import { Post } from '../src';
import { Message } from '../src/message';
import { Subscriber } from '../src/subscription';

export class PostTest {
	public post: Post = Post.getInstance;
	public subs: Subscriber[] = [];
}

describe('PostTest', () => {
	let test: PostTest;

	describe('PubSub', () => {
		beforeEach(() => {
			test = new PostTest();
			test.post.reinitialize();
			test.subs = [];
		});

		it('should publish and log a message', () => {
			const bus = 'default';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.subs.push(
				test.post.subscribe(bus, {
					callback: (message: Message) => {
						console.log(message.getData());
					},
				})
			);
			test.post.publish(bus, new Message(msg));

			expect(console.log).toHaveBeenCalledWith(msg);
		});

		it('should publish and not log a message when unsubscribed', () => {
			const bus = 'default';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.subs.push(
				test.post.subscribe(bus, {
					callback: (message: Message) => {
						console.log(message.getData());
					},
				})
			);
			test.subs[0].unsubscribe();
			test.post.publish(bus, new Message(msg));

			expect(console.log).not.toHaveBeenCalledWith(msg);
		});
	});
});
