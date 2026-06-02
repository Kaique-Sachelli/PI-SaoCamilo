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

const REFEICOES = [
  {
    titulo: 'Café da manhã',
    horario: '07:00',
    itens: ['2 ovos mexidos', 'Pão integral (2 fatias)', '1 fruta', 'Café sem açúcar'],
  },
  {
    titulo: 'Lanche da manhã',
    horario: '10:00',
    itens: ['1 iogurte natural', '1 punhado de castanhas'],
  },
  {
    titulo: 'Almoço',
    horario: '12:30',
    itens: ['150g de frango grelhado', 'Arroz integral (4 col.)', 'Feijão (1 concha)', 'Salada verde à vontade'],
  },
  {
    titulo: 'Lanche da tarde',
    horario: '15:30',
    itens: ['1 banana com pasta de amendoim', '200ml de água de coco'],
  },
  {
    titulo: 'Jantar',
    horario: '19:00',
    itens: ['150g de peixe assado', 'Batata-doce (1 média)', 'Legumes refogados'],
  },
];

export default function Dieta() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        {/* ── Header com tabs ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.nomeAtleta}>Atleta (Kacique)</Text>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => router.push('/exames_medico')}
            >
              <Text style={styles.tabTexto}>Sessões</Text>
            </TouchableOpacity>

            {/* Dieta — ativa */}
            <TouchableOpacity style={[styles.tab, styles.tabAtiva]}>
              <Text style={styles.tabTextoAtivo}>Dieta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => router.push('/exames_medico')}
            >
              <Text style={styles.tabTexto}>Exames</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Conteúdo ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.secaoTitulo}>Plano Alimentar</Text>

          {REFEICOES.map((r, i) => (
            <View key={i} style={styles.refeicaoCard}>
              <View style={styles.refeicaoTopo}>
                <Text style={styles.refeicaoTitulo}>{r.titulo}</Text>
                <View style={styles.horarioBadge}>
                  <Text style={styles.horarioTexto}>⏰ {r.horario}</Text>
                </View>
              </View>
              <View style={styles.divisor} />
              {r.itens.map((item, j) => (
                <View key={j} style={styles.itemRow}>
                  <View style={styles.itemDot} />
                  <Text style={styles.itemTexto}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_adm')}>
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
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  voltarBtn: { marginBottom: 6 },
  voltarTexto: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  nomeAtleta: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 18 },

  // Tabs — mesmo padrão de TelaAtleta
  tabsContainer: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  tabAtiva: { backgroundColor: '#D9D9D9' },
  tabTexto: { fontSize: 14, color: '#B0B0B0', fontWeight: '500' },
  tabTextoAtivo: { color: RED, fontWeight: '700', fontSize: 14 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },
  secaoTitulo: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },

  // Cards refeição
  refeicaoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 1px 4px rgba(0,0,0,0.07)' },
    }),
  },
  refeicaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refeicaoTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },
  horarioBadge: {
    backgroundColor: '#fff3e0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  horarioTexto: { fontSize: 12, color: '#e65100', fontWeight: '600' },
  divisor: { height: 1, backgroundColor: '#f0f0f0' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: RED },
  itemTexto: { fontSize: 13, color: '#444' },

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
