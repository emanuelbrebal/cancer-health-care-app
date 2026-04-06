import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AskAiDto } from './dto/ask-ai';
import OpenAI from 'openai';

@Injectable()
export class MascotService {
  private readonly logger = new Logger(MascotService.name);
  private openai: OpenAI;
  private readonly masterPrompt = process.env.AI_MASTER_PROMPT ?? 'Assistente de Suporte';

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  async generateResponse(data: AskAiDto) {
    try {

      const prompt = this.buildPrompt(data);

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        max_tokens: 150,
      });

      const response = completion.choices[0].message.content ?? '';

      if (!response) {
        throw new InternalServerErrorException('A IA não retornou uma resposta válida.');
      }

      await this.logInteraction(data, response);

      return response;
    }
    catch (error) {
      this.logger.error(`Erro na IA: ${error.message}`);
      throw new InternalServerErrorException('Falha ao processar requisição de IA');
    }
  }

  async generateNotification(triggerData: any) {
    return {
      message: `Olá! Notei que agora é o horário do seu medicamento (${triggerData.medName}). Como você está se sentindo para tomar este passo agora?`
    };
  }

  private buildPrompt(data: AskAiDto): string {

    const formatDate = (obj: any) => {
      return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          const date = new Date(value);
          return date.toLocaleDateString('pt-BR');
        }
        return value;
      }));
    };

    const contextTreatment = formatDate(data.treatmentData);
    const contextCalendar = formatDate(data.calendarData);

    return `
    ### INSTRUÇÕES DE SISTEMA ###
    ${this.masterPrompt}

    ### CONTEXTO REAL DO PACIENTE (FONTE ÚNICA DE VERDADE) ###
    Tratamento: ${JSON.stringify(contextTreatment)}
    Agenda: ${JSON.stringify(contextCalendar)}

    ### PERGUNTA DO USUÁRIO ###
    ${data.userQuestion}

    RESPOSTA DO MASCOTE (CURTA E SEM SUPOSIÇÕES):
  `;
  }

  private async logInteraction(data: AskAiDto, response: string) {
    return this.prisma.patientSupportLog.create({
      data: {
        userId: data.userId,
        prompt: data.userQuestion ?? '',
        response: response ?? '',
        context: { treatment: data.treatmentData, calendar: data.calendarData }
      }
    });
  }
}