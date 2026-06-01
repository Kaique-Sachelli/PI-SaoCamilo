import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomepageAdm() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.titulo}>São Camilo</Text>
          <TouchableOpacity>
            <Image source={require("../assets/sino.png")} style={styles.sino} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
        <Text style={styles.funcao}>Olá, Administrador</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.container}>
          <View style={{ alignSelf: "center" }}>
            <Image source={require("../assets/grafico.png")} style={styles.grafico} />
          </View>
        </View>
        <Text style={styles.painel}>Painel</Text>
        <View style={styles.containerMenor}>
          <View style={styles.row}>
            <View style={{ flexDirection: "row" }}>
              <Image source={require("../assets/solicitacoes.png")} style={styles.icone} />
              <Text style={styles.texto}>Solicitações de cadastro</Text>
            </View>
            <Image source={require("../assets/seta-direita2.png")} style={styles.seta} />
          </View>
        </View>
        <View style={styles.containerMenor}>
          <View style={styles.row}>
            <View style={{ flexDirection: "row" }}>
              <Image source={require("../assets/gerenciar.png")} style={styles.icone} />
              <Text style={styles.texto}>Gerenciar Usuários</Text>
            </View>
            <Image source={require("../assets/seta-direita2.png")} style={styles.seta} />
          </View>
        </View>
        <View style={styles.containerMenor}>
          <View style={styles.row}>
            <View style={{ flexDirection: "row" }}>
              <Image source={require("../assets/batimento2.png")} style={styles.icone} />
              <Text style={styles.texto}>Ver Atletas</Text>
            </View>
            <Image source={require("../assets/seta-direita2.png")} style={styles.seta} />
          </View>
        </View>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image source={require("../assets/homepage.png")} style={styles.homepage} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/batimento3.png")} style={styles.batimento} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/documento.png")} style={styles.documento} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/perfil2.png")} style={styles.perfil} />
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
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grafico: {
    width: 175,
    height: 166,
  },
  painel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginBottom: 10,
  },
  containerMenor: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center"
  },
  icone: {
    width: 20,
    height: 20,
    marginRight: 20,
    alignSelf: "center"
  },
  seta: {
    width: 8,
    height: 12,
    alignSelf: "center"
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