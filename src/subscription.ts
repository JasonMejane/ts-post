import { Message } from "./message";

/**
 * The callback and its id to be found in the bus
 */
export type CallbackWithId<T> = {
	id: number;
	callback: Callback<T>;
};

/**
 * The function to execute on message delivery
 *
 * @param {Message} message The delivered message
 */
export type Callback<T> = (message: Message<T>) => Promise<void>;

/**
 * The function to execute upon callback exception
 *
 * @param {any} error The error thrown by the callback
 */
export type ErrorHandler = ((error: any) => void);

/**
 * Represent a bus subscriber
 */
export interface Subscriber {
    unsubscribe: (() => void);
}

/**
 * Represent the subscription to send to create a susbcriber
 *
 * @param {Callback<T>} callback The callback to execute on message delivery
 * @param {ErrorHandler} [errorHandler] (optional) The function to execute upon callback exception
 * @param {number} [delay] (optional) The delay before executing the callback.
 * - If undefined, the callback will be executed immediatly and synchronously (according to its order in the subscribers list)
 * - If >= 0, the callback will be put in the event loop using `setTimeout`
 */
export interface Subscription<T> {
    callback: Callback<T>;
    errorHandler?: ErrorHandler;
    delay?: number;
}
