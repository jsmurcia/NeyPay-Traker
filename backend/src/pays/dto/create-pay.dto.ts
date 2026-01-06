import { IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreatePayDto {
  @IsDateString()
  date: string;

  @IsEnum(['nequi', 'daviplata'])
  origin: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  amount: number;
}
