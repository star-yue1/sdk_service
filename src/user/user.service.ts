/* user.service.ts */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { SdkDocument } from '@/schema/sdk.schema';
@Injectable()
export class UserService {
  // 注册Schema后，可以使用 @InjectModel() 装饰器将 User 模型注入到 UserService 中:
  constructor(@InjectModel('user') private userTest: Model<UserDocument>, @InjectModel('sdk') private sdkTest: Model<SdkDocument>) { }
  
  // 添加
  async create(query): Promise<user | any> {
    const is_have = await this.userTest.find({ user: query.user });
    
    console.log('is_have', is_have);
    if (is_have.length === 0) {
      if (query.sdk) {
        const getSdk = await this.sdkTest.findOne({ sdk: query.sdk });
        console.log('getSdk', getSdk);
        if (getSdk && getSdk.status != 0) {
          return { code: 500, msg: "SDK已被使用过了！"}
        } else if (!getSdk) {
          return { code: 500, msg: "SDK不存在" }
        }
        const end_time = String(new Date().getTime() + Number(getSdk.time) * 86400000)
        const user = await this.userTest.create({ ...query, create_time: new Date().getTime(), sdk_info: getSdk, end_time });
        await this.sdkTest.updateOne({ sdk: query.sdk }, { status: 1, start_time: new Date().getTime(), end_time })

        return user;
      }
      
      const user = await this.userTest.create({ ...query, create_time: new Date().getTime() });
      return user;
    } else {
      return {
        code: 500,
        msg: '账号存在'
      }
    }
  }
  // 获取用户列表
  async getUserList(query): Promise<{ code: number, data: any[], total: number }> {
    const { page = 0, size = 10, ...rest } = query
    const temp = await this.userTest.find({ ...rest }).sort({ create_time: -1 }).skip(page * size).limit(size);
    const total = await this.userTest.find().count()
    return {
      code: 0,
      data: temp.map(item => ({
        user: item.user,
        password: item.password,
        sdk: item.sdk,
        create_time: item.create_time,
        status: item.status,
        sdk_info: item.sdk_info,
        end_time: item.end_time
      })),
      total
    };
  }
  // 查找
  async findOne(name: string): Promise<user[]> {
    // 这里是异步的
    const temp = await this.userTest.find({ name });
    return temp;
  }
  // 删除
  async delete(): Promise<any> {
    // 这里是异步的  remove 方法删除成功并返回相应的个数
    // const temp = await this.userTest.deleteOne({ _id: sid });
    const temp = await this.userTest.deleteMany({ __v: 0 });
    return temp;
  }


}