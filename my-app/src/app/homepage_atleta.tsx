import { useState, useEffect } from 'react';
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
import { NavbarAtleta } from './NavbarAtleta';
import { useUser } from '../context/UserContext';
import { getUrl } from '../constants/url';
import * as Location from 'expo-location';

type ClimaData = {
  temp: number;
  sensacao: number;
  umidade: number;
  vento: number;
  descricao: string;
};

function iconeClima(descricao: string): string {
  const d = descricao.toLowerCase();
  if (d.includes('trovoa') || d.includes('thunder')) return '⛈';
  if (d.includes('chuva') || d.includes('rain') || d.includes('chuvisco')) return '🌧';
  if (d.includes('neve') || d.includes('snow')) return '❄️';
  if (d.includes('névoa') || d.includes('nevoeiro') || d.includes('mist') || d.includes('fog')) return '🌫';
  if (d.includes('nublado') || d.includes('cloud') || d.includes('nuvens') || d.includes('encoberto')) return '🌥';
  return '☀️';
}

const HORAS_GRAFICO = ['11:00','14:00','17:00','20:00','23:00','02:00','05:00','08:00'];

type UltimaSessao = {
  id_sessao: number;
  data_hora_inicio: string;
  duracao_minutos: number;
  massa_pre: number;
  massa_pos: number;
  taxa_sudorese: number;
  perda_massa_ajustada: number;
  percentual_variacao: number;
  status_color: 'Verde' | 'Amarelo' | 'Vermelho';
  alerta_seguranca: string | null;
};

export default function HomepageAtleta() {
  const router = useRouter();
  const { usuario } = useUser();
  const [ultimaSessao, setUltimaSessao] = useState<UltimaSessao | null>(null);
  const [clima, setClima] = useState<ClimaData | null>(null);

  useEffect(() => {
    async function fetchClima() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let lat = -23.5505;
        let lon = -46.6333;
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
        }
        const r = await fetch(getUrl(`/clima?lat=${lat}&lon=${lon}`));
        const data = await r.json();
        if (data.sucesso) setClima(data.clima);
      } catch (err) {
        console.error('Erro ao buscar clima:', err);
      }
    }
    fetchClima();
  }, []);

  useEffect(() => {
    if (!usuario?.id_usuario) return;
    fetch(getUrl(`/atleta/${usuario.id_usuario}/ultima-sessao`))
      .then(r => r.json())
      .then(data => {
        console.log('ultima-sessao resposta id_sessao:', data?.sessao?.id_sessao);
        if (data.sucesso && data.sessao) {
          const s = data.sessao;
          setUltimaSessao({
            ...s,
            taxa_sudorese: parseFloat(s.taxa_sudorese ?? 0),
            perda_massa_ajustada: parseFloat(s.perda_massa_ajustada ?? 0),
            percentual_variacao: parseFloat(s.percentual_variacao ?? 0),
          });
        }
      })
      .catch(err => console.error('ultima-sessao erro:', err));
  }, [usuario?.id_usuario]);

  const formatarData = (iso: string) => {
    const data = new Date(iso);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (data.toDateString() === hoje.toDateString()) return `Hoje, ${hora}`;
    if (data.toDateString() === ontem.toDateString()) return `Ontem, ${hora}`;
    return data.toLocaleDateString('pt-BR') + `, ${hora}`;
  };

  const badgeSessao = {
    Verde:    { texto: 'Hidratação OK',  cor: '#22c55e' },
    Amarelo:  { texto: 'Atenção',        cor: '#f59e0b' },
    Vermelho: { texto: 'Alerta',         cor: '#ef4444' },
  };

  const agora = new Date();
  const diaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const pontos = clima ? Array(12).fill(clima.temp) : [22, 21, 20, 19, 19, 19, 19, 19, 19, 19, 19, 19];
  const maxVal = Math.max(...pontos);
  const minVal = Math.min(...pontos);
  const range  = maxVal - minVal || 1;

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
            <View>
              <Text style={styles.titulo}>HIDRA PRO-FORMANCE</Text>
            </View>
          </View>
            <Text style={styles.funcao}>Olá, {usuario?.nome}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Última sessão ── */}
          <Text style={styles.secaoLabel}>Última sessão</Text>

          {ultimaSessao ? (
            <TouchableOpacity
              style={styles.sessaoCard}
              activeOpacity={0.75}
              onPress={() => router.push({ pathname: '/sessao_selecionada', params: { id: ultimaSessao.id_sessao } })}
            >
              <View style={styles.sessaoTopo}>
                <Text style={styles.sessaoData}>Treino  {formatarData(ultimaSessao.data_hora_inicio)}</Text>
                <View style={[styles.hidratacaoOkBadge, { backgroundColor: (badgeSessao[ultimaSessao.status_color] ?? badgeSessao['Verde']).cor + '22', borderColor: (badgeSessao[ultimaSessao.status_color] ?? badgeSessao['Verde']).cor }]}>
                  <Text style={[styles.hidratacaoOkTexto, { color: (badgeSessao[ultimaSessao.status_color] ?? badgeSessao['Verde']).cor }]}>
                    {(badgeSessao[ultimaSessao.status_color] ?? badgeSessao['Verde']).texto}
                  </Text>
                </View>
              </View>

              <Text style={styles.sessaoNome}>Sessão de Treino</Text>

              <View style={styles.metricasRow}>
                <View style={styles.metricaItem}>
                  <Text style={styles.metricaLabel}>Taxa de sudorese</Text>
                  <Text style={styles.metricaValor}>{ultimaSessao.taxa_sudorese?.toFixed(1)} <Text style={styles.metricaUnidade}>L/h</Text></Text>
                </View>
                <View style={styles.metricaItem}>
                  <Text style={styles.metricaLabel}>Perda ajustada</Text>
                  <Text style={styles.metricaValor}>{ultimaSessao.perda_massa_ajustada?.toFixed(2)}<Text style={styles.metricaUnidade}>L</Text></Text>
                </View>
                <View style={styles.metricaItem}>
                  <Text style={styles.metricaLabel}>Variação de massa</Text>
                  <Text style={[styles.metricaValor, {
                    color: ultimaSessao.percentual_variacao < 0 ? '#ef4444'
                      : ultimaSessao.percentual_variacao < 2 ? '#22c55e'
                      : ultimaSessao.percentual_variacao <= 3 ? '#f59e0b'
                      : '#ef4444'
                  }]}>
                    {ultimaSessao.percentual_variacao?.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.sessaoCard}>
              <Text style={{ color: '#888', textAlign: 'center', paddingVertical: 16 }}>Nenhuma sessão registrada ainda</Text>
            </View>
          )}

          {/* ── Card Clima ── */}
          <View style={styles.climaCard}>
            {/* Topo clima */}
            <View style={styles.climaTopo}>
              <View style={styles.climaEsquerda}>
                <Text style={styles.climaNuvem}>{iconeClima(clima?.descricao ?? '')}</Text>
                <View>
                  <Text style={styles.climaTemp}>{clima?.temp ?? '--'}°C</Text>
                  <Text style={styles.climaDetalhes}>Sensação: {clima?.sensacao ?? '--'}°C</Text>
                  <Text style={styles.climaDetalhes}>Umidade: {clima?.umidade ?? '--'}%</Text>
                  <Text style={styles.climaDetalhes}>Vento: {clima?.vento ?? '--'} km/h</Text>
                </View>
              </View>
              <View style={styles.climaDireita}>
                <Text style={styles.climaTitulo}>Clima</Text>
                <Text style={styles.climaDiaSemana}>{diaSemana}, {hora}</Text>
                <Text style={styles.climaDescricao}>{clima?.descricao ?? 'Carregando...'}</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.climaTabs}>
              {['Temperatura', 'Umidade', 'Vento'].map((tab, i) => (
                <TouchableOpacity key={tab} style={[styles.climaTab, i === 0 && styles.climaTabAtivo]}>
                  <Text style={[styles.climaTabTexto, i === 0 && styles.climaTabTextoAtivo]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gráfico de temperatura (barras como sparkline) */}
            <View style={styles.graficoWrap}>
              {pontos.map((v, i) => {
                const altura = ((v - minVal) / range) * 28 + 8;
                return (
                  <View key={i} style={styles.graficoColunaWrap}>
                    <View style={[styles.graficoColuna, { height: altura }]} />
                  </View>
                );
              })}
            </View>

            {/* Horas */}
            <View style={styles.horasRow}>
              {HORAS_GRAFICO.map((h, i) => (
                <Text key={i} style={styles.horaTexto}>{h}</Text>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnTreinar}
            activeOpacity={0.85}
            onPress={() => router.push(
              `/checklist-pre-sessao?clima_temp=${clima?.temp ?? 24}&clima_umidade=${clima?.umidade ?? 27}&clima_vento=${clima?.vento ?? 0}&clima_sensacao=${clima?.sensacao ?? 24}`
            )}
          >
            <Text style={styles.btnTreinarTexto}>PRONTO PARA TREINAR?</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <NavbarAtleta active="home" />

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
    paddingTop: 12,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titulo: { fontSize: 20, color: '#fff', fontWeight: '700' },
  subtitulo: { fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: '300', marginTop: 2 },
  sinoWrap: { position: 'relative', marginTop: 4 },
  sino: { width: 28, height: 28, tintColor: '#fff' },
  sinoDot: {
    position: 'absolute', top: 0, right: 0,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#FF9800',
    borderWidth: 1.5, borderColor: RED,
  },
  funcao: { fontSize: 26, color: '#fff', fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 24 },

  secaoLabel: { fontSize: 16, fontWeight: '600', color: '#222' },

  // Sessão card
  sessaoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  sessaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessaoData: { fontSize: 13, color: '#888' },
  hidratacaoOkBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  hidratacaoOkTexto: { fontSize: 12, color: '#15803d', fontWeight: '600' },
  sessaoNome: { fontSize: 20, fontWeight: '700', color: '#111' },
  metricasRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  metricaItem: { gap: 2 },
  metricaLabel: { fontSize: 11, color: '#999' },
  metricaValor: { fontSize: 16, fontWeight: '700', color: '#111' },
  metricaUnidade: { fontSize: 11, fontWeight: '400', color: '#888' },

  // Clima card
  climaCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.2)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.2)' },
    }),
  },
  climaTopo: { flexDirection: 'row', justifyContent: 'space-between' },
  climaEsquerda: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  climaNuvem: { fontSize: 36, marginTop: 2 },
  climaTemp: { fontSize: 28, fontWeight: '700', color: '#fff' },
  climaDetalhes: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  climaDireita: { alignItems: 'flex-end', gap: 2 },
  climaTitulo: { fontSize: 14, fontWeight: '700', color: '#fff' },
  climaDiaSemana: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  climaDescricao: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  // Tabs clima
  climaTabs: { flexDirection: 'row', gap: 16 },
  climaTab: { paddingBottom: 4 },
  climaTabAtivo: { borderBottomWidth: 2, borderBottomColor: '#fff' },
  climaTabTexto: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  climaTabTextoAtivo: { color: '#fff', fontWeight: '700' },

  // Gráfico
  graficoWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 44,
    gap: 2,
  },
  graficoColunaWrap: { flex: 1, justifyContent: 'flex-end' },
  graficoColuna: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    width: '100%',
  },
  horasRow: { flexDirection: 'row', justifyContent: 'space-between' },
  horaTexto: { fontSize: 9, color: 'rgba(255,255,255,0.45)' },

  // Botão treinar
  btnTreinar: {
    backgroundColor: '#22c55e',
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(34,197,94,0.4)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 12px rgba(34,197,94,0.4)' },
    }),
  },
  btnTreinarTexto: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 1 },

});
