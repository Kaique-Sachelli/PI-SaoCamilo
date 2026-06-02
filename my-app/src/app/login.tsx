import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Text,
  Image,
  ImageBackground,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Login attempt:', { email, password });
    } catch (error) {
      alert('Erro ao fazer login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  const handleCreateAccount = () => {
    alert('Funcionalidade de cadastro em desenvolvimento');
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Trocado ThemedView por View */}
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

          <Image 
            source={require('./assets/Img/Logo completa sem fundo.png')} 
            style={styles.logo} 
          />

          {/* Card do Formulário */}
          <View
            style={[
              styles.formCard,
                {
                  backgroundColor: '#ffffff',
                  elevation: 8,
                },
              ]}
          >

          <View style={styles.formSection}>
            <Text style={styles.loginTitle}>
              LOGIN
            </Text>

            {/* Email Input */}
            <TextInput
              style={[
                styles.input,
                {
                  color: '#747474',
                  borderColor: '#747474',
                  backgroundColor: '#ffffff',
                },
              ]}
              placeholder="E-mail:"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            {/* Password Input */}
            <TextInput
              style={[
                styles.input,
                {
                  color: '#747474',
                  borderColor: '#747474',
                  backgroundColor: '#ffffff',
                },
              ]}
              placeholder="Senha:"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>
                Esqueci minha senha?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              // onPress={() => router.push('/homepage_atleta')}
              onPress={() => router.push('/perfil_atleta')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.loginButtonText, { color: '#ffffff' }]}
              >
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </Text>
            </TouchableOpacity>

            {/* Privacy Policy Link */}
            <TouchableOpacity
              style={styles.privacyContainer}
              disabled={loading}
            >
              <Text style={styles.privacyText}>
                Política de privacidade
              </Text>
            </TouchableOpacity>
          </View>
          </View>

          {/* Register Section - Trocado ThemedView por View */}
          <View style={styles.registerSection}>
            <Text style={styles.registerQuestion}>
              Não possuo conta?
            </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/cadastro')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.criarconta}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  formCard: {
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 5,
    gap: 3,
      ...Platform.select({
      ios: {
          boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
      android: {
          elevation: 8,
      },
      web: {
          boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  campusName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  formSection: {
    gap: 10,
    marginBottom: 10,
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    width: '80%',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#666666',
  },
  loginButton: {
    backgroundColor: '#B3151F',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  privacyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  privacyText: {
    color: '#666666',
    textDecorationLine: 'underline',
  },
  registerSection: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  registerQuestion: {
    fontSize: 16,
    fontWeight: '500',
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: '#B3151F',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    minHeight: 48,
    marginBottom: 50,
  },
  criarconta: {
    color: '#B3151F',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});