import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';


type UrineLevel = {
  id: number;
  bg: string;
  textColor: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
};

const URINE_LEVELS: UrineLevel[] = [
  { id: 1, bg: '#FFF9C4', textColor: '#9e8c00', badge: 'Hidratação adequada',    badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 2, bg: '#FFF176', textColor: '#9e8c00', badge: 'Hidratação adequada',    badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 3, bg: '#FFEE58', textColor: '#7a6a00', badge: 'Hidratação adequada',    badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 4, bg: '#FFD740', textColor: '#7a5a00', badge: 'Hidratação moderada',    badgeBg: '#fff8e1', badgeText: '#f57f17' },
  { id: 5, bg: '#FFB300', textColor: '#5a3800', badge: 'Hidratação moderada',    badgeBg: '#fff8e1', badgeText: '#f57f17' },
  { id: 6, bg: '#FF8F00', textColor: '#4a2200', badge: 'Atenção à hidratação',   badgeBg: '#fff3e0', badgeText: '#e65100' },
  { id: 7, bg: '#795548', textColor: '#f5f0ee', badge: 'Hidratação insuficiente', badgeBg: '#ffebee', badgeText: '#b71c1c' },
  { id: 8, bg: '#4E342E', textColor: '#f5f0ee', badge: 'Hidratação insuficiente', badgeBg: '#ffebee', badgeText: '#b71c1c' },
];


function WeightInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Massa Corporal Pré-Exercício</Text>
      <View style={styles.weightRow}>
        <TextInput
          style={styles.weightInput}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholderTextColor="#bbb"
        />
        <Text style={styles.weightUnit}>Kg</Text>
      </View>
    </View>
  );
}

function UrineScale({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  const level = URINE_LEVELS.find((l) => l.id === selected)!;
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Escala de cor da Urina</Text>
      <View style={styles.urineGrid}>
        {URINE_LEVELS.map((l) => (
          <TouchableOpacity
            key={l.id}
            activeOpacity={0.75}
            onPress={() => onSelect(l.id)}
            style={[
              styles.urineCell,
              { backgroundColor: l.bg },
              selected === l.id && styles.urineCellSelected,
            ]}
          >
            <Text style={[styles.urineCellText, { color: l.textColor }]}>
              {l.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.badge, { backgroundColor: level.badgeBg }]}>
        <Text style={[styles.badgeText, { color: level.badgeText }]}>
          {'✓  ' + level.badge}
        </Text>
      </View>
    </View>
  );
}

function EnvConditions({
  temp,
  humidity,
}: {
  temp: string;
  humidity: string;
}) {
  return (
    <View>
      <Text style={styles.sectionLabel}>Condições ambientais</Text>
      <View style={styles.envRow}>
        <View style={[styles.card, styles.envCard]}>
          <Text style={styles.envLabel}>TEMP.</Text>
          <Text style={styles.envValue}>{temp}°C</Text>
        </View>
        <View style={[styles.card, styles.envCard]}>
          <Text style={styles.envLabel}>UMIDADE</Text>
          <Text style={styles.envValue}>{humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function ChecklistPreSessao() {
  const [weight, setWeight] = useState('');
  const [selectedUrine, setSelectedUrine] = useState(2);
  const [temp] = useState('24');
  const [humidity] = useState('27');

  function handleStart() {
    if (!weight) {
      alert('Informe a massa corporal antes de iniciar');
      return;
    }
    router.push(`/cronometro?massa_pre=${weight}&clima_temp=${temp}&clima_umidade=${humidity}`);
  }

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/homepage_atleta')} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Checklist Pré-Sessão</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <WeightInput value={weight} onChange={setWeight} />

        <UrineScale selected={selectedUrine} onSelect={setSelectedUrine} />

        <EnvConditions temp={temp} humidity={humidity} />

        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={handleStart}
        >
          <Text style={styles.startBtnText}>Iniciar sessão  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}


const RED = '#e53935';
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  header: {
    backgroundColor: '#B3151F',
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 16,
  },
  voltarBtn: {
    marginBottom: 4,
  },
  voltarTexto: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.85,
  },
  headerTitulo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },

  // Weight
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
  },
  weightInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  weightUnit: { fontSize: 16, fontWeight: '700', color: '#555' },


  urineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  urineCell: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  urineCellSelected: { borderColor: RED },
  urineCellText: { fontSize: 15, fontWeight: '700' },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },


  envRow: { flexDirection: 'row', gap: 10 },
  envCard: { flex: 1, padding: 12, borderWidth: 1.5, borderColor: '#e0e0e0' },
  envIcon: { fontSize: 16, color: RED, marginBottom: 2 },
  envLabel: { fontSize: 10, fontWeight: '700', color: '#888', letterSpacing: 0.8, marginBottom: 4 },
  envValue: { fontSize: 22, fontWeight: '700', color: '#222' },


  startBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
