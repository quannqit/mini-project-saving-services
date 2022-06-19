import { IsNumber, IsPositive } from 'class-validator';

export class UpdateBalanceDto {
  constructor(amount: number) {
    this.amount = amount;
  }

  @IsNumber()
  @IsPositive()
  amount: number;
}
