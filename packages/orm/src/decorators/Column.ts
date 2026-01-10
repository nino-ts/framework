export function Column(name: string) {
    return function (target: any, context: string | ClassFieldDecoratorContext) {
        // Legacy Decorator Support
        if (typeof context === 'string') {
            const propertyKey = context;
            if (!target.constructor.__columnMapping) {
                Object.defineProperty(target.constructor, '__columnMapping', {
                    value: {},
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
            target.constructor.__columnMapping[propertyKey] = name;
            return;
        }

        // Standard Decorator Support
        const ctx = context as ClassFieldDecoratorContext;
        ctx.addInitializer(function () {
            const instance = this as any;
            if (!instance.constructor.__columnMapping) {
                Object.defineProperty(instance.constructor, '__columnMapping', {
                    value: {},
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            }
            const propName = String(ctx.name);
            instance.constructor.__columnMapping[propName] = name;
        });
    }
}
