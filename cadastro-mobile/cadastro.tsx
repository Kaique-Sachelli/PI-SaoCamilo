import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleVoltar = () => {
    router.back();
  };

  const handleCriarConta = async () => {
    if (!nome || !dataNascimento || !telefone || !email || !senha) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Cadastro attempt:', { nome, dataNascimento, telefone, email, senha });
      // Após cadastro bem-sucedido, voltar para a tela de login
      // router.back();
    } catch (error) {
      alert('Erro ao criar conta');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header com título e botão voltar */}
          <ThemedView style={styles.header}>
            <ThemedText type="small" style={styles.headerTitle}>
              Cadastro - Atleta
            </ThemedText>
          </ThemedView>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={handleVoltar}
              style={styles.voltarContainer}
              disabled={loading}
            >
              <ThemedText type="small" style={styles.voltarText}>
                ← Voltar
              </ThemedText>
            </TouchableOpacity>

            {/* Card do Formulário */}
            <ThemedView
              style={[
                styles.formCard,
                {
                  backgroundColor: theme.background,
                  shadowColor: '#000',
                },
              ]}
            >
              {/* Título Cadastro */}
              <ThemedText type="title" style={styles.cadastroTitle}>
                Cadastro
              </ThemedText>

              {/* Campo Nome */}
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.textSecondary,
                    backgroundColor: theme.background,
                  },
                ]}
                placeholder="Nome:"
                placeholderTextColor={theme.textSecondary}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                editable={!loading}
              />

              {/* Campo Data de Nascimento */}
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.textSecondary,
                    backgroundColor: theme.background,
                  },
                ]}
                placeholder="Data de nascimento:"
                placeholderTextColor={theme.textSecondary}
                value={dataNascimento}
                onChangeText={setDataNascimento}
                keyboardType="numeric"
                editable={!loading}
              />

              {/* Campo Telefone */}
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.textSecondary,
                    backgroundColor: theme.background,
                  },
                ]}
                placeholder="Telefone:"
                placeholderTextColor={theme.textSecondary}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                editable={!loading}
              />

              {/* Campo E-mail */}
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

              {/* Campo Senha */}
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
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                editable={!loading}
              />

              {/* Botão Criar Conta */}
              <TouchableOpacity
                style={[styles.criarContaButton, loading && styles.buttonDisabled]}
                onPress={handleCriarConta}
                disabled={loading}
                activeOpacity={0.8}
              >
                <ThemedText
                  type="smallBold"
                  style={[styles.criarContaButtonText, { color: '#ffffff' }]}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.four,
    paddingVertical: Spacing.one,
  },
  voltarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  formCard: {
    borderRadius: 16,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.three,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cadastroTitle: {
    textAlign: 'center',
    fontSize: 28,
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
  criarContaButton: {
    backgroundColor: '#B3151F',
    borderRadius: 8,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  criarContaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
