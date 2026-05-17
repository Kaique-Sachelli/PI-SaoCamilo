import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Adicione a lógica de autenticação aqui
    console.log('E-mail:', email);
    console.log('Senha:', password);
  };

  const handleCreateAccount = () => {
    // Navegue para a tela de cadastro ou abra o fluxo de criação de conta
    console.log('Criar conta');
  };

  const handleForgotPassword = () => {
    // Adicione ação para recuperação de senha
    console.log('Esqueci minha senha');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1F3" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.backgroundShape} />

        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>✶</Text>
            <Text style={styles.logoText}>SÃO CAMILO</Text>
          </View>

          <Text style={styles.title}>LOGIN</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>

          <Text style={styles.privacyText}>Política de privacidade</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não possui conta?</Text>
          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.createAccountButtonText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F1F3',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#F0D9D9',
    transform: [{ rotate: '20deg' }],
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 32,
    color: '#B70C0C',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F7F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E2E5',
    color: '#1B1B1B',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#B70C0C',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#B70C0C',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  privacyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
  },
  footer: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#6C6C6C',
    fontSize: 14,
    marginBottom: 12,
  },
  createAccountButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B70C0C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  createAccountButtonText: {
    color: '#B70C0C',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LoginScreen;
