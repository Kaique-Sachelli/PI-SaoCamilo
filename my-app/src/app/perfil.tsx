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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { NavbarAtleta } from './NavbarAtleta';
import { useUser } from '../context/UserContext';

export default function Perfil() {
  const router = useRouter();
  const { logout } = useUser();

  const handleSair = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Header ── */}
        <View style={styles.header}>
          {/* Sino */}
          <View style={styles.sinoWrap}>
            <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
            <View style={styles.sinoDot} />
          </View>

          {/* Avatar centralizado */}
          <View style={styles.avatarWrap}>
            <Image source={require('./assets/Img/marcus.jpg')} style={styles.avatar} />
          </View>

          <Text style={styles.nome}>Kacique</Text>
          <Text style={styles.posicao}>Vôlei  •  Arremessador</Text>
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
              <View>
                <Text style={styles.linhaLabel}>E-mail:</Text>
                <Text style={styles.linhaValor}>carlinmaia@gmail.com</Text>
              </View>
            </View>

            <View style={styles.linhaInfo}>
              <Image source={require('./assets/Img/telefone.png')} style={styles.icone} />
              <View>
                <Text style={styles.linhaLabel}>Telefone:</Text>
                <Text style={styles.linhaValor}>(55)11 4002-8922</Text>
              </View>
            </View>

            <View style={styles.linhaInfo}>
              <Image source={require('./assets/Img/idade.png')} style={styles.icone} />
              <View>
                <Text style={styles.linhaLabel}>Idade:</Text>
                <Text style={styles.linhaValor}>45 anos</Text>
              </View>
            </View>
          </View>

          {/* Card Perfil Atlético */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Perfil Atlético</Text>
            <View style={styles.atleticoRow}>
              <View style={styles.atleticoItem}>
                <Image source={require('./assets/Img/batimento.png')} style={styles.atleticoIcone} />
                <Text style={styles.atleticoLabel}>Altura</Text>
                <Text style={styles.atleticoValor}>177 cm</Text>
              </View>
              <View style={styles.atleticoItem}>
                <Image source={require('./assets/Img/batimento.png')} style={styles.atleticoIcone} />
                <Text style={styles.atleticoLabel}>Peso</Text>
                <Text style={styles.atleticoValor}>78 kg</Text>
              </View>
            </View>
          </View>

          {/* Espaçador */}
          <View style={{ flex: 1 }} />

          {/* Botão Sair */}
          <TouchableOpacity style={styles.btnSair} onPress={handleSair} activeOpacity={0.8}>
            <Text style={styles.btnSairIcone}>↪</Text>
            <Text style={styles.btnSairTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>

      <NavbarAtleta active="perfil" />

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
  sinoWrap: {
    position: 'absolute',
    top: 14,
    right: 20,
  },
  sino: { width: 26, height: 26, tintColor: '#fff' },
  sinoDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#FF9800',
    borderWidth: 1.5, borderColor: RED,
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
  icone: { width: 28, height: 28, resizeMode: 'contain' },
  linhaLabel: { fontSize: 12, color: '#888', marginBottom: 1 },
  linhaValor: { fontSize: 15, fontWeight: '500', color: '#111' },

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
