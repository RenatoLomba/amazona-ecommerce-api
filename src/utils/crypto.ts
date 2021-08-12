import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Crypto {
  salt = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async validate(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
