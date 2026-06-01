import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
// usei o mesmo tipo de rota que vi no cadastro
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const router = useRouter();
export default function TelaGerenciarAtletas() {
  return (
    <View style={styles.container}>

      
      <View style={styles.header}>

        <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Gerenciar Atletas</Text>

        
        <View style={styles.searchContainer}>

          <Ionicons name="search" size={18} color="#999" />

          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#999"
            style={styles.input}
          />

        </View>

      </View>

      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        
        <View
        onPress={() => router.push('/perfil')}
        style={styles.card}
        >

          <View style={styles.left}>

            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>

            <View>
              <Text style={styles.nome}>Nome do atleta</Text>

              <Text style={styles.info}>
                Informações do atleta
              </Text>

              <Text style={styles.info}>
                Esporte praticado
              </Text>
            </View>

          </View>

          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#666"
            />
          </TouchableOpacity>

        </View>

        
        <View style={styles.card}>

          <View style={styles.left}>

            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>

            <View>
              <Text style={styles.nome}>Nome do atleta</Text>

              <Text style={styles.info}>
                Informações do atleta
              </Text>

              <Text style={styles.info}>
                Esporte praticado
              </Text>
            </View>

          </View>

          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#666"
            />
          </TouchableOpacity>

        </View>

        
        <View 
        style={styles.card}
        onPress={() => router.push('/perfil')}>

          <View style={styles.left}>

            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>

            <View>
              <Text style={styles.nome}>Nome do atleta</Text>

              <Text style={styles.info}>
                Informações do atleta
              </Text>

              <Text style={styles.info}>
                Esporte praticado
              </Text>
            </View>

          </View>

          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#666"
            />
          </TouchableOpacity>

        </View>

      </ScrollView>

      
      <TouchableOpacity
      style={styles.addButton}
      onPress={() => router.push('/cadastro')}
      >

        <Ionicons name="add" size={24} color="#fff" />

      </TouchableOpacity>

      
      <View style={styles.bottomTab}>

        <TouchableOpacity>
          <Ionicons name="home-outline" size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="pulse-outline" size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="document-text-outline" size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person-outline" size={26} color="#222" />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  header: {
    backgroundColor: '#D91C23',
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 22,
  },

  searchContainer: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    color: '#222',
    fontSize: 14,
  },

  scroll: {
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 140,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#D91C23',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  info: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },

  addButton: {
    position: 'absolute',
    bottom: 95,
    right: 24,

    width: 62,
    height: 62,
    borderRadius: 31,

    backgroundColor: '#D91C23',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  bottomTab: {
    position: 'absolute',
    bottom: 0,

    width: width,
    height: 82,

    backgroundColor: '#fff',

    borderTopWidth: 1,
    borderColor: '#E5E5E5',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

});