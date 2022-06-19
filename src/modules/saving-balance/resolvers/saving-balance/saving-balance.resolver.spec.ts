import { Test, TestingModule } from '@nestjs/testing';
import { SavingBalanceResolver } from './saving-balance.resolver';

describe('SavingBalanceResolver', () => {
  let resolver: SavingBalanceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingBalanceResolver],
    }).compile();

    resolver = module.get<SavingBalanceResolver>(SavingBalanceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
