import { Message } from "./message";

/**
 * The function to execute on message delivery
 *
 * @param {Message} message The delivered message
 */
export type Callback = ((message: Message) => void);

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
 * @param {Callback} callback The callback to execute on message delivery
 * @param {ErrorHandler} [errorHandler] (optional) The function to execute upon callback exception
 * @param {number} [delay] (optional) The delay before executing the callback.
 * - If undefined, the callback will be executed immediatly and synchronously (according to its order in the subscribers list)
 * - If >= 0, the callback will be put in the event loop using `setTimeout`
 */
export interface Subscription {
    callback: Callback;
    errorHandler?: ErrorHandler;
    delay?: number;
}
