import { useCallback, useState } from 'react';
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
import { useFocusEffect, useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { NavbarNutricionista } from './Navbar_nutricionista';
import { NotificacaoPopup } from './notificacao';
import { getUrl } from '../constants/url';

type Atleta = {
  id_usuario: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  situacao?: string | null;
  idade?: number | string | null;
  altura?: number | string | null;
  peso?: number | string | null;
  modalidade_esportiva?: string | null;
  esporte?: string | null;
};

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];
const RED = '#B3151F';

function iniciais(nome: string) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function HomepageNutricionista() {
  const router = useRouter();
  const { usuario } = useUser();
  const [notifVisivel, setNotifVisivel] = useState(false);
  const [busca, setBusca] = useState('');
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState(true);
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

    try {
      setLoading(true);
      setError(null);
      const resposta = await fetch(getUrl(`/profissionais/${usuario.id_usuario}/atletas/vinculados`));
      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || 'Erro ao buscar a lista de atletas');
      }

      setAtletas(Array.isArray(dados.atletas) ? dados.atletas : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const atletasFiltrados = atletas.filter((atleta) => {
    const termoBusca = busca.trim().toLowerCase();
    if (!termoBusca) return true;

    const esporte = atleta.modalidade_esportiva || atleta.esporte || '';
    return [atleta.nome, atleta.email, esporte]
      .filter(Boolean)
      .some((valor) => String(valor).toLowerCase().includes(termoBusca));
  });

  const abrirPerfilAtleta = (atleta: Atleta) => {
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
        modalidade_esportiva: atleta.modalidade_esportiva || atleta.esporte || '',
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
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.titulo}>Sao Camilo</Text>
              <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
            </View>
            <TouchableOpacity onPress={() => setNotifVisivel(true)}>
              <View style={styles.sinoWrap}>
                <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
                <View style={styles.sinoDot} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.funcao}>Ola, {usuario?.nome}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#aaa"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitulo}>Meus atletas</Text>
            <TouchableOpacity
              style={styles.gerenciarBtn}
              onPress={() => router.push('/TelaGerenciarAtletas')}
            >
              <Text style={styles.gerenciarTexto}>Gerenciar </Text>
              <Image source={require('./assets/Img/gerenciar.png')} style={styles.gerenciarIcone} />
            </TouchableOpacity>
          </View>

          {loading && <Text style={styles.estadoTexto}>Carregando atletas...</Text>}

          {!loading && error && <Text style={styles.estadoTexto}>{error}</Text>}

          {!loading && !error && atletasFiltrados.length === 0 && (
            <Text style={styles.estadoTexto}>Nenhum atleta adicionado.</Text>
          )}

          {!loading && !error && atletasFiltrados.map((atleta, idx) => {
            const esporte = atleta.modalidade_esportiva || atleta.esporte || 'Atleta';

            return (
              <TouchableOpacity
                key={atleta.id_usuario}
                style={styles.atletaCard}
                activeOpacity={0.75}
                onPress={() => abrirPerfilAtleta(atleta)}
              >
                <View style={styles.atletaLeft}>
                  <View style={[styles.atletaAvatar, styles.atletaAvatarPlaceholder, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                    <Text style={styles.atletaIniciais}>{iniciais(atleta.nome)}</Text>
                  </View>
                  <View style={styles.atletaInfo}>
                    <Text style={styles.atletaNome} numberOfLines={1}>{atleta.nome}</Text>
                    <Text style={styles.atletaEsporte} numberOfLines={1}>{esporte}</Text>
                  </View>
                </View>

                <View style={styles.atletaRight}>
                  <View style={[styles.statusDot, atleta.situacao === 'Ativo' ? styles.dotVerde : styles.dotVermelho]} />
                  <Text style={styles.atletaSeta}>{'>'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <NavbarNutricionista active="home"/>

        <NotificacaoPopup
          visible={notifVisivel}
          onClose={() => setNotifVisivel(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 10 },
  searchRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 6,
    ...Platform.select({
      ios: { boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  searchInput: { fontSize: 15, color: '#333' },
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
  atletaCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { boxShadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxShadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  atletaLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  atletaAvatar: { width: 44, height: 44, borderRadius: 22 },
  atletaAvatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  atletaIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaInfo: { flex: 1, gap: 2 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaEsporte: { fontSize: 13, color: '#888' },
  atletaRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  dotVerde: { backgroundColor: '#4CAF50' },
  dotVermelho: { backgroundColor: '#e53935' },
  atletaSeta: { fontSize: 18, color: '#ccc', fontWeight: '700' },
});
