import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CreatePayDto {
  @IsEnum(['nequi', 'daviplata'])
  origin: string;

  @IsString()
  message: string;
}
