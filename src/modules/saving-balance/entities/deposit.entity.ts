import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SavingBalanceEntity } from './saving-balance.entity';

@Entity('deposits')
export class DepositEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @JoinColumn()
  @ManyToOne(() => SavingBalanceEntity)
  savingBalance!: SavingBalanceEntity;

  @Column({ type: 'double precision' })
  public amount!: number;

  @Column({ type: 'double precision' })
  public availableAmountBefore!: number;

  @Column({ type: 'double precision' })
  public availableAmountAfter!: number;

  @CreateDateColumn()
  public createdAt!: Date;
}
