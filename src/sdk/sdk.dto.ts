import {IsDefined, IsInt, IsString} from "class-validator";

export class BatchCreateSdkDto {
    @IsDefined()
    @IsString()
    count: string;

    @IsDefined()
    @IsString()
    time: string;
}