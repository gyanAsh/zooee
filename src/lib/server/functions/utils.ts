export const generateRandomOTPNumber = (): number => {
	const buffer = new Uint32Array(1);
	globalThis.crypto.getRandomValues(buffer);
	return 100000 + (buffer[0] % 900000);
};
