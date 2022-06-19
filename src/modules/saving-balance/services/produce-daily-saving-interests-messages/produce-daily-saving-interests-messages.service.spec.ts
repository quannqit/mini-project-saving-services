import { Test, TestingModule } from '@nestjs/testing';
import { ProduceDailySavingInterestsMessagesService } from './produce-daily-saving-interests-messages.service';

describe('ProduceDailySavingInterestsMessagesService', () => {
  let service: ProduceDailySavingInterestsMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduceDailySavingInterestsMessagesService],
    }).compile();

    service = module.get<ProduceDailySavingInterestsMessagesService>(ProduceDailySavingInterestsMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
