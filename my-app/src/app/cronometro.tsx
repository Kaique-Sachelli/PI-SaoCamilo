import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CronometroScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [mlIngeridos, setMlIngeridos] = useState(0);
  const [quantidade, setQuantidade] = useState('');
  const [urinaInput, setUrinaInput] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const { massa_pre, clima_temp, clima_umidade, urina_pre_cor, modalidade } = useLocalSearchParams<{
    massa_pre: string;
    clima_temp: string;
    clima_umidade: string;
    urina_pre_cor: string;
    modalidade: string;
  }>();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const adicionarHidratacao = (ml: number) => {
    setMlIngeridos((prev) => Math.max(0, prev + ml));
  };

  const adicionarCustom = () => {
    const val = parseInt(quantidade);
    if (!isNaN(val) && val > 0) {
      setMlIngeridos((prev) => prev + val);
      setQuantidade('');
    }
  };

  const handleRetomar = () => {
    setRunning((prev) => !prev);
  };

  const handleEncerrar = () => {
    const doEncerrar = () => {
      setRunning(false);
      router.push(
        `/checklist-pos-sessao?massa_pre=${massa_pre}&clima_temp=${clima_temp}&clima_umidade=${clima_umidade}&ml_ingerido=${mlIngeridos}&duracao_segundos=${seconds}&urina_pre_cor=${urina_pre_cor ?? ''}&urina_sessao=${parseInt(urinaInput) || 0}&modalidade=${encodeURIComponent(modalidade ?? '')}`
      );
    };

    if (seconds < 300) {
      const min = Math.floor(seconds / 60);
      const seg = seconds % 60;
      Alert.alert(
        'Sessão muito curta',
        `A sessão durou apenas ${min}m ${seg}s. Com menos de 5 minutos os cálculos de sudorese ficam imprecisos.\n\nEncerrar mesmo assim?`,
        [
          { text: 'Continuar treino', style: 'cancel' },
          { text: 'Encerrar', style: 'destructive', onPress: doEncerrar },
        ]
      );
    } else {
      doEncerrar();
    }
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.sessaoAtiva}>
            <View style={styles.dotVerde} />
            <Text style={styles.headerTextLeft}>SESSÃO ATIVA</Text>
          </View>
          <Text style={styles.headerTextRight}>Sessão ativa</Text>
        </View>

        {/* Timer */}
        <Text style={styles.labelTempo}>TEMPO DESCORRIDO</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

        <View style={styles.addMinRow}>
          {[1, 5, 10].map(min => (
            <TouchableOpacity
              key={min}
              style={styles.addMinBtn}
              onPress={() => setSeconds(s => s + min * 60)}
            >
              <Text style={styles.addMinTexto}>+{min} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hidratação circle */}
        <View style={styles.circulo}>
          <Text style={styles.gotaIcon}>💧</Text>
          <Text style={styles.mlText}>{mlIngeridos}</Text>
          <Text style={styles.mlLabel}>ml ingeridos</Text>
        </View>

        {/* Adicionar hidratação */}
        <Text style={styles.labelHidratacao}>ADICIONAR HIDRATAÇÃO</Text>

        <View style={styles.hidratacaoRow}>
          {/* Copo */}
          <View style={styles.hidratacaoCard}>
            <Text style={styles.hidratacaoIcon}>🥃</Text>
            <Text style={styles.hidratacaoNome}>Copo</Text>
            <Text style={styles.hidratacaoMl}>200 ml</Text>
            <View style={styles.botoesQuantidade}>
              <TouchableOpacity
                style={styles.btnMais}
                onPress={() => adicionarHidratacao(200)}
              >
                <Text style={styles.btnMaisTexto}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMenos}
                onPress={() => adicionarHidratacao(-200)}
              >
                <Text style={styles.btnMenosTexto}>−</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Garrafa */}
          <View style={styles.hidratacaoCard}>
            <Text style={styles.hidratacaoIcon}>🍶</Text>
            <Text style={styles.hidratacaoNome}>Garrafa</Text>
            <Text style={styles.hidratacaoMl}>1000 ml</Text>
            <View style={styles.botoesQuantidade}>
              <TouchableOpacity
                style={styles.btnMais}
                onPress={() => adicionarHidratacao(1000)}
              >
                <Text style={styles.btnMaisTexto}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMenos}
                onPress={() => adicionarHidratacao(-1000)}
              >
                <Text style={styles.btnMenosTexto}>−</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Input customizado */}
        <View style={[styles.inputRow, { marginBottom: 16 }]}>
          <Text style={styles.gotaInputIcon}>💧</Text>
          <TextInput
            style={styles.inputHidratacao}
            placeholder="Insira a quantidade ingerida..."
            placeholderTextColor="#e78585"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
            onSubmitEditing={adicionarCustom}
            returnKeyType="done"
          />
        </View>

        {/* Volume urinário opcional */}
        <Text style={styles.labelHidratacao}>VOLUME URINÁRIO (opcional)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.gotaInputIcon}>↓</Text>
          <TextInput
            style={styles.inputHidratacao}
            placeholder="Volume eliminado (mL)..."
            placeholderTextColor="#e78585"
            keyboardType="numeric"
            value={urinaInput}
            onChangeText={setUrinaInput}
            returnKeyType="done"
          />
        </View>

        {/* Botões de ação */}
        <View style={styles.acoesRow}>
          <TouchableOpacity style={styles.btnRetomar} onPress={handleRetomar}>
            <Text style={styles.btnAcaoIcon}>{running ? '⏸' : '▶'}</Text>
            <Text style={styles.btnAcaoTexto}>{running ? 'Pausar' : 'Retomar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.btnEncerrar}
          onPress={handleEncerrar}
          >
            <Text style={styles.btnAcaoIcon}>⏹</Text>
            <Text style={styles.btnAcaoTexto}>Encerrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#B3151F',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  sessaoAtiva: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotVerde: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  headerTextLeft: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  headerTextRight: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Timer
  labelTempo: {
    color: '#f0a0a5',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 4,
  },
  timer: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 24,
  },

  addMinRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  addMinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  addMinTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Círculo de hidratação
  circulo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  gotaIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  mlText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '700',
  },
  mlLabel: {
    color: '#f0a0a5',
    fontSize: 14,
  },

  // Rótulo hidratação
  labelHidratacao: {
    color: '#f0a0a5',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 14,
  },

  // Cards copo/garrafa
  hidratacaoRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  hidratacaoCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  hidratacaoIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  hidratacaoNome: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  hidratacaoMl: {
    color: '#f0c0c3',
    fontSize: 13,
    marginBottom: 8,
  },
  botoesQuantidade: {
    flexDirection: 'row',
    gap: 10,
  },
  btnMais: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMenos: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMaisTexto: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  btnMenosTexto: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },

  // Input customizado
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 28,
  },
  gotaInputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  inputHidratacao: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },

  // Botões de ação
  acoesRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  btnRetomar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnEncerrar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnAcaoIcon: {
    fontSize: 18,
  },
  btnAcaoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B3151F',
  },
});
