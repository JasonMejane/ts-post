import { Message } from "./message";
import { Callback, Subscriber, Subscription } from "./subscription";

export class Bus {
    private callbacks: Callback[] = [];
    private subscriptionCount: number = 0;

    public getSubscriptionCount(): number {
        return this.subscriptionCount;
    }

    public publish(message: Message): void {
        for (let i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i](message);
        }
    }

    public subscribe(subscription: Subscription): Subscriber {
        const wrappedCallback = this.wrapCallback(subscription);

        this.callbacks.push(wrappedCallback);
        this.subscriptionCount++;

        return {
            unsubscribe: () => { this.unsubscribe(wrappedCallback); }
        };
    }

    public unsubscribeAll(): void {
        this.callbacks = [];
        this.subscriptionCount = 0;
    }

    private unsubscribe(callback: Callback): void {
        const callbacks = this.callbacks;
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
            this.subscriptionCount--;
        }
    }

    private wrapCallback(subscription: Subscription): Callback {
        const safeCallback = (message: Message) => {
            try {
                subscription.callback(message);
            } catch (callbackError) {
                if (!subscription.errorHandler) {
                    return;
                }

                try {
                    subscription.errorHandler(callbackError);
                } catch (error) {
                    throw({ callbackError, errorHandlerError: error });
                }
            }
        };

        return (message: Message) => {
            if (subscription.delay === undefined) {
                safeCallback(message);
            } else {
                setTimeout(() => { safeCallback(message); }, subscription.delay);
            }
        }
    }
}