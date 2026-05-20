import { Test, TestingModule } from '@nestjs/testing';
import { MascotService } from './mascot.service';
import { PrismaService } from '../prisma/prisma.service';
import { PromptLoaderService } from './prompt-loader.service';

describe('MascotService', () => {
  let service: MascotService;

  const prismaMock = {
    user: { findUnique: jest.fn() },
    treatment: { findMany: jest.fn() },
    dailyLog: { findMany: jest.fn() },
    patientSupportLog: { create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MascotService,
        PromptLoaderService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MascotService>(MascotService);
    module.get<PromptLoaderService>(PromptLoaderService).onModuleInit();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateResponse', () => {
    it('aceita resposta válida em português', () => {
      const result = service.validateResponse(
        'Senhor João, estou aqui com você nesse momento difícil.',
      );
      expect(result).toBe(
        'Senhor João, estou aqui com você nesse momento difícil.',
      );
    });

    it('rejeita resposta vazia', () => {
      expect(service.validateResponse('')).toBeNull();
      expect(service.validateResponse('   ')).toBeNull();
    });

    it('rejeita resposta muito curta', () => {
      expect(service.validateResponse('oi')).toBeNull();
    });

    it('rejeita resposta acima do limite de caracteres', () => {
      const longResponse = 'á'.repeat(281);
      expect(service.validateResponse(longResponse)).toBeNull();
    });

    it('rejeita resposta com dosagem em mg', () => {
      expect(
        service.validateResponse('Tome dipirona 500mg de 6 em 6 horas.'),
      ).toBeNull();
    });

    it('rejeita resposta com markdown / lista', () => {
      expect(
        service.validateResponse(
          'Você pode tentar:\n- registrar no diário\n- conversar com seu médico',
        ),
      ).toBeNull();
    });

    it('rejeita resposta com 3+ palavras em inglês', () => {
      expect(
        service.validateResponse(
          'Here are the medications for cancer treatment.',
        ),
      ).toBeNull();
    });

    it('rejeita resposta em inglês sem diacríticos', () => {
      expect(
        service.validateResponse('I am here to help you with that.'),
      ).toBeNull();
    });

    it('rejeita promessa "vai ficar bem"', () => {
      expect(
        service.validateResponse('Não se preocupe, vai ficar tudo bem logo.'),
      ).toBeNull();
    });

    it('rejeita promessa "você vai se curar"', () => {
      expect(
        service.validateResponse('Acredite, você vai se curar em breve.'),
      ).toBeNull();
    });

    it('rejeita promessa "garanto que"', () => {
      expect(
        service.validateResponse('Senhora Ana, garanto que tudo ficará certo.'),
      ).toBeNull();
    });

    it('rejeita "logo passa"', () => {
      expect(
        service.validateResponse('Esse mal-estar logo passa, fica tranquila.'),
      ).toBeNull();
    });

    it('aceita resposta com frase canônica de sem informação', () => {
      const result = service.validateResponse('Não tenho essa informação.');
      expect(result).toBe('Não tenho essa informação.');
    });

    it('aceita acolhimento sem promessa', () => {
      const result = service.validateResponse(
        'Senhora Ana, esse medo é compreensível — estou aqui com você.',
      );
      expect(result).not.toBeNull();
    });
  });

  describe('pickFallback', () => {
    it('escolhe fallback emocional quando há sofrimento', () => {
      const result = service.pickFallback('tô com muito medo da quimio amanhã');
      expect(result).toContain('Estou aqui com você');
    });

    it('escolhe fallback emocional para cansaço/tristeza', () => {
      expect(service.pickFallback('tô cansado, exausto')).toContain(
        'Estou aqui',
      );
      expect(service.pickFallback('me sinto sozinha hoje')).toContain(
        'Estou aqui',
      );
    });

    it('escolhe fallback informativo para perguntas factuais', () => {
      const result = service.pickFallback('como funciona o diário?');
      expect(result).toContain('Não tenho essa informação');
    });

    it('escolhe fallback off-topic para mensagens neutras', () => {
      const result = service.pickFallback('xpto random text');
      expect(result).toContain('Só consigo ajudar com o OncoMente');
    });
  });
});
