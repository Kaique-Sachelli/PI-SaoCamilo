import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function Perfil() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require("../assets/sino.png")} style={styles.sino}/>
        </TouchableOpacity>
        <View style={{ alignSelf: "center" }}>
          <Image source={require("../assets/marcus.jpg")} style={styles.atleta} />
          <Text style={styles.nome}>Kaique</Text>
          <Text style={styles.subtitulo}>Volêi • Arremessador</Text>
        </View>
      </View>
      <View style={styles.conteudo}>
        <View style={styles.container}>
          <Text style={styles.topico}>Informações Pessoais</Text>
          <View style={styles.linha}>
            <Image source={require("../assets/email.png")} style={styles.icone}/>
            <View>
              <Text style={styles.subtopico}>E-mail:</Text>
              <Text style={styles.info}>carlinmaia@gmail.com</Text>
            </View>
          </View>
          <View style={styles.linha}>
            <Image source={require("../assets/telefone.png")} style={styles.icone}/>
            <View>
              <Text style={styles.subtopico}>Telefone:</Text>
              <Text style={styles.info}>(55)11 4002-8922</Text>
            </View>
          </View>
          <View style={styles.linha}>
            <Image source={require("../assets/idade.png")} style={styles.icone}/>
            <View>
              <Text style={styles.subtopico}>Idade:</Text>
              <Text style={styles.info}>45 anos</Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.topico}>Perfil Atlético</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <View style={styles.vermelho}>
              <Image source={require("../assets/batimento.png")} style={styles.batimento}/>
              <View style={{alignSelf: "center"}}>
                <Text style={styles.subtopico}>Altura</Text>
                <Text style={styles.info}>177 cm</Text>
              </View>
            </View>
            <View style={styles.vermelho}>
              <Image source={require("../assets/batimento.png")} style={styles.batimento}/>
              <View style={{alignSelf: "center"}}>
                <Text style={styles.subtopico}>Peso</Text>
                <Text style={styles.info}>78 kg</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.topico}>Configurações</Text>
          <View style={styles.row}>
            <View style={{flexDirection: "row"}}>
              <Image source={require("../assets/configuracao.png")} style={styles.config}/>
              <Text style={styles.texto}>Preferências</Text>
            </View>
            <Image source={require("../assets/seta-direita2.png")} style={styles.seta}/>
          </View>
          <View style={styles.row}>
            <View style={{flexDirection: "row"}}>
              <Image source={require("../assets/perfil.png")} style={styles.config}/>
              <Text style={styles.texto}>Editar Perfil</Text>
            </View>
            <Image source={require("../assets/seta-direita2.png")} style={styles.seta}/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E32429",
    padding: 20,
    paddingBottom: 70,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    marginBottom: -50,
  },
  sino: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
  },
  atleta: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignSelf: "center",
  },
  nome: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "600",
    alignSelf: "center",
  },
  subtitulo: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "200",
    alignSelf: "center",
  },
  conteudo: {
    flex: 1,
    padding: 25,
    paddingTop: 0,
  },
  container: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  topico: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  linha: {
    marginBottom: 20,
    flexDirection: "row",
  },
  row: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icone: {
    width: 30,
    height: 30,
    marginRight: 10,
    alignSelf: "center",
  },
  subtopico: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6E6E6E",
  },
  info: {
    fontSize: 15,
    fontWeight: "500",
  },
  vermelho: {
    borderRadius: 20,
    backgroundColor: "#ffd2d4",
    padding: 20,
    width: "45%",
  },
  batimento: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  texto: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  config: {
    width: 28,
    height: 28,
    marginRight: 5,
  },
  seta: {
    width: 8,
    height: 12,
    alignSelf: "center"
  },
});