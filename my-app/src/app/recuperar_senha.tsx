import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUrl } from '../constants/url';
import { SenhaInput } from './visualizar_senha';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRedefinirSenha = async () => {
    const emailTratado = email.trim();

    if (!emailTratado || !novaSenha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (novaSenha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('As senhas nao conferem');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getUrl('/recuperar-senha'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTratado, novaSenha }),
      });

      const data = await response.json();

      if (!response.ok || !data.sucesso) {
        alert(data.mensagem ?? 'Nao foi possivel atualizar a senha');
        return;
      }

      alert('Senha atualizada com sucesso. Entre novamente.');
      router.replace('/login');
    } catch (error) {
      alert('Nao foi possivel conectar ao servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.voltarContainer}
          disabled={loading}
        >
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.kavFlex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.formCard, { backgroundColor: '#ffffff', elevation: 8 }]}>
              <Text style={styles.titulo}>Redefinir senha</Text>
              <Text style={styles.descricao}>
                Informe o e-mail cadastrado e escolha uma nova senha.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail:"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <SenhaInput
                placeholder="Nova senha:"
                value={novaSenha}
                onChangeText={setNovaSenha}
                editable={!loading}
              />

              <SenhaInput
                placeholder="Confirmar nova senha:"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.botao, loading && styles.botaoDesabilitado]}
                onPress={handleRedefinirSenha}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoTexto}>
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  kavFlex: {
    flex: 1,
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 10,
  },
  voltarText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  formCard: {
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 18,
    ...Platform.select({
      ios: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
      android: { elevation: 8 },
      web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
    }),
  },
  titulo: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  descricao: {
    width: '90%',
    alignSelf: 'center',
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#747474',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '#747474',
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    minHeight: 44,
  },
  botao: {
    backgroundColor: '#B3151F',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
    alignSelf: 'center',
    width: '90%',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
