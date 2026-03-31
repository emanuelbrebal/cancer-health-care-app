import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarioInterativo() {
  const totalDias = 30;
  const diasCumpridos = 12;
  const progresso = (diasCumpridos / totalDias) * 100;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[globalStyles.titleContainer, { paddingHorizontal: 20 }]}>
            <Text style={[globalStyles.textPrimary, { fontSize: 24, fontWeight: 'bold' }]}>Meu Calendário</Text>
            
            <View style={{ 
              backgroundColor: '#FCE4EC', 
              padding: 12, 
              borderRadius: 12, 
              marginTop: 15, 
              flexDirection: 'row', 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#F8BBD0'
            }}>
              <Text style={{ fontSize: 24 }}>🎀</Text>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#C2185B', fontSize: 16 }}>Março Lilás</Text>
                <Text style={{ color: '#D81B60', fontSize: 14 }}>Conscientização do Câncer de Colo do Útero</Text>
              </View>
            </View>
          </View>

          <View style={{ 
            margin: 10, 
            borderRadius: 10, 
            backgroundColor: '#FFF',
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
              android: { elevation: 5 }
            }),
            overflow: 'hidden'
          }}>
            <Calendar 
              theme={{
                calendarBackground: '#FFF',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: Colors.purplePrimary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: Colors.purplePrimary,
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: Colors.purplePrimary,
                arrowColor: Colors.purplePrimary,
                monthTextColor: Colors.purplePrimary,
                indicatorColor: 'blue',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13
              }}
              markedDates={{
                '2026-03-21': { marked: true, dotColor: '#FF5252' },
                '2026-03-10': { selected: true, disableTouchEvent: true },
              }}
            />
          </View>

          <View style={{ paddingHorizontal: 25 }}>
            <Text style={[globalStyles.title, { marginBottom: 15 }]}>Progresso do Tratamento</Text>
            
            <View style={{ 
              height: 24, 
              backgroundColor: '#F0F0F0', 
              borderRadius: 12, 
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#E0E0E0'
            }}>
              <View style={{ 
                width: `${progresso}%`, 
                height: '100%', 
                backgroundColor: Colors.purplePrimary,
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingRight: 10
              }}>
                 <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{Math.round(progresso)}%</Text>
              </View>
            </View>

            <View style={[globalStyles.betweenContainer, { marginTop: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.purplePrimary, marginRight: 5 }} />
                <Text style={{ color: '#666', fontSize: 13 }}>{diasCumpridos} concluídos</Text>
              </View>
              <Text style={{ color: '#999', fontSize: 13 }}>{totalDias - diasCumpridos} dias restantes</Text>
            </View>
            
            <View style={{ 
              marginTop: 25, 
              padding: 18, 
              backgroundColor: '#F3E5F5', 
              borderRadius: 15,
              borderLeftWidth: 5,
              borderLeftColor: Colors.purplePrimary
            }}>
              <Text style={{ fontStyle: 'italic', color: Colors.purplePrimary, lineHeight: 20 }}>
                "Você está indo muito bem! O mascote notou que você já completou {Math.round(progresso)}% desta etapa. Continue firme!"
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}