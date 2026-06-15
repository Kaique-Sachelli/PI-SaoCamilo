import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NavbarAtleta } from './NavbarAtleta';

const REFEICOES = [
  {
    titulo: 'Café da manhã',
    horario: '07:00',
    itens: ['2 ovos mexidos', 'Pão integral (2 fatias)', '1 fruta', 'Café sem açúcar'],
  },
  {
    titulo: 'Lanche da manhã',
    horario: '10:00',
    itens: ['1 iogurte natural', '1 punhado de castanhas'],
  },
  {
    titulo: 'Almoço',
    horario: '12:30',
    itens: ['150g de frango grelhado', 'Arroz integral (4 col.)', 'Feijão (1 concha)', 'Salada verde à vontade'],
  },
  {
    titulo: 'Lanche da tarde',
    horario: '15:30',
    itens: ['1 banana com pasta de amendoim', '200ml de água de coco'],
  },
  {
    titulo: 'Jantar',
    horario: '19:00',
    itens: ['150g de peixe assado', 'Batata-doce (1 média)', 'Legumes refogados'],
  },
];

export default function DietaAtleta() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Plano Alimentar</Text>
        </View>

        {/* ── Conteúdo ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.secaoTitulo}>Refeições do dia</Text>

          {REFEICOES.map((r, i) => (
            <View key={i} style={styles.refeicaoCard}>
              <View style={styles.refeicaoTopo}>
                <Text style={styles.refeicaoTitulo}>{r.titulo}</Text>
                <View style={styles.horarioBadge}>
                  <Text style={styles.horarioTexto}>⏰ {r.horario}</Text>
                </View>
              </View>
              <View style={styles.divisor} />
              {r.itens.map((item, j) => (
                <View key={j} style={styles.itemRow}>
                  <View style={styles.itemDot} />
                  <Text style={styles.itemTexto}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <NavbarAtleta active="dieta" />

      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // Header
  header: {
    backgroundColor: RED,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    gap: 6,
  },

  headerTitulo: { color: '#fff', fontSize: 26, fontWeight: '700' },

  // Scroll
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },

  // Cards de refeição
  refeicaoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  refeicaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refeicaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },
  horarioBadge: {
    backgroundColor: '#fff3e0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  horarioTexto: { fontSize: 12, color: '#e65100', fontWeight: '600' },
  divisor: { height: 1, backgroundColor: '#f0f0f0' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: RED },
  itemTexto: { fontSize: 13, color: '#444' },
});
