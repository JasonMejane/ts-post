import { Post } from '../src';
import { Message } from '../src/message';
import { Subscriber } from '../src/subscription';

export class PostTest {
	public post: Post = Post.getInstance;
	public subs: Subscriber[] = [];
}

describe('PostTest', async () => {
	let test: PostTest;

	describe('Bus', async () => {
		beforeEach(async () => {
            jasmine.clock().install();
			test = new PostTest();
			test.post.reinitialize();
			test.subs = [];
		});

        afterEach(async () => {
            jasmine.clock().uninstall();
        });

		it('should properly create a bus', async () => {
			const bus = 'bus';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
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

		it('should properly remove a bus', async () => {
			const bus = 'bus';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
				})
			);
			test.post.removeBus(bus);
			await test.post.publish(bus, new Message(msg));

			expect(console.log).not.toHaveBeenCalledWith(msg);
		});

		it('should properly unsubscribe all subscribers', async () => {
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
			test.post.resetBus(bus);
			await test.post.publish(bus, new Message(msg));

			expect(console.log).not.toHaveBeenCalledWith(msg);
			expect(test.post.getBusSubscriptionCount(bus)).toEqual(0);
		});

		it('should execute the callback after a delay', async () => {
			const bus = 'default';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
					delay: 10,
				})
			);
			await test.post.publish(bus, new Message(msg));

			jasmine.clock().tick(2);
			expect(console.log).not.toHaveBeenCalledWith(msg);

			jasmine.clock().tick(10);
			expect(console.log).toHaveBeenCalledWith(msg);
		});

		it('should return undefined subscription count for non-existing bus', async () => {
			const bus = 'bus';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
			test.post.removeBus(bus);

			expect(test.post.getBusSubscriptionCount(bus)).toEqual(undefined);
		});

		it('should not execute anything for non-existing bus', async () => {
			const bus = 'bus';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
				})
			);
			test.post.removeBus(bus);
			test.post.resetBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						console.log(message.getData());
					},
				})
			);
			await test.post.publish(bus, new Message(msg));
			test.subs[1].unsubscribe();

			expect(console.log).not.toHaveBeenCalledWith(msg);
		});

		it('should do nothing if no errorHandler is passed', async () => {
			const bus = 'bus';
			const msg = '123456';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						throw('error');
					},
				})
			);
			await test.post.publish(bus, new Message(msg));

			expect(console.log).not.toHaveBeenCalledWith(msg);
		});

		it('should call errorHandler when callback throws', async () => {
			const bus = 'bus';
			const msg = '123456';
			const error = 'testError';

			spyOn(console, 'log').and.callThrough();

			test.post.createBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						throw(error);
					},
					errorHandler: (err) => {
						console.log(err);
					}
				})
			);
			await test.post.publish(bus, new Message(msg));

			expect(console.log).toHaveBeenCalledWith(error);
		});

		it('should throw when errorHandler fails', async () => {
			const bus = 'bus';
			const msg = '123456';
			const error = 'testError';
			let expectedError;

			test.post.createBus(bus);
			test.subs.push(
				test.post.subscribe(bus, {
					callback: async (message: Message<any>) => {
						throw(error);
					},
					errorHandler: (err) => {
						throw(err);
					}
				})
			);
			try {
				await test.post.publish(bus, new Message(msg));
			} catch (e) {
				expectedError = e;
			}

			expect(expectedError).toEqual({ callbackError: error, errorHandlerError: error });
		});
	});
});
