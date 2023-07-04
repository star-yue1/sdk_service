/* user.service.ts */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sdk, SdkDocument } from 'src/schema/sdk.schema';
// import { CreateUserDto } from './sdk.dto.ts';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import moment from 'moment';

const maxSdkLingth = 32;
@Injectable()
export class SdkService {
  // 注册Schema后，可以使用 @InjectModel() 装饰器将 User 模型注入到 UserService 中:
  constructor(@InjectModel('sdk') private sdkTest: Model<SdkDocument>) {}
  // 添加
  async create(query): Promise<sdk | any> {
    const sdk = this.randomString(maxSdkLingth);
    const is_exist = (await this.sdkTest.find({ sdk }).exec()).length;
    if (!is_exist) {
      const createUser = new this.sdkTest({
        sdk,
        create_time: new Date().getTime(),
        status: 0,
        op_name: '',
        start_time: 0,
        end_time: 0,
        time: query.time,
      });
      const temp = await createUser.save();
      return temp;
    } else {
      return { code: 0, msg: 'sdk已存在' };
    }
  }
  // 获取SDK列表
  async getSdkList(
    query,
  ): Promise<{ code: number; data: sdk[]; total: number }> {
    const { page = 0, size = 10, ...rest } = query;
    const temp = await this.sdkTest
      .find({ ...rest })
      .sort({ create_time: -1 })
      .skip(page * size)
      .limit(size);
    const total = await this.sdkTest.find({ ...rest }).count();
    return {
      code: 0,
      data: temp,
      total,
    };
  }
  // 修改SDK状态
  async updataSdkStatus(query) {
    const sdkInfo = await this.sdkTest.findOne({ sdk });
    if (sdkInfo) {
      const end_time = String(
        new Date().getTime() + Number(sdkInfo.time) * 86400000,
      );
      await this.sdkTest.updateOne(
        { sdk: query.sdk },
        { status: 1, start_time: new Date().getTime(), end_time },
      );
    } else {
      return { code: 500, msg: 'SDK不存在' };
    }
  }

  // 查找SDK是否存在
  async findOne(sdk: string): Promise<any> {
    // 这里是异步的
    const temp = await this.sdkTest.find({ sdk });
    return temp;
  }
  // 批量生成SDK
  async batchCreateSdk(query, res) {
    try {
      const { count, time } = query;
      console.log(count, new Array(Number(count)));

      const sdkList = await new Array(Number(count))
        .fill(null)
        .map(async () => {
          return await this.createSdk(query);
        });
      const list = await Promise.all(sdkList);
      console.log('list', list);
      const formattedDate = `${moment().format(
        'YYYY-MM-DD',
      )}_${new Date().getTime()}`;
      console.log(formattedDate);
      const filePath = `/${formattedDate}.txt`;
      fs.writeFile(
        filePath,
        list.map((item) => item.sdk).join('\n'),
        'utf8',
        (err) => {
          if (err) throw err;

          console.log('文件内容修改成功');
        },
      );

      const fileStream = fs.createReadStream(filePath);
      console.log('fileStream', fileStream);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + formattedDate,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res); //将 txt 发送给客户端
      // res.download(file); //将 txt 发送给客户端
    } catch (e) {
      return { code: 500, msg: e };
    }
  }

  async createSdk(query) {
    const sdk = this.randomString(maxSdkLingth);
    const sdkInfo = await this.sdkTest.findOne({ sdk });
    if (!sdkInfo) {
      const createUser = new this.sdkTest({
        sdk,
        create_time: new Date().getTime(),
        status: 0,
        op_name: '',
        start_time: 0,
        end_time: 0,
        time: query.time,
      });
      const temp = await createUser.save();
      return temp;
    } else {
      return await this.createSdk(query);
    }
  }

  randomString(max) {
    //max - 任意长度最大位
    var str = '';
    var arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    var pos;
    for (var i = 0; i < max; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  }
}
