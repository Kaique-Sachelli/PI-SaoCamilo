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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUrl } from '../constants/url';

type Aba = 'Sessões' | 'Exames';

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

// ─── Aba Sessões ──────────────────────────────────────────────────────────────
function AbaSessoes({ atletaId }: { atletaId?: string }) {
  const router = useRouter();

  const [sessoes, setSessoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!atletaId) {
      setError('ID do atleta não informado.');
      setLoading(false);
      return;
    }
    fetch(getUrl(`/atleta/${atletaId}/sessoes`))
      .then(r => r.json())
      .then(data => { if (data.sucesso) setSessoes(data.sessoes ?? []); else setError(data.mensagem || 'Erro ao buscar sessões.'); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [atletaId]);

  const agora = Date.now();
  const semanaMs = 7 * 24 * 60 * 60 * 1000;
  const sessoesNaSemana = sessoes.filter(s => agora - new Date(s.data_hora_inicio).getTime() <= semanaMs).length;
  const sessoesComLiquido = sessoes.filter(s => Number(s.volume_ml) > 0);
  const liquidoMedio = sessoesComLiquido.length > 0
    ? sessoesComLiquido.reduce((acc, s) => acc + Number(s.volume_ml), 0) / sessoesComLiquido.length / 1000
    : null;
  const sessoesComPerda = sessoes.filter(s => s.percentual_variacao != null);
  const perdaMedia = sessoesComPerda.length > 0
    ? sessoesComPerda.reduce((acc, s) => acc + Math.abs(Number(s.percentual_variacao)), 0) / sessoesComPerda.length
    : null;

  if (loading) return <ActivityIndicator color="#B3151F" style={{ marginTop: 40 }} />;
  if (error) return <View style={{ padding: 20 }}><Text style={{ color: '#B3151F' }}>{error}</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#e53935' }]}>⚡</Text>
          <Text style={styles.metricaValor}>{sessoesNaSemana}</Text>
          <Text style={styles.metricaLabel}>Sessões/Semana</Text>
        </View>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#1565c0' }]}>💧</Text>
          <Text style={styles.metricaValor}>{liquidoMedio != null ? liquidoMedio.toFixed(1) : 'N/D'}</Text>
          <Text style={styles.metricaLabel}>L médio</Text>
        </View>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#333' }]}>📊</Text>
          <Text style={styles.metricaValor}>{perdaMedia != null ? `${perdaMedia.toFixed(1)}%` : 'N/D'}</Text>
          <Text style={styles.metricaLabel}>Perda média</Text>
        </View>
      </View>

      {sessoes.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#999', marginTop: 24 }}>Nenhuma sessão registrada.</Text>
      ) : sessoes.map((s, i) => (
        <TouchableOpacity
          key={s.id_sessao}
          style={styles.sessaoCard}
          activeOpacity={0.75}
          onPress={() => router.push({ pathname: '/sessao_selecionada', params: { id: String(s.id_sessao) } })}
        >
          <View style={styles.sessaoTopo}>
            <Text style={styles.sessaoLabel}>{i === 0 ? 'Última sessão' : `Sessão ${sessoes.length - i}`}</Text>
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
            <Text style={[styles.detalheValor, { color: '#2e7d32', fontWeight: '600' }]}>
              {s.percentual_variacao != null ? `${Math.abs(Number(s.percentual_variacao)).toFixed(1)}%` : 'N/D'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Aba Exames ───────────────────────────────────────────────────────────────
function AbaExames() {
  const EXAMES = [
    { nome: 'Hemograma Completo', data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
    { nome: 'Glicemia em Jejum',  data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
    { nome: 'Colesterol Total',   data: '22/04/2026', status: 'Atenção', cor: '#e65100' },
    { nome: 'Ferritina',          data: '22/04/2026', status: 'Baixo',   cor: '#c62828' },
    { nome: 'Vitamina D',         data: '01/04/2026', status: 'Normal',  cor: '#2e7d32' },
  ];
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Exames Recentes</Text>
      {EXAMES.map((e, i) => (
        <View key={i} style={styles.exameCard}>
          <View style={styles.exameInfo}>
            <Text style={styles.exameNome}>{e.nome}</Text>
            <Text style={styles.exameData}>📅 {e.data}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: e.cor + '18', borderColor: e.cor }]}>
            <Text style={[styles.statusText, { color: e.cor }]}>{e.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SessoesMedico() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id_atleta?: string; nome?: string }>();
  const tabInicial: Aba = 'Sessões';
  const atletaId = params.id_atleta;
  const nomeAtleta = params.nome || 'Atleta';
  const [abaAtiva, setAbaAtiva] = useState<Aba>(tabInicial);

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Header com tabs ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <View style={styles.headerNomeRow}>
            <Text style={styles.nomeAtleta}>{nomeAtleta}</Text>
            <TouchableOpacity 
            onPress={() => router.push({ pathname: '/perfil_atleta_medico', params: { nome: nomeAtleta } })} 
            activeOpacity={0.8}>
              <Image
                source={require('./assets/Img/marcus.jpg')}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsContainer}>
            {(['Sessões', 'Exames'] as Aba[]).map((aba) => (
              <TouchableOpacity
                key={aba}
                style={[styles.tab, abaAtiva === aba && styles.tabAtiva]}
                onPress={() => setAbaAtiva(aba)}
              >
                <Text style={[styles.tabTexto, abaAtiva === aba && styles.tabTextoAtivo]}>
                  {aba}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Conteúdo central — troca sem navegar ── */}
        <View style={styles.content}>
          {abaAtiva === 'Sessões' && <AbaSessoes atletaId={atletaId} />}
          {abaAtiva === 'Exames'  && <AbaExames />}
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
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerNomeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  nomeAtleta: { color: '#fff', fontSize: 26, fontWeight: '700' },
  avatarImg: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: '#fff' },

  // Tabs
  tabsContainer: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tab: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 25 },
  tabAtiva: { backgroundColor: '#D9D9D9' },
  tabTexto: { fontSize: 14, color: '#B0B0B0', fontWeight: '500' },
  tabTextoAtivo: { color: RED, fontWeight: '700', fontSize: 14 },

  // Content
  content: { flex: 1 },
  abaContent: { padding: 16, gap: 12, paddingBottom: 24 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },

  // Sessões
  metricasRow: { flexDirection: 'row', gap: 10 },
  metricaCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 12, alignItems: 'center', gap: 4,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' } }),
  },
  metricaIcone: { fontSize: 20 },
  metricaValor: { fontSize: 22, fontWeight: '700', color: '#111' },
  metricaLabel: { fontSize: 10, color: '#888', textAlign: 'center' },
  sessaoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 8,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  sessaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessaoLabel: { fontSize: 16, fontWeight: '700', color: RED },
  sessaoSeta: { fontSize: 22, color: '#ccc' },
  divisor: { height: 1, backgroundColor: '#f0f0f0' },
  detalheRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detalheChave: { fontSize: 13, color: '#999' },
  detalheValor: { fontSize: 13, color: '#222', fontWeight: '500' },

  // Exames
  exameCard: {
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  exameInfo: { flex: 1, gap: 3 },
  exameNome: { fontSize: 14, fontWeight: '600', color: '#111' },
  exameData: { fontSize: 12, color: '#888' },
  statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
