import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const MENU = [
  { id: 1, icone: require('./assets/Img/solicitacoes.png'),  label: 'Solicitações de cadastro', rota: '/solicitacoes_cadastro'              },
  { id: 2, icone: require('./assets/Img/gerenciar.png'),     label: 'Gerenciar Usuários',        rota: '/gerenciar_usuarios'  },
  { id: 3, icone: require('./assets/Img/batimento2.png'),    label: 'Ver Atletas',               rota: '/TelaAtleta'            },
];

export default function HomepageAdm() {
  const router = useRouter();

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
            <View style={styles.sinoWrap}>
              <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
              <View style={styles.sinoDot} />
            </View>
          </View>
          <Text style={styles.funcao}>Olá, Administrador</Text>
        </View>

        {/* ── Conteúdo ── */}
        <View style={styles.conteudo}>

          {/* Gráfico */}
          <View style={styles.graficoCard}>
            <Image source={require('./assets/Img/grafico.png')} style={styles.grafico} />
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

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/homepage.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/batimento3.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/documento.png')} style={styles.navImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./assets/Img/perfil2.png')} style={styles.navImg} />
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
