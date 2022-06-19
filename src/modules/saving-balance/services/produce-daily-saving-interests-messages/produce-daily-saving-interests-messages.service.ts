import { AWSError } from 'aws-sdk';
import SQS, { SendMessageBatchResult } from 'aws-sdk/clients/sqs';

import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SavingBalanceEntity } from '../../entities/saving-balance.entity';
import { SavingBalanceService } from '../saving-balance/saving-balance.service';

@Processor({
  name: 'pay-daily-interests',
})
@Injectable()
export class ProduceDailySavingInterestsMessagesService {
  constructor(
    @Inject('AWS_SQS')
    private readonly sqs: SQS,
    private readonly savingBalanceService: SavingBalanceService,
    private readonly configService: ConfigService,
  ) {}

  @Process({
    name: 'produce-daily-saving-interests-messages',
    concurrency: 1,
  })
  async produceDailySavingInterestsMessages() {
    const date = new Date();
    const txtDate = date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const QueueUrl = this.configService.get(
      'AWS_SQS_PAY_DAILY_SAVING_INTERESTS_QUEUE_NAME',
    );
    const take = this.configService.get<number>(
      'SELECT_SAVING_BALANCE_LIMIT',
      1000,
    );
    const interestRate = this.configService.get<number>('INTEREST_RATE');

    let skip = 0;
    const [firstBatch, total] = await this.savingBalanceService.findAll(
      take,
      skip,
    );
    await this.send2SQS(QueueUrl, txtDate, interestRate, firstBatch);
    skip = firstBatch.length;

    while (skip < total) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [balances, _] = await this.savingBalanceService.findAll(take, skip);
      await this.send2SQS(QueueUrl, txtDate, interestRate, balances);
      skip += balances.length;
    }
    console.log(`${skip} saving balance have been pushed to SQS queue.`);
  }

  private async send2SQS(
    QueueUrl: string,
    period: string,
    interestRate: number,
    balances: SavingBalanceEntity[],
  ) {
    // SQS.sendMessageBatch only take 10 messages
    const chunkSize = 10;
    for (let i = 0; i < balances.length; i += chunkSize) {
      const chunk = balances.slice(i, i + chunkSize);
      await new Promise((resolve, reject) => {
        this.sqs.sendMessageBatch(
          {
            QueueUrl,
            Entries: this.balances2SqsMessages(chunk, period, interestRate),
          },
          (err: AWSError, data: SendMessageBatchResult) => {
            if (err) {
              reject(err);
            }
            resolve(data);
          },
        );
      });
    }
  }

  private balances2SqsMessages(
    balances: SavingBalanceEntity[],
    period: string,
    interestRate: number,
  ) {
    return balances.map((balance) => ({
      Id: balance.id,
      MessageBody: JSON.stringify({
        balanceId: balance.id,
        interestRate,
        period,
      }),
    }));
  }
}
