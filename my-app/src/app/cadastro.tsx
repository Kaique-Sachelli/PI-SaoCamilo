import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  View,
  Modal,
  FlatList,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
  BoxShadowValue,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownVisivel, setDropdownVisivel] = useState(false);
  const [genero, setGenero] = useState('');
  const opcoesFiltro = ['Atleta', 'Treinador', 'Médico', 'Nutricionista'];
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
      source={require('./assets/Img/Background.png')}
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
              onPress={() => router.push('/login')}
              style={styles.voltarContainer}
              disabled={loading}
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


              {/* Botão do Dropdown */}
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={loading}
                style={[styles.input, { borderColor: '#747474', backgroundColor: '#ffffff', justifyContent: 'center' }]}
                onPress={() => setDropdownVisivel(true)}
              >
                <Text style={{ color: genero ? '#747474' : '#747474', fontSize: 16, fontWeight: '500' }}>
                  {genero || 'Selecione o Gênero:'}
                </Text>
              </TouchableOpacity>

              {/* Estrutura Dropdown Flutuante */}
              <Modal
                visible={dropdownVisivel}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisivel(false)}
              >
                {/* Toque fora para fechar */}
                <TouchableOpacity 
                  style={styles.dropdownOverlay} 
                  activeOpacity={1} 
                  onPress={() => setDropdownVisivel(false)}
                >
                  {/* Caixa de Opções */}
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={opcoesFiltro}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={styles.dropdownItem} 
                          onPress={() => { setGenero(item); setDropdownVisivel(false); }}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center',
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
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
  cadastroTitle: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
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
    minHeight: 48,
  },
  criarContaButton: {
    backgroundColor: '#B3151F',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
    marginBottom: 10,
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
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Um fundo quase invisível para detectar o clique fora
    justifyContent: 'center', // Alinha no centro ou ajuste a posição usando margens se preferir fixar perto do input
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    width: '80%', // Largura da caixinha do menu
    borderRadius: 8,
    maxHeight: 200,
    paddingVertical: 5,
    // Sombra para dar o efeito de elemento flutuante igual ao do vídeo
    ...Platform.select({
      ios: {
        boxshadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
      },
      android: {
        elevation: 5,
      },
      web: {
        boxshadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
});

