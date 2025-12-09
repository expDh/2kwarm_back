import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
 
 

  
  
}



// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UserService,
//     private jwt: JwtService,
//   ) {}

//   async validateSteamProfile(profile: any) {
//     let user = await this.usersService.findBySteamId(profile.steamId);

//     if (!user) {
//       user = await this.usersService.createSteamUser({
//         steamId: profile.steamId,
//         nickname: profile.username,
//         avatar: profile.avatar,
//       });
//     }

//     return user;
//   }

//   generateAccessToken(user: any) {
//     return this.jwt.sign(
//       {
//         sub: user.id,
//         steamId: user.steamId,
//         role: user.role,
//       },
//       { expiresIn: '15m' },
//     );
//   }

//   generateRefreshToken(user: any) {
//     return this.jwt.sign(
//       {
//         sub: user.id,
//       },
//       {
//         expiresIn: '30d',
//         secret: process.env.JWT_SECRET, 
//       },
//     );
//   }

//   generateTokens(user: any) {
//     return {
//       accessToken: this.generateAccessToken(user),
//       refreshToken: this.generateRefreshToken(user),
//     };
//   }

//   async refreshTokens(refreshToken: string) {
//     try {
//       const decoded = this.jwt.verify(refreshToken, {
//         secret: process.env.JWT_SECRET,
//       });

//       const user = await this.usersService.findById(decoded.sub);
//       if (!user) throw new UnauthorizedException('User not found');

//       return this.generateTokens(user);
//     } catch (e) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UserService,
//     private jwt: JwtService,
//   ) {}

//   async validateSteamProfile(profile: any) {
//     let user = await this.usersService.findBySteamId(profile.steamId);

//     if (!user) {
//       user = await this.usersService.createSteamUser({
//         steamId: profile.steamId,
//         nickname: profile.username,
//         avatar: profile.avatar,
//       });
//     }

//     return user;
//   }

//   generateTokens(user: any) {
//     const payload = {
//       sub: user.id,
//       steamId: user.steamId,
//       role: user.role,
//     };

//     return {
//       accessToken: this.jwt.sign(payload, { expiresIn: '15m' }),
//       refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
//     };
//   }

//   async refreshTokens(refreshToken: string) {
//     try {
//       const data = this.jwt.verify(refreshToken);
//       const user = await this.usersService.findBySteamId(data.steamId);
//       if (!user) throw new Error('User not found');

//       return this.generateTokens(user);

//     } catch (err) {
//       throw new Error('Invalid refresh token');
//     }
//   }
// }
