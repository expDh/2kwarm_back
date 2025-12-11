
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SteamStrategy } from './steam.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { UtilsService } from 'src/utils/utils.service';
import { HttpModule } from '@nestjs/axios';
import { UtilsModule } from 'src/utils/utils.mudule';


@Module({
  imports: [UserModule,PassportModule.register({ session: true }),HttpModule,UtilsModule],
  controllers: [AuthController],
  providers: [AuthService,SteamStrategy,UtilsService],
  exports:[AuthService]
  
})
export class AuthModule {}
