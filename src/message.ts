/**
 * Represents a message send by a publisher to subscribers of a bus
 *
 * To create a Message: `new Message(data)`
 *
 * The messager issuer can also be set on creation: `new Message(data, issuer)`
 *
 * @param {any} data The data to send
 * @param {any} [issuer] (optional) The issuer of the message
 */
export class Message {
    private data: any;
    private issuer: any;
    private timestamp: number;

    constructor(data: any, issuer?: any) {
        this.timestamp = Date.now();
        this.data = data;
        this.issuer = issuer;
    }

    public getData(): any {
        return this.data;
    }

    public getIssuer(): any {
        return this.issuer;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }
}
