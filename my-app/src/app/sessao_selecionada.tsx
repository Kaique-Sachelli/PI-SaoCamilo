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

// Escala de cores da urina (1–8)
const ESCALA_CORES = [
  '#FFF9C4', '#FFF176', '#FFEE58', '#FFD740',
  '#FFB300', '#FF8F00', '#795548', '#4E342E',
];

const NIVEL_SELECIONADO = 2; // índice 0-based = Nível 2

const LABELS_ESCALA: Record<number, string> = {
  1: 'Bem hidratado',
  2: 'Bem hidratado',
  3: 'Hidratado',
  4: 'Hidratação moderada',
  5: 'Hidratação moderada',
  6: 'Atenção à hidratação',
  7: 'Hidratação insuficiente',
  8: 'Hidratação insuficiente',
};

export default function SessaoSelecionada() {
  const router = useRouter();

  const nivelNum = NIVEL_SELECIONADO; // 1–8
  const nivelIdx = nivelNum - 1;

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
          <Text style={styles.headerTitulo}>Detalhes do Treino</Text>
          <Text style={styles.headerSubtitulo}>22/04/2026, 10:02</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Cards topo: Tempo Total + Hidratação ── */}
          <View style={styles.topoRow}>
            <View style={styles.topoCard}>
              <View style={styles.topoCardHeader}>
                <Text style={styles.topoCardLabel}>Tempo Total</Text>
                <Text style={[styles.topoIcone, { color: '#e53935' }]}>🕐</Text>
              </View>
              <Text style={styles.topoValor}>67</Text>
              <Text style={styles.topoUnidade}>min</Text>
            </View>

            <View style={styles.topoCard}>
              <View style={styles.topoCardHeader}>
                <Text style={styles.topoCardLabel}>Hidratação</Text>
                <Text style={[styles.topoIcone, { color: '#1565c0' }]}>💧</Text>
              </View>
              <Text style={styles.topoValor}>1.6</Text>
              <Text style={styles.topoUnidade}>L</Text>
            </View>
          </View>

          {/* ── Card: Hidratação ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Hidratação</Text>

            <View style={styles.linhaRow}>
              <Text style={styles.linhaChave}>Taxa de Sudorese</Text>
              <Text style={styles.linhaValor}>1.6 L/h</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <Text style={styles.linhaChave}>Massa Pré-treino</Text>
              <Text style={styles.linhaValor}>78,8 Kg</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <Text style={styles.linhaChave}>Massa Pós-treino</Text>
              <Text style={styles.linhaValor}>78,8 Kg</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <Text style={styles.linhaChave}>Perda de massa</Text>
              <Text style={styles.linhaValor}>1,2%</Text>
            </View>
          </View>

          {/* ── Card: Escala de urina ── */}
          <View style={styles.card}>
            <Text style={styles.escalaRotulo}>Escala 1–8</Text>
            <View style={styles.nivelRow}>
              <View style={[styles.nivelBolinha, { backgroundColor: ESCALA_CORES[nivelIdx] }]} />
              <View>
                <Text style={styles.nivelTexto}>Nível {nivelNum}</Text>
                <Text style={styles.nivelLabel}>{LABELS_ESCALA[nivelNum]}</Text>
              </View>
            </View>

            {/* Barra de escala */}
            <View style={styles.escalaBarra}>
              {ESCALA_CORES.map((cor, i) => (
                <View
                  key={i}
                  style={[
                    styles.escalaSegmento,
                    { backgroundColor: cor },
                    i === 0 && styles.escalaSegmentoFirst,
                    i === ESCALA_CORES.length - 1 && styles.escalaSegmentoLast,
                    i === nivelIdx && styles.escalaSegmentoSel,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* ── Card: Condições do Treino ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Condições do Treino</Text>

            <View style={styles.linhaRow}>
              <View style={styles.linhaEsquerda}>
                <Text style={styles.condicaoIcone}>🌡</Text>
                <Text style={styles.linhaChave}>Temperatura</Text>
              </View>
              <Text style={styles.linhaValor}>28 C</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <View style={styles.linhaEsquerda}>
                <Text style={styles.condicaoIcone}>💦</Text>
                <Text style={styles.linhaChave}>Umidade</Text>
              </View>
              <Text style={styles.linhaValor}>70 %</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <View style={styles.linhaEsquerda}>
                <Text style={styles.condicaoIcone}>🏐</Text>
                <Text style={styles.linhaChave}>Esporte</Text>
              </View>
              <Text style={styles.linhaValor}>Vôlei</Text>
            </View>
            <View style={styles.divisor} />

            <View style={styles.linhaRow}>
              <View style={styles.linhaEsquerda}>
                <Text style={styles.condicaoIcone}>⚡</Text>
                <Text style={styles.linhaChave}>Intensidade</Text>
              </View>
              <Text style={styles.linhaValor}>Média</Text>
            </View>
          </View>

          {/* ── Botões de exportação ── */}
          <View style={styles.exportRow}>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportIcone}>⬇</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportIcone}>📄</Text>
            </TouchableOpacity>
          </View>
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
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerSubtitulo: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

  // Cards topo
  topoRow: { flexDirection: 'row', gap: 12 },
  topoCard: {
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
  topoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  topoCardLabel: { fontSize: 12, color: '#888', fontWeight: '500' },
  topoIcone: { fontSize: 16 },
  topoValor: { fontSize: 32, fontWeight: '700', color: '#111' },
  topoUnidade: { fontSize: 13, color: '#888', marginTop: 2 },

  // Card base
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },

  // Linhas de dados
  linhaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linhaEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linhaChave: { fontSize: 13, color: '#666' },
  linhaValor: { fontSize: 13, fontWeight: '600', color: '#222' },
  divisor: { height: 1, backgroundColor: '#f2f2f2' },

  // Escala urina
  escalaRotulo: { fontSize: 11, color: '#aaa', fontWeight: '600', letterSpacing: 0.5 },
  nivelRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nivelBolinha: { width: 44, height: 44, borderRadius: 22 },
  nivelTexto: { fontSize: 22, fontWeight: '700', color: '#222' },
  nivelLabel: { fontSize: 13, color: '#666', marginTop: 2 },
  escalaBarra: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 4,
  },
  escalaSegmento: { flex: 1, height: '100%' },
  escalaSegmentoFirst: { borderTopLeftRadius: 7, borderBottomLeftRadius: 7 },
  escalaSegmentoLast: { borderTopRightRadius: 7, borderBottomRightRadius: 7 },
  escalaSegmentoSel: {
    borderWidth: 2,
    borderColor: '#333',
  },

  // Condições
  condicaoIcone: { fontSize: 16 },

  // Exportar
  exportRow: { flexDirection: 'row', gap: 12 },
  exportBtn: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIcone: { fontSize: 22, color: '#fff' },

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
