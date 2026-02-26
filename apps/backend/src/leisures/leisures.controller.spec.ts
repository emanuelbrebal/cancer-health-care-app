import { Test, TestingModule } from '@nestjs/testing';
import { LeisuresController } from './leisures.controller';
import { LeisuresService } from './leisures.service';

describe('LeisuresController', () => {
  let controller: LeisuresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeisuresController],
      providers: [LeisuresService],
    }).compile();

    controller = module.get<LeisuresController>(LeisuresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
