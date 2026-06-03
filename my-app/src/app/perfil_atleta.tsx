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

export default function PerfilAtleta() {
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
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
              <Text style={styles.voltarIcone}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.nomeAtleta}>Kacique da Silva</Text>

            <View style={styles.chatWrap}>
              <Text style={styles.chatIcone}>💬</Text>
              <View style={styles.chatDot} />
            </View>
          </View>

          <Text style={styles.posicao}>Vôlei  •  Arremessador</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Card Foto + Perfil Atlético ── */}
          <View style={styles.perfilCard}>
            {/* Foto */}
            <View style={styles.fotoWrap}>
              <Image
                source={require('./assets/Img/marcus.jpg')}
                style={styles.fotoAtleta}
                resizeMode="cover"
              />
            </View>

            {/* Dados Perfil */}
            <View style={styles.dadosWrap}>
              <View style={styles.dadosTitulo}>
                <Text style={styles.dadosTituloIcone}>🏅</Text>
                <Text style={styles.dadosTituloTexto}>Perfil Atlético</Text>
              </View>

              <View style={styles.dadoItem}>
                <Text style={styles.dadoIcone}>🏋</Text>
                <View>
                  <Text style={styles.dadoLabel}>Peso</Text>
                  <Text style={styles.dadoValor}>78 kg</Text>
                </View>
              </View>

              <View style={styles.dadoItem}>
                <Text style={styles.dadoIcone}>⚡</Text>
                <View>
                  <Text style={styles.dadoLabel}>Altura</Text>
                  <Text style={styles.dadoValor}>177 cm</Text>
                </View>
              </View>

              <View style={styles.dadoItem}>
                <Text style={styles.dadoIcone}>📅</Text>
                <View>
                  <Text style={styles.dadoLabel}>Idade</Text>
                  <Text style={styles.dadoValor}>20 anos</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Acessar Histórico ── */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Acessar Histórico Atleta</Text>
            <TouchableOpacity
              style={styles.btnAzul}
              activeOpacity={0.85}
              onPress={() => router.push('/historico_atleta')}
            >
              <Text style={styles.btnAzulTexto}>Histórico Longitudinal</Text>
            </TouchableOpacity>
          </View>

          {/* ── Contatos do Atleta ── */}
          <View style={styles.contatosCard}>
            <Text style={styles.secaoTitulo}>Contatos do Atleta</Text>

            <View style={styles.contatoRow}>
              <Text style={styles.contatoIcone}>✉</Text>
              <View>
                <Text style={styles.contatoLabel}>E-mail:</Text>
                <Text style={styles.contatoValor}>carlinmaia@gmail.com</Text>
              </View>
            </View>

            <View style={styles.contatoRow}>
              <Text style={styles.contatoIcone}>📞</Text>
              <View>
                <Text style={styles.contatoLabel}>Telefone:</Text>
                <Text style={styles.contatoValor}>(55)11 4002-8922</Text>
              </View>
            </View>
          </View>

          {/* ── Botão Relatório alimentar ── */}
          <TouchableOpacity
            style={styles.btnAzulOutline}
            activeOpacity={0.85}
            onPress={() => router.push('/relatorio_alimentar')}
          >
            <Text style={styles.btnAzulOutlineTexto}>Adicionar Relatório alimentar</Text>
          </TouchableOpacity>
        </ScrollView>

      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';
const AZUL = '#1565c0';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // Header
  header: {
    backgroundColor: RED,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  voltarBtn: { padding: 4 },
  voltarIcone: { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 34 },
  nomeAtleta: { color: '#fff', fontSize: 22, fontWeight: '700', flex: 1, textAlign: 'center' },
  chatWrap: { position: 'relative' },
  chatIcone: { fontSize: 24 },
  chatDot: {
    position: 'absolute', top: 0, right: 0,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 1.5, borderColor: RED,
  },
  posicao: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '400',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },

  // Card Foto + Dados
  perfilCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  fotoWrap: { width: '45%' },
  fotoAtleta: { width: '100%', height: 220 },
  dadosWrap: {
    flex: 1,
    padding: 12,
    gap: 10,
    justifyContent: 'center',
  },
  dadosTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dadosTituloIcone: { fontSize: 16 },
  dadosTituloTexto: { fontSize: 14, fontWeight: '700', color: '#111' },
  dadoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dadoIcone: { fontSize: 18, width: 24, textAlign: 'center' },
  dadoLabel: { fontSize: 11, color: '#888' },
  dadoValor: { fontSize: 15, fontWeight: '600', color: '#111' },

  // Seções
  secao: { gap: 10 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },

  // Botão azul sólido
  btnAzul: {
    backgroundColor: AZUL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 3px 8px rgba(21,101,192,0.3)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 3px 8px rgba(21,101,192,0.3)' },
    }),
  },
  btnAzulTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Card contatos
  contatosCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  contatoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  contatoIcone: { fontSize: 18, marginTop: 2 },
  contatoLabel: { fontSize: 12, color: '#888' },
  contatoValor: { fontSize: 14, fontWeight: '500', color: '#111' },

  // Botão azul outline
  btnAzulOutline: {
    borderWidth: 2,
    borderColor: AZUL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btnAzulOutlineTexto: { color: AZUL, fontSize: 16, fontWeight: '700' },
});
