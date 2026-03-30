export class DecryptException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DecryptException';
  }
}

export class EncryptException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptException';
  }
}
