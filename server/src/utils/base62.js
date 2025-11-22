const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHAR_ARRAY = CHARACTERS.split('');
const CHAR_LENGTH = CHAR_ARRAY.length;

const generateCode = (length) => {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += CHAR_ARRAY[Math.floor(Math.random() * CHAR_LENGTH)];
	}
	return result;
};

const generateRandomCode = () => {
  const length = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
  return generateCode(length);
};

module.exports = {
  generateCode,
  generateRandomCode
};
