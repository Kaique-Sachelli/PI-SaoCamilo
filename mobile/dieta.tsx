import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function Perfil() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffa8a8" }}>
      <View style={styles.conteudo}>
        <View style={styles.row}>
          <TouchableOpacity>
            <Image source={require("./assets/Img/seta-esquerda.png")} style={styles.setaEsquerda}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("./assets/Img/download.png")} style={styles.download}/>
          </TouchableOpacity>
        </View>
        <View style={styles.centro}>
          <Text style={styles.texto}>Adicione seu relatório aqui:</Text>
          <View style={styles.container}>
            <Text style={styles.mais}>+</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.botao}>
          <Text style={styles.azul}>Enviar</Text>
          <Image source={require("./assets/Img/seta-direita-azul.png")} style={styles.setaDireita}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setaEsquerda: {
    width: 13,
    height: 21,
    alignSelf: "center"
  },
  download: {
    width: 18,
    height: 18,
    alignSelf: "center"
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 15
  },
  container: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#0A3D91",
    borderRadius: 25,
    paddingVertical: 100,
    paddingHorizontal: 150,
    marginBottom: 30,
  },
  mais: {
    fontSize: 100,
    color: "#0A3D91",
    fontWeight: "700",
  },
  botao: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#0A3D91",
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  azul: {
    fontSize: 24,
    color: "#0A3D91",
    fontWeight: "600",
    marginRight: 20,
  },
  setaDireita: {
    width: 8,
    height: 16,
    alignSelf: "center"
  },
});