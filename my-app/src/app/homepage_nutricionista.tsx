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
  { id: 1, nome: 'Marcus Silva',      foto: require('./assets/Img/marcus.jpg'), disponivel: true  },
  { id: 2, nome: 'Jéssica do Santos', foto: null,                               disponivel: true  },
  { id: 3, nome: 'Eurico Miranda',    foto: null,                               disponivel: false },
  { id: 4, nome: 'Ricardo Gomes',     foto: null,                               disponivel: true  },
  { id: 5, nome: 'Márcia Figueiras',  foto: null,                               disponivel: false },
  { id: 6, nome: 'Carlos Mendes',     foto: null,                               disponivel: true  },
  { id: 7, nome: 'Ana Paula',         foto: null,                               disponivel: false },
];

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9', '#6a1b9a', '#00838f'];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function dataAtual() {
  const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const d = new Date();
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function HomepageNutricionista() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [mostrarDisponiveis, setMostrarDisponiveis] = useState(true);
  const [mostrarIndisponiveis, setMostrarIndisponiveis] = useState(true);

  const atletasFiltrados = ATLETAS.filter((a) => {
    const nomeOk = a.nome.toLowerCase().includes(busca.toLowerCase());
    const statusOk =
      (mostrarDisponiveis && a.disponivel) ||
      (mostrarIndisponiveis && !a.disponivel);
    return nomeOk && statusOk;
  });

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
          <Text style={styles.data}>{dataAtual()}</Text>
          <Text style={styles.funcao}>Olá, Nutricionista</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Barra de pesquisa ── */}
          <View style={styles.searchRow}>
            <Text style={styles.searchIcone}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por atleta..."
              placeholderTextColor="#bbb"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* ── Filtros com checkbox ── */}
          <View style={styles.filtrosRow}>
            <TouchableOpacity
              style={styles.filtroItem}
              onPress={() => setMostrarDisponiveis((v) => !v)}
            >
              <View style={[styles.checkbox, styles.checkboxVerde, mostrarDisponiveis && styles.checkboxChecked]}>
                {mostrarDisponiveis && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.filtroTexto, { color: '#2e7d32' }]}>Disponíveis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filtroItem}
              onPress={() => setMostrarIndisponiveis((v) => !v)}
            >
              <View style={[styles.checkbox, styles.checkboxVermelho, mostrarIndisponiveis && styles.checkboxCheckedVerm]}>
                {mostrarIndisponiveis && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.filtroTexto, { color: '#c62828' }]}>Indisponíveis</Text>
            </TouchableOpacity>
          </View>

          {/* ── Lista de atletas ── */}
          {atletasFiltrados.map((atleta, idx) => (
            <TouchableOpacity
              key={atleta.id}
              style={styles.atletaCard}
              activeOpacity={0.75}
              onPress={() => router.push('/sessoes_medico')}
            >
              <View style={styles.atletaLeft}>
                {atleta.foto ? (
                  <Image source={atleta.foto} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                    <Text style={styles.avatarIniciais}>{iniciais(atleta.nome)}</Text>
                  </View>
                )}
                <Text style={styles.atletaNome}>{atleta.nome}</Text>
              </View>

              <View style={styles.atletaRight}>
                <View style={[styles.statusDot, atleta.disponivel ? styles.dotVerde : styles.dotVermelho]} />
                <Text style={styles.seta}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_nutricionista')}>
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
    marginBottom: 8,
  },
  titulo: { fontSize: 28, color: '#fff', fontWeight: '700' },
  subtitulo: { fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: '300', marginTop: 2 },
  sinoWrap: { position: 'relative', marginTop: 4 },
  sino: { width: 28, height: 28, tintColor: '#fff' },
  sinoDot: {
    position: 'absolute', top: 0, right: 0,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#FF9800',
    borderWidth: 1.5, borderColor: RED,
  },
  data: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 6 },
  funcao: { color: '#fff', fontSize: 22, fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 10 },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  searchIcone: { fontSize: 15, marginRight: 8, opacity: 0.45 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  // Filtros checkbox
  filtrosRow: { flexDirection: 'row', gap: 20, paddingLeft: 4 },
  filtroItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxVerde: { borderColor: '#2e7d32' },
  checkboxVermelho: { borderColor: '#c62828' },
  checkboxChecked: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  checkboxCheckedVerm: { backgroundColor: '#c62828', borderColor: '#c62828' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  filtroTexto: { fontSize: 14, fontWeight: '600' },

  // Cards atleta
  atletaCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  avatarIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  dotVerde: { backgroundColor: '#4CAF50' },
  dotVermelho: { backgroundColor: '#e53935' },
  seta: { fontSize: 22, color: '#ccc' },

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
