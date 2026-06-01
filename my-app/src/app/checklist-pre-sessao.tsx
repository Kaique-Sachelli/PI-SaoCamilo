import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


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

function Header({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={12}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Checklist Pré-Sessão</Text>
      {/* spacer to center the title */}
      <View style={styles.backBtn} />
    </View>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressSeg,
            i < current ? styles.progressActive : styles.progressInactive,
          ]}
        />
      ))}
    </View>
  );
}

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
          <Text style={styles.envIcon}>🌡</Text>
          <Text style={styles.envLabel}>TEMP.</Text>
          <Text style={styles.envValue}>{temp}°C</Text>
        </View>
        <View style={[styles.card, styles.envCard]}>
          <Text style={[styles.envIcon, { color: '#1976d2' }]}>💨</Text>
          <Text style={styles.envLabel}>UMIDADE</Text>
          <Text style={styles.envValue}>{humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

function BottomNav() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={[styles.navIcon, styles.navIconActive]}>⌂</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>∿</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>☰</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>◯</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ChecklistPreSessao() {
  const [weight, setWeight] = useState('72,5');
  const [selectedUrine, setSelectedUrine] = useState(2);
  const [temp] = useState('24');
  const [humidity] = useState('27');

  function handleStart() {

    console.log('Sessão iniciada!', { weight, selectedUrine });
  }

  return (
    <View style={styles.container}>
      <Header onBack={() => router.back()} />

      <View style={styles.redBg}>
        <ProgressBar current={1} total={3} />
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

        <TouchableOpacity style={styles.startBtn} activeOpacity={0.85} onPress={handleStart}>
          <Text style={styles.startBtnText}>Iniciar sessão  →</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}


const RED = '#e53935';
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },


  redBg: { backgroundColor: RED },
  headerWrap: {
    backgroundColor: RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: { width: 32 },
  backArrow: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '300' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  progressRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },
  progressActive: { backgroundColor: '#4caf50' },
  progressInactive: { backgroundColor: 'rgba(255,255,255,0.35)' },

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
    backgroundColor: '#43a047',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },


  bottomNav: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    flexDirection: 'row',
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 22, color: '#aaa' },
  navIconActive: { color: RED },
});
