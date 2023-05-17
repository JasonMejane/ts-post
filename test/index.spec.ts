import { Post } from '../src';
import { Message } from '../src/message';
import { Subscriber } from '../src/subscription';

export class PostTest {
	public post: Post = Post.getInstance;
	public subs: Subscriber[] = [];
}

describe('PostTest', async () => {
	let test: PostTest;

	describe('PubSub', async () => {
		beforeEach(async () => {
			test = new PostTest();
			test.post.reinitialize();
			test.subs = [];
		});

		it('should publish and log a message', async () => {
			const bus = 'default';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
				})
			);
			await test.post.publish(bus, new Message(msg));

			expect(console.log).toHaveBeenCalledWith(msg);
		});

		it('should publish and not log a message when unsubscribed', async () => {
			const bus = 'default';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
				})
			);
			test.subs[0].unsubscribe();
			await test.post.publish(bus, new Message(msg));

			expect(console.log).not.toHaveBeenCalledWith(msg);
		});
	});
});
