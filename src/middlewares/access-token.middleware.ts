// src/common/middleware/access-token.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.access || req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No access token');

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;

      // Если нужно, можно сбрасывать таймер скользящей активации
      // Например, добавляем новый access токен в заголовок:
      const newAccess = jwt.sign(
        {
          steamid64: decoded.steamid64,
          user_id: decoded.user_id,
          name: decoded.name,
          avatar: decoded.avatar,
        },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '3d' },
      );
      res.setHeader('x-new-access-token', newAccess);

      // Можно добавить decoded к запросу
      (req as any).user = decoded;

      next();
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
