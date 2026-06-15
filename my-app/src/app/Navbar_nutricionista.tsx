import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const RED = '#B3151F';

export type NavTabNutricionista = 'home'| 'perfil';

type Props = {
  active: NavTabNutricionista;
};

export function NavbarNutricionista({ active }: Props) {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      {/* Home */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage_nutricionista')}>
        <Image
          source={require('./assets/Img/homepage.png')}
          style={[styles.navImg, active === 'home' && styles.navImgAtivo]}
        />
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/perfil_nutricionista')}>
        <Image
          source={require('./assets/Img/perfil2.png')}
          style={[styles.navImg, active === 'perfil' && styles.navImgAtivo]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navImg: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  navImgAtivo: {
    tintColor: RED,
  },
  navEmoji: {
    fontSize: 22,
    opacity: 0.35,
  },
  navEmojiAtivo: {
    opacity: 1,
  },
});
