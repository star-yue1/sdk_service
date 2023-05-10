/* sdk.controller.ts */
// 引入 Nest.js 内置的各个功能
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// 引入用户服务
import { SdkService } from './sdk.service';
// 引入创建用户 DTO 用于限制从接口处传来的参数
// import { CreateSdkDto } from './sdk.dto';
// 配置局部路由
@Controller('/api/sdk')
export class SdkController {
    constructor(private readonly sdkService: SdkService) { }
    //  创建sdk
    @Get('createSdk')
    async createUser(@Query() query: any) {
        return this.sdkService.create(query);
    }

    // 获取SDK列表
    @Get('getSdklist')
    async getSdkList(@Query() query: any) {
        return this.sdkService.getSdkList(query);
    }
    // 更新SDK状态
    @Get('updataStatus')
    async updataStatus(@Query() query: any) {
        return this.sdkService.updataSdkStatus(query);
    }
    @Get('batchCreateSdk')
    async batchCreateSdk(@Query() query: any) {
        return this.sdkService.batchCreateSdk(query);
    }
}