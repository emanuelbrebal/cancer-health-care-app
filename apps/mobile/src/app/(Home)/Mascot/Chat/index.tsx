import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/src/components/ui/Images/Avatar';
import { Colors } from '@/src/constants/Colors';
import api from '@/src/services/api';
import mascotService, { MascotContext } from '@/src/services/mascotService';
import { globalStyles } from '@/src/styles/global';
import { toastService } from '@/src/services/toastService';
import { useAuthStore } from '@/src/store/useAuthStore';

const DAILY_LIMIT = Infinity; // standby durante testes
const CHAT_LIMIT_KEY = 'oncomente:chat-daily-limit';
const CHAT_HISTORY_KEY = 'oncomente:chat-history';
const MAX_HISTORY = 20;

const WELCOME_MESSAGE = {
  id: '1',
  text: 'Olá! Sou o mascote virtual do OncoMente 💜 Estou aqui para tirar dúvidas sobre oncologia e saúde mental e fazer seu dia mais leve. Como posso ajudar?',
  sender: 'bot' as const,
};

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
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
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState<IMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [userContext, setUserContext] = useState<MascotContext | null>(null);
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

  const remaining = DAILY_LIMIT - messagesUsed;
  const limitReached = remaining <= 0;

  const handleClearHistory = async () => {
    await AsyncStorage.multiRemove([CHAT_HISTORY_KEY, CHAT_LIMIT_KEY]);
    setMessages([WELCOME_MESSAGE]);
    setMessagesUsed(0);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading || limitReached) return;

    const userMessageText = inputText.trim();

    const userMessage: IMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.post(
        '/ai-support/ask',
        {
          userQuestion: userMessageText,
          userId: user?.id ?? '',
          treatmentData: userContext?.treatments ?? [],
          calendarData: userContext?.emotionSummary ?? [],
        },
        { timeout: 30000 }
      );

      const botText = response.data?.response ?? 'Sinto muito, recebi uma resposta vazia. Pode repetir? 💜';

      const botResponse: IMessage = {
        id: (Date.now() + 1).toString(),
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
      } else {
        toastService.error('Serviço indisponível. Tente novamente.');
      }
      const errorMsg: IMessage = {
        id: Date.now().toString(),
        text: 'Sinto muito, tive um probleminha técnico. Pode tentar me perguntar de novo? 💜',
        sender: 'bot',
      };
      setMessages(prev => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.scrollContainer} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={handleClearHistory}
              style={{
                alignSelf: 'flex-end',
                marginRight: 12,
                marginTop: 8,
                marginBottom: 4,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#DDD',
                backgroundColor: '#F9F9F9',
              }}
            >
              <Text style={{ fontFamily: 'Montserrat', fontSize: 11, color: '#888' }}>
                Limpar conversa
              </Text>
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={messages}
              inverted
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingVertical: 20 }}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'row',
                  alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  marginHorizontal: 15,
                  marginVertical: 5
                }}>
                  {item.sender === 'bot' && (
                    <Avatar
                      style={{ width: 35, height: 35, marginRight: 8 }}
                      imagePath={require('@assets/images/Home/blueMascotPlaceholder.png')}
                    />
                  )}
                  <View style={{
                    backgroundColor: item.sender === 'user' ? Colors.purplePrimary : '#F0F0F0',
                    padding: 12,
                    borderRadius: 15,
                    borderBottomLeftRadius: item.sender === 'bot' ? 0 : 15,
                    borderBottomRightRadius: item.sender === 'user' ? 0 : 15,
                    maxWidth: '75%'
                  }}>
                    <Text style={{
                      color: item.sender === 'user' ? '#FFF' : '#333',
                      fontSize: 16,
                      lineHeight: 22
                    }}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              )}
            />

            {loading && (
              <View style={{ marginLeft: 60, marginBottom: 10 }}>
                <ActivityIndicator size="small" color={Colors.purplePrimary} />
              </View>
            )}
          </View>

          {/* Área de Input */}
          <View style={{
            paddingHorizontal: 15,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 25 : 12,
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderColor: '#EEE',
          }}>
            {/* Contador discreto — só aparece quando relevante */}
            {!limitReached && remaining <= 2 && (
              <Text style={{
                fontFamily: 'Montserrat',
                fontSize: 10,
                color: '#92400E',
                textAlign: 'right',
                marginBottom: 4,
                paddingRight: 4,
              }}>
                {remaining === 1 ? '1 mensagem restante hoje' : `${remaining} mensagens restantes hoje`}
              </Text>
            )}
            {limitReached && (
              <Text style={{
                fontFamily: 'Montserrat',
                fontSize: 10,
                color: '#DC2626',
                textAlign: 'center',
                marginBottom: 4,
              }}>
                Limite diário atingido — volte amanhã 💜
              </Text>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{
                  flex: 1,
                  minHeight: 45,
                  maxHeight: 100,
                  backgroundColor: '#F9F9F9',
                  color: limitReached ? '#AAA' : Colors.black,
                  borderRadius: 25,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: limitReached ? '#EEE' : '#DDD',
                  textAlignVertical: 'center',
                }}
                multiline
                value={inputText}
                onChangeText={setInputText}
                editable={!loading && !limitReached}
                placeholder={limitReached ? 'Limite diário atingido 💜' : 'Escreva sua mensagem...'}
                placeholderTextColor="#AAA"
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={loading || !inputText.trim() || limitReached}
                style={{
                  marginLeft: 10,
                  backgroundColor: (loading || !inputText.trim() || limitReached) ? '#CCC' : Colors.purplePrimary,
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}> {'>'} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
