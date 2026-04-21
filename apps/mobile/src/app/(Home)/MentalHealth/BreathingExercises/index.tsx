import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TECHNIQUES = [
  {
    id: '478',
    label: '4-7-8',
    description: 'Técnica de relaxamento profundo',
    phases: [
      { name: 'Inspire', duration: 4, color: '#9B5DE0' },
      { name: 'Segure', duration: 7, color: '#4E56C0' },
      { name: 'Expire', duration: 8, color: '#1AD5AD' },
    ],
  },
  {
    id: 'box',
    label: 'Respiração Quadrada',
    description: 'Equilíbrio e foco mental',
    phases: [
      { name: 'Inspire', duration: 4, color: '#9B5DE0' },
      { name: 'Segure', duration: 4, color: '#4E56C0' },
      { name: 'Expire', duration: 4, color: '#1AD5AD' },
      { name: 'Segure', duration: 4, color: '#E040FB' },
    ],
  },
  {
    id: 'calm',
    label: 'Calma Rápida',
    description: 'Para momentos de ansiedade',
    phases: [
      { name: 'Inspire', duration: 4, color: '#9B5DE0' },
      { name: 'Expire', duration: 6, color: '#1AD5AD' },
    ],
  },
];

const MIN_SCALE = 0.6;
const MAX_SCALE = 1.0;

export default function BreathingExercises() {
  const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(selectedTech.phases[0].duration);

  const scaleAnim = useRef(new Animated.Value(MIN_SCALE)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentPhase = selectedTech.phases[phaseIdx % selectedTech.phases.length];

  const animatePhase = (phase: typeof currentPhase) => {
    animRef.current?.stop();
    const toValue = phase.name === 'Expire' ? MIN_SCALE : MAX_SCALE;
    const fromValue = phase.name === 'Expire' ? MAX_SCALE : MIN_SCALE;
    scaleAnim.setValue(fromValue);
    animRef.current = Animated.timing(scaleAnim, {
      toValue,
      duration: phase.duration * 1000,
      useNativeDriver: true,
    });
    animRef.current.start();
  };

  useEffect(() => {
    if (!isRunning) {
      animRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      scaleAnim.setValue(MIN_SCALE);
      return;
    }

    animatePhase(currentPhase);
    setCountdown(currentPhase.duration);

    let remaining = currentPhase.duration;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setPhaseIdx((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phaseIdx, selectedTech]);

  const handleStart = () => {
    setPhaseIdx(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setPhaseIdx(0);
    setCountdown(selectedTech.phases[0].duration);
  };

  const handleSelectTech = (tech: typeof TECHNIQUES[0]) => {
    handleStop();
    setSelectedTech(tech);
    setCountdown(tech.phases[0].duration);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.screenTitle}>Exercícios de Respiração</Text>
        <Text style={styles.screenSubtitle}>
          A respiração consciente reduz a ansiedade e traz equilíbrio emocional.
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Orientação</Text>
          <Text style={styles.tipText}>
            Encontre um lugar tranquilo, sente-se confortavelmente e feche os olhos. Siga o ritmo do círculo e respire com calma.
          </Text>
        </View>

        <View style={styles.techRow}>
          {TECHNIQUES.map((tech) => (
            <TouchableOpacity
              key={tech.id}
              style={[styles.techChip, selectedTech.id === tech.id && styles.techChipActive]}
              onPress={() => handleSelectTech(tech)}
            >
              <Text style={[styles.techChipText, selectedTech.id === tech.id && styles.techChipTextActive]}>
                {tech.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.techDescription}>{selectedTech.description}</Text>

        <View style={styles.phasesRow}>
          {selectedTech.phases.map((phase, idx) => (
            <View key={idx} style={[styles.phaseTag, isRunning && phaseIdx % selectedTech.phases.length === idx && styles.phaseTagActive]}>
              <Text style={styles.phaseTagLabel}>{phase.name}</Text>
              <Text style={styles.phaseTagDuration}>{phase.duration}s</Text>
            </View>
          ))}
        </View>

        <View style={styles.circleWrapper}>
          <Animated.View style={[styles.circleOuter, { transform: [{ scale: scaleAnim }], borderColor: currentPhase.color }]}>
            <View style={[styles.circleInner, { backgroundColor: currentPhase.color + '22' }]}>
              <Text style={[styles.phaseLabel, { color: currentPhase.color }]}>
                {isRunning ? currentPhase.name : 'Pronto'}
              </Text>
              <Text style={[styles.countdown, { color: currentPhase.color }]}>
                {isRunning ? countdown : '–'}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.btnRow}>
          {!isRunning ? (
            <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.purplePrimary }]} onPress={handleStart}>
              <Text style={styles.btnText}>Iniciar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#666' }]} onPress={handleStop}>
              <Text style={styles.btnText}>Parar</Text>
            </TouchableOpacity>
          )}
        </View>



      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 24,
    paddingBottom: 48,
    gap: 18,
  },
  screenTitle: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.purplePrimary,
  },
  screenSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  techChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.purplePrimary,
    backgroundColor: '#FFF',
  },
  techChipActive: {
    backgroundColor: Colors.purplePrimary,
  },
  techChipText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purplePrimary,
  },
  techChipTextActive: {
    color: '#FFF',
  },
  techDescription: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#888',
    marginTop: -8,
  },
  phasesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  phaseTag: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    gap: 2,
  },
  phaseTagActive: {
    borderColor: Colors.purplePrimary,
    backgroundColor: '#F3E5F5',
  },
  phaseTagLabel: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  phaseTagDuration: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.purplePrimary,
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginVertical: 8,
  },
  circleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  phaseLabel: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
  },
  countdown: {
    fontFamily: 'Montserrat',
    fontSize: 40,
    fontWeight: '800',
  },
  btnRow: {
    alignItems: 'center',
  },
  btn: {
    width: '60%',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.purplePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purplePrimary,
    gap: 6,
  },
  tipTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purplePrimary,
  },
  tipText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
