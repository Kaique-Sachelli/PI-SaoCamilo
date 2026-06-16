import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUrl } from '../constants/url';

interface AtletaDados {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  altura: number | null;
  peso: number | null;
  modalidade_esportiva: string | null;
}

function calcularIdade(dataNasc: string | undefined): string {
  if (!dataNasc) return '--';
  const nasc = new Date(dataNasc);
  if (isNaN(nasc.getTime())) return '--';
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return `${idade} anos`;
}

function iniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const CORES_AVATAR = ['#c0392b', '#8e44ad', '#16a085', '#d35400', '#2980b9'];

export default function PerfilAtleta() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id_atleta?: string; nome?: string }>();
  const atletaId = params.id_atleta;
  const nomeAtleta = params.nome || 'Atleta';

  const [dados, setDados] = useState<AtletaDados | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!atletaId) { setCarregando(false); return; }
    fetch(getUrl(`/usuarios/${atletaId}`))
      .then(r => r.json())
      .then(data => setDados(data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [atletaId]);

  const altura = dados?.altura;
  const peso = dados?.peso;
  const email = dados?.email;
  const telefone = dados?.telefone;
  const esporte = dados?.modalidade_esportiva;
  const idade = calcularIdade(dados?.data_nascimento);

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
              <Text style={styles.voltarIcone}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.nomeAtleta}>{nomeAtleta}</Text>
          </View>
          {esporte ? <Text style={styles.posicao}>{esporte}</Text> : null}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {carregando ? (
            <ActivityIndicator color={RED} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Card Foto + Perfil Atlético */}
              <View style={styles.perfilCard}>
                {/* Avatar */}
                <View style={styles.fotoWrap}>
                  <View style={[styles.fotoAtleta, styles.avatarPlaceholder, { backgroundColor: CORES_AVATAR[0] }]}>
                    <Text style={styles.avatarIniciais}>{iniciais(nomeAtleta)}</Text>
                  </View>
                </View>

                {/* Dados Perfil */}
                <View style={styles.dadosWrap}>
                  <Text style={styles.dadosTituloTexto}>Perfil Atlético</Text>

                  <View style={styles.dadoItem}>
                    <View>
                      <Text style={styles.dadoLabel}>Peso</Text>
                      <Text style={styles.dadoValor}>
                        {peso != null ? `${Number(peso).toFixed(1)} kg` : '--'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dadoItem}>
                    <View>
                      <Text style={styles.dadoLabel}>Altura</Text>
                      <Text style={styles.dadoValor}>
                        {altura != null ? `${Number(altura).toFixed(2)} m` : '--'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dadoItem}>
                    <View>
                      <Text style={styles.dadoLabel}>Idade</Text>
                      <Text style={styles.dadoValor}>{idade}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Acessar Histórico */}
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Acessar Histórico Atleta</Text>
                <TouchableOpacity
                  style={styles.btnAzul}
                  activeOpacity={0.85}
                  onPress={() => router.push('/historico_longitudional_medico')}
                >
                  <Text style={styles.btnAzulTexto}>Histórico Longitudinal</Text>
                </TouchableOpacity>
              </View>

              {/* Contatos do Atleta */}
              <View style={styles.contatosCard}>
                <Text style={styles.secaoTitulo}>Contatos do Atleta</Text>

                <View style={styles.contatoRow}>
                  <Text style={styles.contatoIcone}>✉</Text>
                  <View>
                    <Text style={styles.contatoLabel}>E-mail:</Text>
                    <Text style={styles.contatoValor}>{email || '--'}</Text>
                  </View>
                </View>

                <View style={styles.contatoRow}>
                  <Text style={styles.contatoIcone}>📞</Text>
                  <View>
                    <Text style={styles.contatoLabel}>Telefone:</Text>
                    <Text style={styles.contatoValor}>{telefone ? `+55 ${telefone}` : '--'}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';
const AZUL = '#1565c0';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  header: {
    backgroundColor: RED,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  voltarBtn: { padding: 4 },
  voltarIcone: { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 34 },
  nomeAtleta: { color: '#fff', fontSize: 22, fontWeight: '700', flex: 1, textAlign: 'center' },
  posicao: { color: 'rgba(255,255,255,0.85)', fontSize: 15, textAlign: 'center', fontWeight: '400' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 32 },

  perfilCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  fotoWrap: { width: '45%' },
  fotoAtleta: { width: '100%', height: 220 },
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  avatarIniciais: { color: '#fff', fontSize: 40, fontWeight: '700' },

  dadosWrap: { flex: 1, padding: 12, gap: 12, justifyContent: 'center' },
  dadosTituloTexto: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 4 },
  dadoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dadoLabel: { fontSize: 11, color: '#888' },
  dadoValor: { fontSize: 15, fontWeight: '600', color: '#111' },

  secao: { gap: 10 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },

  btnAzul: {
    backgroundColor: AZUL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { boxshadow: '0px 3px 8px rgba(21,101,192,0.3)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 3px 8px rgba(21,101,192,0.3)' },
    }),
  },
  btnAzulTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },

  contatosCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  contatoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  contatoIcone: { fontSize: 18, marginTop: 2 },
  contatoLabel: { fontSize: 12, color: '#888' },
  contatoValor: { fontSize: 14, fontWeight: '500', color: '#111' },
});
