import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function RelatorioAlimentar() {
  const router = useRouter();
  const [arquivoAdicionado, setArquivoAdicionado] = useState(false);

  const handleAdicionarArquivo = () => {
    // Em produção: usar expo-document-picker ou expo-image-picker
    Alert.alert(
      'Adicionar arquivo',
      'Escolha uma opção',
      [
        { text: 'Galeria de fotos',   onPress: () => setArquivoAdicionado(true) },
        { text: 'Documentos (PDF)',    onPress: () => setArquivoAdicionado(true) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleEnviar = () => {
    if (!arquivoAdicionado) {
      Alert.alert('Atenção', 'Adicione um arquivo antes de enviar.');
      return;
    }
    Alert.alert('Sucesso', 'Relatório enviado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay rosa suave */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>

        {/* ── Barra superior ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarIcone}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadIcone}>⬇</Text>
          </TouchableOpacity>
        </View>

        {/* ── Conteúdo central ── */}
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Adicione seu relatório aqui:</Text>

          {/* Área de upload */}
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
        </View>

        {/* ── Botão Enviar ── */}
        <View style={styles.rodape}>
          <TouchableOpacity
            style={[styles.btnEnviar, !arquivoAdicionado && styles.btnEnviarDisabled]}
            activeOpacity={0.85}
            onPress={handleEnviar}
          >
            <Text style={styles.btnEnviarTexto}>Enviar  ›</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const AZUL = '#0A3D91';

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 100, 100, 0.25)',
  },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // Barra topo
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  voltarBtn: { padding: 6 },
  voltarIcone: { fontSize: 32, color: '#fff', fontWeight: '300', lineHeight: 36 },
  downloadBtn: { padding: 6 },
  downloadIcone: { fontSize: 22, color: '#fff' },

  // Conteúdo
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Card de upload
  uploadCard: {
    width: '100%',
    aspectRatio: 1.1,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 16px rgba(0,0,0,0.12)' },
    }),
  },
  uploadCardOk: {
    borderColor: AZUL,
    borderWidth: 2,
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
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 4px 12px rgba(0,0,0,0.12)' },
    }),
  },
  btnEnviarDisabled: { opacity: 0.55 },
  btnEnviarTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: AZUL,
    letterSpacing: 0.5,
  },
});
