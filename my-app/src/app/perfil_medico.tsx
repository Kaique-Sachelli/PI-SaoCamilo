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
import { NavbarMedico } from './Navbar_Medico';

export default function PerfilTreinador() {
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
          {/* Sino canto superior direito */}
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.sinoWrap}>
              <Image source={require('./assets/Img/sino.png')} style={styles.sino} />
              <View style={styles.sinoDot} />
            </TouchableOpacity>
          </View>

          {/* Foto circular centralizada */}
          <View style={styles.fotoWrap}>
            <Image
              source={require('./assets/Img/perfil.png')}
              style={styles.fotoAtleta}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.nomeTexto}>Kacique</Text>
          <Text style={styles.funcaoTexto}>Treinador</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Card Informações Pessoais ── */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitulo}>Informações Pessoais</Text>

            <View style={styles.divisor} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcone}>✉</Text>
              <View>
                <Text style={styles.infoLabel}>E-mail:</Text>
                <Text style={styles.infoValor}>carlinmaia@gmail.com</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcone}>📞</Text>
              <View>
                <Text style={styles.infoLabel}>Telefone:</Text>
                <Text style={styles.infoValor}>(55)11 4002-8922</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcone}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Idade:</Text>
                <Text style={styles.infoValor}>45 anos</Text>
              </View>
            </View>
          </View>

          {/* ── Botão Sair ── */}
          <TouchableOpacity
            style={styles.btnSair}
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.btnSairIcone}>⎋</Text>
            <Text style={styles.btnSairTexto}>Sair</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <NavbarMedico active="perfil" />

      </SafeAreaView>
    </ImageBackground>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // Header vermelho
  header: {
    backgroundColor: RED,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 12,
  },
  sinoWrap: { position: 'relative' },
  sino: { width: 28, height: 28, tintColor: '#fff' },
  sinoDot: {
    position: 'absolute', top: 0, right: 0,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#FF9800',
    borderWidth: 1.5, borderColor: RED,
  },

  // Foto
  fotoWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.25)' },
      android: { elevation: 5 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.25)' },
    }),
  },
  fotoAtleta: { width: '100%', height: '100%' },

  nomeTexto: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  funcaoTexto: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: 15,
    fontWeight: '400',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 24 },

  // Card de informações
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 14,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  divisor: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: -4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  infoIcone: { fontSize: 20, marginTop: 2 },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 1 },
  infoValor: { fontSize: 14, fontWeight: '500', color: '#111' },

  // Botão Sair
  btnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: RED,
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { boxshadow: '0px 2px 6px rgba(0,0,0,0.06)' },
      android: { elevation: 2 },
      web: { boxshadow: '0px 2px 6px rgba(0,0,0,0.06)' },
    }),
  },
  btnSairIcone: { fontSize: 18, color: RED },
  btnSairTexto: { fontSize: 16, fontWeight: '700', color: RED },
});
