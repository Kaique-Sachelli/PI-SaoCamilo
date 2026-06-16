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
import { router, useLocalSearchParams } from 'expo-router';

type CheckKey = 'bexiga' | 'balanca' | 'vestimenta';

const CHECKLIST_ITEMS: { key: CheckKey; label: string }[] = [
  { key: 'bexiga',     label: 'Bexiga esvaziada antes da pesagem' },
  { key: 'balanca',    label: 'Mesma balança e superfície nivelada' },
  { key: 'vestimenta', label: 'Vestimenta mínima e consistente' },
];

const URINE_LEVELS = [
  { id: 1, bg: '#FFF9C4', textColor: '#9e8c00', badge: 'Hidratação adequada',     badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 2, bg: '#FFF176', textColor: '#9e8c00', badge: 'Hidratação adequada',     badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 3, bg: '#FFEE58', textColor: '#7a6a00', badge: 'Hidratação adequada',     badgeBg: '#e8f5e9', badgeText: '#2e7d32' },
  { id: 4, bg: '#FFD740', textColor: '#7a5a00', badge: 'Hidratação moderada',     badgeBg: '#fff8e1', badgeText: '#f57f17' },
  { id: 5, bg: '#FFB300', textColor: '#5a3800', badge: 'Hidratação moderada',     badgeBg: '#fff8e1', badgeText: '#f57f17' },
  { id: 6, bg: '#FF8F00', textColor: '#4a2200', badge: 'Atenção à hidratação',    badgeBg: '#fff3e0', badgeText: '#e65100' },
  { id: 7, bg: '#795548', textColor: '#f5f0ee', badge: 'Hidratação insuficiente', badgeBg: '#ffebee', badgeText: '#b71c1c' },
  { id: 8, bg: '#4E342E', textColor: '#f5f0ee', badge: 'Hidratação insuficiente', badgeBg: '#ffebee', badgeText: '#b71c1c' },
];

export default function ChecklistPreSessao() {
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    bexiga: false, balanca: false, vestimenta: false,
  });
  const [weight, setWeight] = useState('');
  const [selectedUrine, setSelectedUrine] = useState(2);
  const params = useLocalSearchParams<{
    clima_temp?: string;
    clima_umidade?: string;
    clima_vento?: string;
    clima_sensacao?: string;
  }>();
  const temp = params.clima_temp ?? '24';
  const humidity = params.clima_umidade ?? '27';
  const vento = params.clima_vento ?? '0';
  const sensacao = params.clima_sensacao ?? '--';

  const todosChecked = Object.values(checks).every(Boolean);
  const podeContinuar = todosChecked && !!weight;

  function toggleCheck(key: CheckKey) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleStart() {
    if (!todosChecked) {
      alert('Confirme todos os itens do checklist antes de continuar');
      return;
    }
    if (!weight) {
      alert('Informe a massa corporal antes de iniciar');
      return;
    }
    router.push(
      `/cronometro?massa_pre=${weight}&clima_temp=${temp}&clima_umidade=${humidity}&urina_pre_cor=${selectedUrine}`
    );
  }

  const urineSel = URINE_LEVELS.find(l => l.id === selectedUrine)!;

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
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
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Confirmações obrigatórias</Text>
            <Text style={styles.sectionSub}>Confirme antes de realizar a pesagem</Text>
            {CHECKLIST_ITEMS.map(item => (
              <TouchableOpacity
                key={item.key}
                style={styles.checkItem}
                onPress={() => toggleCheck(item.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checks[item.key] && styles.checkboxMarcado]}>
                  {checks[item.key] && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkLabel, checks[item.key] && styles.checkLabelMarcado]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Massa Corporal Pré-Exercício</Text>
            <View style={styles.weightRow}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="0,0"
                placeholderTextColor="#bbb"
              />
              <Text style={styles.weightUnit}>Kg</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Escala de cor da Urina</Text>
            <View style={styles.urineGrid}>
              {URINE_LEVELS.map(l => (
                <TouchableOpacity
                  key={l.id}
                  activeOpacity={0.75}
                  onPress={() => setSelectedUrine(l.id)}
                  style={[
                    styles.urineCell,
                    { backgroundColor: l.bg },
                    selectedUrine === l.id && styles.urineCellSelected,
                  ]}
                >
                  <Text style={[styles.urineCellText, { color: l.textColor }]}>{l.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.badge, { backgroundColor: urineSel.badgeBg }]}>
              <Text style={[styles.badgeText, { color: urineSel.badgeText }]}>
                {'✓  ' + urineSel.badge}
              </Text>
            </View>
          </View>

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
            <View style={[styles.envRow, { marginTop: 8 }]}>
              <View style={[styles.card, styles.envCard]}>
                <Text style={styles.envLabel}>SENSAÇÃO</Text>
                <Text style={styles.envValue}>{sensacao !== '--' ? `${sensacao}°C` : '--'}</Text>
              </View>
              <View style={[styles.card, styles.envCard]}>
                <Text style={styles.envLabel}>VENTO</Text>
                <Text style={styles.envValue}>{vento} km/h</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startBtn, !podeContinuar && styles.startBtnDisabled]}
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

const RED = '#B3151F';
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },

  header: {
    backgroundColor: RED,
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 16,
  },
  voltarBtn: { marginBottom: 4 },
  voltarTexto: { color: '#ffffff', fontSize: 14, opacity: 0.85 },
  headerTitulo: { color: '#ffffff', fontSize: 24, fontWeight: '700' },

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
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },

  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMarcado: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 13, color: '#555' },
  checkLabelMarcado: { color: '#222', fontWeight: '500' },

  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    marginTop: 8,
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
    marginTop: 8,
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

  envRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  envCard: { flex: 1, padding: 12, borderWidth: 1.5, borderColor: '#e0e0e0' },
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
  startBtnDisabled: {
    backgroundColor: '#a8d5b5',
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
