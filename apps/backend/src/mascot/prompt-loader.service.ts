import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

const PROMPT_FILES = [
  'soul.md',
  'rules.md',
  'scope.md',
  'faq.md',
  'format.md',
  'user-context.md',
  'examples.md',
] as const;

export interface PromptVariables {
  nome: string;
  pronome: string;
  papel: string;
  idade: string;
  tratamentos: string;
  historico_emocional: string;
}

@Injectable()
export class PromptLoaderService implements OnModuleInit {
  private readonly logger = new Logger(PromptLoaderService.name);
  private template: string = '';

  onModuleInit() {
    const promptDir = join(__dirname, 'prompt');
    const parts: string[] = [];

    for (const file of PROMPT_FILES) {
      const fullPath = join(promptDir, file);
      const content = readFileSync(fullPath, 'utf-8').trim();
      parts.push(content);
    }

    this.template = parts.join('\n\n---\n\n');
    this.logger.log(
      `Prompt do mascote carregado de ${PROMPT_FILES.length} arquivos (${this.template.length} chars).`,
    );
  }

  render(vars: PromptVariables): string {
    return this.template
      .replace(/\{\{nome\}\}/g, vars.nome)
      .replace(/\{\{pronome\}\}/g, vars.pronome)
      .replace(/\{\{papel\}\}/g, vars.papel)
      .replace(/\{\{idade\}\}/g, vars.idade)
      .replace(/\{\{tratamentos\}\}/g, vars.tratamentos)
      .replace(/\{\{historico_emocional\}\}/g, vars.historico_emocional);
  }
}
