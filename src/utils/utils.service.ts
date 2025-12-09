import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  currentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }
}
