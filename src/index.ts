import { Bus } from "./bus";
import { Message } from "./message";
import { Subscriber, Subscription } from "./subscription";

export class Post {
    private static instance: Post;
    private buses: Map<string, Bus> = new Map<string, Bus>();

    private constructor() {
        this.initialize();
    }

    /**
     * Get or initialize the singleton instance of Post
     *
     * @return {Post} the instance of Post
     */
    public static get getInstance(): Post
    {
        return this.instance || (this.instance = new this());
    }

    /**
     * Create a new Bus with the given name (if none with the same name exists already)
     *
     * @param {string} busName The Bus name
     */
    public createBus(busName: string): void {
        if (!this.buses.has(busName)) {
            this.buses.set(busName, new Bus());
        }
    }

    /**
     * Get the number of active subscribers for a given Bus
     *
     * @param {string} busName The Bus name
     * @return {number} The number of active subscription to the bus
     */
    public getBusSubscriptionCount(busName: string): number | undefined {
        return this.buses.get(busName)?.getSubscriptionCount();
    }

    /**
     * Remove a given Bus
     *
     * @param {string} busName The Bus name
     */
    public removeBus(busName: string): void {
        this.buses.delete(busName);
    }

    /**
     * Reset a give Bus (unsubscribe all subscribers)
     *
     * @param {string} busName The Bus name
     */
    public resetBus(busName: string): void {
        this.buses.get(busName)?.unsubscribeAll();
    }

    /**
     * Publish a Message into a given Bus
	 *
     * @param {string} busName The Bus name
     * @param {Message} message The message to send into the Bus
     */
    public publish(busName: string, message: Message): void {
        this.buses.get(busName)?.publish(message);
    }

    /**
     * Reinitialize Post (all buses will be deleted, `default` bus will be recreated)
     */
    public reinitialize(): void {
        this.initialize();
    }

    /**
     * Subscribe to a given Bus
     *
     * @param {string} busName The Bus name
     * @param {Subscription} subscription The subscription to the Bus
     * @return {Subscriber} The subscriber
     */
    public subscribe(busName: string, subscription: Subscription): Subscriber {
        return this.buses.get(busName)?.subscribe(subscription) ?? { unsubscribe: () => undefined };
    }

	private initialize(): void {
		this.buses = new Map<string, Bus>();
        this.buses.set('default', new Bus());
	}
}
