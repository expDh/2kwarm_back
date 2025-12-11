import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Res,
  Get,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import SteamID from 'steamid';

import { UserService } from 'src/user/user.service';
import { UtilsService } from 'src/utils/utils.service';
import { UserDTO } from 'src/dto/user.dto';
import { SteamAuthGuard } from './steam.auth.guard';

import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private httpService: HttpService,
  ) {}

  @UseGuards(SteamAuthGuard)
  @Get('/steam')
  login() {}

  @UseGuards(SteamAuthGuard)
  @Get('/steam/return')
  async logined(@Req() req: any, @Res() res: Response) {
    const s = req.user;
    const sid = new SteamID(s.steamid64 || s.id);

    const userDTO: UserDTO = {
      name: s.name || s.displayName,
      steamid64: s.steamid64 || s.id,
      sid: sid.getSteam2RenderedID(true),
      avatar: s.avatar || '',
      profile_url: `https://steamcommunity.com/profiles/${s.steamid64}`,
      real_name: s.real_name || null,
      last_online: this.utilsService.currentTimestamp(),
    };

    const user = await this.usersService.verifyOrAdd(userDTO);

    const accessToken = this.authService.createAccessToken(user);
    const refreshToken = this.authService.createRefreshToken(user);

    res.cookie('access', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 180 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(
      `${process.env.FRONT_URL}/auth/?access=${accessToken}&refresh=${refreshToken}`,
    );
  }

  @Get('/')
  async authHome(@Req() req: Request, @Res() res: Response) {
    const { access, refresh } = req.query;

    if (!access || !refresh) {
      return res.status(400).json({ message: 'Tokens not provided' });
    }

    try {
      const decoded: any = jwt.verify(
        access as string,
        process.env.JWT_ACCESS_SECRET!,
      );

      return res.json({
        message: 'Logged in',
        user: {
          steamid64: decoded.steamid64,
          name: decoded.name,
          avatar: decoded.avatar,
          user_id: decoded.user_id,
        },
        tokens: { access, refresh },
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh = (req.query.refresh as string) || req.cookies?.refresh;
    if (!refresh) throw new HttpException('No refresh token', 401);

    const decoded = this.authService.verifyRefreshToken(
      refresh,
    ) as jwt.JwtPayload;
    if (!decoded) throw new HttpException('Invalid refresh token', 401);

    const user = await this.usersService.findBySteamID(decoded.steamid64);
    if (!user) throw new HttpException('User not found', 401);

    const newAccess = this.authService.createAccessToken(user);
    const newRefresh = this.authService.createRefreshToken(user);

    res.cookie('access', newAccess, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh', newRefresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 180 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.FRONT_URL}/auth/?access=${newAccess}&refresh=${newRefresh}`,
    );
    // return res.json(
    //   { message:"Update token",access: newAccess, refresh: newRefresh });
  }
}









// import { HttpService } from "@nestjs/axios";
// import { Controller, Res, Get, Req, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
// import type { Response, Request } from "express";
// import * as jwt from "jsonwebtoken";
// import { catchError, lastValueFrom, map } from "rxjs";
// import SteamID from "steamid";

// import { UserService } from "src/user/user.service";
// import { UtilsService } from "src/utils/utils.service";
// import { UserDTO } from "src/dto/user.dto";
// import { SteamAuthGuard } from "./steam.auth.guard";

// import { SkipThrottle } from "@nestjs/throttler";

// @SkipThrottle()
// @Controller("auth")
// @SkipThrottle()
// export class AuthController {
//     constructor(private usersService: UserService, private utilsService: UtilsService, private httpService: HttpService) { }

//     @UseGuards(SteamAuthGuard)
//     @Get('/steam')
//     login() {

//     }

// @UseGuards(SteamAuthGuard)
// @Get("/steam/return")
// async logined(@Req() req: any, @Res() res: Response) {
//   const userFromSteam = req.user;

//   const sid = new SteamID(userFromSteam.steamid64 || userFromSteam.id);

//   const userDTO: UserDTO = {
//     name: userFromSteam.name || userFromSteam.displayName,
//     steamid64: userFromSteam.steamid64 || userFromSteam.id,
//     sid: sid.getSteam2RenderedID(true),
//     avatar: userFromSteam.avatar || "",
//     profile_url: `https://steamcommunity.com/profiles/${userFromSteam.steamid64}`,
//     real_name: userFromSteam.real_name || null,
//     last_online: this.utilsService.currentTimestamp(),
//   };

//   const user = await this.usersService.verifyOrAdd(userDTO);

//   const accessToken = jwt.sign(
//     {
//       steamid64: user.steamid64,
//       user_id: user.id,
//       name: user.name,
//       avatar: user.avatar,
//       dest: req.headers["x-forwarded-for"] || req.ip,
//       mky: req.headers["user-agent"] || "",
//     },
//     process.env.JWT_SECRET!,
//     { expiresIn: "3d" }
//   );

//   const refreshToken = jwt.sign(
//     { steamid64: user.steamid64, user_id: user.id },
//     process.env.JWT_SECRET!,
//     { expiresIn: "180d" }
//   );

//   res.cookie("access", accessToken, { httpOnly: false, maxAge: 60 * 1000 });
//   res.cookie("refresh", refreshToken, { httpOnly: false, maxAge: 180 * 24 * 60 * 60 * 1000 });

//   // return res.redirect(`${process.env.STEAM_REALM}/auth/?access=${accessToken}&refresh=${refreshToken}`);
//   return res.status(200).redirect(`${process.env.FRONT_URL}/auth/?access=${accessToken}&refresh=${refreshToken}`);
// }

// @Get('/')
// async authHome(@Req() req: Request, @Res() res: Response) {
//   const { access, refresh } = req.query;

//   if (!access || !refresh) {
//     return res.status(400).json({ message: 'Tokens not provided' });
//   }

//   try {
//     const decoded: any = jwt.verify(access as string, process.env.JWT_SECRET!);

//     return res.status(200).json({
//       message: 'Logged in successfully',
//       user: {
//         steamid64: decoded.steamid64,
//         name: decoded.name,
//         avatar: decoded.avatar,
//         user_id: decoded.user_id,
//       },
//       tokens: { access, refresh },
//     });
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid access token' });
//   }
// }

// @Get('/refresh')
// async refresh(@Req() req: Request, @Res() res: Response) {
//   try {
//     const refreshToken = req.cookies['refresh'];
//     if (!refreshToken) throw new HttpException('Refresh token not found', 401);

//     const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET!);

//     const user = await this.usersService.findBySteamID(decoded.steamid64);
//     if (!user) throw new HttpException('User not found', 401);

//     const newAccessToken = jwt.sign(
//       {
//         steamid64: user.steamid64,
//         user_id: user.id,
//         name: user.name,
//         avatar: user.avatar,
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: '1m' }
//     );

//     res.cookie('access', newAccessToken, { httpOnly: false, maxAge: 60 * 1000 });

//     return res.status(200).json({ access: newAccessToken });

//   } catch (err) {
//     throw new HttpException('Invalid refresh token', 401);
//   }
// }

// }

// import { HttpService } from "@nestjs/axios";
// import { Controller, Res, Get, Req, UseGuards, HttpException } from "@nestjs/common";
// import type { Response, Request } from "express";
// import * as jwt from "jsonwebtoken";
// import { catchError, lastValueFrom, map } from "rxjs";
// import SteamID from "steamid";

// import { UserService } from "src/user/user.service";
// import { UtilsService } from "src/utils/utils.service";
// import { UserDTO } from "src/dto/user.dto";
// import { SteamAuthGuard } from "./steam.auth.guard";

// import { SkipThrottle } from "@nestjs/throttler";

// @SkipThrottle()
// @Controller("auth")
// @SkipThrottle()
// export class AuthController {
//     constructor(private usersService: UserService, private utilsService: UtilsService, private httpService: HttpService) { }

//     // @UseGuards(SteamAuthGuard)
//     // @Get("/steam")
//     // async login(@Req() req: Request) { }
//     @UseGuards(SteamAuthGuard)
//     @Get('/steam')
//     login() {
//     // Passport автоматически редиректит на Steam
//     }

// @UseGuards(SteamAuthGuard)
//   @Get("/steam/return")
//   async logined(@Req() req: any, @Res() res: Response) {
//     const userFromSteam = req.user;

//     const sid = new SteamID(userFromSteam.steamid64 || userFromSteam.id);

//     const userDTO: UserDTO = {
//       name: userFromSteam.name || userFromSteam.displayName,
//       steamid64: userFromSteam.steamid64 || userFromSteam.id,
//       sid: sid.getSteam2RenderedID(true),
//       avatar: userFromSteam.avatar || "",
//       profile_url: `https://steamcommunity.com/profiles/${userFromSteam.steamid64}`,
//       real_name: userFromSteam.real_name || null,
//       last_online: this.utilsService.currentTimestamp(),
//     };

//     const user = await this.usersService.verifyOrAdd(userDTO);

//     const accessToken = jwt.sign(
//       {
//         steamid64: user.steamid64,
//         user_id: user.id,
//         name: user.name,
//         avatar: user.avatar,
//         dest: req.headers["x-forwarded-for"] || req.ip,
//         mky: req.headers["user-agent"] || "",
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1m" } // короткоживущий
//     );

//     const refreshToken = jwt.sign(
//       { steamid64: user.steamid64, user_id: user.id },
//       process.env.JWT_SECRET!,
//       { expiresIn: "180d" } // долгоживущий
//     );

//     // Записываем оба токена в cookie
//     res.cookie("access", accessToken, { httpOnly: false, maxAge: 60 * 1000 });
//     res.cookie("refresh", refreshToken, { httpOnly: false, maxAge: 180 * 24 * 60 * 60 * 1000 });

//   // Редирект с токенами в URL
//   return res.status(200).redirect(`${process.env.STEAM_REALM}/?access=${accessToken}&refresh=${refreshToken}`);
// }
// }

//     @Get('/steam/return')
// @UseGuards(SteamAuthGuard)
// async logined(@Req() req: any, @Res() res: Response) {
//   const userFromSteam = req.user;

//   // используем реальные поля
//   const sid = new SteamID(userFromSteam.steamid64);
//   const userDTO: UserDTO = {
//     name: userFromSteam.name,
//     steamid64: userFromSteam.steamid64,
//     sid: sid.getSteam2RenderedID(true),
//     avatar: userFromSteam.avatar || '',
//     profile_url: `https://steamcommunity.com/profiles/${userFromSteam.steamid64}`,
//     real_name: userFromSteam.real_name || null,
//     last_online: this.utilsService.currentTimestamp(),
//   };

//   const user = await this.usersService.verifyOrAdd(userDTO);

//   const token = jwt.sign(
//     {
//       steamid64: user.steamid64,
//       avatar: user.avatar,
//       name: user.name,
//       user_id: user.id,
//       dest: req.headers['x-forwarded-for'],
//       mky: req.headers['user-agent'],
//       exp: this.utilsService.currentTimestamp() + 15552000
//     },
//     process.env.JWT_SECRET!
//   );

//   res.cookie('authentication', token, {
//     domain: process.env.DOMAIN_COOKIE,
//     httpOnly: false,
//     sameSite: 'none',
//     secure: true,
//     maxAge: 15552000000
//   });

//   return res.redirect(`${process.env.STEAM_REALM}?access=${token}&refresh=${refreshToken}`);

// }}

//   @UseGuards(SteamAuthGuard)
//   @Get("/steam/return")
//   async logined(@Req() req: any, @Res() res: Response) {
//       const sid = new SteamID(req.user._json.steamid);
//       const userDTO: UserDTO = {
//           name: req.user._json.personaname,
//           steamid64: req.user._json.steamid,
//           sid: sid.getSteam2RenderedID(true),
//           avatar: req.user.photos[2].value,
//           profile_url: req.user._json.profileurl,
//           real_name: req.user?._json?.realname,
//           last_online: this.utilsService.currentTimestamp()
//       }
//       const user = await this.usersService.verifyOrAdd(userDTO);

//       const token = jwt.sign({
//           steamid64: user.steamid64,
//           avatar: user?.avatar,
//           name: user?.name,
//           user_id: user.id,
//           dest: req.headers["x-forwarded-for"],
//           mky: req.headers["user-agent"],
//           exp: this.utilsService.currentTimestamp() + 15552000
//       }, process.env.JWT_SECRET!);
//       const cookie = req.cookies?.authentication;
//       if (cookie)
//           res.clearCookie("authentication", {
//               domain: process.env.DOMAIN_COOKIE,
//               httpOnly: false,
//               sameSite: "none",
//               secure: true,
//               maxAge: 15552000000
//           });
//       res.cookie("authentication", token, {
//           domain: process.env.DOMAIN_COOKIE,
//           httpOnly: false,
//           sameSite: "none",
//           secure: true,
//           maxAge: 15552000000
//       });

//       return res.status(200).redirect(process.env.STEAM_REALM!);
//   }
// }

// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('auth')
// export class AuthController {

//   @Get('steam')
//   @UseGuards(AuthGuard('steam'))
//   async steamLogin() {

//   }

//   @Get('steam/return')
//   @UseGuards(AuthGuard('steam'))
//   steamReturn(@Req() req) {

//     return req.user;
//   }
// }
