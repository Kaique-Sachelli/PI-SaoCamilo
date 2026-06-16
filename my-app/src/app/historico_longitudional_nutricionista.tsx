import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUrl } from '../constants/url';

type Sessao = {
  id_sessao: number;
  data_hora_inicio: string;
  duracao_minutos: number | null;
  massa_pre: number | string | null;
  massa_pos: number | string | null;
  clima_temp: number | string | null;
  clima_umidade: number | string | null;
  taxa_sudorese: number | string | null;
  perda_massa_ajustada: number | string | null;
  percentual_variacao: number | string | null;
  alerta_seguranca: string | null;
  status_color: 'Verde' | 'Amarelo' | 'Vermelho' | null;
  volume_ml: number | string | null;
};

type Resumo = {
  sessoes: number;
  taxaMedia: number | null;
  perdaMedia: number | null;
};

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const DIAS_SEMANA = ['Do','Se','Te','Qu','Qu','Se','Sá'];

function textoParam(valor?: string | string[]) {
  return Array.isArray(valor) ? valor[0] : valor;
}

function numero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function formatarMetrica(valor: number | string | null | undefined, casas: number, sufixo: string) {
  const n = numero(valor);
  return n !== null ? `${n.toFixed(casas)}${sufixo}` : '--';
}

function formatarData(dataStr: string): string {
  const d = new Date(dataStr);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesmaData = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (mesmaData(d, hoje)) return `Hoje, ${hora}`;
  if (mesmaData(d, ontem)) return `Ontem, ${hora}`;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}, ${hora}`;
}

function dataCurta(dataStr: string) {
  const d = new Date(dataStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function mesmaDataBR(dataStr: string, dataBR: string) {
  const [dia, mes, ano] = dataBR.split('/');
  if (!dia || !mes || !ano) return true;
  const d = new Date(dataStr);
  return (
    d.getDate() === Number(dia) &&
    d.getMonth() + 1 === Number(mes) &&
    d.getFullYear() === Number(ano)
  );
}

function filtrarUltimosDias(sessoes: Sessao[], dias: number) {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - (dias - 1));

  return sessoes.filter((sessao) => new Date(sessao.data_hora_inicio) >= inicio);
}

function calcularResumo(sessoes: Sessao[]): Resumo {
  const taxas = sessoes
    .map((s) => numero(s.taxa_sudorese))
    .filter((valor): valor is number => valor !== null);
  const perdas = sessoes
    .map((s) => numero(s.percentual_variacao))
    .filter((valor): valor is number => valor !== null);

  return {
    sessoes: sessoes.length,
    taxaMedia: taxas.length ? taxas.reduce((sum, valor) => sum + valor, 0) / taxas.length : null,
    perdaMedia: perdas.length ? perdas.reduce((sum, valor) => sum + Math.abs(valor), 0) / perdas.length : null,
  };
}

function statusInfo(statusColor: string | null) {
  if (statusColor === 'Verde') return { texto: 'Hidratação OK', cor: 'verde' as const };
  if (statusColor === 'Vermelho') return { texto: 'Crítico', cor: 'vermelho' as const };
  if (statusColor === 'Amarelo') return { texto: 'Atenção', cor: 'amarelo' as const };
  return { texto: 'Sem dados', cor: 'amarelo' as const };
}

function intensidadeFlexes(taxa: number | string | null): [number, number, number] {
  const t = Number(taxa);
  if (!t || t <= 0) return [1, 0, 0];
  if (t < 0.6) return [0.85, 0.12, 0.03];
  if (t < 1.0) return [0.4, 0.45, 0.15];
  if (t < 1.5) return [0.15, 0.5, 0.35];
  return [0.05, 0.3, 0.65];
}

function diasNoMes(mes: number, ano: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

function primeiroDiaSemana(mes: number, ano: number) {
  return new Date(ano, mes, 1).getDay();
}

function CalendarioModal({
  visible,
  onClose,
  onSelectDate,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (data: string) => void;
}) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [diaSel, setDiaSel] = useState(hoje.getDate());

  const total = diasNoMes(mes, ano);
  const offset = primeiroDiaSemana(mes, ano);
  const celulas = Array.from({ length: offset + total }, (_, i) =>
    i < offset ? null : i - offset + 1
  );

  const navMes = (dir: number) => {
    let m = mes + dir;
    let a = ano;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m);
    setAno(a);
    setDiaSel(0);
  };

  const confirmar = () => {
    const d = String(diaSel).padStart(2, '0');
    const m = String(mes + 1).padStart(2, '0');
    onSelectDate(`${d}/${m}/${ano}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.calCard}>
          <View style={styles.calNav}>
            <TouchableOpacity onPress={() => navMes(-1)} style={styles.calNavBtn}>
              <Text style={styles.calNavArrow}>‹</Text>
            </TouchableOpacity>

            <View style={styles.calNavCenter}>
              <View style={styles.calSelect}>
                <Text style={styles.calSelectText}>{MESES[mes]}</Text>
              </View>
              <View style={styles.calSelect}>
                <Text style={styles.calSelectText}>{ano}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navMes(1)} style={styles.calNavBtn}>
              <Text style={styles.calNavArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calWeekRow}>
            {DIAS_SEMANA.map((d, i) => (
              <Text key={i} style={styles.calWeekText}>{d}</Text>
            ))}
          </View>

          <View style={styles.calGrid}>
            {celulas.map((dia, i) => {
              if (!dia) return <View key={i} style={styles.calCell} />;
              const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
              const isSel = dia === diaSel;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.calCell,
                    isHoje && !isSel && styles.calCellHoje,
                    isSel && styles.calCellSel,
                  ]}
                  onPress={() => setDiaSel(dia)}
                >
                  <Text style={[
                    styles.calCellText,
                    isHoje && !isSel && styles.calCellHojeText,
                    isSel && styles.calCellSelText,
                  ]}>
                    {dia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.calFooter}>
            <TouchableOpacity style={styles.calBtnCancel} onPress={onClose}>
              <Text style={styles.calBtnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.calBtnOk, !diaSel && { opacity: 0.4 }]}
              onPress={confirmar}
              disabled={!diaSel}
            >
              <Text style={styles.calBtnOkText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function ResumoCard({ titulo, resumo }: { titulo: string; resumo: Resumo }) {
  return (
    <View style={styles.metricaCard}>
      <View style={styles.metricaHeader}>
        <Text style={styles.metricaIcone}>📈</Text>
        <Text style={styles.metricaRotulo}>{titulo}</Text>
      </View>
      <Text style={styles.metricaValorGrande}>
        {resumo.taxaMedia !== null ? resumo.taxaMedia.toFixed(2) : '--'}
      </Text>
      <Text style={styles.metricaUnidade}>L/h média</Text>
      <Text style={styles.metricaSecundaria}>
        Perda {resumo.perdaMedia !== null ? `${resumo.perdaMedia.toFixed(1)}%` : '--'}
      </Text>
      <Text style={styles.metricaSessoes}>
        {resumo.sessoes} {resumo.sessoes === 1 ? 'sessão' : 'sessões'}
      </Text>
    </View>
  );
}

export default function HistoricoAtleta() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id_atleta?: string;
    nome?: string;
  }>();

  const idAtleta = Number(textoParam(params.id_atleta));
  const nomeAtleta = textoParam(params.nome) || 'Atleta';
  const [calVisible, setCalVisible] = useState(false);
  const [dataSel, setDataSel] = useState('');
  const [busca, setBusca] = useState('');
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarSessoes = useCallback(async () => {
    if (!Number.isInteger(idAtleta) || idAtleta <= 0) {
      setCarregando(false);
      setSessoes([]);
      return;
    }

    try {
      setCarregando(true);
      const resp = await fetch(getUrl(`/atleta/${idAtleta}/sessoes`));
      const json = await resp.json();

      if (!resp.ok || !json.sucesso) {
        throw new Error(json.mensagem || 'Não foi possível carregar o histórico.');
      }

      setSessoes(json.sessoes);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível carregar o histórico.';
      console.log('Erro ao buscar histórico longitudinal:', mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }, [idAtleta]);

  useEffect(() => {
    buscarSessoes();
  }, [buscarSessoes]);

  const resumoSemana = useMemo(
    () => calcularResumo(filtrarUltimosDias(sessoes, 7)),
    [sessoes]
  );

  const resumoMes = useMemo(
    () => calcularResumo(filtrarUltimosDias(sessoes, 30)),
    [sessoes]
  );

  const sessoesGrafico = useMemo(() => sessoes.slice(0, 5).reverse(), [sessoes]);

  const sessoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return sessoes.filter((s) => {
      const st = statusInfo(s.status_color);
      const dataFormatada = formatarData(s.data_hora_inicio);
      const textoBusca = [
        st.texto,
        dataFormatada,
        `${s.duracao_minutos || 0} min`,
        s.alerta_seguranca || '',
      ].join(' ').toLowerCase();

      return (!dataSel || mesmaDataBR(s.data_hora_inicio, dataSel)) &&
        (!termo || textoBusca.includes(termo));
    });
  }, [busca, dataSel, sessoes]);

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Histórico Longitudinal</Text>
        <Text style={styles.headerSubtitulo}>{nomeAtleta}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metricasRow}>
          <ResumoCard titulo="Últimos 7 dias" resumo={resumoSemana} />
          <ResumoCard titulo="Últimos 30 dias" resumo={resumoMes} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Taxa de Sudorese & Intensidade</Text>

          {carregando ? (
            <ActivityIndicator color={RED} size="small" style={styles.loadingInline} />
          ) : sessoesGrafico.length === 0 ? (
            <Text style={styles.semSessoes}>Nenhuma sessão registrada para montar o gráfico.</Text>
          ) : (
            <>
              {sessoesGrafico.map((s) => {
                const [fl, fm, fa] = intensidadeFlexes(s.taxa_sudorese);
                return (
                  <View key={s.id_sessao} style={styles.barraRow}>
                    <Text style={styles.barraData}>{dataCurta(s.data_hora_inicio)}</Text>
                    <View style={styles.barraTrack}>
                      {fl > 0 && <View style={[styles.barraBaixa, { flex: fl }]} />}
                      {fm > 0 && <View style={[styles.barraMedia, { flex: fm }]} />}
                      {fa > 0 && <View style={[styles.barraAlta, { flex: fa }]} />}
                    </View>
                    <Text style={styles.barraDur}>{s.duracao_minutos || '--'}min</Text>
                  </View>
                );
              })}

              <View style={styles.legendaRow}>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: '#90caf9' }]} />
                  <Text style={styles.legendaText}>Baixa</Text>
                </View>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: '#ffb74d' }]} />
                  <Text style={styles.legendaText}>Média</Text>
                </View>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, { backgroundColor: '#e53935' }]} />
                  <Text style={styles.legendaText}>Alta</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.sessoesHeader}>
            <Text style={styles.cardTitulo}>Sessões Recentes</Text>
            <TouchableOpacity onPress={() => setCalVisible(true)} style={styles.calBtn}>
              <Text style={styles.calBtnIcone}>📅</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buscaRow}>
            <TextInput
              style={styles.buscaInput}
              placeholder="Filtrar por status ou data..."
              value={busca}
              onChangeText={setBusca}
              placeholderTextColor="#bbb"
            />
            {dataSel ? (
              <TouchableOpacity onPress={() => setDataSel('')}>
                <Text style={styles.dataSelTag}>📅 {dataSel}  ✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {carregando ? (
            <ActivityIndicator color={RED} size="small" style={styles.loadingInline} />
          ) : !Number.isInteger(idAtleta) || idAtleta <= 0 ? (
            <Text style={styles.semSessoes}>Selecione um atleta para visualizar o histórico.</Text>
          ) : sessoesFiltradas.length === 0 ? (
            <Text style={styles.semSessoes}>
              {dataSel ? 'Nenhuma sessão nesta data.' : 'Nenhuma sessão encontrada.'}
            </Text>
          ) : (
            <>
              <Text style={styles.ultimaSessaoLabel}>
                {sessoesFiltradas.length} {sessoesFiltradas.length === 1 ? 'sessão' : 'sessões'} encontradas
              </Text>

              {sessoesFiltradas.map((s, idx) => {
                const st = statusInfo(s.status_color);
                return (
                  <TouchableOpacity
                    key={s.id_sessao}
                    style={styles.sessaoCard}
                    activeOpacity={0.75}
                    onPress={() =>
                      router.push({ pathname: '/sessao_selecionada', params: { id: String(s.id_sessao) } })
                    }
                  >
                    {idx === 0 && <Text style={styles.maisRecenteLabel}>Mais recente</Text>}
                    <View style={styles.sessaoTopRow}>
                      <Text style={styles.sessaoDataTexto}>{formatarData(s.data_hora_inicio)}</Text>
                      <View style={[
                        styles.statusBadge,
                        st.cor === 'verde' && styles.statusOk,
                        st.cor === 'amarelo' && styles.statusAtencao,
                        st.cor === 'vermelho' && styles.statusCritico,
                      ]}>
                        <Text style={[
                          styles.statusText,
                          st.cor === 'verde' && styles.statusOkText,
                          st.cor === 'amarelo' && styles.statusAtencaoText,
                          st.cor === 'vermelho' && styles.statusCriticoText,
                        ]}>
                          {st.texto}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.sessaoNome}>{s.duracao_minutos || '--'} min de treino</Text>
                    <View style={styles.sessaoMetricasRow}>
                      <View style={styles.sessaoMetrica}>
                        <Text style={styles.sessaoMetricaLabel}>Taxa de sudorese</Text>
                        <Text style={styles.sessaoMetricaValor}>
                          {formatarMetrica(s.taxa_sudorese, 2, ' L/h')}
                        </Text>
                      </View>
                      <View style={styles.sessaoMetrica}>
                        <Text style={styles.sessaoMetricaLabel}>Perda de massa</Text>
                        <Text style={styles.sessaoMetricaValor}>
                          {formatarMetrica(s.perda_massa_ajustada, 2, ' kg')}
                        </Text>
                      </View>
                      <View style={styles.sessaoMetrica}>
                        <Text style={styles.sessaoMetricaLabel}>Variação %</Text>
                        <Text style={[
                          styles.sessaoMetricaValor,
                          {
                            color:
                              st.cor === 'verde' ? '#2e7d32' :
                              st.cor === 'vermelho' ? '#b71c1c' : '#e65100',
                          },
                        ]}>
                          {formatarMetrica(s.percentual_variacao, 1, '%')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Exportar Relatório</Text>
          <View style={styles.exportRow}>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportIcone}>⬇</Text>
              <Text style={styles.exportTexto}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn}>
              <Text style={styles.exportIcone}>⬇</Text>
              <Text style={styles.exportTexto}>Planilha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CalendarioModal
        visible={calVisible}
        onClose={() => setCalVisible(false)}
        onSelectDate={(d) => setDataSel(d)}
      />
    </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Header
  header: {
    backgroundColor: RED,
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  headerSubtitulo: { color: 'rgba(255,255,255,0.82)', fontSize: 14, marginTop: 4 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 20 },

  // Cards métricas topo
  metricasRow: { flexDirection: 'row', gap: 12 },
  metricaCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 6px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 6px rgba(0,0,0,0.07)' },
    }),
  },
  metricaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  metricaIcone: { fontSize: 14 },
  metricaRotulo: { fontSize: 11, color: '#666', fontWeight: '600' },
  metricaValorGrande: { fontSize: 28, fontWeight: '700', color: '#111' },
  metricaUnidade: { fontSize: 12, color: '#888', marginTop: 2 },
  metricaSecundaria: { fontSize: 13, color: '#222', fontWeight: '700', marginTop: 8 },
  metricaSessoes: { fontSize: 11, color: '#888', marginTop: 2 },

  // Card base
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 6px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 6px rgba(0,0,0,0.07)' },
    }),
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#222' },
  loadingInline: { marginVertical: 18 },
  semSessoes: { fontSize: 14, color: '#777', textAlign: 'center', paddingVertical: 18 },

  // Barras intensidade
  barraRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barraData: { fontSize: 12, color: '#888', width: 36 },
  barraTrack: { flex: 1, flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' },
  barraBaixa: { backgroundColor: '#90caf9', height: '100%' },
  barraMedia: { backgroundColor: '#ffb74d', height: '100%' },
  barraAlta: { backgroundColor: '#e53935', height: '100%' },
  barraDur: { fontSize: 12, color: '#888', width: 44, textAlign: 'right' },
  legendaRow: { flexDirection: 'row', gap: 16, marginTop: 2 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendaDot: { width: 10, height: 10, borderRadius: 5 },
  legendaText: { fontSize: 12, color: '#555' },

  // Sessões
  sessoesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', alignItems: 'center',
  },
  calBtnIcone: { fontSize: 18 },
  buscaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buscaInput: {
    flex: 1,
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14, color: '#333',
  },
  dataSelTag: { fontSize: 12, color: RED, fontWeight: '600' },
  ultimaSessaoLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  maisRecenteLabel: { fontSize: 11, color: RED, fontWeight: '700', marginBottom: 2 },

  sessaoCard: {
    borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 12,
    padding: 12, gap: 6,
  },
  sessaoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessaoDataTexto: { fontSize: 12, color: '#888' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  statusOk: { backgroundColor: '#e8f5e9' },
  statusAtencao: { backgroundColor: '#fff3e0' },
  statusCritico: { backgroundColor: '#ffebee' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusOkText: { color: '#2e7d32' },
  statusAtencaoText: { color: '#e65100' },
  statusCriticoText: { color: '#b71c1c' },
  sessaoNome: { fontSize: 16, fontWeight: '700', color: '#111' },
  sessaoMetricasRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sessaoMetrica: { gap: 2, maxWidth: '33%' },
  sessaoMetricaLabel: { fontSize: 10, color: '#999' },
  sessaoMetricaValor: { fontSize: 13, fontWeight: '600', color: '#222' },

  // Exportar
  exportRow: { flexDirection: 'row', gap: 12 },
  exportBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#1565c0', borderRadius: 12,
    paddingVertical: 12,
  },
  exportIcone: { fontSize: 16, color: '#fff' },
  exportTexto: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Modal calendário
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  calCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, width: 300,
    ...Platform.select({
      ios: { boxshadow: '0px 8px 24px rgba(0,0,0,0.15)' },
      android: { elevation: 8 },
      web: { boxshadow: '0px 8px 24px rgba(0,0,0,0.15)' },
    }),
  },
  calNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calNavBtn: { padding: 4 },
  calNavArrow: { fontSize: 22, color: '#333', fontWeight: '600' },
  calNavCenter: { flexDirection: 'row', gap: 8 },
  calSelect: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  calSelectText: { fontSize: 14, fontWeight: '600', color: '#333' },
  calWeekRow: { flexDirection: 'row', marginBottom: 6 },
  calWeekText: { flex: 1, textAlign: 'center', fontSize: 11, color: '#aaa', fontWeight: '600' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  calCell: {
    width: `${100 / 7}%`, aspectRatio: 1,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 50,
  },
  calCellHoje: { borderWidth: 1.5, borderColor: '#333' },
  calCellSel: { backgroundColor: '#111' },
  calCellText: { fontSize: 13, color: '#222' },
  calCellHojeText: { fontWeight: '700' },
  calCellSelText: { color: '#fff', fontWeight: '700' },
  calFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  calBtnCancel: { paddingVertical: 8, paddingHorizontal: 14 },
  calBtnCancelText: { fontSize: 14, color: '#888' },
  calBtnOk: {
    backgroundColor: '#111', borderRadius: 8,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  calBtnOkText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
