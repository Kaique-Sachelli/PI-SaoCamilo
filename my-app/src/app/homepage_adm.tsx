import { useState, useEffect } from 'react';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { API_URL } from '../constants/url';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { NavbarADM } from './Navbar_ADM';
import { NotificacaoPopup } from './notificacao';

const MENU = [
  { id: 1, icone: require('./assets/Img/solicitacoes.png'), label: 'Solicitações de cadastro', rota: '/solicitacoes_cadastro' },
  { id: 2, icone: require('./assets/Img/gerenciar.png'), label: 'Gerenciar Usuários', rota: '/gerenciar_usuarios' },
];
//criando grafico

export default function HomepageAdm() {
  const router = useRouter();
  const { usuario } = useUser();
  const [notifVisivel, setNotifVisivel] = useState(false);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
useEffect(() => {
  carregarGrafico();
}, []);

async function carregarGrafico() {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/usuarios-por-perfil`
    );

    const dados = await response.json();

    const cores = [
      '#ff0000',
      '#0026ff',
      '#00ff0d',
      '#fbe200',
      '#ff00ea',
    ];

    const formatado = dados.map(
      (item: any, index: number) => ({
        name: item.tipo_perfil,
        population: item.quantidade,
        color: cores[index % cores.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      })
    );

    setDadosGrafico(formatado);
  } catch (erro) {
    console.log('Erro ao carregar gráfico:', erro);
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
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.titulo}>Hidra Pro-formance</Text>
              <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
            </View>

            <TouchableOpacity onPress={() => setNotifVisivel(true)}>
              <View style={styles.sinoWrap}>
                <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
                <View style={styles.sinoDot} />
              </View>
            </TouchableOpacity>

          </View>
          <Text style={styles.funcao}>Olá, {usuario?.nome}</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Conteúdo ── */}
          <View style={styles.conteudo}>

            {/* Gráfico */}
            <View style={styles.graficoCard}>
              <PieChart
                data={dadosGrafico}
                width={Dimensions.get('window').width - 60}
                height={180}
                chartConfig={{
                  color: () => '#000',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
            </View>

            {/* Painel */}
            <Text style={styles.painelLabel}>Painel</Text>

            {MENU.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                activeOpacity={0.75}
                onPress={() => router.push(item.rota as any)}
              >
                <View style={styles.menuEsquerda}>
                  <Image source={item.icone} style={styles.menuIcone} />
                  <Text style={styles.menuTexto}>{item.label}</Text>
                </View>
                <Text style={styles.menuSeta}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* ── Bottom Nav ── */}
        <NavbarADM active="home" />

        {/* ── Popup de Notificações ── */}
        <NotificacaoPopup
          visible={notifVisivel}
          onClose={() => setNotifVisivel(false)}
        />
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
    marginBottom: 20,
  },
  titulo: { fontSize: 26, color: '#fff', fontWeight: '700' },
  subtitulo: { fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: '300', marginTop: 2 },
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

  // Conteúdo
  conteudo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },

  // Gráfico
  graficoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 4,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  grafico: { width: 180, height: 170, resizeMode: 'contain' },

  // Painel label
  painelLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 2 },

  // Menu cards
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  menuEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcone: { width: 22, height: 22, resizeMode: 'contain', tintColor: RED },
  menuTexto: { fontSize: 15, fontWeight: '600', color: '#111' },
  menuSeta: { fontSize: 22, color: '#ccc' },

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
