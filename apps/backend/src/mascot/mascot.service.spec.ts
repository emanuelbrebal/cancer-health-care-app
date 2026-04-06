import { Test, TestingModule } from '@nestjs/testing';
import { MascotService } from './mascot.service';

describe('MascotService', () => {
  let service: MascotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MascotService],
    }).compile();

    service = module.get<MascotService>(MascotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
