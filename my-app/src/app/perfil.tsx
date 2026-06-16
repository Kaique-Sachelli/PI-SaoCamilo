import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NavbarAtleta } from './NavbarAtleta';
import { useUser } from '../context/UserContext';
import { getUrl } from '../constants/url';

interface PesoData {
  peso: number;
}

interface AlturaData {
  altura: number;
}

function formatarNascimento(dataStr: string | undefined): string {
  if (!dataStr) return '--';
  const d = new Date(dataStr);
  if (isNaN(d.getTime())) return dataStr;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout } = useUser();
  const [peso, setPeso] = useState<number | null>(null);
  const [altura, setAltura] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pesoEdit, setPesoEdit] = useState('');
  const [alturaEdit, setAlturaEdit] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSair = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  useEffect(() => {
    if (usuario?.id_usuario) {
      fetchPeso();
      fetchAltura();
    }
  }, [usuario?.id_usuario]);

  async function fetchPeso() {
    try {
      const response = await fetch(getUrl(`/peso/${usuario?.id_usuario}`));
        
      if (!response.ok) {
        throw new Error('Erro ao buscar o peso do atleta');
      }

      const data: PesoData = await response.json();

      setPeso(data.peso);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAltura() {
    try {
      const response = await fetch(getUrl(`/altura/${usuario?.id_usuario}`));

      if (!response.ok) {
        throw new Error('Erro ao buscar a altura do atleta');
      }

      const data: AlturaData = await response.json();

      setAltura(data.altura);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function abrirModal() {
    setPesoEdit(peso != null ? String(peso) : '');
    setAlturaEdit(altura != null ? String(altura) : '');
    setModalVisivel(true);
  }

  async function salvarMedidas() {
    const pesoNum = pesoEdit ? parseFloat(pesoEdit.replace(',', '.')) : null;
    const alturaNum = alturaEdit ? parseFloat(alturaEdit.replace(',', '.')) : null;
    if (pesoEdit && isNaN(pesoNum!)) { Alert.alert('Erro', 'Peso inválido'); return; }
    if (alturaEdit && isNaN(alturaNum!)) { Alert.alert('Erro', 'Altura inválida'); return; }
    setSalvando(true);
    try {
      const resp = await fetch(getUrl(`/atleta/${usuario?.id_usuario}/medidas`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peso: pesoNum, altura: alturaNum }),
      });
      if (!resp.ok) throw new Error('Falha ao salvar');
      setPeso(pesoNum);
      setAltura(alturaNum);
      setModalVisivel(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão.');
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

        {/* ── Header ── */}
        <View style={styles.header}>
          {/* Avatar centralizado */}
          <View style={styles.avatarWrap}>
            <Image source={require('./assets/Img/marcus.jpg')} style={styles.avatar} />
          </View>

          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.posicao}>{usuario?.tipo_perfil}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

        {/* ── Conteúdo ── */}
        <View style={styles.conteudo}>

          {/* Card Informações Pessoais */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Informações Pessoais</Text>

            <View style={styles.linhaInfo}>
              <Image source={require('./assets/Img/email.png')} style={styles.icone} />
              <View style={styles.linhaTextos}>
                <Text style={styles.linhaLabel}>E-mail</Text>
                <Text style={styles.linhaValor} numberOfLines={1} adjustsFontSizeToFit>
                  {usuario?.email ?? '--'}
                </Text>
              </View>
            </View>

            <View style={styles.linhaInfo}>
              <Image source={require('./assets/Img/telefone.png')} style={styles.icone} />
              <View style={styles.linhaTextos}>
                <Text style={styles.linhaLabel}>Telefone</Text>
                <Text style={styles.linhaValor}>+55 {usuario?.telefone ?? '--'}</Text>
              </View>
            </View>

            <View style={styles.linhaInfo}>
              <Image source={require('./assets/Img/idade.png')} style={styles.icone} />
              <View style={styles.linhaTextos}>
                <Text style={styles.linhaLabel}>Data de nascimento</Text>
                <Text style={styles.linhaValor}>
                  {formatarNascimento(usuario?.data_nascimento)}
                </Text>
              </View>
            </View>
          </View>

          {/* Card Perfil Atlético */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <Text style={styles.cardTitulo}>Perfil Atlético</Text>
              <TouchableOpacity onPress={abrirModal} style={styles.editarBtn}>
                <Text style={styles.editarTexto}>Editar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.atleticoRow}>
              <View style={styles.atleticoItem}>
                <Image source={require('./assets/Img/batimento.png')} style={styles.atleticoIcone} />
                <Text style={styles.atleticoLabel}>Altura</Text>
                <Text style={styles.atleticoValor}>
                  {altura != null ? `${Number(altura).toFixed(2)} m` : '--'}
                </Text>
              </View>
              <View style={styles.atleticoItem}>
                <Image source={require('./assets/Img/batimento.png')} style={styles.atleticoIcone} />
                <Text style={styles.atleticoLabel}>Peso</Text>
                <Text style={styles.atleticoValor}>
                  {peso != null ? `${Number(peso).toFixed(1)} kg` : '--'}
                </Text>
              </View>
            </View>
          </View>

          {/* Modal editar medidas */}
          <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
            <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitulo}>Atualizar medidas</Text>

                <Text style={styles.modalLabel}>Altura (m)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: 1.75"
                  placeholderTextColor="#aaa"
                  keyboardType="decimal-pad"
                  value={alturaEdit}
                  onChangeText={setAlturaEdit}
                />

                <Text style={styles.modalLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: 72.5"
                  placeholderTextColor="#aaa"
                  keyboardType="decimal-pad"
                  value={pesoEdit}
                  onChangeText={setPesoEdit}
                />

                <View style={styles.modalBotoes}>
                  <TouchableOpacity style={styles.modalBtnCancelar} onPress={() => setModalVisivel(false)}>
                    <Text style={styles.modalBtnCancelarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtnSalvar} onPress={salvarMedidas} disabled={salvando}>
                    <Text style={styles.modalBtnSalvarTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Espaçador */}
          <View style={{ flex: 1 }} />

          {/* Botão Sair */}
          <TouchableOpacity 
            style={styles.btnSair} 
            onPress={() => { logout(); router.push('/login')}} 
            activeOpacity={0.8}
          >
            <Text style={styles.btnSairIcone}>↪</Text>
            <Text style={styles.btnSairTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
        <NavbarAtleta active="perfil" />

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
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  avatarWrap: {
    marginTop: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0,0,0,0.3)' },
      android: { elevation: 6 },
      web: { boxshadow: '0px 4px 12px rgba(0,0,0,0.3)' },
    }),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nome: { fontSize: 22, color: '#fff', fontWeight: '700', marginBottom: 4 },
  posicao: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '400' },

  // Conteúdo
  conteudo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  cardTitulo: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 2 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 24 },
  
  // Linhas informações
  linhaInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: { width: 28, height: 28, resizeMode: 'contain', flexShrink: 0 },
  linhaTextos: { flex: 1 },
  linhaLabel: { fontSize: 12, color: '#888', marginBottom: 1 },
  linhaValor: { fontSize: 15, fontWeight: '500', color: '#111' },

  // Card título com botão editar
  cardTituloRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  editarBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1.5, borderColor: RED },
  editarTexto: { fontSize: 13, color: RED, fontWeight: '600' },

  // Perfil atlético
  atleticoRow: { flexDirection: 'row', gap: 12 },
  atleticoItem: {
    flex: 1,
    backgroundColor: '#ffd2d4',
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  atleticoIcone: { width: 28, height: 18, resizeMode: 'contain', marginBottom: 4 },
  atleticoLabel: { fontSize: 13, color: '#555', fontWeight: '500' },
  atleticoValor: { fontSize: 17, fontWeight: '700', color: '#111' },

  // Modal medidas
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 18, padding: 24, width: '84%', gap: 10 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  modalLabel: { fontSize: 13, color: '#555', fontWeight: '500', marginBottom: -4 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: '#111',
  },
  modalBotoes: { flexDirection: 'row', gap: 10, marginTop: 6 },
  modalBtnCancelar: { flex: 1, borderWidth: 1.5, borderColor: '#ccc', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnCancelarTexto: { fontSize: 15, color: '#555', fontWeight: '600' },
  modalBtnSalvar: { flex: 1, backgroundColor: RED, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnSalvarTexto: { fontSize: 15, color: '#fff', fontWeight: '700' },

  // Botão sair
  btnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { boxshadow: '0px 2px 6px rgba(0,0,0,0.06)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 6px rgba(0,0,0,0.06)' },
    }),
  },
  btnSairIcone: { fontSize: 20, color: RED },
  btnSairTexto: { fontSize: 18, fontWeight: '700', color: RED },
});
