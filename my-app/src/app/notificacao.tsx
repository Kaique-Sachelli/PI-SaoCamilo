import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  onPress?: () => void;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  notificacoes?: Notificacao[];
}


export function NotificacaoPopup({ visible, onClose, notificacoes }: Props) {
  const router = useRouter();

  const NOTIFICACOES_PADRAO_COM_ROTA: Notificacao[] = [
    {
      id: 1,
      titulo: 'Solicitação de login',
      mensagem: 'Um usuário solicitou a liberação do seu login.',
      lida: false,
      onPress: () => { onClose(); router.push('/solicitacoes_cadastro'); },
    },
    {
      id: 2,
      titulo: 'Novo cadastro',
      mensagem: 'Novo atleta cadastrado.',
      lida: false,
      onPress: () => { onClose(); router.push('/gerenciar_usuarios'); },
    },
    {
      id: 3,
      titulo: 'Novo cadastro',
      mensagem: 'Novo atleta cadastrado.',
      lida: true,
      onPress: () => { onClose(); router.push('/gerenciar_usuarios'); },
    },
  ];

  const lista = notificacoes ?? NOTIFICACOES_PADRAO_COM_ROTA;
  const naoLidas = lista.filter((n) => !n.lida).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop — fecha ao tocar fora */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>

        {/* Popup — não propaga o toque para o backdrop */}
        <TouchableOpacity style={styles.popup} activeOpacity={1} onPress={() => {}}>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerEsquerda}>
              <Text style={styles.headerTitulo}>Notificações</Text>
              {naoLidas > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{naoLidas}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.fecharBtn}>
              <Text style={styles.fecharIcone}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divisor} />

          {/* Lista de notificações */}
          <ScrollView
            style={styles.lista}
            showsVerticalScrollIndicator={false}
          >
            {lista.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma notificação.</Text>
            ) : (
              lista.map((n, idx) => (
                <View key={n.id}>
                  <TouchableOpacity
                    style={[styles.item, !n.lida && styles.itemNaoLido]}
                    activeOpacity={0.7}
                    onPress={n.onPress}
                    disabled={!n.onPress}
                  >
                    <View style={[styles.itemDot, n.lida && styles.itemDotLido]} />
                    <View style={styles.itemConteudo}>
                      <Text style={styles.itemTitulo}>{n.titulo}</Text>
                      <Text style={styles.itemMensagem}>{n.mensagem}</Text>
                    </View>
                    {n.onPress && <Text style={styles.itemSeta}>›</Text>}
                  </TouchableOpacity>
                  {idx < lista.length - 1 && <View style={styles.divisorItem} />}
                </View>
              ))
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 16,
  },

  popup: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 300,
    maxHeight: 400,
    ...Platform.select({
      ios: { boxshadow: '0px 8px 24px rgba(0,0,0,0.18)' },
      android: { elevation: 8 },
      web: { boxshadow: '0px 8px 24px rgba(0,0,0,0.18)' },
    }),
  },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitulo: { fontSize: 16, fontWeight: '700', color: '#111' },
  badge: {
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: '700' },
  fecharBtn: { padding: 4 },
  fecharIcone: { fontSize: 16, color: '#999' },

  divisor: { height: 1, backgroundColor: '#f0f0f0' },
  divisorItem: { height: 1, backgroundColor: '#f5f5f5', marginLeft: 46 },

  // Lista
  lista: { maxHeight: 320 },
  vazio: { padding: 24, textAlign: 'center', color: '#aaa', fontSize: 14 },

  // Item
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  itemNaoLido: { backgroundColor: '#fff8f8' },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RED,
    marginTop: 4,
    flexShrink: 0,
  },
  itemDotLido: { backgroundColor: '#ddd' },
  itemConteudo: { flex: 1, gap: 2 },
  itemTitulo: { fontSize: 13, fontWeight: '700', color: '#111' },
  itemMensagem: { fontSize: 13, color: '#444', lineHeight: 18 },
  itemSeta: { fontSize: 20, color: '#ccc', alignSelf: 'center' },
});
