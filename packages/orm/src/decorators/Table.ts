export function Table(name: string) {
    return function (target: any, context?: ClassDecoratorContext) {
        // Legacy Support (target is Constructor)
        if (typeof target === 'function' && (!context || typeof context === 'undefined')) {
            (target as any).table = name;
            return;
        }

        // Standard Support
        if (context) {
            context.addInitializer(function () {
                (this as any).table = name;
            });
        }
    }
}
