import { useEffect, useState } from 'react';
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
import { getUrl } from '../constants/url';

type Sessao = {
  id_sessao: number;
  data_hora_inicio: string;
  duracao_minutos: number;
  volume_ml: number | null;
  percentual_variacao: number | null;
};

function formatarData(dataStr: string): string {
  const d = new Date(dataStr);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano}, ${hora}:${min}`;
}

function formatarLiquido(ml: number | null): string {
  const v = Number(ml);
  if (!v) return 'N/D';
  return v >= 1000 ? `${(v / 1000).toFixed(1)}L` : `${Math.round(v)}ml`;
}

export default function SessoesTreinador() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id_atleta?: string; nome?: string; esporte?: string }>();
  const atletaId = params.id_atleta;
  const atletaNome = params.nome || 'Atleta';
  const atletaEsporte = params.esporte || '';

  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!atletaId) { setCarregando(false); return; }
    fetch(getUrl(`/atleta/${atletaId}/sessoes`))
      .then(r => r.json())
      .then(data => { if (data.sucesso) setSessoes(data.sessoes ?? []); })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [atletaId]);

  const agora = Date.now();
  const semanaMs = 7 * 24 * 60 * 60 * 1000;
  const sessoesNaSemana = sessoes.filter(
    s => agora - new Date(s.data_hora_inicio).getTime() <= semanaMs
  ).length;

  const sessoesComLiquido = sessoes.filter(s => Number(s.volume_ml) > 0);
  const liquidoMedio = sessoesComLiquido.length > 0
    ? sessoesComLiquido.reduce((acc, s) => acc + Number(s.volume_ml), 0) / sessoesComLiquido.length / 1000
    : null;

  const sessoesComPerda = sessoes.filter(s => s.percentual_variacao != null);
  const perdaMedia = sessoesComPerda.length > 0
    ? sessoesComPerda.reduce((acc, s) => acc + Math.abs(Number(s.percentual_variacao)), 0) / sessoesComPerda.length
    : null;

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
          <Text style={styles.atletaNome}>{atletaNome}</Text>
          <Text style={styles.atletaEsporte}>{atletaEsporte}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Cards de métricas ── */}
          <View style={styles.metricasRow}>
            <View style={styles.metricaCard}>
              <Text style={styles.metricaValor}>{sessoesNaSemana}</Text>
              <Text style={styles.metricaLabel}>Sessões/Semana</Text>
            </View>
            <View style={styles.metricaCard}>
              <Text style={styles.metricaValor}>
                {liquidoMedio != null ? liquidoMedio.toFixed(1) : 'N/D'}
              </Text>
              <Text style={styles.metricaLabel}>L médio</Text>
            </View>
            <View style={styles.metricaCard}>
              <Text style={styles.metricaValor}>
                {perdaMedia != null ? `${perdaMedia.toFixed(1)}%` : 'N/D'}
              </Text>
              <Text style={styles.metricaLabel}>Perda média</Text>
            </View>
          </View>

          {/* ── Lista de sessões ── */}
          {carregando ? (
            <ActivityIndicator color={RED} style={{ marginTop: 40 }} />
          ) : sessoes.length === 0 ? (
            <Text style={styles.semSessoes}>Nenhuma sessão registrada.</Text>
          ) : (
            sessoes.map((s, idx) => (
              <TouchableOpacity
                key={s.id_sessao}
                style={styles.sessaoCard}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({ pathname: '/sessao_selecionada', params: { id: String(s.id_sessao) } })
                }
              >
                <View style={styles.sessaoTopo}>
                  <Text style={styles.sessaoLabel}>
                    {idx === 0 ? 'Última sessão' : `Sessão ${sessoes.length - idx}`}
                  </Text>
                  <Text style={styles.sessaoSeta}>›</Text>
                </View>

                <View style={styles.divisor} />

                <View style={styles.detalheRow}>
                  <Text style={styles.detalheChave}>Data</Text>
                  <Text style={styles.detalheValor}>{formatarData(s.data_hora_inicio)}</Text>
                </View>
                <View style={styles.detalheRow}>
                  <Text style={styles.detalheChave}>Duração</Text>
                  <Text style={styles.detalheValor}>{s.duracao_minutos} min</Text>
                </View>
                <View style={styles.detalheRow}>
                  <Text style={styles.detalheChave}>Ingestão de líquidos</Text>
                  <Text style={styles.detalheValor}>{formatarLiquido(s.volume_ml)}</Text>
                </View>
                <View style={styles.detalheRow}>
                  <Text style={styles.detalheChave}>Perda de peso</Text>
                  <Text style={[styles.detalheValor, styles.perdaVerde]}>
                    {s.percentual_variacao != null
                      ? `${Math.abs(Number(s.percentual_variacao)).toFixed(1)}%`
                      : 'N/D'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

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

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

  metricasRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
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

  detalheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalheChave: { fontSize: 13, color: '#999' },
  detalheValor: { fontSize: 13, color: '#222', fontWeight: '500' },
  perdaVerde: { color: '#2e7d32', fontWeight: '600' },

  semSessoes: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
});
