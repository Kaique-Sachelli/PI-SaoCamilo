import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUrl } from '../constants/url';
import { useUser } from '../context/UserContext';

export default function ChecklistPosSessaoScreen() {
  const [massaPos, setMassaPos] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { usuario } = useUser();
  const { massa_pre, clima_temp, clima_umidade, ml_ingerido, duracao_segundos } = useLocalSearchParams<{
    massa_pre: string;
    clima_temp: string;
    clima_umidade: string;
    ml_ingerido: string;
    duracao_segundos: string;
  }>();

  const massaPreNum = parseFloat((massa_pre ?? '0').replace(',', '.'));
  const mlIngeridoLitros = parseFloat(ml_ingerido ?? '0') / 1000;
  const horasSessao = parseFloat(duracao_segundos ?? '0') / 3600;

  const massaPosNum = parseFloat(massaPos.replace(',', '.')) || 0;

  // fórmulas do motor_calculo.py
  const perdaTotal = massaPosNum > 0
    ? (massaPreNum - massaPosNum) + mlIngeridoLitros
    : 0;

  const taxaSudorese = horasSessao > 0 && massaPosNum > 0
    ? perdaTotal / horasSessao
    : 0;

  const variacaoMassa = massaPosNum > 0
    ? ((massaPreNum - massaPosNum) / massaPreNum) * 100
    : 0;

  const alerta = massaPosNum > massaPreNum
    ? 'ALERTA: Ganho de peso! Risco de hiponatremia (excesso de hidratação).'
    : variacaoMassa > 2
      ? 'ALERTA: Desidratação superior a 2%. Queda de performance provável.'
      : '';

  const avaliacaoVariacao = (v: number) => {
    if (v < 0)  return { label: 'Atenção', color: '#c62828', statusColor: 'Vermelho' as const };
    if (v < 2)  return { label: 'Ótimo',   color: '#2e7d32', statusColor: 'Verde'    as const };
    if (v <= 3) return { label: 'Moderado',color: '#f57f17', statusColor: 'Amarelo'  as const };
    return        { label: 'Crítico',  color: '#c62828', statusColor: 'Vermelho' as const };
  };

  const avaliacao = avaliacaoVariacao(variacaoMassa);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const handleSalvar = async () => {
    if (!massaPos) {
      alert('Informe a massa corporal pós-exercício');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getUrl('/sessao/completa'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_atleta: usuario?.id_usuario,
          massa_pre: massaPreNum,
          massa_pos: massaPosNum,
          clima_temp: parseFloat(clima_temp ?? '0'),
          clima_umidade: parseFloat(clima_umidade ?? '0'),
          duracao_minutos: Math.round(parseFloat(duracao_segundos ?? '0') / 60),
          volume_ml: parseFloat(ml_ingerido ?? '0'),
          perda_massa_ajustada: parseFloat(perdaTotal.toFixed(2)),
          taxa_sudorese: parseFloat(taxaSudorese.toFixed(1)),
          percentual_variacao: parseFloat(variacaoMassa.toFixed(1)),
          alerta_seguranca: alerta || null,
          status_color: avaliacao.statusColor,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.sucesso) {
        alert(data.mensagem ?? 'Erro ao salvar sessão');
        return;
      }

      router.push('/homepage_atleta');
    } catch {
      alert('Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/Img/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.voltarBtn}
          >
            <Text style={styles.voltarTexto}>{'< Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Checklist Pós-Sessão</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card: Massa Corporal Pós-Exercício */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Massa Corporal Pós-Exercício</Text>
            <View style={styles.massaRow}>
              <TextInput
                style={styles.massaInput}
                placeholder="0,0"
                placeholderTextColor="#747474"
                keyboardType="decimal-pad"
                value={massaPos}
                onChangeText={setMassaPos}
              />
              <Text style={styles.massaUnidade}>Kg</Text>
            </View>
            <View style={styles.massaSubRow}>
              <Text style={styles.massaSubTexto}>Pré: {massaPreNum} Kg</Text>
              <Text style={styles.massaSubTexto}>Ingerido: {mlIngeridoLitros.toFixed(2)}L</Text>
            </View>
          </View>

          {/* Cards lado a lado: Perda Total + Taxa de Sudorese */}
          <View style={styles.duploRow}>
            <View style={[styles.card, styles.cardMetade]}>
              <View style={styles.metricaHeader}>
                <Text style={styles.metricaIcone}>💧</Text>
                <Text style={styles.metricaRotulo}>PERDA TOTAL</Text>
              </View>
              <Text style={styles.metricaValor}>{perdaTotal.toFixed(2)}L</Text>
            </View>

            <View style={[styles.card, styles.cardMetade]}>
              <View style={styles.metricaHeader}>
                <Text style={[styles.metricaIcone, { color: '#B3151F' }]}>⚡</Text>
                <Text style={styles.metricaRotulo}>TAXA DE SUDORESE</Text>
              </View>
              <Text style={styles.metricaValor}>{taxaSudorese.toFixed(1)}L/h</Text>
            </View>
          </View>

          {/* Card: Variação de Massa */}
          <View style={styles.card}>
            <View style={styles.metricaHeader}>
              <Text style={[styles.metricaIcone, { color: '#2e7d32' }]}>↘</Text>
              <Text style={styles.metricaRotulo}>VARIAÇÃO DE MASSA</Text>
            </View>
            <View style={styles.variacaoRow}>
              <Text style={[styles.variacaoValor, { color: variacaoMassa < 0 ? '#2e7d32' : '#B3151F' }]}>
                {variacaoMassa >= 0 ? '+' : ''}{variacaoMassa.toFixed(1)}%
              </Text>
              <View style={[styles.badge, { backgroundColor: avaliacao.color + '22', borderColor: avaliacao.color }]}>
                <Text style={[styles.badgeTexto, { color: avaliacao.color }]}>{avaliacao.label}</Text>
              </View>
            </View>
          </View>

          {/* Card: Alerta */}
          {alerta !== '' && (
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#c62828' }]}>
              <Text style={styles.alertaTexto}>{alerta}</Text>
            </View>
          )}

          {/* Card: Tempo de Sessão */}
          <View style={styles.card}>
            <View style={styles.metricaHeader}>
              <Text style={styles.metricaIcone}>🕐</Text>
              <Text style={styles.metricaRotulo}>Tempo de Sessão</Text>
            </View>
            <Text style={styles.tempoValor}>{formatTime(parseFloat(duracao_segundos ?? '0'))}</Text>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
          style={[styles.btnSalvar, loading && { opacity: 0.6 }]}
          onPress={handleSalvar}
          activeOpacity={0.85}
          disabled={loading}
          >
            <Text style={styles.btnSalvarTexto}>{loading ? 'Salvando...' : 'Salvar e encerrar'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Header vermelho
  header: {
    backgroundColor: '#B3151F',
    paddingTop: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  voltarBtn: {
    marginBottom: 4,
  },
  voltarTexto: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.85,
  },
  headerTitulo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },

  // Cards
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
      android: { elevation: 3 },
      web: { boxshadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  cardLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    fontWeight: '500',
  },

  // Massa input
  massaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 10,
  },
  massaInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '600',
    color: '#747474',
  },
  massaUnidade: {
    fontSize: 22,
    fontWeight: '600',
    color: '#747474',
    marginLeft: 8,
  },
  massaSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  massaSubTexto: {
    fontSize: 12,
    color: '#747474',
  },

  // Duplo row
  duploRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardMetade: {
    flex: 1,
  },

  // Métricas
  metricaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metricaIcone: {
    fontSize: 16,
    color: '#1565c0',
  },
  metricaRotulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#747474',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  metricaValor: {
    fontSize: 26,
    fontWeight: '700',
    color: '#747474',
  },

  // Variação
  variacaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  variacaoValor: {
    fontSize: 32,
    fontWeight: '700',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeTexto: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Tempo
  tempoValor: {
    fontSize: 32,
    fontWeight: '700',
    color: '#B3151F',
    letterSpacing: 1,
  },

  // Botão salvar
  btnSalvar: {
    backgroundColor: '#22C55E',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: { boxshadow: '0px 4px 12px rgba(76,175,80,0.35)' },
      android: { elevation: 4 },
      web: { boxshadow: '0px 4px 12px rgba(76,175,80,0.35)' },
    }),
  },
  btnSalvarTexto: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c62828',
  },
});
