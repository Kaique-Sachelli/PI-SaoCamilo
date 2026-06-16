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
      }
    );

    const dados = await response.json();

    if (dados.sucesso) {
      carregarUsuarios();
    }

  } catch (erro) {
    console.log('Erro ao desativar usuário:', erro);
  }
}
  const handleRemover = (id: number, nome: string) => {
  Alert.alert(
    'Desativar usuário',
    `Deseja desativar ${nome}?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Desativar',
        style: 'destructive',
        onPress: async () => {
          await excluirUsuario(id);
        },
      },
    ]
  );
};
  const lista = usuarios.filter(
  (u) =>
    u.situacao !== 'Desativado' &&
    (categoria === 'Todos' || converterCategoria(u.tipo_perfil) === categoria) &&
    (
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      (u.registro || '').toLowerCase().includes(busca.toLowerCase()) ||
      u.tipo_perfil.toLowerCase().includes(busca.toLowerCase()) ||
      u.situacao.toLowerCase().includes(busca.toLowerCase())
    )
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
        <ScrollView
          style={styles.filtrosScroll}
          contentContainerStyle={styles.filtrosRow}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
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
                onPress={() => handleRemover(u.id_usuario, u.nome)}
              >
                <Text style={styles.lixoIcone}>🗑</Text>
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

  // Filtros
  filtrosScroll: {
    maxHeight: 100,
    paddingHorizontal: 16,
  },
  filtrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    gap: 8,
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
