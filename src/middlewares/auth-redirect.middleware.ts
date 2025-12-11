// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class AuthRedirectMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const url = req.originalUrl.split('?')[0]; // <-- ВАЖНО
//     console.log('Middleware HIT:', url);

//     const whitelist = [
//       '/',
//       '/auth',
//       '/auth/steam',
//       '/auth/steam/return',
//       '/auth/refresh',
//     ];

//     if (whitelist.includes(url)) {
//       return next();
//     }

//     const token =
//       req.cookies?.access || req.headers.authorization?.replace('Bearer ', '');

//     if (!token) {
//       return res.redirect(process.env.FRONT_URL + '/');
//     }

//     try {
//       jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
//       next();
//     } catch (e) {
//       return res.redirect(process.env.FRONT_URL + '/');
//     }
//   }
// }
