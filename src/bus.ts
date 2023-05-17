import { Message } from "./message";
import { Callback, CallbackWithId, Subscriber, Subscription } from "./subscription";

export class Bus<T> {
    private callbacks: (CallbackWithId<T> | null)[] = [];
    private subscriptionCount: number = 0;
	private idSequence: number = 0;

    public getSubscriptionCount(): number {
        return this.subscriptionCount;
    }

    public async publish(message: Message<T>): Promise<void> {
        for (let i = 0; i < this.callbacks.length; i++) {
            await this.callbacks[i]?.callback(message);
        }
    }

    public subscribe(subscription: Subscription<T>): Subscriber {
        const wrappedCallback = this.wrapCallback(subscription);

		const id = this.idSequence;
        this.callbacks.push({
			id,
			callback: wrappedCallback
		});
        this.idSequence++;
        this.subscriptionCount++;

        return {
            unsubscribe: () => { this.unsubscribe(id); }
        };
    }

    public reset(): void {
        this.unsubscribeAll();
        this.idSequence = 0;
    }

    public unsubscribeAll(): void {
        this.callbacks = [];
        this.subscriptionCount = 0;
    }

    private unsubscribe(id: number): void {
		for (let i = 0; i < this.callbacks.length; i++) {
			if (this.callbacks[i]?.id === id) {
				this.callbacks[i] = null;
				this.callbacks.splice(i, 1);
				this.subscriptionCount--;
				break;
			}
		}
    }

    private wrapCallback(subscription: Subscription<T>): Callback<T> {
        const safeCallback = async (message: Message<T>) => {
            try {
                await subscription.callback(message);
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

        return async (message: Message<T>) => {
            if (subscription.delay === undefined) {
                await safeCallback(message);
            } else {
                setTimeout(async () => { await safeCallback(message); }, subscription.delay);
            }
        }
    }
}
