import { DeepPartial, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DepositEntity } from '../../entities/deposit.entity';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(DepositEntity)
    private readonly repo: Repository<DepositEntity>,
  ) {}

  /**
   * Save a DepositEntity into database
   *
   * @param dto
   * @returns
   */
  async create(dto: DeepPartial<DepositEntity>) {
    return this.repo.save(dto);
  }
}
