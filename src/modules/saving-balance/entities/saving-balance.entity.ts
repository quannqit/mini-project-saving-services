import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DepositEntity } from './deposit.entity';

@Entity('saving-balances')
@Index(['createdAt'])
export class SavingBalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public userId!: string;

  @Column({ type: 'double precision' })
  public availableAmount!: number;

  @OneToMany(() => DepositEntity, (deposit) => deposit.savingBalance, {
    eager: false,
  })
  deposits?: DepositEntity[];

  @CreateDateColumn()
  public createdAt!: Date;
}
