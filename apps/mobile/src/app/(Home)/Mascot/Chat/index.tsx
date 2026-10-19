import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '@/src/components/ui/Images/Avatar';
import api from '@/src/services/api';
import mascotService, { MascotContext } from '@/src/services/mascotService';
import { toastService } from '@/src/services/toastService';
import { Button } from '@/src/components/ds/Button';
import { ConfirmDialog } from '@/src/components/ds/ConfirmDialog';
import { useUxDebugStore } from '@/src/store/useUxDebugStore';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';

const DAILY_LIMIT = 30;
const CHAT_LIMIT_KEY = 'oncomente:chat-daily-limit';
const CHAT_HISTORY_KEY = 'oncomente:chat-history';
const MAX_HISTORY = 20;
const HISTORY_CONTEXT_SIZE = 8;

// Atalhos para quem não sabe por onde começar (estado vazio).
const SUGGESTIONS = [
  'Como lidar com o enjoo da quimioterapia?',
  'Estou ansioso(a) antes da consulta',
  'O que é a Lei dos 60 dias?',
];

let _msgCounter = 0;
function nextMsgId() {
  return `${Date.now()}-${++_msgCounter}`;
}

const WELCOME_MESSAGE: IMessage = {
  id: 'welcome',
  text: 'Olá! Sou o mascote virtual do OncoMente 💜 Estou aqui para tirar dúvidas sobre oncologia e saúde mental e fazer seu dia mais leve. Como posso ajudar?',
  sender: 'bot',
};

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  failed?: boolean;
}

interface ChatLimitRecord {
  date: string;
  count: number;
}

async function getTodayCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(CHAT_LIMIT_KEY);
  if (!raw) return 0;
  const record: ChatLimitRecord = JSON.parse(raw);
  const today = new Date().toISOString().slice(0, 10);
  return record.date === today ? record.count : 0;
}

async function incrementTodayCount(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const count = (await getTodayCount()) + 1;
  await AsyncStorage.setItem(CHAT_LIMIT_KEY, JSON.stringify({ date: today, count }));
  return count;
}

export default function MascotChat() {
  const headerHeight = useHeaderHeight();
  const forced = useUxDebugStore((s) => s.forced);
  const setForced = useUxDebugStore((s) => s.setForced);
  const [messages, setMessages] = useState<IMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [userContext, setUserContext] = useState<MascotContext | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Carregar contagem diária e histórico em paralelo
    Promise.all([
      getTodayCount(),
      AsyncStorage.getItem(CHAT_HISTORY_KEY),
    ]).then(([count, rawHistory]) => {
      setMessagesUsed(count);
      if (rawHistory) {
        const history: IMessage[] = JSON.parse(rawHistory);
        if (history.length > 0) setMessages(history);
      }
    });

    // Buscar contexto do paciente uma vez por sessão
    mascotService.getContext()
      .then(setUserContext)
      .catch(() => {}); // chat funciona normalmente sem contexto
  }, []);

  // Persistir histórico sempre que as mensagens mudarem
  useEffect(() => {
    const slice = messages.slice(0, MAX_HISTORY);
    AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(slice));
  }, [messages]);

  const remaining = Math.max(DAILY_LIMIT - messagesUsed, 0);
  const limitReached = remaining <= 0;

  // Painel de simulação de estados (gravação): força digitando, erro ou conversa vazia.
  const showTyping = loading || forced === 'loading';
  const showError = forced === 'error' || (!!lastFailedText && !loading);
  const visibleMessages = forced === 'empty' ? [WELCOME_MESSAGE] : messages;
  const isEmpty = visibleMessages.length === 1 && visibleMessages[0].id === 'welcome';

  const handleClearHistory = async () => {
    await AsyncStorage.multiRemove([CHAT_HISTORY_KEY, CHAT_LIMIT_KEY]);
    setMessages([WELCOME_MESSAGE]);
    setMessagesUsed(0);
    setLastFailedText(null);
    setConfirmClear(false);
    toastService.info('Conversa apagada.');
  };

  const sendMessage = async (text: string) => {
    const userMessageText = text.trim();
    if (!userMessageText || loading || limitReached) return;

    const userMessage: IMessage = {
      id: nextMsgId(),
      text: userMessageText,
      sender: 'user',
    };

    setMessages(prev => [userMessage, ...prev.filter((m) => !m.failed)]);
    setInputText('');
    setLastFailedText(null);
    setLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => !m.failed)
        .slice(0, HISTORY_CONTEXT_SIZE)
        .reverse()
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const response = await api.post(
        '/ai-support/ask',
        {
          userQuestion: userMessageText,
          treatmentData: userContext?.treatments ?? [],
          calendarData: userContext?.emotionSummary ?? [],
          history: historyForApi,
        },
        { timeout: 30000 }
      );

      const botText = response.data?.response ?? 'Sinto muito, recebi uma resposta vazia. Pode repetir? 💜';

      const botResponse: IMessage = {
        id: nextMsgId(),
        text: botText,
        sender: 'bot',
      };

      setMessages(prev => [botResponse, ...prev]);
      const newCount = await incrementTodayCount();
      setMessagesUsed(newCount);

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);

    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 429) {
        toastService.error('Muitas mensagens em pouco tempo. Aguarde um momento! 💜');
      }
      const errorMsg: IMessage = {
        id: nextMsgId(),
        text: 'Sinto muito, tive um probleminha técnico e não consegui responder. 💜',
        sender: 'bot',
        failed: true,
      };
      setMessages(prev => [errorMsg, ...prev]);
      setLastFailedText(userMessageText);
    } finally {
      setLoading(false);
    }
  };

  const canSend = !!inputText.trim() && !loading && !limitReached;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
    >
      {/* v1: sem aviso de escopo e limite só exibido quando faltavam 2 mensagens (P20). */}
      <View style={styles.infoBar} accessibilityRole="text">
        <Feather name="info" size={iconSize.sm} color={color.text.info} />
        <Text style={styles.infoText}>
          Respostas informativas, não substituem sua equipe de saúde · {remaining} {remaining === 1 ? 'mensagem restante' : 'mensagens restantes'} hoje
        </Text>
        <Pressable
          onPress={() => setConfirmClear(true)}
          accessibilityRole="button"
          accessibilityLabel="Limpar conversa"
          style={styles.clearBtn}
        >
          <Feather name="trash-2" size={iconSize.md} color={color.text.info} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={visibleMessages}
        inverted
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        ListHeaderComponent={
          <>
            {showTyping && (
              <View style={styles.typing} accessibilityLiveRegion="polite" accessibilityLabel="O mascote está escrevendo">
                <Text style={styles.typingText}>O mascote está escrevendo…</Text>
              </View>
            )}
            {showError && !showTyping && (
              <View style={styles.errorBar} accessibilityRole="alert">
                <Text style={styles.errorText}>Não consegui responder agora. Pode ser a conexão.</Text>
                <Button
                  title="Tentar de novo"
                  icon="refresh-cw"
                  variant="secondary"
                  // No erro simulado (gravação), "tentar de novo" encerra a simulação.
                  onPress={() => (lastFailedText ? sendMessage(lastFailedText) : setForced('auto'))}
                />
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, item.sender === 'user' ? styles.rowUser : styles.rowBot]}>
            {item.sender === 'bot' && (
              <Avatar
                style={styles.avatar}
                imagePath={require('@assets/images/Home/blueMascotPlaceholder.png')}
              />
            )}
            <View
              style={[styles.bubble, item.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}
              accessible
              accessibilityLabel={`${item.sender === 'user' ? 'Você' : 'Mascote'}: ${item.text}`}
            >
              <Text style={item.sender === 'user' ? styles.textUser : styles.textBot}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {isEmpty && !showTyping && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsLabel}>Sugestões para começar</Text>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => sendMessage(s)}
              disabled={limitReached}
              accessibilityRole="button"
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.inputArea}>
        {limitReached && (
          <Text style={styles.limitText} accessibilityLiveRegion="polite">
            Limite diário atingido. Volte amanhã 💜
          </Text>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            multiline
            value={inputText}
            onChangeText={setInputText}
            editable={!loading && !limitReached}
            placeholder={limitReached ? 'Limite diário atingido' : 'Escreva sua mensagem'}
            placeholderTextColor={color.text.secondary}
            accessibilityLabel="Mensagem para o mascote"
          />
          <Pressable
            onPress={() => sendMessage(inputText)}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
            accessibilityState={{ disabled: !canSend, busy: loading }}
            style={({ pressed }) => [
              styles.sendBtn,
              !canSend && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}
          >
            <Feather name="send" size={iconSize.md} color={canSend ? color.text.onAction : color.text.disabled} />
          </Pressable>
        </View>
      </View>

      <ConfirmDialog
        visible={confirmClear}
        title="Apagar a conversa?"
        message="Todo o histórico com o mascote será apagado deste aparelho."
        confirmLabel="Apagar conversa"
        cancelLabel="Manter"
        destructive
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmClear(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginHorizontal: space.sm,
    paddingLeft: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.bg.info,
  },
  infoText: {
    ...typography.caption,
    color: color.text.info,
    flex: 1,
    paddingVertical: space.xs,
  },
  clearBtn: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.xs,
  },
  rowUser: {
    alignSelf: 'flex-end',
  },
  rowBot: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: space.lg + space.xxs,
    height: space.lg + space.xxs,
  },
  bubble: {
    padding: space.sm,
    borderRadius: radius.lg,
    maxWidth: '78%',
  },
  bubbleUser: {
    backgroundColor: color.action.primary,
    borderBottomRightRadius: radius.sm / 2,
  },
  bubbleBot: {
    backgroundColor: color.bg.subtle,
    borderBottomLeftRadius: radius.sm / 2,
  },
  textUser: {
    ...typography.body,
    color: color.text.onAction,
  },
  textBot: {
    ...typography.body,
    color: color.text.primary,
  },
  typing: {
    alignSelf: 'flex-start',
    marginLeft: space.xl,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: color.bg.brandSubtle,
  },
  typingText: {
    ...typography.small,
    color: color.text.brandStrong,
  },
  errorBar: {
    gap: space.xs,
    padding: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.bg.danger,
  },
  errorText: {
    ...typography.smallStrong,
    color: color.text.danger,
  },
  suggestions: {
    paddingHorizontal: space.sm,
    gap: space.xs,
    paddingBottom: space.xs,
  },
  suggestionsLabel: {
    ...typography.smallStrong,
    color: color.text.secondary,
  },
  chip: {
    minHeight: touch.min,
    justifyContent: 'center',
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    borderWidth: layout.borderHairline,
    borderColor: color.border.brand,
    backgroundColor: color.bg.surface,
    alignSelf: 'flex-start',
  },
  chipPressed: {
    backgroundColor: color.bg.brandSubtle,
  },
  chipText: {
    ...typography.small,
    color: color.text.link,
  },
  inputArea: {
    paddingHorizontal: space.sm,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    gap: space.xxs,
    backgroundColor: color.bg.surface,
    borderTopWidth: layout.borderHairline,
    borderColor: color.border.default,
  },
  limitText: {
    ...typography.small,
    color: color.text.danger,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  input: {
    flex: 1,
    minHeight: touch.comfortable,
    maxHeight: touch.comfortable * 2,
    ...typography.body,
    color: color.text.primary,
    backgroundColor: color.bg.subtle,
    borderRadius: radius.xl,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderWidth: layout.borderHairline,
    borderColor: color.border.strong,
  },
  sendBtn: {
    width: touch.comfortable,
    height: touch.comfortable,
    borderRadius: radius.pill,
    backgroundColor: color.action.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: color.action.disabledBg,
  },
  sendBtnPressed: {
    backgroundColor: color.action.primaryPressed,
  },
});
