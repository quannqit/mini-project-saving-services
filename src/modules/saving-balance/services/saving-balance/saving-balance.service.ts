import { DeepPartial, EntityManager, MoreThan, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DepositEntity } from '../../entities/deposit.entity';
import { SavingBalanceEntity } from '../../entities/saving-balance.entity';
import { SavingInterestEntity } from '../../entities/saving-interest.entity';
import { WithdrawEntity } from '../../entities/withdraw.entity';

@Injectable()
export class SavingBalanceService {
  constructor(
    @InjectRepository(SavingBalanceEntity)
    private readonly repo: Repository<SavingBalanceEntity>,
  ) {}

  /**
   * Creates a saving balance
   *
   * @param dto
   * @returns
   */
  async create(
    dto: DeepPartial<SavingBalanceEntity>,
  ): Promise<SavingBalanceEntity> {
    return this.repo.save(dto);
  }

  /**
   * Returns a saving balance by their unique userId or undefined
   *
   * @param userId
   * @returns
   */
  findOneByUserId(userId: string) {
    return this.repo.findOne({ userId });
  }

  /**
   * Returns all saving balances
   *
   * @param take
   * @param skip
   * @returns
   */
  findAll(take: number, skip: number) {
    return this.repo.findAndCount({
      where: { availableAmount: MoreThan(0) },
      order: { createdAt: 'ASC' },
      take,
      skip,
    });
  }

  async deposit(userId: string, amount: number) {
    const balance = await this.repo.manager.transaction(
      'READ COMMITTED',
      async (entityManager: EntityManager) => {
        let balanceEntity = await entityManager.findOne(
          SavingBalanceEntity,
          { userId },
          {
            lock: { mode: 'pessimistic_write' /** SELECT....FOR UPDATE */ },
            transaction: true,
          },
        );
        if (!balanceEntity) {
          // create new saving balance if not exists yet
          balanceEntity = new SavingBalanceEntity();
          balanceEntity.userId = userId;
          balanceEntity.availableAmount = 0;
          balanceEntity = await entityManager.save<SavingBalanceEntity>(
            balanceEntity,
          );
        }
        const depositEntity = new DepositEntity();
        depositEntity.amount = amount;
        depositEntity.savingBalance = balanceEntity;
        depositEntity.availableAmountBefore = balanceEntity.availableAmount;
        depositEntity.availableAmountAfter =
          balanceEntity.availableAmount + amount;
        await entityManager.save(depositEntity);

        // update availableAmount of current saving balance
        balanceEntity.availableAmount = balanceEntity.availableAmount + amount;
        await entityManager.save(balanceEntity);

        return balanceEntity;
      },
    );

    return balance;
  }

  async withdraw(userId: string, amount: number) {
    const balance = await this.repo.manager.transaction(
      'READ COMMITTED',
      async (entityManager: EntityManager) => {
        const savingBalance = await entityManager.findOne(
          SavingBalanceEntity,
          { userId },
          {
            lock: { mode: 'pessimistic_write' /** SELECT....FOR UPDATE */ },
            transaction: true,
          },
        );
        if (!savingBalance) {
          throw new NotFoundException(
            `Saving balance of user ${userId} not found`,
          );
        }

        const availableAmountAfter = savingBalance.availableAmount - amount;
        if (availableAmountAfter < 0) {
          throw new BadRequestException(`Saving balance is not enough`);
        }

        const withdrawEntity = new WithdrawEntity();
        withdrawEntity.amount = amount;
        withdrawEntity.savingBalance = savingBalance;
        withdrawEntity.availableAmountBefore = savingBalance.availableAmount;
        withdrawEntity.availableAmountAfter =
          savingBalance.availableAmount - amount;
        await entityManager.save(withdrawEntity);

        // update availableAmount of current saving balance
        savingBalance.availableAmount = availableAmountAfter;
        await entityManager.save(savingBalance);

        return savingBalance;
      },
    );

    return balance;
  }

  async payDailySavingInterests(
    balanceId: string,
    interestRate: number,
    period: string,
  ) {
    const balance = await this.repo.manager.transaction(
      async (entityManager: EntityManager) => {
        const savingBalance = await entityManager.findOne(
          SavingBalanceEntity,
          { id: balanceId },
          { lock: { mode: 'pessimistic_write' /** SELECT....FOR UPDATE */ } },
        );
        if (!savingBalance) {
          // create new saving balance if not exists yet
          throw new NotFoundException(`Saving balance ${balanceId} not found!`);
        }

        const amount = (savingBalance.availableAmount * interestRate) / 365;
        const savingInterestEntity = new SavingInterestEntity();
        savingInterestEntity.interestRate = interestRate;
        savingInterestEntity.period = period;
        savingInterestEntity.savingBalance = savingBalance;
        savingInterestEntity.availableAmountBefore =
          savingBalance.availableAmount;
        savingInterestEntity.availableAmountAfter =
          savingBalance.availableAmount + amount;
        await entityManager.save(savingInterestEntity);

        // update availableAmount of current saving balance
        savingBalance.availableAmount = savingBalance.availableAmount + amount;
        return entityManager.save(savingBalance);
      },
    );
    return balance;
  }
}
