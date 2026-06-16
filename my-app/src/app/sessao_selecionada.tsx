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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUrl } from '../constants/url';
import * as Print from 'expo-print';

type SessaoDetalhe = {
  id_sessao: number;
  data_hora_inicio: string;
  duracao_minutos: number;
  massa_pre: number;
  massa_pos: number;
  clima_temp: number | null;
  clima_umidade: number | null;
  intensidade_percebida: string | null;
  roupas_encharcadas: number | null;
  urina_pre_cor: number | null;
  volume_urina_ml: number | null;
  taxa_sudorese: number | null;
  perda_massa_ajustada: number | null;
  percentual_variacao: number | null;
  alerta_seguranca: string | null;
  status_color: 'Verde' | 'Amarelo' | 'Vermelho' | null;
  volume_ml: number | null;
  modalidade_esportiva: string | null;
  nivel_fadiga: number | null;
  sintomas_gastrointestinais: string | null;
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

async function gerarPDFSessao(s: SessaoDetalhe) {
  const dataFormatada = formatarDataDetalhe(s.data_hora_inicio);
  const dataExport = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const statusTexto = s.status_color === 'Verde' ? 'Hidratação OK'
    : s.status_color === 'Vermelho' ? 'Crítico'
    : s.status_color === 'Amarelo' ? 'Atenção'
    : '--';
  const statusCor = s.status_color === 'Verde' ? '#2e7d32'
    : s.status_color === 'Vermelho' ? '#b71c1c'
    : '#e65100';

  const nivel = s.urina_pre_cor
    ? Math.min(8, Math.max(1, s.urina_pre_cor))
    : nivelUrina(s.percentual_variacao ?? null);
  const labelUrina: Record<number, string> = {
    1: 'Bem hidratado', 2: 'Bem hidratado', 3: 'Hidratado',
    4: 'Hidratação moderada', 5: 'Hidratação moderada',
    6: 'Atenção à hidratação', 7: 'Hidratação insuficiente', 8: 'Hidratação insuficiente',
  };

  const fadigaDots = s.nivel_fadiga
    ? Array.from({ length: 5 }, (_, i) =>
        `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${i < s.nivel_fadiga! ? '#B3151F' : '#e0e0e0'};margin-right:4px;"></span>`
      ).join('')
    : null;

  const alertaHtml = s.alerta_seguranca ? `
    <div style="background:${s.status_color === 'Vermelho' ? '#ffebee' : '#fff8e1'};border-left:4px solid ${statusCor};border-radius:8px;padding:12px 16px;margin-bottom:20px;">
      <strong>${s.status_color === 'Vermelho' ? 'Alerta Crítico' : 'Atenção'}</strong>
      <p style="margin:6px 0 0;color:#444;font-size:13px;">${s.alerta_seguranca}</p>
    </div>` : '';

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #222; padding: 32px; }
    h1   { color: #B3151F; font-size: 22px; margin-bottom: 2px; }
    .subtitulo { font-size: 13px; color: #666; margin-bottom: 6px; }
    .data-sessao { font-size: 15px; font-weight: 700; color: #333; margin-bottom: 20px; }
    .badge { display:inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
             background: ${statusCor}22; color: ${statusCor}; border: 1px solid ${statusCor}; margin-left: 10px; }
    .resumo { display: flex; gap: 14px; margin-bottom: 22px; }
    .mini-card { flex: 1; border: 1px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; }
    .mini-label { font-size: 11px; color: #888; margin-bottom: 4px; }
    .mini-valor { font-size: 22px; font-weight: 700; color: #111; }
    .mini-unidade { font-size: 11px; color: #888; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 14px; font-weight: 700; color: #222; border-bottom: 2px solid #B3151F;
                     padding-bottom: 4px; margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; padding: 7px 0;
           border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .row-label { color: #666; }
    .row-valor { font-weight: 600; color: #222; }
    .urina-barra { display: flex; height: 12px; border-radius: 6px; overflow: hidden; margin: 8px 0 4px; }
    .urina-seg { flex: 1; }
    .urina-info { font-size: 12px; color: #666; }
    .rodape { margin-top: 32px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>São Camilo — Nutri-Esportiva</h1>
  <div class="subtitulo">Relatório de Sessão de Treino</div>
  <div class="data-sessao">${dataFormatada} <span class="badge">${statusTexto}</span></div>

  ${alertaHtml}

  <div class="resumo">
    <div class="mini-card">
      <div class="mini-label">Duração</div>
      <div class="mini-valor">${s.duracao_minutos}</div>
      <div class="mini-unidade">minutos</div>
    </div>
    <div class="mini-card">
      <div class="mini-label">Volume Ingerido</div>
      <div class="mini-valor">${s.volume_ml !== null ? (s.volume_ml / 1000).toFixed(1) : '--'}</div>
      <div class="mini-unidade">litros</div>
    </div>
    <div class="mini-card">
      <div class="mini-label">Taxa de Sudorese</div>
      <div class="mini-valor">${s.taxa_sudorese !== null ? Number(s.taxa_sudorese).toFixed(2) : '--'}</div>
      <div class="mini-unidade">L/h</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Hidratação</div>
    <div class="row">
      <span class="row-label">Massa pré-treino</span>
      <span class="row-valor">${Number(s.massa_pre).toFixed(1)} kg</span>
    </div>
    <div class="row">
      <span class="row-label">Massa pós-treino</span>
      <span class="row-valor">${Number(s.massa_pos).toFixed(1)} kg</span>
    </div>
    <div class="row">
      <span class="row-label">Perda de massa ajustada</span>
      <span class="row-valor">${s.perda_massa_ajustada !== null ? Number(s.perda_massa_ajustada).toFixed(2) + ' kg' : 'N/D'}</span>
    </div>
    <div class="row">
      <span class="row-label">Variação de massa</span>
      <span class="row-valor" style="color:${statusCor}">${s.percentual_variacao !== null ? Number(s.percentual_variacao).toFixed(1) + '%' : 'N/D'}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Escala de Hidratação Urinária (1–8)</div>
    <div class="urina-barra">
      ${['#FFF9C4','#FFF176','#FFEE58','#FFD740','#FFB300','#FF8F00','#795548','#4E342E']
        .map((cor, i) => `<div class="urina-seg" style="background:${cor};${i === nivel - 1 ? 'outline:2px solid #333;' : ''}"></div>`)
        .join('')}
    </div>
    <div class="urina-info">Nível ${nivel} — ${labelUrina[nivel]}</div>
  </div>

  <div class="section">
    <div class="section-title">Condições do Treino</div>
    ${s.clima_temp !== null ? `<div class="row"><span class="row-label">Temperatura</span><span class="row-valor">${s.clima_temp} °C</span></div>` : ''}
    ${s.clima_umidade !== null ? `<div class="row"><span class="row-label">Umidade</span><span class="row-valor">${s.clima_umidade}%</span></div>` : ''}
    ${s.modalidade_esportiva ? `<div class="row"><span class="row-label">Esporte</span><span class="row-valor">${s.modalidade_esportiva}</span></div>` : ''}
    <div class="row">
      <span class="row-label">Intensidade</span>
      <span class="row-valor">${s.intensidade_percebida ?? calcularIntensidade(s.taxa_sudorese)}</span>
    </div>
    ${s.roupas_encharcadas !== null ? `<div class="row"><span class="row-label">Roupas encharcadas</span><span class="row-valor">${s.roupas_encharcadas ? 'Sim' : 'Não'}</span></div>` : ''}
    ${s.volume_urina_ml !== null ? `<div class="row"><span class="row-label">Volume urinário na sessão</span><span class="row-valor">${s.volume_urina_ml} mL</span></div>` : ''}
  </div>

  ${(s.nivel_fadiga || s.sintomas_gastrointestinais) ? `
  <div class="section">
    <div class="section-title">Bem-estar pós-treino</div>
    ${fadigaDots ? `<div class="row"><span class="row-label">Nível de fadiga</span><span>${fadigaDots}</span></div>
    <div style="font-size:11px;color:#aaa;margin-bottom:6px;">1 = Sem fadiga · 5 = Exaustão extrema</div>` : ''}
    ${s.sintomas_gastrointestinais ? `<div class="row" style="flex-direction:column;gap:4px;">
      <span class="row-label">Sintomas gastrointestinais</span>
      <span style="font-size:13px;color:#444;margin-top:4px;">${s.sintomas_gastrointestinais}</span>
    </div>` : ''}
  </div>` : ''}

  <div class="rodape">São Camilo — Projeto Integrador • Gerado em ${dataExport}</div>
</body>
</html>`;

  try {
    await Print.printAsync({ html });
  } catch (err: any) {
    if (err?.message?.includes('cancelled') || err?.message?.includes('dismissed')) return;
    Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    console.error('gerarPDFSessao erro:', err);
  }
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

  const nivelNum = sessao?.urina_pre_cor
    ? Math.min(8, Math.max(1, sessao.urina_pre_cor))
    : nivelUrina(sessao?.percentual_variacao ?? null);
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
                <Text style={styles.alertaTexto}>{sessao.alerta_seguranca}</Text>
              </View>
            ) : null}

            {/* Cards topo: Tempo + Hidratação ingerida */}
            <View style={styles.topoRow}>
              <View style={styles.topoCard}>
                <View style={styles.topoCardHeader}>
                  <Text style={styles.topoCardLabel}>Tempo Total</Text>
                </View>
                <Text style={styles.topoValor}>{sessao.duracao_minutos}</Text>
                <Text style={styles.topoUnidade}>min</Text>
              </View>

              <View style={styles.topoCard}>
                <View style={styles.topoCardHeader}>
                  <Text style={styles.topoCardLabel}>Volume Ingerido</Text>
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
                    <Text style={styles.linhaChave}>Temperatura</Text>
                    <Text style={styles.linhaValor}>{sessao.clima_temp} °C</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              {sessao.clima_umidade !== null && (
                <>
                  <View style={styles.linhaRow}>
                    <Text style={styles.linhaChave}>Umidade</Text>
                    <Text style={styles.linhaValor}>{sessao.clima_umidade}%</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              {sessao.modalidade_esportiva && (
                <>
                  <View style={styles.linhaRow}>
                    <Text style={styles.linhaChave}>Esporte</Text>
                    <Text style={styles.linhaValor}>{sessao.modalidade_esportiva}</Text>
                  </View>
                  <View style={styles.divisor} />
                </>
              )}

              <View style={styles.linhaRow}>
                <Text style={styles.linhaChave}>Intensidade</Text>
                <Text style={styles.linhaValor}>
                  {sessao.intensidade_percebida ?? calcularIntensidade(sessao.taxa_sudorese)}
                </Text>
              </View>

              {sessao.roupas_encharcadas !== null && (
                <>
                  <View style={styles.divisor} />
                  <View style={styles.linhaRow}>
                    <Text style={styles.linhaChave}>Roupas encharcadas</Text>
                    <Text style={styles.linhaValor}>
                      {sessao.roupas_encharcadas ? 'Sim' : 'Não'}
                    </Text>
                  </View>
                </>
              )}

              {sessao.volume_urina_ml !== null && (
                <>
                  <View style={styles.divisor} />
                  <View style={styles.linhaRow}>
                    <Text style={styles.linhaChave}>Volume urinário na sessão</Text>
                    <Text style={styles.linhaValor}>{sessao.volume_urina_ml} mL</Text>
                  </View>
                </>
              )}
            </View>

            {/* Card: Bem-estar pós-treino */}
            {(sessao.nivel_fadiga || sessao.sintomas_gastrointestinais) && (
              <View style={styles.card}>
                <Text style={styles.cardTitulo}>Bem-estar pós-treino</Text>

                {sessao.nivel_fadiga !== null && (
                  <>
                    <View style={styles.linhaRow}>
                      <Text style={styles.linhaChave}>Nível de fadiga</Text>
                      <View style={styles.fadigaRow}>
                        {[1,2,3,4,5].map(n => (
                          <View
                            key={n}
                            style={[
                              styles.fadigaDot,
                              n <= (sessao.nivel_fadiga ?? 0) && styles.fadigaDotAtivo,
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.fadigaLegenda}>1 = Sem fadiga · 5 = Exaustão extrema</Text>
                    <View style={styles.divisor} />
                  </>
                )}

                {sessao.sintomas_gastrointestinais && (
                  <View>
                    <Text style={[styles.linhaChave, { marginBottom: 4 }]}>Sintomas gastrointestinais</Text>
                    <Text style={styles.sintomasTexto}>{sessao.sintomas_gastrointestinais}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Botão exportar PDF */}
            <TouchableOpacity
              style={styles.exportBtn}
              activeOpacity={0.85}
              onPress={() => gerarPDFSessao(sessao)}
            >
              <Text style={styles.exportBtnTexto}>Exportar Relatório PDF</Text>
            </TouchableOpacity>
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

  fadigaRow: { flexDirection: 'row', gap: 6 },
  fadigaDot: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  fadigaDotAtivo: { backgroundColor: '#B3151F' },
  fadigaLegenda: { fontSize: 10, color: '#aaa', marginTop: 2 },
  sintomasTexto: { fontSize: 13, color: '#444', lineHeight: 20 },

  exportBtn: {
    backgroundColor: RED,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(179,21,31,0.35)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 12px rgba(179,21,31,0.35)' },
    }),
  },
  exportBtnTexto: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
});
