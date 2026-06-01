// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   SafeAreaView,
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// export default function TelaAtleta() {
//   const [abaAtiva, setAbaAtiva] = useState('Dieta');

//   return (
//     <SafeAreaView style={styles.container}>


//       <View style={styles.header}>

//         <Text style={styles.nomeAtleta}>
//           Atleta
//         </Text>

  
//         <View style={styles.tabsContainer}>

//           <TouchableOpacity
//             style={[
//               styles.tab,
//               abaAtiva === 'Sessões' && styles.tabAtiva,
//             ]}
//             onPress={() => setAbaAtiva('Sessões')}
//           >
//             <Text
//               style={[
//                 styles.tabTexto,
//                 abaAtiva === 'Sessões' && styles.tabTextoAtivo,
//               ]}
//             >
//               Sessões
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tab,
//               abaAtiva === 'Dieta' && styles.tabAtiva,
//             ]}
//             onPress={() => setAbaAtiva('Dieta')}
//           >
//             <Text
//               style={[
//                 styles.tabTexto,
//                 abaAtiva === 'Dieta' && styles.tabTextoAtivo,
//               ]}
//             >
//               Dietaa
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tab,
//               abaAtiva === 'Exames' && styles.tabAtiva,
//             ]}
//             onPress={() => setAbaAtiva('Exames')}
//           >
//             <Text
//               style={[
//                 styles.tabTexto,
//                 abaAtiva === 'Exames' && styles.tabTextoAtivo,
//               ]}
//             >
//               Exames
//             </Text>
//           </TouchableOpacity>

//         </View>

//       </View>

  
//       <View style={styles.content}>

  

//       </View>

  
//       <View style={styles.bottomTab}>

//         <TouchableOpacity>
//           <Ionicons
//             name="home-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Ionicons
//             name="pulse-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Ionicons
//             name="document-text-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Ionicons
//             name="person-outline"
//             size={26}
//             color="#222"
//           />
//         </TouchableOpacity>

//       </View>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#EDEDED',
//   },


//   header: {
//     backgroundColor: '#F21F26',
//     paddingTop: 18,
//     paddingHorizontal: 16,
//     paddingBottom: 22,

//     borderBottomLeftRadius: 22,
//     borderBottomRightRadius: 22,
//   },

//   nomeAtleta: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: '700',
//     marginBottom: 18,
//   },



//   tabsContainer: {
//     width: '100%',
//     height: 46,

//     backgroundColor: '#fff',
//     borderRadius: 30,

//     flexDirection: 'row',
//     alignItems: 'center',

//     padding: 4,
//   },

//   tab: {
//     flex: 1,
//     height: '100%',

//     justifyContent: 'center',
//     alignItems: 'center',

//     borderRadius: 25,
//   },

//   tabAtiva: {
//     backgroundColor: '#D9D9D9',
//   },

//   tabTexto: {
//     fontSize: 15,
//     color: '#B0B0B0',
//     fontWeight: '500',
//   },

//   tabTextoAtivo: {
//     color: '#F21F26',
//     fontWeight: '700',
//   },


//   content: {
//     flex: 1,
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