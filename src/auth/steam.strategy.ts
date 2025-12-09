import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly prisma: PrismaService) {
    super({
      returnURL: process.env.STEAM_RETURN_URL!,
      realm: process.env.STEAM_REALM!,
      apiKey: process.env.STEAM_API_KEY!,
      
    });
   
  }

  async validate(identifier: string, profile: any): Promise<any> {
   
    let user = await this.prisma.user.findUnique({
      where: { steamid64: profile.id },
    });

    if (!user) {
     
      user = await this.prisma.user.create({
        data: {
          steamid64: profile.id,
          name: profile.displayName,
          avatar: profile.photos?.[2]?.value,
        },
      });
    }

    return user;
  }
}
