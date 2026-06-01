import { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VERMELHO = '#e53935';
const VERDE = '#43a047';
const RAIO_CARD = 14;

function Cabecalho({ aoVoltar }: { aoVoltar: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.cabecalhoWrap, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={aoVoltar} style={estilos.botaoVoltar} hitSlop={12}>
        <Text style={estilos.setaVoltar}>‹</Text>
      </TouchableOpacity>
      <Text style={estilos.tituloCabecalho}>Checklist Pós-Sessão</Text>
      <View style={estilos.botaoVoltar} />
    </View>
  );
}

function CardMassaPos({
  posMassa,
  preMassa,
  ingerido,
  aoAlterarPos,
  aoAlterarIngerido,
}: {
  posMassa: string;
  preMassa: number;
  ingerido: string;
  aoAlterarPos: (v: string) => void;
  aoAlterarIngerido: (v: string) => void;
}) {
  return (
    <View style={estilos.card}>
      <Text style={estilos.rotuloSecao}>Massa Corporal Pós-Exercício</Text>
      <View style={estilos.linhaInput}>
        <TextInput
          style={estilos.inputMassa}
          value={posMassa}
          onChangeText={aoAlterarPos}
          keyboardType="decimal-pad"
          placeholderTextColor="#bbb"
        />
        <Text style={estilos.unidadeMassa}>Kg</Text>
      </View>
      <View style={estilos.linhaInfoMassa}>
        <Text style={estilos.textoInfoMassa}>Pré: {preMassa.toFixed(1)} Kg</Text>
        <View style={estilos.linhaIngerido}>
          <Text style={estilos.textoInfoMassa}>Ingerido: </Text>
          <TextInput
            style={estilos.inputIngerido}
            value={ingerido}
            onChangeText={aoAlterarIngerido}
            keyboardType="decimal-pad"
            placeholderTextColor="#bbb"
          />
          <Text style={estilos.textoInfoMassa}>L</Text>
        </View>
      </View>
    </View>
  );
}

function CardsEstatisticas({
  perdaTotal,
  taxaSudorese,
}: {
  perdaTotal: number;
  taxaSudorese: number;
}) {
  return (
    <View style={estilos.linhaCards}>
      <View style={[estilos.card, estilos.cardEstat]}>
        <Text style={estilos.iconeEstat}>💧</Text>
        <Text style={estilos.rotuloEstat}>PERDA TOTAL</Text>
        <Text style={estilos.valorEstat}>{perdaTotal.toFixed(2)}L</Text>
      </View>
      <View style={[estilos.card, estilos.cardEstat]}>
        <Text style={[estilos.iconeEstat, { color: VERMELHO }]}>📈</Text>
        <Text style={estilos.rotuloEstat}>TAXA DE SUDORESE</Text>
        <Text style={estilos.valorEstat}>{taxaSudorese.toFixed(1)}L/h</Text>
      </View>
    </View>
  );
}

function CardVariacaoMassa({ variacao }: { variacao: number }) {
  const { badgeBg, badgeTexto, badgeCor } = useMemo(() => {
    if (variacao >= -3)
      return { badgeBg: '#e8f5e9', badgeTexto: 'Adequado', badgeCor: '#2e7d32' };
    if (variacao >= -5)
      return { badgeBg: '#fff8e1', badgeTexto: 'Atenção', badgeCor: '#f57f17' };
    return { badgeBg: '#ffebee', badgeTexto: 'Crítico', badgeCor: '#b71c1c' };
  }, [variacao]);

  return (
    <View style={estilos.card}>
      <Text style={estilos.rotuloEstat}>VARIAÇÃO DE MASSA</Text>
      <View style={estilos.linhaVariacao}>
        <Text style={[estilos.valorVariacao, { color: variacao < 0 ? VERMELHO : VERDE }]}>
          {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
        </Text>
        <View style={[estilos.badge, { backgroundColor: badgeBg }]}>
          <Text style={[estilos.textoBadge, { color: badgeCor }]}>{badgeTexto}</Text>
        </View>
      </View>
    </View>
  );
}

function CardTempoSessao({ segundos }: { segundos: number }) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  const formatado = [horas, minutos, segs]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');

  return (
    <View style={estilos.card}>
      <View style={estilos.linhaTempo}>
        <Text style={estilos.iconeRelogio}>🕐</Text>
        <Text style={estilos.rotuloTempo}>Tempo de Sessão</Text>
      </View>
      <Text style={estilos.valorTempo}>{formatado}</Text>
    </View>
  );
}

function NavegacaoInferior() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.navInferior, { paddingBottom: insets.bottom + 8 }]}>
      <TouchableOpacity style={estilos.itemNav}>
        <Text style={[estilos.iconeNav, estilos.iconeNavAtivo]}>⌂</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.itemNav}>
        <Text style={estilos.iconeNav}>∿</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.itemNav}>
        <Text style={estilos.iconeNav}>☰</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.itemNav}>
        <Text style={estilos.iconeNav}>◯</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRE_MASSA = 72.5;
const SEGUNDOS_SESSAO = 2842;

export default function ChecklistPosSessao() {
  const [posMassa, setPosMassa] = useState('72,5');
  const [ingerido, setIngerido] = useState('7,0');

  const posMassaNum = useMemo(
    () => parseFloat(posMassa.replace(',', '.')) || 0,
    [posMassa]
  );
  const ingeridoNum = useMemo(
    () => parseFloat(ingerido.replace(',', '.')) || 0,
    [ingerido]
  );

  const perdaTotal = useMemo(
    () => Math.max(0, PRE_MASSA - posMassaNum + ingeridoNum),
    [posMassaNum, ingeridoNum]
  );

  const taxaSudorese = useMemo(
    () => (SEGUNDOS_SESSAO > 0 ? perdaTotal / (SEGUNDOS_SESSAO / 3600) : 0),
    [perdaTotal]
  );

  const variacaoMassa = useMemo(
    () => (PRE_MASSA > 0 ? ((posMassaNum - PRE_MASSA) / PRE_MASSA) * 100 : 0),
    [posMassaNum]
  );

  function aoSalvar() {
    console.log('Sessão encerrada!', { posMassa, ingerido, perdaTotal, taxaSudorese, variacaoMassa });
  }

  return (
    <View style={estilos.container}>
      <Cabecalho aoVoltar={() => router.back()} />

      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={estilos.conteudoScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CardMassaPos
          posMassa={posMassa}
          preMassa={PRE_MASSA}
          ingerido={ingerido}
          aoAlterarPos={setPosMassa}
          aoAlterarIngerido={setIngerido}
        />

        <CardsEstatisticas perdaTotal={perdaTotal} taxaSudorese={taxaSudorese} />

        <CardVariacaoMassa variacao={variacaoMassa} />

        <CardTempoSessao segundos={SEGUNDOS_SESSAO} />

        <TouchableOpacity style={estilos.botaoSalvar} activeOpacity={0.85} onPress={aoSalvar}>
          <Text style={estilos.textoBotaoSalvar}>Salvar e encerrar</Text>
        </TouchableOpacity>
      </ScrollView>

      <NavegacaoInferior />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  cabecalhoWrap: {
    backgroundColor: VERMELHO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  botaoVoltar: { width: 32 },
  setaVoltar: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '300' },
  tituloCabecalho: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  scroll: { flex: 1 },
  conteudoScroll: { padding: 16, gap: 14, paddingBottom: 32 },

  card: {
    backgroundColor: '#fff',
    borderRadius: RAIO_CARD,
    padding: 16,
  },
  rotuloSecao: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },

  linhaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
  },
  inputMassa: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  unidadeMassa: { fontSize: 16, fontWeight: '700', color: '#555' },

  linhaInfoMassa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  textoInfoMassa: { fontSize: 12, color: '#888' },
  linhaIngerido: { flexDirection: 'row', alignItems: 'center' },
  inputIngerido: {
    fontSize: 12,
    color: '#888',
    minWidth: 28,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },

  linhaCards: { flexDirection: 'row', gap: 14 },
  cardEstat: {
    flex: 1,
    gap: 4,
  },
  iconeEstat: { fontSize: 16, color: '#1976d2' },
  rotuloEstat: { fontSize: 10, fontWeight: '700', color: '#888', letterSpacing: 0.8 },
  valorEstat: { fontSize: 22, fontWeight: '700', color: '#222' },

  linhaVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  valorVariacao: { fontSize: 28, fontWeight: '700' },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  textoBadge: { fontSize: 12, fontWeight: '600' },

  linhaTempo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  iconeRelogio: { fontSize: 14 },
  rotuloTempo: { fontSize: 13, fontWeight: '600', color: '#444' },
  valorTempo: { fontSize: 28, fontWeight: '700', color: VERMELHO },

  botaoSalvar: {
    backgroundColor: VERDE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  textoBotaoSalvar: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  navInferior: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    flexDirection: 'row',
    paddingTop: 10,
  },
  itemNav: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconeNav: { fontSize: 22, color: '#aaa' },
  iconeNavAtivo: { color: VERMELHO },
});
