import { Message } from '../src/message';

describe('PostTest', () => {

	describe('Message', () => {
		it('should properly set the timestamp', () => {
			const bus = 'default';
			const beforeTime = Date.now();
			const msg = new Message('');
			const afterTime = Date.now();

			expect(msg.getTimestamp()).toBeGreaterThanOrEqual(beforeTime);
			expect(msg.getTimestamp()).toBeLessThanOrEqual(afterTime);
		});

		it('should return the issuer when set', () => {
			const issuer = 'Issuer';
			const msg = new Message('', issuer);

			expect(msg.getIssuer()).toEqual(issuer);
		});
	});
});
