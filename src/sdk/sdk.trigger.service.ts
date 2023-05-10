import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User } from './interfaces/user.interface';
import { sdk, SdkDocument } from 'src/schema/sdk.schema';


@Injectable()
export class SdkTriggerService {
  constructor(@InjectModel('sdk') private readonly SdkModel: Model<SdkDocument>) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const _this = this;
    await (await this.SdkModel.find({ status: 1 })).forEach(async function (item) {
      const now = new Date().getTime();
      console.log(now > item.end_time, now, item.end_time);
      // 判断是否过期
      if (now > item.end_time) {
        await _this.SdkModel.updateOne({ sdk: item.sdk }, { status: 2});
      }
    });
    // 在这里执行你的触发器逻辑
  }
}