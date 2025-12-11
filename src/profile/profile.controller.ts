import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Controller('profile')
export class ProfileController {
  constructor(private usersService: UserService) {}

  private requireAuth(req: Request, res: Response): string | null {
    const token =
      req.cookies?.access || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.redirect(`${process.env.FRONT_URL}/`);
      return null;
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      return decoded.steamid64;
    } catch (e) {
      res.redirect(`${process.env.FRONT_URL}/`);
      return null;
    }
  }

  @Get()
  async getMyProfile(@Req() req: Request, @Res() res: Response) {
    const userSteamId = this.requireAuth(req, res);
    if (!userSteamId) return;

    const user = await this.usersService.findBySteamID(userSteamId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return res.json({
      self: true,
      profile: user,
    });
  }

  @Get(':steamid64')
  async getProfile(
    @Param('steamid64') targetSteamId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const mySteamId = this.requireAuth(req, res);
    if (!mySteamId) return;

    const targetUser = await this.usersService.findBySteamID(targetSteamId);

    if (!targetUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (mySteamId === targetSteamId) {
      return res.json({
        self: true,
        profile: targetUser,
      });
    }

    return res.json({
      self: false,
      profile: {
        steamid64: targetUser.steamid64,
        name: targetUser.name,
      },
    });
  }
}









// import { Controller, Get, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
// import type { Request } from 'express';
// import * as jwt from 'jsonwebtoken';
// import { UserService } from 'src/user/user.service';

// @Controller('profile')
// export class ProfileController {
//   constructor(private usersService: UserService) {}

//   @Get()
//   async getMyProfile(@Req() req: Request) {
//     const userSteamId = this.extractSteamId(req);

//     if (!userSteamId) {
//       return { message: 'No token (but middleware should catch this)' };
//     }

//     const user = await this.usersService.findBySteamID(userSteamId);

//     if (!user) {
//       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
//     }

//     return {
//       self: true,
//       profile: user,
//     };
//   }

//   @Get(':steamid64')
//   async getProfile(@Param('steamid64') targetSteamId: string, @Req() req: Request) {
//     const mySteamId = this.extractSteamId(req);

//     if (!mySteamId) {
//       throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
//     }

//     const targetUser = await this.usersService.findBySteamID(targetSteamId);

//     if (!targetUser) {
//       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
//     }

//     const isSelf = mySteamId === targetSteamId;

//     if (isSelf) {
//       return {
//         self: true,
//         profile: targetUser,
//       };
//     }

//     return {
//       self: false,
//       profile: {
//         steamid64: targetUser.steamid64,
//         name: targetUser.name,
//       },
//     };
//   }

//   private extractSteamId(req: Request): string | null {
//     const access = req.cookies?.access || req.headers.authorization?.replace('Bearer ', '');

//     if (!access) return null;

//     try {
//       const decoded: any = jwt.verify(access, process.env.JWT_ACCESS_SECRET!);
//       return decoded.steamid64;
//     } catch {
//       return null;
//     }
//   }
// }
