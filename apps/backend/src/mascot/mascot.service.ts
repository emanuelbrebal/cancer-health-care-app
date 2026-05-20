import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AskAiDto } from './dto/ask-ai';
import OpenAI from 'openai';
import { PromptLoaderService } from './prompt-loader.service';

interface UserProfile {
  name: string | null;
  pronoun: string | null;
  role: string;
  birthday: Date | null;
}

@Injectable()
export class MascotService {
  private readonly logger = new Logger(MascotService.name);
  private readonly openai: OpenAI | null;

  constructor(
    private prisma: PrismaService,
    private promptLoader: PromptLoaderService,
  ) {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
    } else {
      this.openai = null;
      this.logger.warn(
        'GROQ_API_KEY não definida — o mascote IA não responderá até você configurar a chave no .env.',
      );
    }
  }

  private readonly EMERGENCY_TRIGGERS = [
    'morte',
    'morrer',
    'quero morrer',
    'não quero mais viver',
    'acabar com tudo',
    'me machucar',
    'me matar',
    'suicídio',
    'suicidio',
    'desistir de viver',
    'não vejo saída',
    'nao vejo saida',
    'não aguento mais',
    'nao aguento mais',
    'não quero mais estar aqui',
    'nao quero mais estar aqui',
    'dor insuportável',
    'dor insuportavel',
    'dor muito forte',
    'dor no peito',
    'dor forte no peito',
    'aperto no peito',
    'febre muito alta',
    'sangramento forte',
    'sangrando muito',
    'falta de ar',
    'falta de ar intensa',
    'não consigo respirar',
    'nao consigo respirar',
    'sem conseguir respirar',
    'engasgou',
    'engasgando',
    'desmaiei',
    'desmaiou',
    'convulsão',
    'convulsao',
    'tive uma convulsão',
    'avc',
    'derrame',
    'infarto',
  ];

  private readonly EMERGENCY_RESPONSE =
    'Sinto muito que esteja passando por isso. Acesse Área de Saúde Mental > Botão do Pânico, ligue 188 (CVV) ou 192 (SAMU). Você não está sozinho.';

  private readonly NO_INFO_FALLBACK = 'Não tenho essa informação.';
  private readonly OFF_TOPIC_FALLBACK =
    'Só consigo ajudar com o OncoMente. Em que posso te apoiar hoje?';
  private readonly EMOTIONAL_FALLBACK =
    'Estou aqui com você, mesmo quando faltam as palavras certas. Não sou profissional de saúde, mas posso fazer companhia.';
  private readonly INFO_FALLBACK =
    'Não tenho essa informação por aqui — mas se quiser falar sobre como você está, estou ao seu lado.';

  private readonly EMOTIONAL_CUES = [
    'medo', 'triste', 'tristeza', 'cansad', 'exaust', 'sozinh',
    'chorar', 'choro', 'chorei', 'ansios', 'angústia', 'angustia',
    'sofrend', 'sofrer', 'desespero', 'perdid', 'frágil', 'fragil',
    'dor', 'doendo', 'machuc', 'apavorad', 'assustad', 'preocupad',
    'culpa', 'raiva', 'revolt', 'vazi', 'sem forças', 'sem forcas',
    'desanimad', 'deprimid', 'pra baixo', 'difícil', 'dificil',
    'pesado', 'pesando', 'sufocad', 'sem esperança', 'sem esperanca',
    'não aguento', 'nao aguento', 'sente saudade', 'saudade',
  ];

  private readonly INFO_CUES = [
    'como', 'onde', 'qual', 'quais', 'quando', 'o que', 'pra que',
    'para que', 'tem', 'existe', 'funciona', 'cadastrar', 'registrar',
    '?',
  ];

  private readonly FORBIDDEN_PROMISES = [
    /\bvai ficar (tudo )?bem\b/i,
    /\bvocê vai (se )?curar\b/i,
    /\bvai se curar\b/i,
    /\blogo passa\b/i,
    /\bgaranto que\b/i,
    /\btenho certeza que\b/i,
    /\bcom certeza vai\b/i,
  ];

  private readonly DOSAGE_PATTERN =
    /\b\d+([.,]\d+)?\s?(mg|mcg|µg|ml|g|ui|mg\/m2|mg\/m²|mg\/kg|g\/m2|g\/m²)\b/i;

  private readonly MARKDOWN_NOISE_PATTERN = /(\*\*|^#|^\s*[-*]\s|^\s*\d+\.\s)/m;

  private readonly ENGLISH_WORDS = [
    'the', 'you', 'are', 'is', 'with', 'for', 'and', 'or', 'in',
    'to', 'on', 'at', 'medication', 'medications', 'dose', 'dosage',
    'treatment', 'cancer', 'patient', 'please', 'thank', 'list',
    'every', 'weeks', 'mg', 'iv', 'protocol',
  ];

  private readonly MAX_RESPONSE_CHARS = 280;

  private isEmergency(text: string): boolean {
    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const normalized = normalize(text);
    return this.EMERGENCY_TRIGGERS.some((trigger) =>
      normalized.includes(normalize(trigger)),
    );
  }

  async generateResponse(userId: string, data: AskAiDto) {
    if (this.isEmergency(data.userQuestion)) {
      await this.logInteraction(userId, data, this.EMERGENCY_RESPONSE);
      return { response: this.EMERGENCY_RESPONSE };
    }

    if (!this.openai) {
      throw new ServiceUnavailableException(
        'O serviço de IA do mascote não está configurado. Defina GROQ_API_KEY no ambiente (ex.: chave em https://console.groq.com/keys).',
      );
    }

    try {
      const profile = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, pronoun: true, role: true, birthday: true },
      });

      const { systemMessage, userMessage } = this.buildMessages(data, profile);

      const historyMessages = (data.history ?? []).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      }));

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          ...historyMessages,
          { role: 'user', content: userMessage },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        top_p: 0.5,
        max_tokens: 400,
      });

      const raw = completion.choices[0].message.content ?? '';
      const validated = this.validateResponse(raw);
      const response = validated ?? this.pickFallback(data.userQuestion);

      this.logInteraction(userId, data, response).catch((err) =>
        this.logger.error(`Falha ao registrar log: ${(err as Error).message}`),
      );

      return { response };
    } catch (error) {
      this.logger.error(`Erro na IA: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        'Falha ao processar requisição de IA',
      );
    }
  }

  async getUserContext(userId: string) {
    const [user, treatments, logs] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, pronoun: true, role: true, birthday: true },
      }),
      this.prisma.treatment.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { name: true, frequency: true, startTime: true, endDate: true },
      }),
      this.prisma.dailyLog.findMany({
        where: {
          userId,
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        select: { date: true, emotes: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    return {
      profile: user
        ? {
            name: user.name,
            pronoun: user.pronoun,
            role: user.role,
            age: user.birthday ? this.calculateAge(user.birthday) : null,
          }
        : null,
      treatments,
      emotionSummary: logs.map((l) => ({
        date: l.date.toISOString().slice(0, 10),
        emotes: l.emotes,
      })),
    };
  }

  validateResponse(response: string): string | null {
    const trimmed = response.trim();
    if (!trimmed || trimmed.length < 5) return null;

    if (trimmed.length > this.MAX_RESPONSE_CHARS) {
      this.logger.warn(
        `Resposta excedeu ${this.MAX_RESPONSE_CHARS} chars — descartada.`,
      );
      return null;
    }

    if (this.countEnglishWords(trimmed) >= 3) {
      this.logger.warn('Resposta com 3+ palavras em inglês — descartada.');
      return null;
    }

    const hasPtDiacritics = /[ãçêáéíóúâôàèõ]/i.test(trimmed);
    const hasEnglishStructure =
      /\b(the |I am |you are |it is |this is |please |thank you |I don't|I can't|happy to|here is|here are)\b/i.test(
        trimmed,
      );
    if (!hasPtDiacritics && hasEnglishStructure) {
      this.logger.warn('Resposta fora do idioma esperado — descartada.');
      return null;
    }

    if (this.DOSAGE_PATTERN.test(trimmed)) {
      this.logger.warn('Resposta com dosagem detectada — descartada.');
      return null;
    }

    if (this.MARKDOWN_NOISE_PATTERN.test(trimmed)) {
      this.logger.warn('Resposta com markdown/lista — descartada.');
      return null;
    }

    for (const pattern of this.FORBIDDEN_PROMISES) {
      if (pattern.test(trimmed)) {
        this.logger.warn(
          `Resposta com promessa proibida (${pattern}) — descartada.`,
        );
        return null;
      }
    }

    return trimmed;
  }

  pickFallback(userQuestion: string): string {
    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const text = normalize(userQuestion);

    const isEmotional = this.EMOTIONAL_CUES.some((cue) =>
      text.includes(normalize(cue)),
    );
    if (isEmotional) return this.EMOTIONAL_FALLBACK;

    const isInfo = this.INFO_CUES.some((cue) => text.includes(normalize(cue)));
    if (isInfo) return this.INFO_FALLBACK;

    return this.OFF_TOPIC_FALLBACK;
  }

  private countEnglishWords(text: string): number {
    const words = text
      .toLowerCase()
      .replace(/[^a-zà-ÿ\s]/gi, ' ')
      .split(/\s+/)
      .filter(Boolean);
    return words.filter((w) => this.ENGLISH_WORDS.includes(w)).length;
  }

  private buildMessages(
    data: AskAiDto,
    profile: UserProfile | null,
  ): { systemMessage: string; userMessage: string } {
    const hasTreatment =
      Array.isArray(data.treatmentData) && data.treatmentData.length > 0;
    const hasEmotions =
      Array.isArray(data.calendarData) && data.calendarData.length > 0;

    const systemMessage = this.promptLoader.render({
      nome: profile?.name ?? '',
      pronome: this.formatPronounLabel(profile?.pronoun ?? null) ?? '',
      papel: profile ? this.formatRole(profile.role) : '',
      idade: profile?.birthday
        ? String(this.calculateAge(profile.birthday))
        : '',
      tratamentos: hasTreatment
        ? JSON.stringify(data.treatmentData)
        : 'nenhum registrado',
      historico_emocional: hasEmotions
        ? JSON.stringify(data.calendarData)
        : 'nenhum registrado',
    });

    return {
      systemMessage,
      userMessage: data.userQuestion,
    };
  }

  private formatPronounLabel(pronoun: string | null): string | null {
    const map: Record<string, string | null> = {
      SR: 'Senhor',
      SRA: 'Senhora',
      SRTA: 'Senhorita',
      CUSTOM: null,
      NOT_INFORMED: null,
    };
    return pronoun ? (map[pronoun] ?? null) : null;
  }

  private formatRole(role: string): string {
    if (role === 'CAREGIVER') return 'cuidador de paciente oncológico';
    if (role === 'PATIENT') return 'paciente oncológico';
    return 'não especificado';
  }

  private calculateAge(birthday: Date): number {
    return Math.floor(
      (Date.now() - birthday.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );
  }

  private async logInteraction(
    userId: string,
    data: AskAiDto,
    response: string,
  ) {
    return this.prisma.patientSupportLog.create({
      data: {
        userId,
        prompt: data.userQuestion ?? '',
        response: response ?? '',
        context: { treatment: data.treatmentData, calendar: data.calendarData },
      },
    });
  }
}
