import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CronometroScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [mlIngeridos, setMlIngeridos] = useState(400);
  const [quantidade, setQuantidade] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

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
    setRunning(false);
    router.back();
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
          <Text style={styles.headerTextRight}>Corrida intervalar</Text>
        </View>

        {/* Timer */}
        <Text style={styles.labelTempo}>TEMPO DESCORRIDO</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

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
        <View style={styles.inputRow}>
          <Text style={styles.gotaInputIcon}>💧</Text>
          <TextInput
            style={styles.inputHidratacao}
            placeholder="Insira a quantidade inserida..."
            placeholderTextColor="#e78585"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
            onSubmitEditing={adicionarCustom}
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
          onPress={() => router.push('/checklist-pos-sessao')}
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
