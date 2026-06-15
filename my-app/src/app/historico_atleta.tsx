import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NavbarAtleta } from './NavbarAtleta';

type Aba = 'Sessões' | 'Exames';

const SESSOES = [
  {
    id: 1,
    data: 'Ontem, 18:30',
    tipo: 'Corrida intervalar',
    status: 'Hidratação OK',
    statusOk: true,
    sudorese: '1.2 L/h',
    perdaPeso: '1.8kg',
    perdaPerc: '-1.5%',
  },
  {
    id: 2,
    data: '08/05, 17:00',
    tipo: 'Treino de força',
    status: 'Atenção',
    statusOk: false,
    sudorese: '0.9 L/h',
    perdaPeso: '1.2kg',
    perdaPerc: '-1.1%',
  },
];

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const DIAS_SEMANA = ['Do','Se','Te','Qu','Qu','Se','Sá'];

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

// ─── Aba Sessões ──────────────────────────────────────────────────────────────
function AbaSessoes({
  calVisible,
  setCalVisible,
  dataSel,
  setDataSel,
}: {
  calVisible: boolean;
  setCalVisible: (v: boolean) => void;
  dataSel: string;
  setDataSel: (d: string) => void;
}) {
  const [busca, setBusca] = useState('');

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Cards de métricas topo */}
      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <View style={styles.metricaHeader}>
            <Text style={styles.metricaIcone}>📈</Text>
            <Text style={styles.metricaRotulo}>Taxa média</Text>
          </View>
          <Text style={styles.metricaValorGrande}>1.09</Text>
          <Text style={styles.metricaUnidade}>L/h</Text>
        </View>
        <View style={styles.metricaCard}>
          <View style={styles.metricaHeader}>
            <Text style={styles.metricaIcone}>📅</Text>
            <Text style={styles.metricaRotulo}>Perda média</Text>
          </View>
          <Text style={styles.metricaValorGrande}>1.7%</Text>
          <Text style={styles.metricaUnidade}>Peso corporal</Text>
        </View>
      </View>

      {/* Taxa de Sudorese & Intensidade */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Taxa de Sudorese & Intensidade</Text>
        <View style={styles.barraRow}>
          <Text style={styles.barraData}>11/04</Text>
          <View style={styles.barraTrack}>
            <View style={[styles.barraBaixa, { flex: 0.3 }]} />
            <View style={[styles.barraMedia, { flex: 0.4 }]} />
            <View style={[styles.barraAlta, { flex: 0.3 }]} />
          </View>
          <Text style={styles.barraDur}>67min</Text>
        </View>
        <View style={styles.barraRow}>
          <Text style={styles.barraData}>08/05</Text>
          <View style={styles.barraTrack}>
            <View style={[styles.barraBaixa, { flex: 0.5 }]} />
            <View style={[styles.barraMedia, { flex: 0.35 }]} />
            <View style={[styles.barraAlta, { flex: 0.15 }]} />
          </View>
          <Text style={styles.barraDur}>53min</Text>
        </View>
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
      </View>

      {/* Sessões Recentes */}
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
            placeholder="Nome:"
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

        <Text style={styles.ultimaSessaoLabel}>Última sessão</Text>

        {SESSOES.map((s) => (
          <View key={s.id} style={styles.sessaoCard}>
            <View style={styles.sessaoTopRow}>
              <Text style={styles.sessaoDataTexto}>{s.data}</Text>
              <View style={[styles.statusBadge, s.statusOk ? styles.statusOk : styles.statusAtencao]}>
                <Text style={[styles.statusText, s.statusOk ? styles.statusOkText : styles.statusAtencaoText]}>
                  {s.status}
                </Text>
              </View>
            </View>
            <Text style={styles.sessaoNome}>{s.tipo}</Text>
            <View style={styles.sessaoMetricasRow}>
              <View style={styles.sessaoMetrica}>
                <Text style={styles.sessaoMetricaLabel}>Taxa de sudorese</Text>
                <Text style={styles.sessaoMetricaValor}>{s.sudorese}</Text>
              </View>
              <View style={styles.sessaoMetrica}>
                <Text style={styles.sessaoMetricaLabel}>Perda de peso</Text>
                <Text style={styles.sessaoMetricaValor}>{s.perdaPeso}</Text>
              </View>
              <View style={styles.sessaoMetrica}>
                <Text style={styles.sessaoMetricaLabel}>Perda de peso</Text>
                <Text style={[styles.sessaoMetricaValor, { color: '#e53935' }]}>{s.perdaPerc}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Exportar Relatório */}
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
  );
}

// ─── Aba Exames ───────────────────────────────────────────────────────────────
function AbaExames() {
  const [arquivoAdicionado, setArquivoAdicionado] = useState(false);

  const handleAdicionarArquivo = () => {
    Alert.alert(
      'Adicionar arquivo',
      'Escolha uma opção',
      [
        { text: 'Galeria de fotos',  onPress: () => setArquivoAdicionado(true) },
        { text: 'Documentos (PDF)', onPress: () => setArquivoAdicionado(true) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleEnviar = () => {
    if (!arquivoAdicionado) {
      Alert.alert('Atenção', 'Adicione um arquivo antes de enviar.');
      return;
    }
    Alert.alert('Sucesso', 'Exame enviado com sucesso!', [
      { text: 'OK', onPress: () => setArquivoAdicionado(false) },
    ]);
  };

  return (
    <View style={styles.examesContainer}>
      <Text style={styles.examesTitulo}>Adicione seus exames de sangue aqui:</Text>

      <TouchableOpacity
        style={[styles.uploadCard, arquivoAdicionado && styles.uploadCardOk]}
        activeOpacity={0.8}
        onPress={handleAdicionarArquivo}
      >
        {arquivoAdicionado ? (
          <View style={styles.arquivoOkWrap}>
            <Text style={styles.arquivoOkIcone}>✅</Text>
            <Text style={styles.arquivoOkTexto}>Arquivo adicionado</Text>
            <Text style={styles.arquivoOkSub}>Toque para substituir</Text>
          </View>
        ) : (
          <Text style={styles.maisIcone}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnEnviar}
        activeOpacity={0.85}
        onPress={handleEnviar}
      >
        <Text style={styles.btnEnviarTexto}>Enviar  ›</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function HistoricoAtleta() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<Aba>('Sessões');
  const [calVisible, setCalVisible] = useState(false);
  const [dataSel, setDataSel] = useState('');

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header com tabs */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Histórico Longitudinal</Text>

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

        {/* Conteúdo da aba */}
        <View style={styles.content}>
          {abaAtiva === 'Sessões' && (
            <AbaSessoes
              calVisible={calVisible}
              setCalVisible={setCalVisible}
              dataSel={dataSel}
              setDataSel={setDataSel}
            />
          )}
          {abaAtiva === 'Exames' && <AbaExames />}
        </View>

        {/* Bottom Nav */}
        <NavbarAtleta active="historico" />

        {/* Modal calendário */}
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
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // Header
  header: {
    backgroundColor: RED,
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 14,
  },
  headerTitulo: { color: '#ffffff', fontSize: 24, fontWeight: '700' },

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

  // Barras intensidade
  barraRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barraData: { fontSize: 12, color: '#888', width: 36 },
  barraTrack: { flex: 1, flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' },
  barraBaixa: { backgroundColor: '#90caf9', height: '100%' },
  barraMedia: { backgroundColor: '#ffb74d', height: '100%' },
  barraAlta: { backgroundColor: '#e53935', height: '100%' },
  barraDur: { fontSize: 12, color: '#888', width: 36, textAlign: 'right' },
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

  sessaoCard: {
    borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 12,
    padding: 12, gap: 6,
  },
  sessaoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessaoDataTexto: { fontSize: 12, color: '#888' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  statusOk: { backgroundColor: '#e8f5e9' },
  statusAtencao: { backgroundColor: '#fff3e0' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusOkText: { color: '#2e7d32' },
  statusAtencaoText: { color: '#e65100' },
  sessaoNome: { fontSize: 16, fontWeight: '700', color: '#111' },
  sessaoMetricasRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sessaoMetrica: { gap: 2 },
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

  // Exames
  examesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  examesTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  // Upload
  uploadCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RED,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
    }),
  },
  uploadCardOk: { borderColor: '#22c55e' },
  maisIcone: { fontSize: 72, color: RED, fontWeight: '300', lineHeight: 80 },
  arquivoOkWrap: { alignItems: 'center', gap: 8 },
  arquivoOkIcone: { fontSize: 48 },
  arquivoOkTexto: { fontSize: 18, fontWeight: '700', color: RED },
  arquivoOkSub: { fontSize: 13, color: '#888' },
  btnEnviar: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
    }),
  },
  btnEnviarTexto: { fontSize: 18, fontWeight: '700', color: RED, letterSpacing: 0.5 },

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
