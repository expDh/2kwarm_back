import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserService } from "src/user/user.service";

@Controller("profile")
export class ProfileController {
  constructor(private usersService: UserService) {}

  @Get(":steamid64")
  async getProfile(
    @Param("steamid64") targetSteamId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    let mySteamIdFromToken: string | null = null;

    
    const access = req.cookies?.access || req.headers.authorization?.replace("Bearer ", "");

    if (access) {
      try {
        const decoded: any = jwt.verify(access, process.env.JWT_SECRET!);
        mySteamIdFromToken = decoded.steamid64;
      } catch (err) {
        
      }
    }


    const targetUser = await this.usersService.findBySteamID(targetSteamId);

    if (!targetUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    
    if (mySteamIdFromToken === targetSteamId) {
      return res.json({
        self: true,
        profile: targetUser,
      });
    }

   
    return res.json({
      self: false,
      profile: targetUser,
    });
  }
}
