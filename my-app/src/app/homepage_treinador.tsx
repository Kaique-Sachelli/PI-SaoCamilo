import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ATLETAS = [
  { id: 1, nome: 'Marcus Silva',      esporte: 'Vôlei',   ativo: true,  foto: require('./assets/Img/marcus.jpg') },
  { id: 2, nome: 'Jéssica do Santos', esporte: 'Tênis',   ativo: false, foto: null },
  { id: 3, nome: 'Eurico Miranda',    esporte: 'Boxe',    ativo: false, foto: null },
  { id: 4, nome: 'Ricardo Gomes',     esporte: 'Natação', ativo: true,  foto: null },
  { id: 5, nome: 'Márcia Figueiras',  esporte: 'Natação', ativo: true,  foto: null },
];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

export default function HomepageTreinador() {
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const atletasFiltrados = ATLETAS.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.esporte.toLowerCase().includes(busca.toLowerCase())
  );

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
              <Text style={styles.titulo}>São Camilo</Text>
              <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
            </View>
            <View style={styles.sinoWrap}>
              <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
              <View style={styles.sinoDot} />
            </View>
          </View>
          <Text style={styles.funcao}>Olá, Treinador</Text>
        </View>

        {/* ── Conteúdo ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Barra de pesquisa */}
          <View style={styles.searchRow}>
            <Text style={styles.searchIcone}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#aaa"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* Cabeçalho da lista */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitulo}>Meu time</Text>
            <TouchableOpacity
              style={styles.gerenciarBtn}
              onPress={() => router.push('/TelaGerenciarAtletas')}
            >
              <Text style={styles.gerenciarTexto}>Gerenciar </Text>
              <Image source={require('./assets/Img/gerenciar.png')} style={styles.gerenciarIcone} />
            </TouchableOpacity>
          </View>

          {/* Lista de atletas */}
          {atletasFiltrados.map((atleta, idx) => (
            <TouchableOpacity
              key={atleta.id}
              style={styles.atletaCard}
              activeOpacity={0.75}
              onPress={() => router.push('/sessoes_treinador')}
            >
              <View style={styles.atletaLeft}>
                {atleta.foto ? (
                  <Image source={atleta.foto} style={styles.atletaAvatar} />
                ) : (
                  <View style={[styles.atletaAvatar, styles.atletaAvatarPlaceholder, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                    <Text style={styles.atletaIniciais}>{iniciais(atleta.nome)}</Text>
                  </View>
                )}
                <View style={styles.atletaInfo}>
                  <Text style={styles.atletaNome}>{atleta.nome}</Text>
                  <Text style={styles.atletaEsporte}>{atleta.esporte}</Text>
                </View>
              </View>

              <View style={styles.atletaRight}>
                <View style={[styles.statusDot, atleta.ativo ? styles.dotVerde : styles.dotVermelho]} />
                <Text style={styles.atletaSeta}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_treinador')}>
            <Image source={require('./assets/Img/homepage.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/batimento3.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/documento.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/perfil2.png')} style={styles.navImg} />
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  titulo: { fontSize: 28, color: '#fff', fontWeight: '700' },
  subtitulo: { fontSize: 16, color: 'rgba(255,255,255,0.75)', fontWeight: '300', marginTop: 2 },
  sinoWrap: { position: 'relative', marginTop: 4 },
  sino: { width: 28, height: 28, tintColor: '#fff' },
  sinoDot: {
    position: 'absolute', top: 0, right: 0,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#FF9800',
    borderWidth: 1.5, borderColor: RED,
  },
  funcao: { fontSize: 20, color: '#fff', fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 10 },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 6,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  searchIcone: { fontSize: 16, marginRight: 8, opacity: 0.5 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  // List header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listTitulo: { fontSize: 16, fontWeight: '700', color: '#111' },
  gerenciarBtn: { flexDirection: 'row', alignItems: 'center' },
  gerenciarTexto: { fontSize: 15, color: RED, fontWeight: '600' },
  gerenciarIcone: { width: 18, height: 16, tintColor: RED },

  // Athlete cards
  atletaCard: {
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
  atletaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  atletaAvatar: { width: 44, height: 44, borderRadius: 22 },
  atletaAvatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  atletaIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaInfo: { gap: 2 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaEsporte: { fontSize: 13, color: '#888' },
  atletaRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  dotVerde: { backgroundColor: '#4CAF50' },
  dotVermelho: { backgroundColor: '#e53935' },
  atletaSeta: { fontSize: 22, color: '#ccc', fontWeight: '300' },

  // Navbar
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navImg: { width: 26, height: 26, resizeMode: 'contain' },
});
