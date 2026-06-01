import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomepageAtleta() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.titulo}>São Camilo</Text>
          <TouchableOpacity>
            <Image source={require("../assets/sino.png")} style={styles.sino}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
        <Text style={styles.funcao}>Olá, Atleta</Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.painel}>Última sessão</Text>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.textoCinza}>Treino Ontem, 18:30</Text>
            <View style={styles.verde}>
              <Text style={styles.textoVerde}>Hidratação OK</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.texto20}>Corrida Intervalar</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.texto12}>Taixa de sudorese</Text>
            <Text style={styles.texto12}>Perda de peso</Text>
            <Text style={styles.texto12}>Perda de peso</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.texto15}>1.2</Text>
              <Text style={styles.medida}>L/h</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.texto15}>1.8</Text>
              <Text style={styles.medida}>kg</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textoVerde2}>-1.5%</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBranco}>PRONTO PARA TREINAR?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image source={require("../assets/homepage.png")} style={styles.homepage}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/batimento3.png")} style={styles.batimento}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/documento.png")} style={styles.documento}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/perfil2.png")} style={styles.perfil}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E32429",
    padding: 20,
    paddingBottom: 50,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
  titulo: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "700",
  },
  sino: {
    alignSelf: "center",
    width: 32,
    height: 32,
  },
  subtitulo: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "200",
    marginBottom: 50,
  },
  funcao: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
  },
  conteudo: {
    flex: 1,
    padding: 25,
  },
  container: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  painel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginBottom: 10,
  },
  textoCinza: {
    fontSize: 15,
    fontWeight: "500",
    color: "#777",
    alignContent: "center"
  },
  verde: {
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: "#c4ffda",
    borderRadius: 20,
    alignContent: "center"
  },
  textoVerde: {
    fontSize: 15,
    fontWeight: "500",
    color: "#177D3C",
    alignContent: "center"
  },
  texto20: {
    fontSize: 20,
    fontWeight: "500",
    alignContent: "center",
    marginVertical: 20,
  },
  texto12: {
    fontSize: 12,
    fontWeight: "500",
    color: "#777",
    alignContent: "center",
    marginBottom: 5,
  },
  texto15: {
    fontSize: 15,
    fontWeight: "500",
    alignContent: "center"
  },
  medida: {
    fontSize: 10,
    fontWeight: "500",
    alignContent: "flex-end"
  },
  textoVerde2: {
    fontSize: 15,
    fontWeight: "500",
    color: "#22C55E",
    alignContent: "center"
  },
  botao: {
    backgroundColor: "#22C55E",
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  textoBranco: {
    fontSize: 20,
    fontWeight: "500",
    color: "#ffffff",
    alignContent: "center",
    textAlign: "center",
  },
  navbar: {
    backgroundColor: "#ccc",
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  homepage: {
    alignSelf: "center",
    width: 30,
    height: 33,
  },
  batimento: {
    alignSelf: "center",
    width: 33,
    height: 30,
  },
  documento: {
    alignSelf: "center",
    width: 27,
    height: 33,
  },
  perfil: {
    alignSelf: "center",
    width: 27,
    height: 30,
  },
});