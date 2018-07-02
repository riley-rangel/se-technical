const fs = require('fs');
const { execSync } = require('child_process');

const Encryption = class {
  constructor(keyPath, privFile, pubFile) {
    this.keyPath = keyPath;
    this.privPath = `${keyPath}/${privFile}`;
    this.pubPath = `${keyPath}/${pubFile}`;
  }

  _bufferToString(buffer) {
    return buffer.toString('utf8');
  }
  _readFile(filePath) {
    const buffer = execSync(`cat ${filePath}`);

    return this._bufferToString(buffer);
  }
  encrypt(message, callback) {
    try {
      const { privkey, pubkey } = this.keysExist()
        ? this.getKeys()
        : this.generateKeys();
  
      const digest = this.generateDigest(message);
      const signature = this.generateSignature(privkey, digest);

      return callback(null, { message, signature, pubkey });
    } catch (e) {
      console.log('ENCRYPT ERR:', e);

      return callback(new Error(e));
    }
  }
  generateDigest(message) {
    const buffer = execSync(`echo -n "${message}" | openssl dgst -sha256`);

    return this._bufferToString(buffer);
  }
  generateKeys() {
    if (!fs.existsSync(this.keyPath)) {
      fs.mkdirSync(this.keyPath);
    }

    return {
      privkey: this.generatePrivate(),
      pubkey: this.generatePublic(),
    };
  }
  generatePrivate() {
    execSync(`openssl genrsa -out ${this.privPath} 1024`);

    return this._readFile(this.privPath);
  }
  generatePublic() {
    execSync(`openssl rsa -pubout -in ${this.privPath} -out ${this.pubPath}`);

    return this._readFile(this.pubPath);
  }
  generateSignature(privateKey, digest) {
    const buffer = execSync(`echo -n "${privateKey}" "${digest}" | openssl dgst -sha256`);

    return this._bufferToString(buffer);
  }
  getKeys() {
    return {
      privkey: this._readFile(this.privPath),
      pubkey: this._readFile(this.pubPath),
    };
  }
  keysExist() {
    const privExists = fs.existsSync(this.privPath);
    const pubExists = fs.existsSync(this.pubPath);

    return privExists && pubExists;
  }
}

module.exports = Encryption;
