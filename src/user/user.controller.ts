    /* user.controller.ts */
    // 引入 Nest.js 内置的各个功能
    import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
    // 引入用户服务
    import { UserService } from './user.service';
    // 引入创建用户 DTO 用于限制从接口处传来的参数
    import { CreateUserDto } from './user.dto';
    // 配置局部路由
    @Controller('/api/user')
    export class UserController {
      constructor(private readonly userService: UserService) {}
      // 创建user路由 user/createUser
      @Get('createUser')
      async createUser(@Query() query: CreateUserDto) {
        return this.userService.create(query);
      }
      // 获取SDK列表
      @Get('getUserlist')
      async getSdkList(@Query() query: any) {
        return this.userService.getUserList(query);
      }
      // 查找某一个用户路由
      // @Get('findOne')
      // async findOne(@Query() query: any) {
      //   return this.userService.findOne(query.name);
      // }
    //   // 删除一个用户的路由
      @Get('delete')
      async getDelete() {
        return this.userService.delete();
      }
    //   // 更改用户信息的路由
    //   @Put(':sid')
    //   updateUser(@Body() body: any, @Param() param: any) {
    //     return this.userService.updateUser(param.sid, body);
    //   }
    }