import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   Feather,
// } from '@expo/vector-icons';

export default function PerfilAtletaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity>
              {/* <Ionicons
                name="chevron-back"
                size={30}
                color="#fff"
              /> */}
            </TouchableOpacity>

            <Text style={styles.name}>
              Kacique da Silva
            </Text>

            <View style={styles.notificationContainer}>
              {/* <Ionicons
                name="chatbox-outline"
                size={34}
                color="#fff"
              /> */}

              <View style={styles.greenDot} />
            </View>
          </View>

          <Text style={styles.sport}>
            Vôlei • Arremessador
          </Text>
        </View>

        {/* CARD PERFIL */}
        <View style={styles.profileCard}>
          {/* FOTO */}
          <Image
            source={{
              uri: 'https://i.imgur.com/6VBx3io.jpeg',
            }}
            style={styles.profileImage}
          />

          {/* INFO */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              {/* <MaterialCommunityIcons
                name="run"
                size={24}
                color="#111"
              /> */}

              <Text style={styles.infoTitle}>
                Perfil Atlético
              </Text>
            </View>

            <View style={styles.infoItem}>
              {/* <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color="#111"
              /> */}

              <View>
                <Text style={styles.infoLabel}>Peso</Text>
                <Text style={styles.infoValue}>
                  78 kg
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              {/* <MaterialCommunityIcons
                name="pulse"
                size={24}
                color="#111"
              /> */}

              <View>
                <Text style={styles.infoLabel}>Altura</Text>
                <Text style={styles.infoValue}>
                  177 cm
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              {/* <Feather
                name="calendar"
                size={22}
                color="#111"
              /> */}

              <View>
                <Text style={styles.infoLabel}>Idade</Text>
                <Text style={styles.infoValue}>
                  20 anos
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* HISTÓRICO */}
        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>
            Acessar Histórico Atleta
          </Text>

          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>
              Histórico Longitunual
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTATOS */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>
            Contatos do Atleta
          </Text>

          <View style={styles.contactRow}>
            {/* <MaterialCommunityIcons
              name="email"
              size={26}
              color="#222"
            /> */}

            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>
                E-mail:
              </Text>

              <Text style={styles.contactValue}>
                carlinmaia@gmail.com
              </Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            {/* <Feather
              name="phone-call"
              size={24}
              color="#222"
            /> */}

            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>
                Telefone:
              </Text>

              <Text style={styles.contactValue}>
                (55)11 4002-8922
              </Text>
            </View>
          </View>
        </View>

        {/* BOTÃO */}
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>
            Adicionar Relatório alimentar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const RED = '#F21E24';
const BLUE = '#123F99';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1F1',
  },

  scroll: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: RED,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 34,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  notificationContainer: {
    position: 'relative',
  },

  greenDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#52E35A',
    position: 'absolute',
    right: -2,
    bottom: 0,
    borderWidth: 2,
    borderColor: RED,
  },

  sport: {
    marginTop: 50,
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
  },

  /* PROFILE CARD */
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 20,
    padding: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 5,
  },

  profileImage: {
    width: 178,
    height: 320,
    borderRadius: 30,
  },

  infoCard: {
    flex: 1,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 18,
    padding: 14,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#111',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 14,
  },

  infoLabel: {
    fontSize: 16,
    color: '#8A8A8A',
  },

  infoValue: {
    fontSize: 18,
    color: '#111',
    marginTop: 2,
  },

  /* HISTORY */
  historyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 18,
  },

  historyButton: {
    backgroundColor: BLUE,
    borderRadius: 22,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  historyButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  /* CONTACT */
  contactCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 5,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  contactTextContainer: {
    marginLeft: 14,
  },

  contactLabel: {
    fontSize: 16,
    color: '#888',
  },

  contactValue: {
    fontSize: 16,
    color: '#111',
    marginTop: 2,
  },

  /* BUTTON */
  reportButton: {
    marginHorizontal: 16,
    marginTop: 26,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 16,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  reportButtonText: {
    color: BLUE,
    fontSize: 20,
    fontWeight: 'bold',
  },
});