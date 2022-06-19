import { DeepPartial, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WithdrawEntity } from '../../entities/withdraw.entity';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(WithdrawEntity)
    private readonly repo: Repository<WithdrawEntity>,
  ) {}

  /**
   * Saving a WithdrawEntity into database
   *
   * @param dto
   * @returns
   */
  async create(dto: DeepPartial<WithdrawEntity>) {
    return this.repo.save(dto);
  }
}
