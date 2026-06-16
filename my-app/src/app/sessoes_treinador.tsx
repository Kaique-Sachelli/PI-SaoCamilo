import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUrl } from '../constants/url';

export default function SessoesTreinador() {
  const router = useRouter();
  const { id_atleta } = useLocalSearchParams();

  const [atleta, setAtleta] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      const usuarioResponse = await fetch(
        getUrl(`/usuarios/${id_atleta}`)
      );

      const usuarioData = await usuarioResponse.json();

      setAtleta(usuarioData);

      const sessoesResponse = await fetch(
        getUrl(`/atleta/${id_atleta}/sessoes`)
      );

      const sessoesData = await sessoesResponse.json();

      if (sessoesData?.sucesso) {
        setSessoes(sessoesData.sessoes || []);
      }
    } catch (erro) {
      console.log('Erro ao carregar sessões:', erro);
    } finally {
      setCarregando(false);
    }
  }

  const mediaLiquidos =
    sessoes.length > 0
      ? (
          sessoes.reduce(
            (acc, s) => acc + Number(s.volume_ml || 0),
            0
          ) /
          sessoes.length /
          1000
        ).toFixed(1)
      : '0';

  const mediaPerda =
    sessoes.length > 0
      ? (
          sessoes.reduce(
            (acc, s) =>
              acc + Number(s.percentual_variacao || 0),
            0
          ) / sessoes.length
        ).toFixed(1)
      : '0';

  const sessoesSemana = sessoes.length;

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.voltarBtn}
          >
            <Text style={styles.voltarTexto}>
              {'< Voltar'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.atletaNome}>
            {atleta?.nome || 'Atleta'}
          </Text>

          <Text style={styles.atletaEsporte}>
            {atleta?.modalidade_esportiva ||
              atleta?.tipo_perfil ||
              ''}
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.metricasRow}>
            <View style={styles.metricaCard}>
              <Text
                style={[
                  styles.metricaIcone,
                  { color: '#e53935' },
                ]}
              >
                ⚡
              </Text>

              <Text style={styles.metricaValor}>
                {sessoesSemana}
              </Text>

              <Text style={styles.metricaLabel}>
                Sessões
              </Text>
            </View>

            <View style={styles.metricaCard}>
              <Text
                style={[
                  styles.metricaIcone,
                  { color: '#1565c0' },
                ]}
              >
                💧
              </Text>

              <Text style={styles.metricaValor}>
                {mediaLiquidos}
              </Text>

              <Text style={styles.metricaLabel}>
                L médio
              </Text>
            </View>

            <View style={styles.metricaCard}>
              <Text
                style={[
                  styles.metricaIcone,
                  { color: '#333' },
                ]}
              >
                📊
              </Text>

              <Text style={styles.metricaValor}>
                {mediaPerda}%
              </Text>

              <Text style={styles.metricaLabel}>
                Perda média
              </Text>
            </View>
          </View>

          {sessoes.length === 0 && (
            <View style={styles.sessaoCard}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                Nenhuma sessão encontrada.
              </Text>
            </View>
          )}

          {sessoes.map((s, index) => (
            <TouchableOpacity
              key={
                s.id_sessao?.toString() ||
                index.toString()
              }
              style={styles.sessaoCard}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: '/sessao_selecionada',
                  params: {
                    idSessao: s.id_sessao,
                  },
                })
              }
            >
              <View style={styles.sessaoTopo}>
                <Text style={styles.sessaoLabel}>
                  {index === 0
                    ? 'Última sessão'
                    : `Sessão ${
                        sessoes.length - index
                      }`}
                </Text>

                <Text style={styles.sessaoSeta}>
                  ›
                </Text>
              </View>

              <View style={styles.divisor} />

              <View style={styles.detalheRow}>
                <Text style={styles.detalheChave}>
                  Data
                </Text>

                <Text style={styles.detalheValor}>
                  {s.data_hora_inicio
                    ? new Date(
                        s.data_hora_inicio
                      ).toLocaleString('pt-BR')
                    : '-'}
                </Text>
              </View>

              <View style={styles.detalheRow}>
                <Text style={styles.detalheChave}>
                  Duração
                </Text>

                <Text style={styles.detalheValor}>
                  {s.duracao_minutos || 0} min
                </Text>
              </View>

              <View style={styles.detalheRow}>
                <Text style={styles.detalheChave}>
                  Ingestão de líquidos
                </Text>

                <Text style={styles.detalheValor}>
                  {(
                    Number(s.volume_ml || 0) / 1000
                  ).toFixed(1)}
                  L
                </Text>
              </View>

              <View style={styles.detalheRow}>
                <Text style={styles.detalheChave}>
                  Perda de peso
                </Text>

                <Text
                  style={[
                    styles.detalheValor,
                    styles.perdaVerde,
                  ]}
                >
                  {s.percentual_variacao || 0}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
});
