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
import { useRouter } from 'expo-router';

type Aba = 'Sessões' | 'Dieta' | 'Exames';

// ─── Conteúdo da aba Exames ───────────────────────────────────────────────────
function AbaExames() {
  return (
    <ScrollView
      contentContainerStyle={styles.abaContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.secaoTitulo}>Exames Recentes</Text>

      {[
        { nome: 'Hemograma Completo',   data: '10/05/2026', status: 'Normal',   cor: '#2e7d32' },
        { nome: 'Glicemia em Jejum',    data: '10/05/2026', status: 'Normal',   cor: '#2e7d32' },
        { nome: 'Colesterol Total',     data: '22/04/2026', status: 'Atenção',  cor: '#e65100' },
        { nome: 'Ferritina',            data: '22/04/2026', status: 'Baixo',    cor: '#c62828' },
        { nome: 'Vitamina D',           data: '01/04/2026', status: 'Normal',   cor: '#2e7d32' },
      ].map((exame, i) => (
        <View key={i} style={styles.exameCard}>
          <View style={styles.exameInfo}>
            <Text style={styles.exameNome}>{exame.nome}</Text>
            <Text style={styles.exameData}>📅 {exame.data}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: exame.cor + '18', borderColor: exame.cor }]}>
            <Text style={[styles.statusText, { color: exame.cor }]}>{exame.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Conteúdo da aba Sessões ─────────────────────────────────────────────────
function AbaSessoes() {
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <View style={styles.metricaHeader}>
            <Text style={styles.metricaIcone}>📈</Text>
            <Text style={styles.metricaRotulo}>Taxa média</Text>
          </View>
          <Text style={styles.metricaValor}>1.09</Text>
          <Text style={styles.metricaUnidade}>L/h</Text>
        </View>
        <View style={styles.metricaCard}>
          <View style={styles.metricaHeader}>
            <Text style={styles.metricaIcone}>📅</Text>
            <Text style={styles.metricaRotulo}>Perda média</Text>
          </View>
          <Text style={styles.metricaValor}>1.7%</Text>
          <Text style={styles.metricaUnidade}>Peso corporal</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Conteúdo da aba Dieta ───────────────────────────────────────────────────
function AbaDieta() {
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Plano Alimentar</Text>
      {['Café da manhã', 'Almoço', 'Lanche', 'Jantar'].map((refeicao, i) => (
        <View key={i} style={styles.exameCard}>
          <Text style={styles.exameNome}>{refeicao}</Text>
          <Text style={styles.exameData}>Plano não configurado</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Tela principal ──────────────────────────────────────────────────────────
export default function ExamesMedico() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<Aba>('Exames');

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
          <Text style={styles.nomeAtleta}>Atleta (Kacique)</Text>

          {/* Tabs — mesmo padrão de TelaAtleta */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'Sessões' && styles.tabAtiva]}
              onPress={() => setAbaAtiva('Sessões')}
            >
              <Text style={[styles.tabTexto, abaAtiva === 'Sessões' && styles.tabTextoAtivo]}>
                Sessões
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'Dieta' && styles.tabAtiva]}
              onPress={() => router.push('/dieta')}
            >
              <Text style={[styles.tabTexto, abaAtiva === 'Dieta' && styles.tabTextoAtivo]}>
                Dieta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'Exames' && styles.tabAtiva]}
              onPress={() => setAbaAtiva('Exames')}
            >
              <Text style={[styles.tabTexto, abaAtiva === 'Exames' && styles.tabTextoAtivo]}>
                Exames
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Conteúdo da aba ── */}
        <View style={styles.content}>
          {abaAtiva === 'Sessões' && <AbaSessoes />}
          {abaAtiva === 'Dieta'   && <AbaDieta />}
          {abaAtiva === 'Exames'  && <AbaExames />}
        </View>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_adm')}>
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

  // Header — idêntico ao TelaAtleta
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
  nomeAtleta: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 18 },

  // Tabs — mesmo padrão de TelaAtleta
  tabsContainer: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  tabAtiva: { backgroundColor: '#D9D9D9' },
  tabTexto: { fontSize: 14, color: '#B0B0B0', fontWeight: '500' },
  tabTextoAtivo: { color: RED, fontWeight: '700' },

  // Conteúdo
  content: { flex: 1 },
  abaContent: { padding: 16, gap: 10, paddingBottom: 24 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },

  // Métricas (aba Sessões)
  metricasRow: { flexDirection: 'row', gap: 12 },
  metricaCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  metricaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  metricaIcone: { fontSize: 14 },
  metricaRotulo: { fontSize: 11, color: '#666', fontWeight: '600' },
  metricaValor: { fontSize: 28, fontWeight: '700', color: '#111' },
  metricaUnidade: { fontSize: 12, color: '#888', marginTop: 2 },

  // Exames
  exameCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  exameInfo: { flex: 1, gap: 3 },
  exameNome: { fontSize: 14, fontWeight: '600', color: '#111' },
  exameData: { fontSize: 12, color: '#888' },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  statusText: { fontSize: 12, fontWeight: '700' },

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
