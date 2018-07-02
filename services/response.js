const isString = require('../validators/isString');

/** Class to handle the reponse object that will be returned */
class Response {
  /**
   * Method to return object for success response case.
   * @method onValid
   * @static
   * @memberof Response
   * @param {string} message
   */
  static onValid({ message, signature, pubkey }) {
    this.respond({
      message,
      signature,
      pubkey,
    });
  }

  /**
   * Method to return object for error response case.
   * @method onInvalid
   * @static
   * @memberof Response
   * @param {string} message
   */
  static onError({ message, error }) {
    const length = isString(message) ? message.length : undefined;

    this.respond({
      error,
      length,
      message,
    });
  }

  /**
   * Method to return console log including JSON string.
   * @method respond
   * @static
   * @memberof Response
   * @param {Object} object
   * @returns
   */
  static respond(object) {
    try {
      return console.log(JSON.stringify(object, null, '\t'));
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
}

module.exports = Response;
