import { useState, useEffect } from 'react';
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

type SessaoDetalhe = {
  id_sessao: number;
  data_hora_inicio: string;
  duracao_minutos: number;
  massa_pre: number;
  massa_pos: number;
  clima_temp: number | null;
  clima_umidade: number | null;
  taxa_sudorese: number | null;
  perda_massa_ajustada: number | null;
  percentual_variacao: number | null;
  alerta_seguranca: string | null;
  status_color: 'Verde' | 'Amarelo' | 'Vermelho' | null;
  volume_ml: number | null;
  modalidade_esportiva: string | null;
};

const ESCALA_CORES = [
  '#FFF9C4', '#FFF176', '#FFEE58', '#FFD740',
  '#FFB300', '#FF8F00', '#795548', '#4E342E',
];

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

function nivelUrina(perc: number | string | null): number {
  if (perc === null || perc === undefined) return 3;
  const p = Math.abs(Number(perc));
  if (p <= 0.5) return 1;
  if (p <= 1.0) return 2;
  if (p <= 1.5) return 3;
  if (p <= 2.0) return 4;
  if (p <= 2.5) return 5;
  if (p <= 3.0) return 6;
  if (p <= 4.0) return 7;
  return 8;
}

function calcularIntensidade(taxa: number | string | null): string {
  const t = Number(taxa);
  if (!t) return 'N/D';
  if (t < 0.6) return 'Baixa';
  if (t < 1.2) return 'Média';
  return 'Alta';
}

function formatarDataDetalhe(dataStr: string): string {
  const d = new Date(dataStr);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia}/${mes}/${ano}, ${hora}`;
}

export default function SessaoSelecionada() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sessao, setSessao] = useState<SessaoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) {
      setErro('ID da sessão não informado.');
      setCarregando(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch(getUrl(`/sessao/${id}`));
        const json = await resp.json();
        if (json.sucesso) {
          setSessao(json.sessao);
        } else {
          setErro(json.mensagem ?? 'Sessão não encontrada.');
        }
      } catch (e) {
        setErro('Não foi possível carregar a sessão.');
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  const nivelNum = nivelUrina(sessao?.percentual_variacao ?? null);
  const nivelIdx = nivelNum - 1;

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Detalhes do Treino</Text>
          {sessao && (
            <Text style={styles.headerSubtitulo}>
              {formatarDataDetalhe(sessao.data_hora_inicio)}
            </Text>
          )}
        </View>

        {carregando ? (
          <View style={styles.centrado}>
            <ActivityIndicator color={RED} size="large" />
          </View>
        ) : erro ? (
          <View style={styles.centrado}>
            <Text style={styles.erroTexto}>{erro}</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.voltarErroBtn}>
              <Text style={styles.voltarErroBtnTexto}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : sessao ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Alerta de segurança */}
            {sessao.alerta_seguranca ? (
              <View style={[
                styles.alertaCard,
                sessao.status_color === 'Vermelho' ? styles.alertaCritico : styles.alertaAtencao,
              ]}>
                <Text style={styles.alertaIcone}>
                  {sessao.status_color === 'Vermelho' ? '🚨' : '⚠️'}
                </Text>
                <Text style={styles.alertaTexto}>{sessao.alerta_seguranca}</Text>
              </View>
            ) : null}

            {/* Cards topo: Tempo + Hidratação ingerida */}
            <View style={styles.topoRow}>
              <View style={styles.topoCard}>
                <View style={styles.topoCardHeader}>
                  <Text style={styles.topoCardLabel}>Tempo Total</Text>
                  <Text style={[styles.topoIcone, { color: '#e53935' }]}>🕐</Text>
                </View>
                <Text style={styles.topoValor}>{sessao.duracao_minutos}</Text>
                <Text style={styles.topoUnidade}>min</Text>
              </View>

              <View style={styles.topoCard}>
                <View style={styles.topoCardHeader}>
                  <Text style={styles.topoCardLabel}>Volume Ingerido</Text>
                  <Text style={[styles.topoIcone, { color: '#1565c0' }]}>💧</Text>
                </View>
                <Text style={styles.topoValor}>
                  {sessao.volume_ml !== null
                    ? (sessao.volume_ml / 1000).toFixed(1)
                    : '--'}
                </Text>
                <Text style={styles.topoUnidade}>L</Text>
              </View>
            </View>

            {/* Card: Hidratação */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Hidratação</Text>

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Taxa de Sudorese</Text>
                <Text style={styles.linhaValor}>
                  {sessao.taxa_sudorese !== null
                    ? `${Number(sessao.taxa_sudorese).toFixed(2)} L/h`
                    : 'N/D'}
                </Text>
              </View>
              <View style={styles.divisor} />

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Massa Pré-treino</Text>
                <Text style={styles.linhaValor}>
                  {Number(sessao.massa_pre).toFixed(1)} kg
                </Text>
              </View>
              <View style={styles.divisor} />

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Massa Pós-treino</Text>
                <Text style={styles.linhaValor}>
                  {Number(sessao.massa_pos).toFixed(1)} kg
                </Text>
              </View>
              <View style={styles.divisor} />

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Perda de massa ajustada</Text>
                <Text style={styles.linhaValor}>
                  {sessao.perda_massa_ajustada !== null
                    ? `${Number(sessao.perda_massa_ajustada).toFixed(2)} kg`
                    : 'N/D'}
                </Text>
              </View>
              <View style={styles.divisor} />

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Variação de massa</Text>
                <Text style={[
                  styles.linhaValor,
                  {
                    color:
                      sessao.status_color === 'Verde' ? '#2e7d32' :
                      sessao.status_color === 'Vermelho' ? '#b71c1c' : '#e65100',
                  },
                ]}>
                  {sessao.percentual_variacao !== null
                    ? `${Number(sessao.percentual_variacao).toFixed(1)}%`
                    : 'N/D'}
                </Text>
              </View>
            </View>

            {/* Card: Escala de urina */}
            <View style={styles.card}>
              <Text style={styles.escalaRotulo}>ESCALA DE HIDRATAÇÃO 1–8</Text>
              <View style={styles.nivelRow}>
                <View style={[styles.nivelBolinha, { backgroundColor: ESCALA_CORES[nivelIdx] }]} />
                <View>
                  <Text style={styles.nivelTexto}>Nível {nivelNum}</Text>
                  <Text style={styles.nivelLabel}>{LABELS_ESCALA[nivelNum]}</Text>
                </View>
              </View>

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

            {/* Card: Condições do Treino */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Condições do Treino</Text>

              {sessao.clima_temp !== null && (
                <>
                  <View style={styles.linhaRow}>
                    <View style={styles.linhaEsquerda}>
                      <Text style={styles.condicaoIcone}>🌡</Text>
                      <Text style={styles.linhaChave}>Temperatura</Text>
                    </View>
                    <Text style={styles.linhaValor}>{sessao.clima_temp} °C</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              {sessao.clima_umidade !== null && (
                <>
                  <View style={styles.linhaRow}>
                    <View style={styles.linhaEsquerda}>
                      <Text style={styles.condicaoIcone}>💦</Text>
                      <Text style={styles.linhaChave}>Umidade</Text>
                    </View>
                    <Text style={styles.linhaValor}>{sessao.clima_umidade}%</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              {sessao.modalidade_esportiva && (
                <>
                  <View style={styles.linhaRow}>
                    <View style={styles.linhaEsquerda}>
                      <Text style={styles.condicaoIcone}>🏅</Text>
                      <Text style={styles.linhaChave}>Esporte</Text>
                    </View>
                    <Text style={styles.linhaValor}>{sessao.modalidade_esportiva}</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              <View style={styles.linhaRow}>
                <View style={styles.linhaEsquerda}>
                  <Text style={styles.condicaoIcone}>⚡</Text>
                  <Text style={styles.linhaChave}>Intensidade estimada</Text>
                </View>
                <Text style={styles.linhaValor}>
                  {calcularIntensidade(sessao.taxa_sudorese)}
                </Text>
              </View>
            </View>

            {/* Botões de exportação */}
            <View style={styles.exportRow}>
              <TouchableOpacity style={styles.exportBtn}>
                <Text style={styles.exportIcone}>⬇</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportBtn}>
                <Text style={styles.exportIcone}>📄</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  centrado: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  erroTexto: { fontSize: 15, color: '#888', textAlign: 'center', paddingHorizontal: 32 },
  voltarErroBtn: {
    backgroundColor: RED, borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 10,
  },
  voltarErroBtnTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },

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

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

  alertaCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 12, padding: 14,
  },
  alertaCritico: { backgroundColor: '#ffebee' },
  alertaAtencao: { backgroundColor: '#fff8e1' },
  alertaIcone: { fontSize: 20 },
  alertaTexto: { flex: 1, fontSize: 13, color: '#333', lineHeight: 20 },

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

  linhaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linhaEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linhaChave: { fontSize: 13, color: '#666' },
  linhaValor: { fontSize: 13, fontWeight: '600', color: '#222' },
  divisor: { height: 1, backgroundColor: '#f2f2f2' },

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

  condicaoIcone: { fontSize: 16 },

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
});
