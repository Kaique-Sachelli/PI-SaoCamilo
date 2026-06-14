import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  View,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUrl } from '../constants/url';

type TipoPerfil = 'Atleta' | 'Treinador' | 'Médico' | 'Nutricionista';

const TIPOS: TipoPerfil[] = ['Atleta', 'Treinador', 'Médico', 'Nutricionista'];

function registroLabel(tipo: TipoPerfil): string | null {
  if (tipo === 'Atleta') return 'RA:';
  if (tipo === 'Médico') return 'CRM:';
  if (tipo === 'Nutricionista') return 'CRN:';
  return null;
}

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [registro, setRegistro] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState<TipoPerfil>('Atleta');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleVoltar = () => {
    router.back();
  };

  const formatarData = (texto: string) => {
    const digitos = texto.replace(/\D/g, '').slice(0, 8);
    let formatado = digitos;
    if (digitos.length > 4) {
      formatado = digitos.slice(0, 2) + '/' + digitos.slice(2, 4) + '/' + digitos.slice(4);
    } else if (digitos.length > 2) {
      formatado = digitos.slice(0, 2) + '/' + digitos.slice(2);
    }
    setDataNascimento(formatado);
  };

  const handleCriarConta = async () => {
    const label = registroLabel(tipoPerfil);
    if (!nome || !dataNascimento || !telefone || !email || !senha || (label && !registro)) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getUrl('/cadastro'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo_perfil: tipoPerfil,
          data_nascimento: dataNascimento,
          telefone,
          registro,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.sucesso) {
        alert(data.mensagem ?? 'Erro ao criar conta');
        return;
      }

      alert('Cadastro realizado! Aguarde aprovação do administrador.');
      router.push('/login');
    } catch (error) {
      alert('Não foi possível conectar ao servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const label = registroLabel(tipoPerfil);
  const inputStyle = [styles.input, { color: '#747474', borderColor: '#747474', backgroundColor: '#ffffff' }];

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.voltarText}>
                ← Voltar
              </Text>
            </TouchableOpacity>

            {/* Card do Formulário */}
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: '#ffffff',
                  elevation: 6,
                },
              ]}
            >
              {/* Título Cadastro */}
              <Text style={styles.cadastroTitle}>
                Cadastro
              </Text>

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
                placeholder="Data de nascimento: DD/MM/AAAA"
                value={dataNascimento}
                onChangeText={formatarData}
                keyboardType="numeric"
                maxLength={10}
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
              {/* Botão do Dropdown */}
              <TouchableOpacity
                onPress={() => router.push('/login')}
                style={styles.voltarContainer}
                disabled={loading}
              >
                <Text style={{ color: genero ? '#747474' : '#747474', fontSize: 16, fontWeight: '500' }}>
                  {genero || 'Selecione o login:'}
                </Text>

                <Text style={styles.voltarText}>← Voltar</Text>

              </TouchableOpacity>

              <View style={[styles.formCard, { backgroundColor: '#ffffff', elevation: 6 }]}>
                <Text style={styles.cadastroTitle}>Cadastro</Text>

                <View style={styles.chipsRow}>
                  {TIPOS.map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[styles.chip, tipoPerfil === tipo && styles.chipAtivo]}
                      onPress={() => { setTipoPerfil(tipo); setRegistro(''); }}
                      disabled={loading}
                    >
                      <Text style={[styles.chipText, tipoPerfil === tipo && styles.chipTextAtivo]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={inputStyle}
                  placeholder="Nome:"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  editable={!loading}
                />
                <TextInput
                  style={inputStyle}
                  placeholder="Data de nascimento: DD/MM/AAAA"
                  value={dataNascimento}
                  onChangeText={setDataNascimento}
                  keyboardType="numeric"
                  editable={!loading}
                />
                <TextInput
                  style={inputStyle}
                  placeholder="Telefone:"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
                <TextInput
                  style={inputStyle}
                  placeholder="E-mail:"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TextInput
                  style={inputStyle}
                  placeholder="Senha:"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  editable={!loading}
                />

                {label && (
                  <TextInput
                    style={inputStyle}
                    placeholder={label}
                    value={registro}
                    onChangeText={setRegistro}
                    autoCapitalize="characters"
                    editable={!loading}
                  />
                )}

                <TouchableOpacity
                  style={[styles.criarContaButton, loading && styles.buttonDisabled]}
                  onPress={handleCriarConta}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.criarContaButtonText, { color: '#ffffff' }]}>
                    {loading ? 'Criando...' : 'Criar Conta'}
                  </Text>
                </TouchableOpacity>
              </Modal>

              {/* Botão Criar Conta */}
              <TouchableOpacity
                style={[styles.criarContaButton, loading && styles.buttonDisabled]}
                onPress={handleCriarConta}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.criarContaButtonText, { color: '#ffffff' }]}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center',
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 1,
    marginTop: -50,
  },
  voltarText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333333',
  },
  formCard: {
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 16,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
      android: { elevation: 8 },
      web: { boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
    }),
  },
  cadastroTitle: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#747474',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipAtivo: {
    backgroundColor: '#B3151F',
    borderColor: '#B3151F',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#747474',
  },
  chipTextAtivo: {
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    width: '90%',
    alignSelf: 'center',
    minHeight: 44,
  },
  criarContaButton: {
    backgroundColor: '#B3151F',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
    marginBottom: 8,
    alignSelf: 'center',
    width: '90%',
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
