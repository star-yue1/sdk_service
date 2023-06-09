import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserSchema } from 'src/schema/user.schema';

import { SdkSchema } from 'src/schema/sdk.schema';
import { SdkController } from 'src/sdk/sdk.controller'
import { SdkService } from 'src/sdk/sdk.service'
import { SdkTriggerService } from 'src/sdk/sdk.trigger.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot('mongodb://43.140.249.45:27017/user_cdkey'), MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]), MongooseModule.forFeature([{ name: 'sdk', schema: SdkSchema }])],
  controllers: [AppController, UserController, SdkController],
  providers: [AppService, UserService, SdkService, SdkTriggerService],
})
export class AppModule { }
