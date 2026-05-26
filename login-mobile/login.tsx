import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UniversityLogo } from '@/components/university-logo';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement login API call
      console.log('Login attempt:', { email, password });
      // router.replace('/(tabs)/');
    } catch (error) {
      alert('Erro ao fazer login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // router.push('/forgot-password');
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  const handleCreateAccount = () => {
    // router.push('/register');
    alert('Funcionalidade de cadastro em desenvolvimento');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <ThemedView style={styles.logoSection}>
            <ThemedView style={styles.logoContainer}>
              <UniversityLogo size={100} />
            </ThemedView>
            <ThemedText type="subtitle" style={styles.universityName}>
              CENTRO UNIVERSITÁRIO
            </ThemedText>
            <ThemedText type="title" style={styles.campusName}>
              SÃOCAMILO
            </ThemedText>
          </ThemedView>

          {/* Login Form Section */}
          <ThemedView style={styles.formSection}>
            <ThemedText type="title" style={styles.loginTitle}>
              LOGIN
            </ThemedText>

            {/* Email Input */}
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.textSecondary,
                  backgroundColor: theme.background,
                },
              ]}
              placeholder="E-mail:"
              placeholderTextColor={theme.textSecondary}
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
                  color: theme.text,
                  borderColor: theme.textSecondary,
                  backgroundColor: theme.background,
                },
              ]}
              placeholder="Senha:"
              placeholderTextColor={theme.textSecondary}
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
              <ThemedText type="link" style={styles.forgotPasswordText}>
                Esqueci minha senha?
              </ThemedText>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <ThemedText
                type="smallBold"
                style={[styles.loginButtonText, { color: '#ffffff' }]}
              >
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </ThemedText>
            </TouchableOpacity>

            {/* Privacy Policy Link */}
            <TouchableOpacity
              style={styles.privacyContainer}
              disabled={loading}
            >
              <ThemedText type="small" style={styles.privacyText}>
                Política de privacidade
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Register Section */}
          <ThemedView style={styles.registerSection}>
            <ThemedText type="default" style={styles.registerQuestion}>
              Não possuo conta?
            </ThemedText>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleCreateAccount}
              disabled={loading}
              activeOpacity={0.8}
            >
              <ThemedText type="smallBold" style={styles.registerButtonText}>
                Criar conta
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
    paddingTop: Spacing.four,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  universityName: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
    marginBottom: Spacing.half,
  },
  campusName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  formSection: {
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.one,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#666666',
  },
  loginButton: {
    backgroundColor: '#B3151F',
    borderRadius: 8,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.two,
    minHeight: 48,
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
    marginTop: Spacing.two,
  },
  privacyText: {
    color: '#666666',
    textDecorationLine: 'underline',
  },
  registerSection: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
    marginTop: Spacing.four,
  },
  registerQuestion: {
    fontSize: 16,
    fontWeight: '500',
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: '#B3151F',
    borderRadius: 8,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    minHeight: 48,
  },
  registerButtonText: {
    color: '#B3151F',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
