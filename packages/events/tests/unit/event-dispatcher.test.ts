import { describe, expect, test } from "bun:test";
import { EventDispatcher } from "../../src/event-dispatcher";

class UserSignedUp {
    constructor(public readonly email: string) {}
}

describe("EventDispatcher", () => {
    test("invokes function listeners", async () => {
        const dispatcher = new EventDispatcher();
        const seen: string[] = [];

        dispatcher.listen(UserSignedUp, (event) => {
            seen.push(event.email);
        });

        await dispatcher.dispatch(new UserSignedUp("a@example.com"));

        expect(seen).toEqual(["a@example.com"]);
    });

    test("invokes class listeners with handle()", async () => {
        const dispatcher = new EventDispatcher();
        let handled = false;

        class NotifyAdmin {
            public async handle(_event: UserSignedUp): Promise<void> {
                handled = true;
            }
        }

        dispatcher.listen(UserSignedUp, new NotifyAdmin());
        await dispatcher.dispatch(new UserSignedUp("b@example.com"));

        expect(handled).toBe(true);
    });
});
