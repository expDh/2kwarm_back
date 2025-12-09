import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from 'src/prisma.service';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { ProfileController } from './profile/profile.controller';
import { AuthController } from './auth/auth.controller';
import { UtilsModule } from './utils/utils.mudule';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), UserModule,PrismaModule,UtilsModule,HttpModule],
  controllers: [AppController,ProfileController,AuthController],
  providers: [AppService, ],
})
export class AppModule {}
