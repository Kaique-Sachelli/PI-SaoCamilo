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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Aba = 'Sessões' | 'Dieta' | 'Exames';

// ─── Aba Sessões ──────────────────────────────────────────────────────────────
function AbaSessoes() {
  const router = useRouter();

  const [sessoes, setSessoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarSessoes();
  }, []);

  async function buscarSessoes() {
    try {
      const response = await fetch(
        'http://192.168.1.7:3000/atleta/1/sessoes'
      );

      const data = await response.json();

      if (data.sucesso) {
        setSessoes(data.sessoes);
      }
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Carregando sessões...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.abaContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Métricas */}
      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#e53935' }]}>⚡</Text>
          <Text style={styles.metricaValor}>
            {sessoes.length}
          </Text>
          <Text style={styles.metricaLabel}>Sessões</Text>
        </View>

        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#1565c0' }]}>💧</Text>
          <Text style={styles.metricaValor}>
            {sessoes.length > 0
              ? (sessoes[0].volume_ml / 1000).toFixed(1)
              : '0'}
          </Text>
          <Text style={styles.metricaLabel}>Líquidos (L)</Text>
        </View>

        <View style={styles.metricaCard}>
          <Text style={[styles.metricaIcone, { color: '#333' }]}>📊</Text>
          <Text style={styles.metricaValor}>
            {sessoes.length > 0
              ? sessoes[0].percentual_variacao
              : '0'}
            %
          </Text>
          <Text style={styles.metricaLabel}>Última perda</Text>
        </View>
      </View>

      {sessoes.map((s, i) => (
        <TouchableOpacity
          key={s.id_sessao}
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
              {i === 0
                ? 'Última sessão'
                : `Sessão ${s.id_sessao}`}
            </Text>

            <Text style={styles.sessaoSeta}>›</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Data</Text>

            <Text style={styles.detalheValor}>
              {new Date(
                s.data_hora_inicio
              ).toLocaleString('pt-BR')}
            </Text>
          </View>

          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>Duração</Text>

            <Text style={styles.detalheValor}>
              {s.duracao_minutos} min
            </Text>
          </View>

          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>
              Ingestão de líquidos
            </Text>

            <Text style={styles.detalheValor}>
              {s.volume_ml} ml
            </Text>
          </View>

          <View style={styles.detalheRow}>
            <Text style={styles.detalheChave}>
              Perda de peso
            </Text>

            <Text
              style={[
                styles.detalheValor,
                {
                  color: '#2e7d32',
                  fontWeight: '600',
                },
              ]}
            >
              {s.percentual_variacao}%
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {sessoes.length === 0 && (
        <Text style={{ textAlign: 'center' }}>
          Nenhuma sessão encontrada.
        </Text>
      )}
    </ScrollView>
  );
}

// ─── Aba Dieta ────────────────────────────────────────────────────────────────
function AbaDieta() {
  const REFEICOES = [
    { titulo: 'Café da manhã',   horario: '07:00', itens: ['2 ovos mexidos', 'Pão integral (2 fatias)', '1 fruta', 'Café sem açúcar'] },
    { titulo: 'Lanche da manhã', horario: '10:00', itens: ['1 iogurte natural', '1 punhado de castanhas'] },
    { titulo: 'Almoço',          horario: '12:30', itens: ['150g de frango grelhado', 'Arroz integral (4 col.)', 'Feijão (1 concha)', 'Salada verde à vontade'] },
    { titulo: 'Lanche da tarde', horario: '15:30', itens: ['1 banana com pasta de amendoim', '200ml de água de coco'] },
    { titulo: 'Jantar',          horario: '19:00', itens: ['150g de peixe assado', 'Batata-doce (1 média)', 'Legumes refogados'] },
  ];
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Plano Alimentar</Text>
      {REFEICOES.map((r, i) => (
        <View key={i} style={styles.refeicaoCard}>
          <View style={styles.refeicaoTopo}>
            <Text style={styles.refeicaoTitulo}>{r.titulo}</Text>
            <View style={styles.horarioBadge}>
              <Text style={styles.horarioTexto}>⏰ {r.horario}</Text>
            </View>
          </View>
          <View style={styles.divisor} />
          {r.itens.map((item, j) => (
            <View key={j} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <Text style={styles.itemTexto}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Aba Exames ───────────────────────────────────────────────────────────────
function AbaExames({ onBaixar }: { onBaixar: (nome: string) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.abaContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.secaoTitulo}>Exames Recentes</Text>
      {[
        { nome: 'Hemograma Completo', data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
        { nome: 'Glicemia em Jejum',  data: '10/05/2026', status: 'Normal',  cor: '#2e7d32' },
        { nome: 'Colesterol Total',   data: '22/04/2026', status: 'Atenção', cor: '#e65100' },
        { nome: 'Ferritina',          data: '22/04/2026', status: 'Baixo',   cor: '#c62828' },
        { nome: 'Vitamina D',         data: '01/04/2026', status: 'Normal',  cor: '#2e7d32' },
      ].map((e, i) => (
        <TouchableOpacity key={i} style={styles.exameCard} activeOpacity={0.75} onPress={() => onBaixar(e.nome)}>
          <View style={styles.exameInfo}>
            <Text style={styles.exameNome}>{e.nome}</Text>
            <Text style={styles.exameData}>📅 {e.data}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: e.cor + '18', borderColor: e.cor }]}>
            <Text style={[styles.statusText, { color: e.cor }]}>{e.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SessoesMedico() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const tabInicial = (params.tab as Aba) || 'Sessões';
  const [abaAtiva, setAbaAtiva] = useState<Aba>(tabInicial);
  const [exameSelecionado, setExameSelecionado] = useState<string | null>(null);

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
            <Text style={styles.nomeAtleta}>Atleta (Kacique)</Text>
            <TouchableOpacity 
            onPress={() => router.push('/perfil_atleta_medico')} 
            activeOpacity={0.8}>
              <Image
                source={require('./assets/Img/marcus.jpg')}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsContainer}>
            {(['Sessões', 'Dieta', 'Exames'] as Aba[]).map((aba) => (
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
          {abaAtiva === 'Sessões' && <AbaSessoes />}
          {abaAtiva === 'Dieta'   && <AbaDieta />}
          {abaAtiva === 'Exames'  && <AbaExames onBaixar={(nome) => setExameSelecionado(nome)} />}
        </View>

        {/* ── Modal de confirmação de download ── */}
        <Modal
          visible={exameSelecionado !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setExameSelecionado(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setExameSelecionado(null)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitulo}>Baixar Exame</Text>
              <Text style={styles.modalMensagem}>
                Deseja baixar o exame{'\n'}
                <Text style={styles.modalNomeExame}>{exameSelecionado}</Text>?
              </Text>
              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.modalBtnCancelar}
                  onPress={() => setExameSelecionado(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalBtnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtnBaixar}
                  onPress={() => setExameSelecionado(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalBtnBaixarTexto}>Baixar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

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

  // Dieta
  refeicaoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 8,
    ...Platform.select({ ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' }, android: { elevation: 2 }, web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' } }),
  },
  refeicaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refeicaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },
  horarioBadge: { backgroundColor: '#fff3e0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  horarioTexto: { fontSize: 12, color: '#e65100', fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: RED },
  itemTexto: { fontSize: 13, color: '#444' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
    ...Platform.select({ ios: { boxshadow: '0px 4px 12px rgba(0,0,0,0.2)' }, android: { elevation: 8 }, web: { boxshadow: '0px 4px 12px rgba(0,0,0,0.2)' } }),
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#111' },
  modalMensagem: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22 },
  modalNomeExame: { fontWeight: '700', color: '#111' },
  modalBotoes: { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnCancelar: {
    flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20,
    paddingVertical: 10, alignItems: 'center',
  },
  modalBtnCancelarTexto: { fontSize: 14, fontWeight: '600', color: '#555' },
  modalBtnBaixar: {
    flex: 1, backgroundColor: RED, borderRadius: 20,
    paddingVertical: 10, alignItems: 'center',
  },
  modalBtnBaixarTexto: { fontSize: 14, fontWeight: '700', color: '#fff' },

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
