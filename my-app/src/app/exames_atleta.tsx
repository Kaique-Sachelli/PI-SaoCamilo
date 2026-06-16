import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { NavbarAtleta } from './NavbarAtleta';
import { getUrl } from '../constants/url';

type Exame = {
  id_exame: number;
  tipo_exame: string;
  data_exame: string;
  resultado: string | null;
  status: string;
};

const STATUS_COR: Record<string, string> = {
  Normal: '#2e7d32',
  Atenção: '#e65100',
  Baixo: '#c62828',
};

const STATUS_OPTIONS = ['Normal', 'Atenção', 'Baixo'];

function formatarDataExame(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function dataHoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExamesAtleta() {
  const router = useRouter();
  const { usuario } = useUser();

  const [exames, setExames] = useState<Exame[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [tipoExame, setTipoExame] = useState('');
  const [dataExame, setDataExame] = useState(dataHoje());
  const [resultado, setResultado] = useState('');
  const [statusSel, setStatusSel] = useState('Normal');

  useEffect(() => {
    buscarExames();
  }, [usuario?.id_usuario]);

  async function buscarExames() {
    if (!usuario?.id_usuario) return;
    setCarregando(true);
    try {
      const r = await fetch(getUrl(`/atleta/${usuario.id_usuario}/exames`));
      const data = await r.json();
      if (data.sucesso) setExames(data.exames ?? []);
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }

  function abrirModal() {
    setTipoExame('');
    setDataExame(dataHoje());
    setResultado('');
    setStatusSel('Normal');
    setModalVisivel(true);
  }

  async function salvar() {
    if (!tipoExame.trim()) {
      Alert.alert('Atenção', 'Informe o tipo do exame.');
      return;
    }
    if (!dataExame.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Atenção', 'Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }
    setSalvando(true);
    try {
      const r = await fetch(getUrl(`/atleta/${usuario!.id_usuario}/exames`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_exame: tipoExame.trim(),
          data_exame: dataExame,
          resultado: resultado.trim() || null,
          status: statusSel,
        }),
      });
      const data = await r.json();
      if (data.sucesso) {
        setModalVisivel(false);
        buscarExames();
      } else {
        Alert.alert('Erro', data.mensagem || 'Não foi possível salvar.');
      }
    } catch {
      Alert.alert('Erro', 'Falha na conexão. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

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
          <View style={styles.headerRow}>
            <Text style={styles.headerTitulo}>Meus Exames</Text>
            <TouchableOpacity style={styles.addBtn} onPress={abrirModal}>
              <Text style={styles.addBtnTexto}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSub}>Compartilhados com seu médico</Text>
        </View>

        {carregando ? (
          <ActivityIndicator color={RED} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {exames.length === 0 ? (
              <Text style={styles.vazio}>Nenhum exame registrado ainda.{'\n'}Toque em "+ Adicionar" para incluir um.</Text>
            ) : exames.map((e) => {
              const cor = STATUS_COR[e.status] ?? '#888';
              return (
                <View key={e.id_exame} style={styles.exameCard}>
                  <View style={styles.exameInfo}>
                    <Text style={styles.exameNome}>{e.tipo_exame}</Text>
                    <Text style={styles.exameData}>📅 {formatarDataExame(e.data_exame)}</Text>
                    {e.resultado ? <Text style={styles.exameResultado}>{e.resultado}</Text> : null}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cor + '18', borderColor: cor }]}>
                    <Text style={[styles.statusText, { color: cor }]}>{e.status}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <NavbarAtleta active="historico" />

        {/* Modal Adicionar Exame */}
        <Modal visible={modalVisivel} transparent animationType="slide" onRequestClose={() => setModalVisivel(false)}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setModalVisivel(false)}>
            <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
              <Text style={styles.modalTitulo}>Novo Exame</Text>

              <Text style={styles.label}>Tipo do exame *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Hemograma Completo"
                placeholderTextColor="#aaa"
                value={tipoExame}
                onChangeText={setTipoExame}
              />

              <Text style={styles.label}>Data (AAAA-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-06-15"
                placeholderTextColor="#aaa"
                value={dataExame}
                onChangeText={setDataExame}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Resultado / Observações</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Ex: Dentro dos valores de referência"
                placeholderTextColor="#aaa"
                value={resultado}
                onChangeText={setResultado}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusOpt, statusSel === s && { backgroundColor: (STATUS_COR[s] ?? RED) + '22', borderColor: STATUS_COR[s] ?? RED }]}
                    onPress={() => setStatusSel(s)}
                  >
                    <Text style={[styles.statusOptTexto, statusSel === s && { color: STATUS_COR[s] ?? RED, fontWeight: '700' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalBotoes}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisivel(false)}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnSalvar, salvando && { opacity: 0.7 }]} onPress={salvar} disabled={salvando}>
                  {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSalvarTexto}>Salvar</Text>}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitulo: { color: '#fff', fontSize: 26, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  addBtnTexto: { color: '#fff', fontSize: 14, fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },

  vazio: { textAlign: 'center', color: '#999', fontSize: 14, marginTop: 40, lineHeight: 22 },

  exameCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  exameInfo: { flex: 1, gap: 3 },
  exameNome: { fontSize: 14, fontWeight: '600', color: '#111' },
  exameData: { fontSize: 12, color: '#888' },
  exameResultado: { fontSize: 12, color: '#555', marginTop: 2 },
  statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 8,
    ...Platform.select({
      ios: { boxshadow: '0px -2px 12px rgba(0,0,0,0.15)' },
      android: { elevation: 10 },
      web: { boxshadow: '0px -2px 12px rgba(0,0,0,0.15)' },
    }),
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#fafafa',
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },

  statusRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  statusOpt: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 7,
    alignItems: 'center',
  },
  statusOptTexto: { fontSize: 13, color: '#888' },

  modalBotoes: { flexDirection: 'row', gap: 12, marginTop: 12 },
  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnCancelarTexto: { fontSize: 14, fontWeight: '600', color: '#555' },
  btnSalvar: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSalvarTexto: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
