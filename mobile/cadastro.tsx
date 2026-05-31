import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  View,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    } catch (error) {
      alert('Erro ao criar conta');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./img/Background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            <TouchableOpacity
              onPress={() => navigation.navigate('login')}
              style={styles.voltarContainer}
              disabled={loading}
            >
              <ThemedText type="small" style={styles.voltarText}>
                ← Voltar
              </ThemedText>
            </TouchableOpacity>

            {/* Card do Formulário */}
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
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
                    color: '#747474',
                    borderColor: '#747474',
                    backgroundColor: '#ffffff',
                  },
                ]}
                placeholder="Nome:"
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
                    color: '#747474',
                    borderColor: '#747474',
                    backgroundColor: '#ffffff',
                  },
                ]}
                placeholder="Data de nascimento:"
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
                    color: '#747474',
                    borderColor: '#747474',
                    backgroundColor: '#ffffff',
                  },
                ]}
                placeholder="Telefone:"
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

              {/* Campo Senha */}
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
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                editable={!loading}
              />

              {/* Campo Nome */}
              <TextInput
                style={[
                  styles.input,
                  {
                    color: '#747474',
                    borderColor: '#747474',
                    backgroundColor: '#ffffff',
                  },
                ]}
                placeholder="Nome:"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    fontSize: 20,
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
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  cadastroTitle: {
    color: '#000000',
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
