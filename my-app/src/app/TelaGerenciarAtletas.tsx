import { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUrl } from '../constants/url';
import { useUser } from '../context/UserContext';

type FiltroLista = 'todos' | 'adicionados';

type Atleta = {
  id_usuario: number;
  nome: string;
  email?: string | null;
  registro?: string | null;
  situacao?: string | null;
  modalidade_esportiva?: string | null;
  esporte?: string | null;
  vinculado?: boolean | number;
};

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];
const RED = '#B3151F';

function iniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function estaVinculado(atleta: Atleta) {
  return atleta.vinculado === true || atleta.vinculado === 1;
}

function textoAtleta(atleta: Atleta) {
  return [
    atleta.nome,
    atleta.email,
    atleta.registro,
    atleta.modalidade_esportiva,
    atleta.esporte,
    atleta.situacao,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function TelaGerenciarAtletas() {
  const router = useRouter();
  const { usuario } = useUser();
  const [busca, setBusca] = useState('');
  const [filtroLista, setFiltroLista] = useState<FiltroLista>('todos');
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  const carregarAtletas = async () => {
    if (!usuario?.id_usuario) {
      setErro('Usuario logado nao encontrado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(getUrl(`/profissionais/${usuario.id_usuario}/atletas`));
      const data = await response.json();

      if (!response.ok || !data.sucesso) {
        throw new Error(data.mensagem || 'Nao foi possivel carregar os atletas.');
      }

      setAtletas(Array.isArray(data.atletas) ? data.atletas : []);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Nao foi possivel carregar os atletas.';
      setErro(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAtletas();
  }, [usuario?.id_usuario]);

  const alternarVinculo = async (atleta: Atleta) => {
    if (!usuario?.id_usuario || atualizandoId) return;

    const proximoVinculo = !estaVinculado(atleta);
    setAtualizandoId(atleta.id_usuario);
    setAtletas((lista) =>
      lista.map((item) =>
        item.id_usuario === atleta.id_usuario
          ? { ...item, vinculado: proximoVinculo }
          : item
      )
    );

    try {
      const response = await fetch(
        getUrl(`/profissionais/${usuario.id_usuario}/atletas/${atleta.id_usuario}`),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vinculado: proximoVinculo }),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.sucesso) {
        throw new Error(data.mensagem || 'Nao foi possivel atualizar a lista.');
      }
    } catch (error) {
      setAtletas((lista) =>
        lista.map((item) =>
          item.id_usuario === atleta.id_usuario
            ? { ...item, vinculado: !proximoVinculo }
            : item
        )
      );
      const mensagem = error instanceof Error ? error.message : 'Nao foi possivel atualizar a lista.';
      Alert.alert('Erro', mensagem);
    } finally {
      setAtualizandoId(null);
    }
  };

  const termoBusca = busca.trim().toLowerCase();
  const atletasFiltrados = atletas.filter((atleta) => {
    const passaBusca = !termoBusca || textoAtleta(atleta).includes(termoBusca);
    const passaFiltro = filtroLista === 'todos' || estaVinculado(atleta);
    return passaBusca && passaFiltro;
  });
  const totalVinculados = atletas.filter(estaVinculado).length;

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
          <Text style={styles.headerSubtitulo}>Adicione ou remova atletas da sua lista</Text>
          <Text style={styles.headerResumo}>
            {totalVinculados} de {atletas.length} adicionados
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome, e-mail, registro ou modalidade"
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.filtros}>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroLista === 'todos' && styles.filtroAtivo]}
            onPress={() => setFiltroLista('todos')}
          >
            <Text style={[styles.filtroTexto, filtroLista === 'todos' && styles.filtroTextoAtivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroLista === 'adicionados' && styles.filtroAtivo]}
            onPress={() => setFiltroLista('adicionados')}
          >
            <Text style={[styles.filtroTexto, filtroLista === 'adicionados' && styles.filtroTextoAtivo]}>
              Adicionados
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {carregando && <Text style={styles.estadoTexto}>Carregando atletas...</Text>}

          {!carregando && erro && (
            <TouchableOpacity style={styles.estadoCard} onPress={carregarAtletas}>
              <Text style={styles.estadoTexto}>{erro}</Text>
              <Text style={styles.tentarNovamente}>Tocar para tentar novamente</Text>
            </TouchableOpacity>
          )}

          {!carregando && !erro && atletasFiltrados.length === 0 && (
            <Text style={styles.estadoTexto}>Nenhum atleta encontrado.</Text>
          )}

          {!carregando && !erro && atletasFiltrados.map((atleta, idx) => {
            const vinculado = estaVinculado(atleta);
            const atualizando = atualizandoId === atleta.id_usuario;
            const esporte = atleta.modalidade_esportiva || atleta.esporte || 'Atleta';

            return (
              <TouchableOpacity
                key={atleta.id_usuario}
                style={styles.atletaCard}
                activeOpacity={0.75}
                onPress={() => alternarVinculo(atleta)}
                disabled={atualizando}
              >
                <View style={styles.atletaLeft}>
                  <View style={[styles.avatar, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                    <Text style={styles.avatarIniciais}>{iniciais(atleta.nome)}</Text>
                  </View>
                  <View style={styles.atletaInfo}>
                    <Text style={styles.atletaNome} numberOfLines={1}>{atleta.nome}</Text>
                    <Text style={styles.atletaEsporte} numberOfLines={1}>
                      {esporte}
                    </Text>
                    <Text style={styles.atletaEmail} numberOfLines={1}>
                      {atleta.email || 'E-mail nao informado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.atletaRight}>
                  <Text style={[styles.acaoTexto, vinculado && styles.acaoTextoRemover]}>
                    {atualizando ? 'Salvando' : vinculado ? 'Remover' : 'Adicionar'}
                  </Text>
                  <View style={[styles.checkbox, vinculado && styles.checkboxSel]}>
                    {vinculado && <Text style={styles.checkmark}>V</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerSubtitulo: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  headerResumo: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 10 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: '#333',
    ...Platform.select({
      ios: { boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' },
      android: { elevation: 2 },
      web: { boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' },
    }),
  },
  filtros: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filtroBotao: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroAtivo: {
    backgroundColor: RED,
    borderColor: RED,
  },
  filtroTexto: {
    color: '#555',
    fontSize: 14,
    fontWeight: '700',
  },
  filtroTextoAtivo: {
    color: '#fff',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24, gap: 0 },
  estadoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  estadoTexto: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  tentarNovamente: {
    color: RED,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  atletaCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  atletaLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  avatarIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  atletaInfo: { flex: 1, gap: 2 },
  atletaNome: { fontSize: 15, fontWeight: '600', color: '#111' },
  atletaEsporte: { fontSize: 13, color: '#777' },
  atletaEmail: { fontSize: 12, color: '#999' },
  atletaRight: { alignItems: 'flex-end', gap: 6 },
  acaoTexto: { color: RED, fontSize: 12, fontWeight: '700' },
  acaoTextoRemover: { color: '#777' },
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
});
