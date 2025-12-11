import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_ACCESS_SECRET'),
  signOptions: { expiresIn: '3d' },
});



// import {ConfigService} from "@nestjs/config"
// import {JwtModuleOptions} from "@nestjs/jwt";

// export const getJwtConfig = async (
//     configService: ConfigService

// ): Promise<JwtModuleOptions> => ({
//     secret: configService.get('JWT_SECRET'),
// })