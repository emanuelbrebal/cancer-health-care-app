import { Test, TestingModule } from '@nestjs/testing';
import { MascotController } from './mascot.controller';
import { MascotService } from './mascot.service';

describe('MascotController', () => {
  let controller: MascotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MascotController],
      providers: [MascotService],
    }).compile();

    controller = module.get<MascotController>(MascotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
