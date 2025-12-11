import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthWhitelistMiddleware implements NestMiddleware {
  private whitelist = [
    '/',                 // главная
    '/auth',             // API входа
    '/auth/steam',
    '/auth/steam/return',
    '/public',           // пример
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;

    // Если путь есть в списке разрешённых — пропустить
    if (this.isWhitelisted(path)) {
      return next();
    }

    // Проверка access токена
    const access =
      req.cookies?.access ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!access) {
      return res.redirect('/');  // например, на главную
    }

    try {
      jwt.verify(access, process.env.JWT_ACCESS_SECRET!);
      next();
    } catch (e) {
      return res.redirect('/');
    }
  }

  private isWhitelisted(path: string): boolean {
    // точное совпадение
    if (this.whitelist.includes(path)) {
      return true;
    }

    // поддержка маршрутов с параметрами (например /auth/*)
    return this.whitelist.some((allowed) => {
      if (allowed.endsWith('*')) {
        const prefix = allowed.replace('*', '');
        return path.startsWith(prefix);
      }
      return false;
    });
  }
}
