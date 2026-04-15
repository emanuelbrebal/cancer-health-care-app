import React, { useState, useRef } from 'react';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/src/components/ui/Images/Avatar';
import { Colors } from '@/src/constants/Colors';
import api from '@/src/services/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import { globalStyles } from '@/src/styles/global';

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function MascotChat() {
  const [messages, setMessages] = useState<IMessage[]>([
    { id: '1', text: 'Olá! Sou o mascote virtual Oncomente. Meu papel é tirar tuas dúvidas sobre oncologia e saúde mental além, claro, de fazer teu dia melhor! Como posso ajudar? 💜', sender: 'bot' },
  ]);

  const { user, isAuthenticated } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async () => {

    if (!inputText.trim() || loading) {
      console.log("Bloqueado: campo vazio ou carregando");
      return;
    }

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
      const response = await api.post('/ai-support/ask',
        {
          userQuestion: userMessageText,
          userId: "usuario-teste-001",
          calendarData: {},
          treatmentData: {},
        },
        {
          timeout: 30000
        }
      );

      const botText = response.data?.response ||
        (typeof response.data === 'string' ? response.data : null) ||
        "Sinto muito, recebi uma resposta vazia. Pode repetir? 💜";

      const botResponse: IMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
      };

      setMessages(prev => [botResponse, ...prev]);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);

    } catch (error) {
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

          {/* Indicador de Digitação */}
          {loading && (
            <View style={{ marginLeft: 60, marginBottom: 10 }}>
              <ActivityIndicator size="small" color={Colors.purplePrimary} />
            </View>
          )}

          {/* Área de Input */}
          <View style={{
            padding: 15,
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderColor: '#EEE',
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: Platform.OS === 'ios' ? 25 : 15
          }}>
            <TextInput
              style={{
                flex: 1,
                minHeight: 45,
                maxHeight: 100,
                backgroundColor: '#F9F9F9',
                color: Colors.black,
                borderRadius: 25,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: '#DDD',
                textAlignVertical: 'center'
              }}

              multiline
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={loading || !inputText.trim()}
              style={{
                marginLeft: 10,
                backgroundColor: (loading || !inputText.trim()) ? '#CCC' : Colors.purplePrimary,
                width: 45,
                height: 45,
                borderRadius: 22.5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}> {'>'} </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}