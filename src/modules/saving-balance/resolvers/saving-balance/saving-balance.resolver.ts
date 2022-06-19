import { validate } from 'class-validator';
import { GqlAuthGuard } from 'src/modules/auth/auth-guards/gql.auth-guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user';
import { UserModel } from 'src/modules/auth/models/user.model';
import { errorMessages } from 'src/shared/functions';

import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UpdateBalanceDto } from '../../dtos/update-balance.dto';
import { SavingBalanceModel } from '../../models/user.model';
import { SavingBalanceService } from '../../services/saving-balance/saving-balance.service';

@Resolver(() => SavingBalanceModel)
export class SavingBalanceResolver {
  constructor(private readonly savingBalanceService: SavingBalanceService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SavingBalanceModel)
  async deposit(
    @CurrentUser() user: UserModel,
    @Args({ name: 'amount', type: () => Number }) amount: number,
  ) {
    const updateBalanceDto = new UpdateBalanceDto(amount);
    const errors = await validate(updateBalanceDto);
    if (errors.length > 0) {
      const msgs = errorMessages(errors);
      throw new BadRequestException(msgs);
    }
    return await this.savingBalanceService.deposit(user.id, amount);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SavingBalanceModel)
  async withdraw(
    @CurrentUser() user: UserModel,
    @Args({ name: 'amount', type: () => Number }) amount: number,
  ) {
    const updateBalanceDto = new UpdateBalanceDto(amount);
    const errors = await validate(updateBalanceDto);
    if (errors.length > 0) {
      const msgs = errorMessages(errors);
      throw new BadRequestException(msgs);
    }
    return await this.savingBalanceService.withdraw(user.id, amount);
  }
}
