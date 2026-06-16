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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUrl } from '../constants/url';
import { useUser } from '../context/UserContext';

interface Atleta {
  id: number;
  nome: string;
  esporte: string;
  ativo: string;
  foto: null;
}

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function TelaGerenciarEquipe_Nutri() {
  const router = useRouter();
  const { usuario } = useUser();
  const [busca, setBusca] = useState('');
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([fetchTodosAtletas(), fetchAtletasDoNutricionista()])
      .finally(() => setCarregando(false));
  }, []);

  async function fetchTodosAtletas() {
    try {
      const resposta = await fetch(getUrl('/atletas'));
      if (resposta.ok) {
        const dados: Atleta[] = await resposta.json();
        setAtletas(dados);
      }
    } catch {
      // lista fica vazia se o servidor não responder
    }
  }

  async function fetchAtletasDoNutricionista() {
    if (!usuario?.id_usuario) return;
    try {
      const resposta = await fetch(getUrl(`/nutricionista/${usuario.id_usuario}/atletas`));
      if (resposta.ok) {
        const dados: Atleta[] = await resposta.json();
        setSelecionados(dados.map((a) => a.id));
      }
    } catch {
      // mantém selecionados vazio em caso de erro
    }
  }

  const atletasFiltrados = atletas.filter((a) => {
    const termo = busca.toLowerCase();
    return (
      (a.nome?.toLowerCase().includes(termo)) ||
      (a.esporte?.toLowerCase().includes(termo))
    );
  });

  const toggle = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  async function salvar() {
    if (!usuario?.id_usuario) return;
    setSalvando(true);
    try {
      const resposta = await fetch(getUrl(`/nutricionista/${usuario.id_usuario}/atletas`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atleta_ids: selecionados }),
      });

      if (!resposta.ok) throw new Error('Erro ao salvar');

      Alert.alert('Sucesso', 'Time atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o time. Tente novamente.');
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
          <Text style={styles.headerTitulo}>Gerenciar Atletas</Text>
          <Text style={styles.headerSubtitulo}>Selecione os atletas para compor seu grupo</Text>
        </View>

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

        {carregando ? (
          <ActivityIndicator color={RED} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {atletasFiltrados.map((atleta, idx) => {
              const isSel = selecionados.includes(atleta.id);
              return (
                <TouchableOpacity
                  key={`atleta-${atleta.id}`}
                  style={styles.atletaCard}
                  activeOpacity={0.75}
                  onPress={() => toggle(atleta.id)}
                >
                  <View style={styles.atletaLeft}>
                    {atleta.foto ? (
                      <Image source={atleta.foto} style={styles.avatar} />
                    ) : (
                      <View
                        style={[
                          styles.avatar,
                          styles.avatarPlaceholder,
                          { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] },
                        ]}
                      >
                        <Text style={styles.avatarIniciais}>{iniciais(atleta.nome)}</Text>
                      </View>
                    )}
                    <View style={styles.atletaInfo}>
                      <Text style={styles.atletaNome}>{atleta.nome}</Text>
                      <Text style={styles.atletaEsporte}>{atleta.esporte ?? ''}</Text>
                    </View>
                  </View>

                  <View style={[styles.checkbox, isSel && styles.checkboxSel]}>
                    {isSel && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.footerWrap}>
          <TouchableOpacity
            style={[styles.salvarBtn, salvando && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.salvarTexto}>Salvar time</Text>
            )}
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

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 0 },

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

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSel: { backgroundColor: RED, borderColor: RED },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },

  footerWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  salvarBtn: {
    backgroundColor: RED,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 2px 6px rgba(0,0,0,0.2)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 6px rgba(0,0,0,0.2)' },
    }),
  },
  salvarTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
