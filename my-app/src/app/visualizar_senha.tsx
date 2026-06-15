import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInputProps,
} from 'react-native';

type Props = Omit<TextInputProps, 'secureTextEntry'> & {
  containerStyle?: object;
  inputStyle?: object;
};

export function SenhaInput({ containerStyle, inputStyle, ...props }: Props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        style={[styles.textInput, inputStyle]}
        secureTextEntry={!visivel}
      />
      <TouchableOpacity onPress={() => setVisivel((v) => !v)} style={styles.botao}>
        <Image
          source={require('./assets/Img/eyes-off.png')}
          style={[styles.icone, visivel && styles.iconeVisivel]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#747474',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    fontWeight: '500',
    color: '#747474',
    minHeight: 44,
  },
  botao: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icone: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#747474',
    opacity: 0.4,
  },
  iconeVisivel: {
    opacity: 1,
    tintColor: '#B3151F',
  },
});
