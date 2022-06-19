import { Queue } from 'bull';

import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsServicesModule } from '../aws-services/aws-services.module';
import { DepositEntity } from './entities/deposit.entity';
import { SavingBalanceEntity } from './entities/saving-balance.entity';
import { SavingInterestEntity } from './entities/saving-interest.entity';
import { WithdrawEntity } from './entities/withdraw.entity';
import { SavingBalanceResolver } from './resolvers/saving-balance/saving-balance.resolver';
import { DepositService } from './services/deposit/deposit.service';
import { ProduceDailySavingInterestsMessagesService } from './services/produce-daily-saving-interests-messages/produce-daily-saving-interests-messages.service';
import { SavingBalanceService } from './services/saving-balance/saving-balance.service';
import { WithdrawService } from './services/withdraw/withdraw.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavingBalanceEntity,
      DepositEntity,
      WithdrawEntity,
      SavingInterestEntity,
    ]),
    BullModule.registerQueue({ name: 'pay-daily-interests' }),
    AwsServicesModule,
  ],
  providers: [
    SavingBalanceService,
    DepositService,
    WithdrawService,
    SavingBalanceResolver,
    ProduceDailySavingInterestsMessagesService,
  ],
})
export class SavingBalanceModule implements OnModuleInit {
  constructor(
    @InjectQueue('pay-daily-interests')
    private queue: Queue,
  ) {}

  async onModuleInit() {
    const oldJobs = await this.queue.getRepeatableJobs();
    oldJobs.forEach((job) => {
      this.queue.removeRepeatableByKey(job.key);
    });

    /**
     * Everyday at 23:59PM GMT+07, assume server time zone is UTC
     */
    await this.queue.add('produce-daily-saving-interests-messages', null, {
      repeat: { cron: '59 16 * * *' },
    });
  }
}
