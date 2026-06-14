import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Aba = 'Sessões' | 'Dieta' | 'Exames';

// ─── Aba Sessões ──────────────────────────────────────────────────────────────
function AbaSessoes() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      {/* Métricas */}
      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#e53935' }]}>⚡</Text>
          <Text style={styles.metricaValor}>5</Text>
          <Text style={styles.metricaLabel}>Sessões/Semana</Text>
        </View>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#1565c0' }]}>💧</Text>
          <Text style={styles.metricaValor}>2.4</Text>
          <Text style={styles.metricaLabel}>L médio</Text>
        </View>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#333' }]}>📊</Text>
          <Text style={styles.metricaValor}>1.8%</Text>
          <Text style={styles.metricaLabel}>Perda média</Text>
        </View>
      </View>

      {/* Sessões */}
      {[
        { label: 'Última sessão', data: '22/04/2026, 10:02', duracao: '90 min', liquidos: '1.8L', perda: '1.5%' },
        { label: 'Sessão 4',      data: '05/04/2026, 12:56', duracao: '87 min', liquidos: '1.8L', perda: '1.5%' },
        { label: 'Sessão 3',      data: '22/03/2026, 18:02', duracao: '30 min', liquidos: '500ml', perda: '1.5%' },
      ].map((s, i) => (
        <TouchableOpacity
          key={i}
          style={styles.sessaoCard}
          activeOpacity={0.75}
          onPress={() => router.push('/sessao_selecionada')}
        >
          <View style={styles.sessaoTopo}>
            <Text style={styles.sessaoLabel}>{s.label}</Text>
            <Text style={styles.sessaoSeta}>›</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Data</Text>
            <Text style={styles.detalheValor}>{s.data}</Text>
          </View>
          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Duração</Text>
            <Text style={styles.detalheValor}>{s.duracao}</Text>
          </View>
          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Ingestão de líquidos</Text>
            <Text style={styles.detalheValor}>{s.liquidos}</Text>
          </View>
          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Perda de peso</Text>
            <Text style={[styles.detalheValor, { color: '#2e7d32', fontWeight: '600' }]}>{s.perda}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Aba Dieta ────────────────────────────────────────────────────────────────
function AbaDieta() {
  const REFEICOES = [
    { titulo: 'Café da manhã',   horario: '07:00', itens: ['2 ovos mexidos', 'Pão integral (2 fatias)', '1 fruta', 'Café sem açúcar'] },
    { titulo: 'Lanche da manhã', horario: '10:00', itens: ['1 iogurte natural', '1 punhado de castanhas'] },
    { titulo: 'Almoço',          horario: '12:30', itens: ['150g de frango grelhado', 'Arroz integral (4 col.)', 'Feijão (1 concha)', 'Salada verde à vontade'] },
    { titulo: 'Lanche da tarde', horario: '15:30', itens: ['1 banana com pasta de amendoim', '200ml de água de coco'] },
    { titulo: 'Jantar',          horario: '19:00', itens: ['150g de peixe assado', 'Batata-doce (1 média)', 'Legumes refogados'] },
  ];
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Plano Alimentar</Text>
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
  );
}

// ─── Aba Exames ───────────────────────────────────────────────────────────────
function AbaExames() {
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Exames Recentes</Text>
      {[
        { nome: 'Hemograma Completo', data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
        { nome: 'Glicemia em Jejum',  data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
        { nome: 'Colesterol Total',   data: '22/04/2026', status: 'Atenção', cor: '#e65100' },
        { nome: 'Ferritina',          data: '22/04/2026', status: 'Baixo',   cor: '#c62828' },
        { nome: 'Vitamina D',         data: '01/04/2026', status: 'Normal',  cor: '#2e7d32' },
      ].map((e, i) => (
        <View key={i} style={styles.exameCard}>
          <View style={styles.exameInfo}>
            <Text style={styles.exameNome}>{e.nome}</Text>
            <Text style={styles.exameData}>📅 {e.data}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: e.cor + '18', borderColor: e.cor }]}>
            <Text style={[styles.statusText, { color: e.cor }]}>{e.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SessoesMedico() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const tabInicial = (params.tab as Aba) || 'Sessões';
  const [abaAtiva, setAbaAtiva] = useState<Aba>(tabInicial);

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Header com tabs ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <View style={styles.headerNomeRow}>
            <Text style={styles.nomeAtleta}>Atleta (Kacique)</Text>
            <TouchableOpacity 
            onPress={() => router.push('/perfil_atleta')} 
            activeOpacity={0.8}>
              <Image
                source={require('./assets/Img/marcus.jpg')}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsContainer}>
            {(['Sessões', 'Dieta', 'Exames'] as Aba[]).map((aba) => (
              <TouchableOpacity
                key={aba}
                style={[styles.tab, abaAtiva === aba && styles.tabAtiva]}
                onPress={() => setAbaAtiva(aba)}
              >
                <Text style={[styles.tabTexto, abaAtiva === aba && styles.tabTextoAtivo]}>
                  {aba}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Conteúdo central — troca sem navegar ── */}
        <View style={styles.content}>
          {abaAtiva === 'Sessões' && <AbaSessoes />}
          {abaAtiva === 'Dieta'   && <AbaDieta />}
          {abaAtiva === 'Exames'  && <AbaExames />}
        </View>
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
  },
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerNomeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  nomeAtleta: { color: '#fff', fontSize: 26, fontWeight: '700' },
  avatarImg: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: '#fff' },

  // Tabs
  tabsContainer: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tab: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 25 },
  tabAtiva: { backgroundColor: '#D9D9D9' },
  tabTexto: { fontSize: 14, color: '#B0B0B0', fontWeight: '500' },
  tabTextoAtivo: { color: RED, fontWeight: '700', fontSize: 14 },

  // Content
  content: { flex: 1 },
  abaContent: { padding: 16, gap: 12, paddingBottom: 24 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },

  // Sessões
  metricasRow: { flexDirection: 'row', gap: 10 },
  metricaCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 12, alignItems: 'center', gap: 4,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' } }),
  },
  metricaIcone: { fontSize: 20 },
  metricaValor: { fontSize: 22, fontWeight: '700', color: '#111' },
  metricaLabel: { fontSize: 10, color: '#888', textAlign: 'center' },
  sessaoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 8,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  sessaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessaoLabel: { fontSize: 16, fontWeight: '700', color: RED },
  sessaoSeta: { fontSize: 22, color: '#ccc' },
  divisor: { height: 1, backgroundColor: '#f0f0f0' },
  detalheRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detalheChave: { fontSize: 13, color: '#999' },
  detalheValor: { fontSize: 13, color: '#222', fontWeight: '500' },

  // Dieta
  refeicaoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 8,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  refeicaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refeicaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },
  horarioBadge: { backgroundColor: '#fff3e0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  horarioTexto: { fontSize: 12, color: '#e65100', fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: RED },
  itemTexto: { fontSize: 13, color: '#444' },

  // Exames
  exameCard: {
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  exameInfo: { flex: 1, gap: 3 },
  exameNome: { fontSize: 14, fontWeight: '600', color: '#111' },
  exameData: { fontSize: 12, color: '#888' },
  statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
