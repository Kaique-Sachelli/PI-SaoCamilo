import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUrl } from '../constants/url';

interface Atleta {
  id: number;
  nome: string;
  esporte: string;
  ativo: string;
  foto: null;
  selecionado: false;
}

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function TelaGerenciarAtletas() {
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAtletas();
  }, []);

  async function fetchAtletas() { 
    try { 
      const resposta = await fetch(getUrl(`/atletas`)); 
      
      if (!resposta.ok) { 
        throw new Error('Erro ao buscar a lista de atletas');
      } 
      
      const dados: Atleta[] = await resposta.json();
      setAtletas(dados);
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Erro desconhecido'); 
    } finally { 
      setLoading(false); 
    } 
  }

  const atletasFiltrados = atletas.filter((a) => {
    const termoBusca = busca ? busca.toLowerCase() : "";
    const nomeMatch = a.nome ? a.nome.toLowerCase().includes(termoBusca) : false;
    const esporteMatch = a.esporte ? a.esporte.toLowerCase().includes(termoBusca) : false;

    return nomeMatch || esporteMatch;
  });

  const [selecionados, setSelecionados] = useState<number[]>(
    atletasFiltrados.filter((a) => a.selecionado).map((a) => a.id)
  );

  const toggle = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
          <Text style={styles.headerTitulo}>Gerenciar Atletas</Text>
          <Text style={styles.headerSubtitulo}>Selecione os atletas para compor seu time</Text>
        </View>

        {/* ── Barra de pesquisa (fora do header, acima da lista) ── */}
        <View style={styles.searchWrap}>
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
        </View>

        {/* ── Lista ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {atletasFiltrados.map((atleta, idx) => {
            const isSel = selecionados.includes(atleta.id || idx);
            return (
              <TouchableOpacity
                key={`atleta-${atleta.id || idx}`}
                style={styles.atletaCard}
                activeOpacity={0.75}
                onPress={() => toggle(atleta.id || idx)}
              >
                <View style={styles.atletaLeft}>
                  {atleta.foto ? (
                    <Image source={atleta.foto} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                      <Text style={styles.avatarIniciais}>{iniciais(atleta.nome)}</Text>
                    </View>
                  )}
                  <View style={styles.atletaInfo}>
                    <Text style={styles.atletaNome}>{atleta.nome}</Text>
                    <Text style={styles.atletaEsporte}>{atleta.esporte}</Text>
                  </View>
                </View>

                {/* Checkbox */}
                <View style={[styles.checkbox, isSel && styles.checkboxSel]}>
                  {isSel && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerSubtitulo: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },

  // Search (fora do header)
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
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

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 0 },

  // Cards atleta
  atletaCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  atletaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  avatarIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaInfo: { gap: 2 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaEsporte: { fontSize: 13, color: '#888' },

  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSel: {
    backgroundColor: RED,
    borderColor: RED,
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },

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
