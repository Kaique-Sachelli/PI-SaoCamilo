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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type Solicitacao = {
  id: number;
  nome: string;
  tipo: 'ATLETA' | 'NUTRICIONISTA' | 'TREINADOR';
  email: string;
  telefone: string;
  registro: string;
  especialidade: string;
  data: string;
  foto: null;
};

// const SOLICITACOES: Solicitacao[] = [
//   {
//     id: 1,
//     nome: 'Gabriel Moreira',
//     tipo: 'ATLETA',
//     email: 'gabriel.moreira@saocamilo.br',
//     telefone: '(11) 98765-4321',
//     registro: 'RA 2026.10234',
//     especialidade: 'Handebol',
//     data: '21/05/2026',
//     foto: null,
//   },
//   {
//     id: 2,
//     nome: 'Larissa Antunes',
//     tipo: 'NUTRICIONISTA',
//     email: 'larissa.antunes@saocamilo.br',
//     telefone: '(11) 97123-5544',
//     registro: 'CRN 8 - 45.221',
//     especialidade: '',
//     data: '24/05/2026',
//     foto: null,
//   },
// ];

const FILTROS = ['Hoje', '30 dias', '15 dias', '7 dias'];

const CORES_AVATAR: Record<string, string> = {
  Atleta: '#1565c0',
  Nutricionista: '#2e7d32',
  Treinador: '#6a1b9a',
  Medico: '#ef6c00',
  Admin: '#424242',
};

function iniciais(nome?: string) {
  if (!nome) return '?';

  return nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}


export default function SolicitacoesCadastro() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Hoje');

  //  const [recusados, setRecusados] = useState<number[]>([]);
  //  const [aprovados, setAprovados] = useState<number[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);

  /**const lista = SOLICITACOES.filter(
    (s) =>
      !recusados.includes(s.id) &&
      !aprovados.includes(s.id) &&
      (s.nome.toLowerCase().includes(busca.toLowerCase()) ||
        s.email.toLowerCase().includes(busca.toLowerCase()))
  );*/
  console.log('SOLICITACOES:', solicitacoes);
  const lista = Array.isArray(solicitacoes)
    ? solicitacoes.filter(
      (s) =>
        s.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        s.email?.toLowerCase().includes(busca.toLowerCase())
    )
    : [];
    
  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      const response = await fetch(
        `${API_URL}/usuarios/pendentes`
      );
      const dados = await response.json();

      console.log('DADOS API:', dados);

      setSolicitacoes(dados);

    } catch (erro) {
      console.log('Erro ao carregar solicitações:', erro);
    }
  }
  async function aprovarUsuario(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/usuario/${id}/aprovar`,
        {
          method: 'PATCH',
        }
      );

      const dados = await response.json();

      if (dados.sucesso) {
        carregarSolicitacoes();
      }

    } catch (erro) {
      console.log('Erro ao aprovar usuário:', erro);
    }
  }
  async function recusarUsuario(id: number) {
    try {
      const response = await fetch(
        `${API_URL}/usuario/${id}/desativar`,
        {
          method: 'PATCH',
        }
      );

      const dados = await response.json();

      if (dados.sucesso) {
        carregarSolicitacoes();
      }

    } catch (erro) {
      console.log('Erro ao recusar usuário:', erro);
    }
  }

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
          <Text style={styles.headerTitulo}>Solicitações de cadastro</Text>
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
        <View style={styles.filtrosRow}>
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filtroPill, filtro === f && styles.filtroPillAtivo]}
              onPress={() => setFiltro(f)}
            >
              <Text style={[styles.filtroTexto, filtro === f && styles.filtroTextoAtivo]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Lista ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {lista.length === 0 && (
            <Text style={styles.semResultados}>Nenhuma solicitação encontrada.</Text>
          )}

          {lista.map((s) => (
            <View key={s.id_usuario} style={styles.card}>
              {}
              <View style={styles.cardTopo}>
                <View style={[styles.avatar, { backgroundColor: CORES_AVATAR[s.tipo_perfil] ?? '#888' }]}>
                  <Text style={styles.avatarIniciais}>{iniciais(s.nome)}</Text>
                </View>
                <View>
                  <Text style={styles.cardNome}>{s.nome}</Text>
                  <Text style={[styles.cardTipo, { color: RED }]}>{s.tipo_perfil}</Text>
                </View>
              </View>

              <View style={styles.divisor} />

              {/* Detalhes */}
              <View style={styles.detalheRow}>
                <Text style={styles.detalheIcone}>✉</Text>
                <Text style={styles.detalheTexto}>{s.email}</Text>
              </View>
              <View style={styles.detalheRow}>
                <Text style={styles.detalheIcone}>📞</Text>
                <Text style={styles.detalheTexto}>{s.telefone}</Text>
              </View>
              <View style={styles.detalheRow}>
                <Text style={styles.detalheIcone}>💳</Text>
                <Text style={styles.detalheTexto}>{s.registro || '-'}</Text>
              </View>
              {s.especialidade ? (
                <View style={styles.detalheRow}>
                  <Text style={styles.detalheIcone}>🏅</Text>
                  <Text style={styles.detalheTexto}>{s.modalidade_esportiva}</Text>
                </View>
              ) : null}
              <View style={styles.detalheRow}>
                <Text style={styles.detalheIcone}>📅</Text>
                <Text style={styles.detalheTexto}>Solicitado em {s.data}</Text>
              </View>

              {/* Botões */}
              <View style={styles.botoesRow}>
                <TouchableOpacity
                  style={styles.btnRecusar}
                  onPress={() => recusarUsuario(s.id_usuario)}
                >
                  <Text style={styles.btnRecusarTexto}>✕  Recusar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnAprovar}
                  onPress={() => aprovarUsuario(s.id_usuario)}
                >
                  <Text style={styles.btnAprovarTexto}>✓  Aprovar</Text>
                </TouchableOpacity>
              </View>
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
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitulo: { color: '#fff', fontSize: 24, fontWeight: '700' },

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
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filtroPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },

  semResultados: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 15,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  cardTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIniciais: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cardNome: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardTipo: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },

  divisor: { height: 1, backgroundColor: '#f0f0f0' },

  // Detalhe linhas
  detalheRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detalheIcone: { fontSize: 14, width: 20, textAlign: 'center', opacity: 0.6 },
  detalheTexto: { fontSize: 13, color: '#444', flex: 1 },

  // Botões
  botoesRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnRecusar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnRecusarTexto: { fontSize: 14, color: '#555', fontWeight: '600' },
  btnAprovar: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnAprovarTexto: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
