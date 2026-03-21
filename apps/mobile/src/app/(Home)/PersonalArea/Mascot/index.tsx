import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/src/components/ui/Images/Avatar';
import { Colors } from '@/src/constants/Colors';

export default function MascoteChat() {
  const [messages] = useState([
    { id: '2', text: 'Quais são os meus remédios de hoje?', sender: 'user' },
    { id: '1', text: 'Olá! Sou o seu parceiro. Como posso ajudar?', sender: 'bot' },
  ]);

  return (
    <SafeAreaProvider>
      
      <SafeAreaView style={{ flex: 1  }} edges={['top', 'left', 'right']}>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          
          <FlatList
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
                  <Text style={{ color: item.sender === 'user' ? '#FFF' : '#333', fontSize: 16 }}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
          />

          <View style={{ 
            padding: 15, 
            backgroundColor: '#FFF', 
            borderTopWidth: 1, 
            borderColor: '#EEE', 
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: Platform.OS === 'ios' ? 10 : 15
          }}>
            <TextInput 
              style={{ 
                flex: 1, 
                minHeight: 45, 
                backgroundColor: '#F9F9F9', 
                borderRadius: 25, 
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: '#DDD' 
              }} 
              placeholder="Pergunte algo ao mascote..."
              multiline
            />
            <TouchableOpacity 
              style={{ 
                marginLeft: 10, 
                backgroundColor: Colors.purplePrimary, 
                width: 45, 
                height: 45, 
                borderRadius: 22.5, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
               <Text style={{ color: '#FFF', fontWeight: 'bold' }}> {'>'} </Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}