import { Test, TestingModule } from '@nestjs/testing';
import { LeisuresService } from './leisures.service';

describe('LeisuresService', () => {
  let service: LeisuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeisuresService],
    }).compile();

    service = module.get<LeisuresService>(LeisuresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
