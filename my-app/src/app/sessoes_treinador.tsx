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
import { useRouter } from 'expo-router';

const SESSOES = [
  {
    id: 'ultima',
    label: 'Última sessão',
    data: '22/04/2026, 10:02',
    duracao: '90 min',
    liquidos: '1.8L',
    perdaPeso: '1.5%',
  },
  {
    id: 'sessao4',
    label: 'Sessão 4',
    data: '05/04/2026, 12:56',
    duracao: '87 min',
    liquidos: '1.8L',
    perdaPeso: '1.5%',
  },
  {
    id: 'sessao3',
    label: 'Sessão 3',
    data: '22/03/2026, 18:02',
    duracao: '30 min',
    liquidos: '500ml',
    perdaPeso: '1.5%',
  },
  {
    id: 'sessao2',
    label: 'Sessão 2',
    data: '22/03/2026, 18:02',
    duracao: '30 min',
    liquidos: '500ml',
    perdaPeso: '1.5%',
  },
];

export default function SessoesTreinador() {
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
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.atletaNome}>Marcus Silva</Text>
          <Text style={styles.atletaEsporte}>Volante</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Cards de métricas ── */}
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

          {/* ── Lista de sessões ── */}
          {SESSOES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.sessaoCard}
              activeOpacity={0.75}
              onPress={() => router.push('/sessao_selecionada')}
            >
              {/* Cabeçalho da sessão */}
              <View style={styles.sessaoTopo}>
                <Text style={styles.sessaoLabel}>{s.label}</Text>
                <Text style={styles.sessaoSeta}>›</Text>
              </View>

              {/* Linhas de detalhe */}
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
                <Text style={[styles.detalheValor, styles.perdaVerde]}>{s.perdaPeso}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_treinador')}>
            <Image source={require('./assets/Img/homepage.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/batimento3.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/documento.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/perfil2.png')} style={styles.navImg} />
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  voltarBtn: { marginBottom: 8 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  atletaNome: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 30 },
  atletaEsporte: { color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: '400', marginTop: 2 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

  // Métricas
  metricasRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  metricaIcone: { fontSize: 20 },
  metricaValor: { fontSize: 22, fontWeight: '700', color: '#111' },
  metricaLabel: { fontSize: 10, color: '#888', textAlign: 'center' },

  // Sessão card
  sessaoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  sessaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessaoLabel: { fontSize: 16, fontWeight: '700', color: '#111' },
  sessaoSeta: { fontSize: 22, color: '#ccc' },
  divisor: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 2 },

  // Linhas de detalhe
  detalheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalheChave: { fontSize: 13, color: '#999' },
  detalheValor: { fontSize: 13, color: '#222', fontWeight: '500' },
  perdaVerde: { color: '#2e7d32', fontWeight: '600' },

  // Navbar
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navImg: { width: 26, height: 26, resizeMode: 'contain' },
});
