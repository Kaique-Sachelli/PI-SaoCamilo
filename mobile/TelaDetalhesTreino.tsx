// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';

// import { useRouter } from 'expo-router';

// import {
//   Ionicons,
//   MaterialCommunityIcons,
// } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// export default function TelaDetalhesTreino() {
//   const router = useRouter();
// // como nao temos banco, coloquei informacoes fixas apenas para mostrar como deve ficar
//   return (
//     <View style={styles.container}>

//       <View style={styles.header}>

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons name="chevron-back" size={24} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.titulo}>
//           Treino de Basquete
//         </Text>

//         <Text style={styles.subtitulo}>
//           Sessão realizada em 30/05/2026
//         </Text>

//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scroll}
//       >

//         <View style={styles.cardsTop}>

//           <View style={styles.topCard}>

//             <View style={styles.cardHeader}>
//               <Text style={styles.cardLabel}>
//                 Tempo Total
//               </Text>

//               <Ionicons
//                 name="time-outline"
//                 size={18}
//                 color="#D91C23"
//               />
//             </View>

//             <View style={styles.cardValorContainer}>
//               <Text style={styles.cardValor}>
//                 90
//               </Text>

//               <Text style={styles.cardUnidade}>
//                 min
//               </Text>
//             </View>

//           </View>

//           <View style={styles.topCard}>

//             <View style={styles.cardHeader}>
//               <Text style={styles.cardLabel}>
//                 Hidratação
//               </Text>

//               <Ionicons
//                 name="water-outline"
//                 size={18}
//                 color="#D91C23"
//               />
//             </View>

//             <View style={styles.cardValorContainer}>
//               <Text style={styles.cardValor}>
//                 2.1
//               </Text>

//               <Text style={styles.cardUnidade}>
//                 L
//               </Text>
//             </View>

//           </View>

//         </View>

//         <Text style={styles.sectionTitle}>
//           Hidratação
//         </Text>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>
//             Taxa de sudorese
//           </Text>

//           <Text style={styles.infoValue}>
//             1.35 L/h
//           </Text>
//         </View>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>
//             Massa pré-treino
//           </Text>

//           <Text style={styles.infoValue}>
//             78.4 kg
//           </Text>
//         </View>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>
//             Massa pós-treino
//           </Text>

//           <Text style={styles.infoValue}>
//             77.2 kg
//           </Text>
//         </View>

//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>
//             Perda de massa
//           </Text>

//           <Text style={styles.infoValue}>
//             1.2 kg
//           </Text>
//         </View>

//         <Text style={styles.sectionTitle}>
//           Cor da Urina
//         </Text>

//         <View style={styles.urinaCard}>

//           <View style={styles.urinaTop}>

//             <View style={styles.corUrina} />

//             <View>
//               <Text style={styles.urinaEscala}>
//                 Escala 1-8
//               </Text>

//               <Text style={styles.urinaNivel}>
//                 3
//               </Text>

//               <Text style={styles.urinaStatus}>
//                 Bem hidratado
//               </Text>
//             </View>

//           </View>

//           <View style={styles.barras}>
//             <View style={[styles.barra, { backgroundColor: '#F5E27D' }]} />
//             <View style={[styles.barra, { backgroundColor: '#E6C65A' }]} />
//             <View style={[styles.barra, { backgroundColor: '#D8AA39' }]} />
//             <View style={[styles.barra, { backgroundColor: '#BF8723' }]} />
//             <View style={[styles.barra, { backgroundColor: '#9C6317' }]} />
//             <View style={[styles.barra, { backgroundColor: '#6F420D' }]} />
//           </View>

//         </View>

//         <Text style={styles.sectionTitle}>
//           Condições do Treino
//         </Text>

//         <View style={styles.infoCard}>

//           <View style={styles.iconText}>
//             <Ionicons
//               name="thermometer-outline"
//               size={18}
//               color="#D91C23"
//             />
//             <Text style={styles.infoLabel}>
//               Temperatura
//             </Text>
//           </View>

//           <Text style={styles.infoValue}>
//             29°C
//           </Text>

//         </View>

//         <View style={styles.infoCard}>

//           <View style={styles.iconText}>
//             <Ionicons
//               name="water-outline"
//               size={18}
//               color="#D91C23"
//             />
//             <Text style={styles.infoLabel}>
//               Umidade
//             </Text>
//           </View>

//           <Text style={styles.infoValue}>
//             68%
//           </Text>

//         </View>

//         <View style={styles.infoCard}>

//           <View style={styles.iconText}>
//             <MaterialCommunityIcons
//               name="basketball"
//               size={18}
//               color="#D91C23"
//             />
//             <Text style={styles.infoLabel}>
//               Esporte
//             </Text>
//           </View>

//           <Text style={styles.infoValue}>
//             Basquete
//           </Text>

//         </View>

//         <View style={styles.infoCard}>

//           <View style={styles.iconText}>
//             <Ionicons
//               name="pulse-outline"
//               size={18}
//               color="#D91C23"
//             />
//             <Text style={styles.infoLabel}>
//               Intensidade
//             </Text>
//           </View>

//           <Text style={styles.infoValue}>
//             Alta
//           </Text>

//         </View>

//         <View style={styles.buttonsContainer}>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => alert('Download iniciado')}
//           >
//             <Ionicons
//               name="download-outline"
//               size={22}
//               color="#fff"
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => alert('Relatório gerado')}
//           >
//             <Ionicons
//               name="document-text-outline"
//               size={22}
//               color="#fff"
//             />
//           </TouchableOpacity>

//         </View>

//       </ScrollView>

//       <View style={styles.bottomTab}>

//         <TouchableOpacity
//           onPress={() => router.push('/homepage_treinador')}
//         >
//           <Ionicons
//             name="home-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => router.push('/TelaDetalhesTreino')}
//         >
//           <Ionicons
//             name="pulse"
//             size={26}
//             color="#D91C23"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => router.push('/checklist-pre-sessao')}
//         >
//           <Ionicons
//             name="document-text-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => router.push('/perfil')}
//         >
//           <Ionicons
//             name="person-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({

// });

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#F4F4F4',
//   },

//   header: {
//     backgroundColor: '#D91C23',
//     paddingTop: 60,
//     paddingHorizontal: 22,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//   },

//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   titulo: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: '700',
//     marginTop: 10,
//   },

//   subtitulo: {
//     color: '#fff',
//     opacity: 0.8,
//     marginTop: 6,
//   },

//   scroll: {
//     paddingHorizontal: 18,
//     paddingTop: 20,
//     paddingBottom: 140,
//   },

//   cardsTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   topCard: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 22,
//     padding: 16,

//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },

//     elevation: 3,
//   },

//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   cardLabel: {
//     color: '#666',
//     fontWeight: '600',
//   },

//   cardValorContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginTop: 18,
//   },

//   cardValor: {
//     fontSize: 38,
//     fontWeight: '700',
//     color: '#222',
//   },

//   cardUnidade: {
//     marginLeft: 4,
//     marginBottom: 6,
//     color: '#777',
//   },

//   sectionTitle: {
//     marginTop: 28,
//     marginBottom: 14,
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#666',
//   },

//   infoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     paddingVertical: 16,
//     paddingHorizontal: 18,
//     marginBottom: 14,

//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',

//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },

//     elevation: 3,
//   },

//   infoLabel: {
//     color: '#666',
//     fontSize: 14,
//   },

//   infoValue: {
//     color: '#222',
//     fontWeight: '700',
//   },

//   urinaCard: {
//     backgroundColor: '#EFEFEF',
//     borderRadius: 22,
//     padding: 18,
//   },

//   urinaTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   corUrina: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: '#E7D36A',
//     marginRight: 14,
//   },

//   urinaEscala: {
//     color: '#777',
//     fontSize: 12,
//   },

//   urinaNivel: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#222',
//   },

//   urinaStatus: {
//     color: '#7BA63B',
//     fontWeight: '700',
//   },

//   barras: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 18,
//   },

//   barra: {
//     width: 40,
//     height: 10,
//     borderRadius: 8,
//   },

//   iconText: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },

//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
//   },

//   button: {
//     width: '48%',
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: '#D91C23',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   bottomTab: {
//     position: 'absolute',
//     bottom: 0,

//     width: width,
//     height: 82,

//     backgroundColor: '#fff',

//     borderTopWidth: 1,
//     borderColor: '#E5E5E5',

//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },

// });