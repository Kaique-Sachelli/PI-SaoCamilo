import { useState, useEffect } from 'react';
import { API_URL } from '../constants/url';
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

// const ATLETAS = [];

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function ListaAtletas() {
  console.log('TELA LISTA_ATLETAS CARREGADA');
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const [atletas, setAtletas] = useState<any[]>([]);
  useEffect(() => {
    carregarAtletas();
  }, []);

  async function carregarAtletas() {
    try {
      console.log('Buscando atletas...');
      const response = await fetch(`${API_URL}/atletas`);
      console.log('Status:', response.status);
      const dados = await response.json();
      console.log('Dados recebidos:', dados);
      
      setAtletas(dados);
    } catch (erro) {
      console.log('Erro ao carregar atletas:', erro);
    }
  }
  const atletasFiltrados = atletas.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirPerfilAtleta = (atleta: any) => {
    router.push({
      pathname: '/perfil_atleta_nutricionista',
      params: {
        id_atleta: String(atleta.id_usuario),
        nome: atleta.nome,
        email: atleta.email || '',
        telefone: atleta.telefone || '',
        idade: atleta.idade != null ? String(atleta.idade) : '',
        altura: atleta.altura != null ? String(atleta.altura) : '',
        peso: atleta.peso != null ? String(atleta.peso) : '',
        modalidade_esportiva: atleta.modalidade_esportiva || '',
      },
    });
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
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>TESTE PEDRO</Text>
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
              placeholder="Pesquisar"
              placeholderTextColor="#bbb"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* ── Cabeçalho lista ── */}
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

          {/* ── Lista de atletas ── */}
          {atletasFiltrados.map((atleta, idx) => (
            <TouchableOpacity
              key={atleta.id_usuario}
              style={styles.atletaCard}
              activeOpacity={0.75}
              onPress={() => abrirPerfilAtleta(atleta)}
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
                  <Text style={styles.atletaEsporte}>Atleta</Text>
                </View>
              </View>

              <View style={styles.atletaRight}>
                <View
                  style={[
                    styles.statusDot,
                    atleta.situacao === 'Ativo'
                      ? styles.dotVerde
                      : styles.dotVermelho,
                  ]}
                />
                <Text style={styles.atletaSeta}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_adm')}>
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
    paddingTop: 10,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  voltarBtn: { marginBottom: 4 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 32, fontWeight: '700' },

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

  // List header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitulo: { fontSize: 16, fontWeight: '700', color: '#111' },
  gerenciarBtn: { flexDirection: 'row', alignItems: 'center' },
  gerenciarTexto: { fontSize: 14, color: RED, fontWeight: '600' },
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
  atletaAvatar: { width: 46, height: 46, borderRadius: 23 },
  atletaAvatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  atletaIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaInfo: { gap: 2 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaEsporte: { fontSize: 13, color: '#888' },
  atletaRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  dotVerde: { backgroundColor: '#4CAF50' },
  dotVermelho: { backgroundColor: '#e53935' },
  atletaSeta: { fontSize: 22, color: '#ccc' },

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
