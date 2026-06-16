import { useState, useEffect } from 'react';
import { API_URL } from '../constants/url';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type Categoria = 'Atletas' | 'Treinadores' | 'Médicos' | 'Nutricionistas';
/** 
type Usuario = {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
  categoria: Categoria;
  foto: any;
};//*mentando placebo
/**const USUARIOS: Usuario[] = [
  { id: 1, nome: 'Marcus Silva',     email: 'Marcus@gmail.com',  especialidade: 'Vôlei',   categoria: 'Atletas',        foto: require('./assets/Img/marcus.jpg') },
  { id: 2, nome: 'Eurico Miranda',   email: 'Eurico@gmail.com',  especialidade: 'Boxe',    categoria: 'Atletas',        foto: null },
  { id: 3, nome: 'Ricardo Gomes',    email: 'Ricardo@gmail.com', especialidade: 'Natação', categoria: 'Atletas',        foto: null },
  { id: 4, nome: 'Márcia Figueiras', email: 'Marcus@gmail.com',  especialidade: 'Natação', categoria: 'Atletas',        foto: null },
  { id: 5, nome: 'Jéssica dos Santos', email: 'Jéssica@gmail.com', especialidade: 'Tênis', categoria: 'Atletas',        foto: null },
  { id: 6, nome: 'Carlos Mendes',    email: 'Carlos@gmail.com',  especialidade: 'Futebol', categoria: 'Treinadores',    foto: null },
  { id: 7, nome: 'Ana Paula',        email: 'Ana@gmail.com',     especialidade: 'CRM 12345', categoria: 'Médicos',      foto: null },
  { id: 8, nome: 'Beatriz Lima',     email: 'Beatriz@gmail.com', especialidade: 'CRN 45.221', categoria: 'Nutricionistas', foto: null },
];
/** */

const CATEGORIAS: Categoria[] = ['Atletas', 'Treinadores', 'Médicos', 'Nutricionistas'];

const CATEGORIAS_GERAL: (Categoria | 'Todos')[] = ['Todos', ...CATEGORIAS];

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9', '#6a1b9a', '#00838f', '#558b2f'];

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}
function converterCategoria(tipo: string) {
  switch (tipo) {
    case 'Atleta':
      return 'Atletas';

    case 'Treinador':
      return 'Treinadores';

    case 'Medico':
      return 'Médicos';

    case 'Nutricionista':
      return 'Nutricionistas';

    default:
      return 'Atletas';
  }
}
export default function GerenciarUsuarios() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<Categoria | 'Todos'>('Todos');
  const [statusFiltro, setStatusFiltro] = useState<'Ativos' | 'Desativados'>('Ativos');
  const [statusMenuAberto, setStatusMenuAberto] = useState(false);
  const [removidos, setRemovidoss] = useState<number[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const dados = await response.json();

      setUsuarios(dados);
    } catch (erro) {
      console.log('Erro ao carregar usuários:', erro);
    }
  }
async function excluirUsuario(id: number) {
  try {
    const response = await fetch(
      `${API_URL}/usuario/${id}/desativar`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );

    const dados = await response.json();

    if (dados.sucesso) {
      carregarUsuarios();
      if (Platform.OS === 'web') {
        alert('Usuário desativado com sucesso');
      } else {
        Alert.alert('Sucesso', 'Usuário desativado com sucesso');
      }
    } else {
      if (Platform.OS === 'web') {
        alert('Erro: ' + (dados.mensagem || 'Não foi possível desativar o usuário'));
      } else {
        Alert.alert('Erro', dados.mensagem || 'Não foi possível desativar o usuário');
      }
    }

  } catch (erro) {
    console.log('Erro ao desativar usuário:', erro);
    if (Platform.OS === 'web') {
      alert('Erro ao conectar ao servidor');
    } else {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  }
}
async function reativarUsuario(id: number) {
  try {
    const response = await fetch(
      `${API_URL}/usuario/${id}/aprovar`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );

    const dados = await response.json();

    if (dados.sucesso) {
      carregarUsuarios();
      if (Platform.OS === 'web') {
        alert('Usuário reativado com sucesso');
      } else {
        Alert.alert('Sucesso', 'Usuário reativado com sucesso');
      }
    } else {
      if (Platform.OS === 'web') {
        alert('Erro: ' + (dados.mensagem || 'Não foi possível reativar o usuário'));
      } else {
        Alert.alert('Erro', dados.mensagem || 'Não foi possível reativar o usuário');
      }
    }

  } catch (erro) {
    console.log('Erro ao reativar usuário:', erro);
    if (Platform.OS === 'web') {
      alert('Erro ao conectar ao servidor');
    } else {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  }
}
  const handleRemover = (id: number, nome: string, situacao: string) => {
    if (situacao === 'Desativado') {
      if (Platform.OS === 'web') {
        const confirmar = window.confirm(`Tem certeza que deseja reativar ${nome}?`);
        if (!confirmar) return;
        reativarUsuario(id);
        return;
      }

      Alert.alert(
        'Reativar usuário',
        `Tem certeza que deseja reativar ${nome}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Reativar',
            style: 'default',
            onPress: () => {
              reativarUsuario(id);
            },
          },
        ]
      );
      return;
    }

    if (Platform.OS === 'web') {
      const confirmar = window.confirm(`Tem certeza que deseja desativar ${nome}?`);
      if (!confirmar) return;
      excluirUsuario(id);
      return;
    }

    Alert.alert(
      'Desativar usuário',
      `Tem certeza que deseja desativar ${nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => {
            excluirUsuario(id);
          },
        },
      ]
    );
  };
  const lista = usuarios.filter(
  (u) => {
    const statusOk = statusFiltro === 'Ativos' 
      ? u.situacao !== 'Desativado' 
      : u.situacao === 'Desativado';
    
    const categoriasOk = categoria === 'Todos' || converterCategoria(u.tipo_perfil) === categoria;
    
    const buscaOk = 
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      (u.registro || '').toLowerCase().includes(busca.toLowerCase()) ||
      u.tipo_perfil.toLowerCase().includes(busca.toLowerCase()) ||
      u.situacao.toLowerCase().includes(busca.toLowerCase());
    
    return statusOk && categoriasOk && buscaOk;
  }
);

  /**  const lista = USUARIOS.filter(
      (u) =>
        !removidos.includes(u.id) &&
        u.categoria === categoria &&
        (u.nome.toLowerCase().includes(busca.toLowerCase()) ||
          u.email.toLowerCase().includes(busca.toLowerCase()))
    );
  /* */

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
          <Text style={styles.headerTitulo}>Gerenciar usuários</Text>
        </View>

        {/* ── Busca ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchRow}>
            <Text style={styles.searchIcone}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por nome ou e-mail"
              placeholderTextColor="#bbb"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </View>

        {/* ── Filtros ── */}
        <View style={styles.filtrosContainer}>
          <ScrollView
            style={styles.filtrosScroll}
            contentContainerStyle={styles.filtrosRow}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            horizontal
          >
            {CATEGORIAS_GERAL.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.filtroPill, categoria === c && styles.filtroPillAtivo]}
                onPress={() => setCategoria(c)}
              >
                <Text style={[styles.filtroTexto, categoria === c && styles.filtroTextoAtivo]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Status Dropdown Button - Canto Direito */}
          <TouchableOpacity
            style={[styles.statusDropdownBtn, statusFiltro === 'Ativos' && styles.statusDropdownBtnAtivo]}
            onPress={() => setStatusMenuAberto(!statusMenuAberto)}
          >
            <Text style={[styles.statusDropdownText, statusFiltro === 'Ativos' && styles.statusDropdownTextAtivo]}>
              {statusFiltro}
            </Text>
            <Text style={[styles.statusDropdownArrow, statusFiltro === 'Ativos' && styles.statusDropdownArrowAtivo]}>
              {statusMenuAberto ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Dropdown Menu - Fora do Container */}
        {statusMenuAberto && (
          <View style={styles.statusDropdownMenuContainer}>
            <TouchableOpacity
              style={styles.statusDropdownItem}
              onPress={() => {
                setStatusFiltro('Ativos');
                setStatusMenuAberto(false);
              }}
            >
              <Text style={styles.statusDropdownItemText}>Ativos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusDropdownItem}
              onPress={() => {
                setStatusFiltro('Desativados');
                setStatusMenuAberto(false);
              }}
            >
              <Text style={styles.statusDropdownItemText}>Desativados</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Lista ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {lista.length === 0 && (
            <Text style={styles.semResultados}>Nenhum usuário encontrado.</Text>
          )}

          {lista.map((u, idx) => (
            <View key={u.id_usuario} style={styles.card}>
              <TouchableOpacity
                style={styles.cardEsquerda}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/perfil_usuario_adm', params: { id: u.id_usuario } })}
              >
                {u.foto ? (
                  <Image source={u.foto} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: CORES_AVATAR[idx % CORES_AVATAR.length] }]}>
                    <Text style={styles.avatarIniciais}>{iniciais(u.nome)}</Text>
                  </View>
                )}
                <View style={styles.usuarioInfo}>
                  <Text style={styles.usuarioNome}>{u.nome}</Text>
                  <Text style={styles.usuarioEmail}>{u.email}</Text>
                  <Text style={styles.usuarioEspecialidade}>{u.registro || u.tipo_perfil}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnLixo}
                onPress={() => handleRemover(u.id_usuario, u.nome, u.situacao)}
              >
                <Text style={styles.lixoIcone}>{u.situacao === 'Desativado' ? '↺' : '🗑'}</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  voltarBtn: { marginBottom: 4 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 32, fontWeight: '700' },

  // Search
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 2 },
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

  // Container Filtros
  filtrosContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Filtros
  filtrosScroll: {
    maxHeight: 50,
  },
  filtrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingRight: 120,
  },
  filtroPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  filtroPillAtivo: {
    backgroundColor: RED,
    borderColor: RED,
  },
  filtroTexto: { fontSize: 13, color: '#555', fontWeight: '500' },
  filtroTextoAtivo: { color: '#fff', fontWeight: '700' },

  // Status Dropdown
  statusDropdownBtn: {
    position: 'absolute',
    right: 16,
    top: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDropdownBtnAtivo: {
    backgroundColor: RED,
    borderColor: RED,
  },
  statusDropdownText: { fontSize: 13, color: '#555', fontWeight: '500' },
  statusDropdownTextAtivo: { color: '#fff', fontWeight: '700' },
  statusDropdownArrow: { fontSize: 10, color: '#555', marginLeft: 4 },
  statusDropdownArrowAtivo: { color: '#fff' },

  statusDropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  statusDropdownMenuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 16,
    marginTop: -5,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  statusDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusDropdownItemText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },

  semResultados: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 15,
  },

  // Card usuário
  card: {
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
  cardEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  avatarIniciais: { color: '#fff', fontWeight: '700', fontSize: 15 },
  usuarioInfo: { flex: 1, gap: 1 },
  usuarioNome: { fontSize: 15, fontWeight: '700', color: '#111' },
  usuarioEmail: { fontSize: 12, color: '#888' },
  usuarioEspecialidade: { fontSize: 12, color: RED, fontWeight: '600', marginTop: 1 },

  // Botão lixo
  btnLixo: {
    padding: 6,
    marginLeft: 8,
  },
  lixoIcone: { fontSize: 20 },
});
