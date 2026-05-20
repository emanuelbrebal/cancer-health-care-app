import { Test, TestingModule } from '@nestjs/testing';
import { PromptLoaderService } from './prompt-loader.service';

describe('PromptLoaderService', () => {
  let service: PromptLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptLoaderService],
    }).compile();

    service = module.get<PromptLoaderService>(PromptLoaderService);
    service.onModuleInit();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve carregar conteúdo de todos os módulos do prompt', () => {
    const rendered = service.render({
      nome: '',
      pronome: '',
      papel: '',
      idade: '',
      tratamentos: 'nenhum registrado',
      historico_emocional: 'nenhum registrado',
    });

    expect(rendered).toContain('IDENTIDADE');
    expect(rendered).toContain('REGRAS ABSOLUTAS');
    expect(rendered).toContain('ESCOPO');
    expect(rendered).toContain('FAQ');
    expect(rendered).toContain('FORMATO DE SAÍDA');
    expect(rendered).toContain('CONTEXTO DO USUÁRIO');
    expect(rendered).toContain('EXEMPLOS');
  });

  it('deve substituir placeholders com dados do usuário', () => {
    const rendered = service.render({
      nome: 'João',
      pronome: 'Senhor',
      papel: 'paciente oncológico',
      idade: '45',
      tratamentos: '[{"name":"Quimio"}]',
      historico_emocional: '[]',
    });

    expect(rendered).toContain('João');
    expect(rendered).toContain('Senhor');
    expect(rendered).toContain('paciente oncológico');
    expect(rendered).toContain('45');
    expect(rendered).toContain('Quimio');
    expect(rendered).not.toContain('{{nome}}');
    expect(rendered).not.toContain('{{pronome}}');
    expect(rendered).not.toContain('{{papel}}');
    expect(rendered).not.toContain('{{idade}}');
    expect(rendered).not.toContain('{{tratamentos}}');
    expect(rendered).not.toContain('{{historico_emocional}}');
  });

  it('deve incluir as frases canônicas no template', () => {
    const rendered = service.render({
      nome: '',
      pronome: '',
      papel: '',
      idade: '',
      tratamentos: '',
      historico_emocional: '',
    });

    expect(rendered).toContain('Não tenho essa informação.');
    expect(rendered).toContain('Só consigo ajudar com o OncoMente');
    expect(rendered).toContain(
      'Isso precisa ser avaliado pelo seu médico',
    );
  });
});
