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
import { SenhaInput } from './visualizar_senha';
import { PoliticaPrivacidadeModal } from './politica_privacidade';

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
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [loading, setLoading] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [politicaVisivel, setPoliticaVisivel] = useState(false);
  const router = useRouter();

  const formatarTelefone = (texto: string) => {
    const digitos = texto.replace(/\D/g, '').slice(0, 11);
    let formatado = digitos;
    if (digitos.length > 7) {
      formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
    } else if (digitos.length > 2) {
      formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    } else if (digitos.length > 0) {
      formatado = `(${digitos}`;
    }
    setTelefone(formatado);
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
    const isAtleta = tipoPerfil === 'Atleta';
    if (!nome || !dataNascimento || !telefone || !email || !senha || (label && !registro) || (isAtleta && (!altura || !peso))) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    if (!termosAceitos) {
      alert('Você precisa aceitar os Termos de Uso para continuar.');
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
          ...(tipoPerfil === 'Atleta' && { altura, peso }),
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
        {/* Botão voltar fixo acima do card */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.voltarContainer}
          disabled={loading}
        >
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.kavFlex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.formCard, { backgroundColor: '#ffffff', elevation: 6 }]}>
            <Text style={styles.cadastroTitle}>Cadastro</Text>

            {/* Scroll interno ao card */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.chipsRow}>
                {TIPOS.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[styles.chip, tipoPerfil === tipo && styles.chipAtivo]}
                    onPress={() => { setTipoPerfil(tipo); setRegistro(''); setAltura(''); setPeso(''); }}
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
                onChangeText={formatarData}
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
              />
              <TextInput
                style={inputStyle}
                placeholder="Telefone: (XX) XXXXX-XXXX"
                value={telefone}
                onChangeText={formatarTelefone}
                keyboardType="phone-pad"
                maxLength={16}
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
              <SenhaInput
                placeholder="Senha:"
                value={senha}
                onChangeText={setSenha}
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

              {tipoPerfil === 'Atleta' && (
                <>
                  <TextInput
                    style={inputStyle}
                    placeholder="Altura (cm):"
                    value={altura}
                    onChangeText={setAltura}
                    keyboardType="numeric"
                    maxLength={3}
                    editable={!loading}
                  />
                  <TextInput
                    style={inputStyle}
                    placeholder="Peso (kg):"
                    value={peso}
                    onChangeText={setPeso}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!loading}
                  />
                </>
              )}

              {/* Termos de uso */}
              <View style={styles.termosContainer}>
                <TouchableOpacity
                  onPress={() => setPoliticaVisivel(true)}
                  style={styles.termosLink}
                >
                  <Text style={styles.termosLinkTexto}>
                    Leia nossos Termos de Uso e Política de Privacidade
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setTermosAceitos((v) => !v)}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <View style={[styles.checkbox, termosAceitos && styles.checkboxAtivo]}>
                    {termosAceitos && <Text style={styles.checkboxMarca}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Li e aceito os Termos de Uso e a Política de Privacidade
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Botão fixo na base do card */}
            <TouchableOpacity
              style={[styles.criarContaButton, (loading || !termosAceitos) && styles.buttonDisabled]}
              onPress={handleCriarConta}
              disabled={loading || !termosAceitos}
              activeOpacity={0.8}
            >
              <Text style={[styles.criarContaButtonText, { color: '#ffffff' }]}>
                {loading ? 'Criando...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <PoliticaPrivacidadeModal
          visible={politicaVisivel}
          onClose={() => setPoliticaVisivel(false)}
        />
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
  formCard: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
      android: { elevation: 8 },
      web: { boxshadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' },
    }),
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
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
  termosContainer: {
    width: '90%',
    alignSelf: 'center',
    gap: 10,
    marginBottom: 8,
  },
  termosLink: {
    alignSelf: 'flex-start',
  },
  termosLinkTexto: {
    fontSize: 13,
    color: '#B3151F',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#747474',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxAtivo: {
    backgroundColor: '#B3151F',
    borderColor: '#B3151F',
  },
  checkboxMarca: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
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
