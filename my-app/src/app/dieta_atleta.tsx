import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavbarAtleta } from './NavbarAtleta';
import { getUrl } from '../constants/url';
import { useUser } from '../context/UserContext';

type Dieta = {
  id_dieta: number;
  titulo: string;
  descricao: string;
  nome_arquivo?: string | null;
  tipo_arquivo?: string | null;
  data_envio?: string;
  nutricionista_nome?: string | null;
};

function formatarData(data?: string) {
  if (!data) return '';

  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return data;

  return dataObj.toLocaleDateString('pt-BR');
}

export default function DietaAtleta() {
  const { usuario } = useUser();
  const [dieta, setDieta] = useState<Dieta | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDieta();
  }, [usuario?.id_usuario]);

  async function carregarDieta() {
    if (!usuario?.id_usuario) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(getUrl(`/atleta/${usuario.id_usuario}/dieta`));
      const dados = await response.json();

      if (!response.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || 'Não foi possível carregar a dieta.');
      }

      setDieta(dados.dieta);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível carregar a dieta.';
      console.log('Erro ao carregar dieta:', mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  const itensDieta = dieta?.descricao
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean) || [];

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

          {carregando && (
            <View style={styles.estadoCard}>
              <ActivityIndicator color={RED} />
              <Text style={styles.estadoTexto}>Carregando dieta...</Text>
            </View>
          )}

          {!carregando && !dieta && (
            <View style={styles.estadoCard}>
              <Text style={styles.estadoTexto}>Nenhuma dieta enviada ainda.</Text>
            </View>
          )}

          {!carregando && dieta && (
            <View style={styles.refeicaoCard}>
              <View style={styles.refeicaoTopo}>
                <Text style={styles.refeicaoTitulo}>{dieta.titulo}</Text>
                <View style={styles.horarioBadge}>
                  <Text style={styles.horarioTexto}>{formatarData(dieta.data_envio)}</Text>
                </View>
              </View>
              {!!dieta.nutricionista_nome && (
                <Text style={styles.refeicaoMeta}>Nutricionista: {dieta.nutricionista_nome}</Text>
              )}
              <View style={styles.divisor} />
              {itensDieta.map((item, j) => (
                <View key={j} style={styles.itemRow}>
                  <View style={styles.itemDot} />
                  <Text style={styles.itemTexto}>{item}</Text>
                </View>
              ))}
              {!!dieta.nome_arquivo && (
                <>
                  <View style={styles.divisor} />
                  <Text style={styles.arquivoTexto}>
                    Arquivo: {dieta.nome_arquivo}
                    {dieta.tipo_arquivo ? ` (${dieta.tipo_arquivo})` : ''}
                  </Text>
                </>
              )}
            </View>
          )}
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
  estadoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    gap: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  estadoTexto: { fontSize: 14, color: '#555', textAlign: 'center' },

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
  refeicaoMeta: { fontSize: 12, color: '#777' },
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
  arquivoTexto: { fontSize: 12, color: '#666', fontWeight: '600' },
});
