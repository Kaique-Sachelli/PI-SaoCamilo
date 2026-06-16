import { useState, useCallback } from 'react';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { useUser } from '../context/UserContext';
import { NavbarNutricionista } from './Navbar_nutricionista';
import { getUrl } from '../constants/url';

interface Atleta {
  id: number;
  nome: string;
  esporte: string;
  ativo: string;
  foto: null;
  email?: string;
  telefone?: string;
  idade?: number | string | null;
  altura?: number | string | null;
  peso?: number | string | null;
}

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

export default function HomepageNutricionista() {
  const router = useRouter();
  const { usuario } = useUser();
  const [busca, setBusca] = useState('');
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchAtletas();
    }, [usuario?.id_usuario])
  );

  async function fetchAtletas() {
    if (!usuario?.id_usuario) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resposta = await fetch(getUrl(`/nutricionista/${usuario.id_usuario}/atletas`));
      if (!resposta.ok) throw new Error('Erro ao buscar a lista de atletas');
      const dados: Atleta[] = await resposta.json();
      setAtletas(dados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const atletasFiltrados = atletas.filter((a) => {
    const termoBusca = busca.trim().toLowerCase();
    if (!termoBusca) return true;
    const nomeMatch = a.nome ? a.nome.toLowerCase().includes(termoBusca) : false;
    const esporteMatch = a.esporte ? a.esporte.toLowerCase().includes(termoBusca) : false;
    return nomeMatch || esporteMatch;
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
              <Text style={styles.titulo}>HIDRA PRO-FORMANCE</Text>
            </View>
          </View>
          <Text style={styles.funcao}>Olá, {usuario?.nome}</Text>
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
              onPress={() => router.push('/TelaGerenciarEquipe_Nutri')}
            >
              <Text style={styles.gerenciarTexto}>Gerenciar </Text>
              <Image source={require('./assets/Img/gerenciar.png')} style={styles.gerenciarIcone} />
            </TouchableOpacity>
          </View>

          {/* Lista de atletas */}
          {loading ? (
            <Text style={styles.estadoTexto}>Carregando atletas...</Text>
          ) : error ? (
            <Text style={styles.estadoTexto}>{error}</Text>
          ) : atletasFiltrados.length === 0 ? (
            <Text style={styles.estadoTexto}>
              {busca ? 'Nenhum atleta encontrado.' : 'Seu time está vazio.\nClique em Gerenciar para adicionar atletas.'}
            </Text>
          ) : atletasFiltrados.map((atleta, idx) => (
            <TouchableOpacity
              key={`atleta-${atleta.id}`}
              style={styles.atletaCard}
              activeOpacity={0.75}
              onPress={() => router.push({ pathname: '/sessoes_nutricionista', params: { id_atleta: String(atleta.id), nome: atleta.nome } })}
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
              <Text style={styles.atletaSeta}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <NavbarNutricionista active="home" />

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
  titulo: { fontSize: 20, color: '#fff', fontWeight: '700' },
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
  estadoTexto: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },

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
});
