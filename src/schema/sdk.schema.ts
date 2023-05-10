/* user.schema.ts */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// @Prop 装饰器接受一个可选的参数，通过这个，你可以指示这个属性是否是必须的，是否需要默认值，或者是标记它作为一个常量，下面是例子
// SchemaFactory 是 mongoose 内置的一个方法做用是读取模式文档 并创建 Schema 对象
import { Document } from 'mongoose';
export type SdkDocument = sdk & Document;
@Schema()
export class sdk extends Document {

  // 设置值为必填
  // 卡密
  @Prop({ required: true })
  sdk: string;
  // 使用开始时间
  @Prop()
  start_time: number;
  // 使用结束时间
  @Prop()
  end_time: number;
  // 有效时间
  @Prop()
  time: string;
  // 创建时间
  @Prop()
  create_time: string;
  // 状态
  @Prop()
  status: number;
  // 操作人
  @Prop()
  op_name: string;


  // 设置值为必填
  // 卡密
  // @Prop({ required: true })
  // sdk: string;
  // // 账号
  // @Prop()
  // user: number;
  // // 密码
  // @Prop()
  // password: number;
  // // 创建时间
  // @Prop()
  // create_time: string;
  // // 状态
  // @Prop()
  // status: number;
}
export const SdkSchema = SchemaFactory.createForClass(sdk);