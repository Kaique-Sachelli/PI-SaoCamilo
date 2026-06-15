import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getUrl } from '../constants/url';
import { useUser } from '../context/UserContext';

type ArquivoSelecionado = {
  nome: string;
  tipo: string;
};

function textoParam(valor?: string | string[]) {
  return Array.isArray(valor) ? valor[0] : valor;
}

export default function RelatorioAlimentar() {
  const router = useRouter();
  const { usuario } = useUser();
  const params = useLocalSearchParams<{
    id_atleta?: string;
    nome?: string;
  }>();

  const [titulo, setTitulo] = useState('Plano alimentar');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState<ArquivoSelecionado | null>(null);
  const [enviando, setEnviando] = useState(false);

  const idAtleta = Number(textoParam(params.id_atleta));
  const nomeAtleta = textoParam(params.nome) || 'atleta selecionado';

  const handleAdicionarArquivo = () => {
    Alert.alert(
      'Adicionar arquivo',
      'Escolha uma opção',
      [
        {
          text: 'Galeria de fotos',
          onPress: () => setArquivo({ nome: 'imagem-da-dieta.jpg', tipo: 'imagem' }),
        },
        {
          text: 'Documentos (PDF)',
          onPress: () => setArquivo({ nome: 'dieta.pdf', tipo: 'pdf' }),
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleEnviar = async () => {
    if (!Number.isInteger(idAtleta) || idAtleta <= 0) {
      Alert.alert('Atenção', 'Selecione um atleta antes de enviar a dieta.');
      return;
    }

    if (!usuario?.id_usuario) {
      Alert.alert('Atenção', 'Usuário logado não encontrado.');
      return;
    }

    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Descreva a dieta antes de enviar.');
      return;
    }

    try {
      setEnviando(true);

      const response = await fetch(getUrl('/dietas'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_atleta: idAtleta,
          id_nutricionista: usuario.id_usuario,
          titulo: titulo.trim() || 'Plano alimentar',
          descricao: descricao.trim(),
          nome_arquivo: arquivo?.nome || null,
          tipo_arquivo: arquivo?.tipo || null,
        }),
      });

      const dados = await response.json();

      if (!response.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || 'Não foi possível enviar a dieta.');
      }

      Alert.alert('Sucesso', 'Dieta enviada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Não foi possível enviar a dieta.';
      Alert.alert('Erro', mensagem);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Barra superior ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
            <Text style={styles.voltarIcone}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Text style={styles.downloadIcone}>⬇</Text>
          </TouchableOpacity>
        </View>

        {/* ── Conteúdo central ── */}
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titulo}>Adicione a dieta aqui:</Text>
          <Text style={styles.subtitulo}>{nomeAtleta}</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#777"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição da dieta"
              placeholderTextColor="#777"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.uploadCard, arquivo && styles.uploadCardOk]}
            activeOpacity={0.8}
            onPress={handleAdicionarArquivo}
          >
            {arquivo ? (
              <View style={styles.arquivoOkWrap}>
                <Text style={styles.arquivoOkIcone}>✅</Text>
                <Text style={styles.arquivoOkTexto}>{arquivo.nome}</Text>
                <Text style={styles.arquivoOkSub}>Toque para substituir</Text>
              </View>
            ) : (
              <Text style={styles.maisIcone}>+</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* ── Botão Enviar ── */}
        <View style={styles.rodape}>
          <TouchableOpacity
            style={[styles.btnEnviar, enviando && styles.btnEnviarDisabled]}
            activeOpacity={0.85}
            onPress={handleEnviar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color={AZUL} />
            ) : (
              <Text style={styles.btnEnviarTexto}>Enviar  ›</Text>
            )}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const AZUL = '#0A3D91';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'rgba(220, 100, 100, 0.25)' },

  // Barra topo
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topBtn: { padding: 6 },
  voltarIcone: { fontSize: 32, color: '#fff', fontWeight: '300', lineHeight: 36 },
  downloadIcone: { fontSize: 22, color: '#fff' },

  // Conteúdo
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 18,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: -10,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    color: '#111',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  textArea: {
    minHeight: 140,
    lineHeight: 20,
  },

  // Card de upload
  uploadCard: {
    width: '100%',
    minHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AZUL,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
    }),
  },
  uploadCardOk: {
    borderColor: '#22c55e',
  },
  maisIcone: {
    fontSize: 72,
    color: AZUL,
    fontWeight: '300',
    lineHeight: 80,
  },
  arquivoOkWrap: { alignItems: 'center', gap: 8 },
  arquivoOkIcone: { fontSize: 48 },
  arquivoOkTexto: { fontSize: 18, fontWeight: '700', color: AZUL },
  arquivoOkSub: { fontSize: 13, color: '#888' },

  // Botão enviar
  rodape: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  btnEnviar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    minHeight: 58,
    justifyContent: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
    }),
  },
  btnEnviarDisabled: {
    opacity: 0.75,
  },
  btnEnviarTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: AZUL,
    letterSpacing: 0.5,
  },
});
