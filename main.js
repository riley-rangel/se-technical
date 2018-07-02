const path = require('path');
const validateStrLength = require('./validators/strLength');
const EncryptionService = require('./services/encryption');
const Response = require('./services/response');
const {
  KEY_PRIV_FILE,
  KEY_PUB_FILE,
  MSG_INVALID,
  MSG_KEYGEN_ERROR,
} = require('./constants');

const keyPath = path.resolve(__dirname, '.keys');
const Encryption = new EncryptionService(keyPath, KEY_PRIV_FILE, KEY_PUB_FILE);
const validateString = validateStrLength(250);

// TODO: Add tests for everything
// TODO: Add jsdocs for everything
// TODO: Verify encryption is done properly (signature)

/**
 * @function main
 * @param {string} rawInput
 * @returns
 */
const main = (rawInput) => {
  const validated = validateString(rawInput);

  if (!validated && validated !== '') {
    return Response.onError({
      message: rawInput,
      error: MSG_INVALID,
    });
  };

  Encryption.encrypt(validated, (error, { message, signature, pubkey }) => {
    if (error) {
      return Response.onError({
        message: validated,
        error: MSG_KEYGEN_ERROR,
      });
    };
  
    return Response.onValid({
      message,
      signature,
      pubkey,
    });
  });
}

module.exports = main;
