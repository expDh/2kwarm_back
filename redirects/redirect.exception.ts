import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectException extends HttpException {
  constructor(url: string) {
    super(
      { statusCode: HttpStatus.FOUND, url },
      HttpStatus.FOUND,
    );
  }
}