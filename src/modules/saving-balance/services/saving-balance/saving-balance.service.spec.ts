import { Test, TestingModule } from '@nestjs/testing';
import { SavingBalanceService } from './saving-balance.service';

describe('SavingBalanceService', () => {
  let service: SavingBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingBalanceService],
    }).compile();

    service = module.get<SavingBalanceService>(SavingBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
