import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomepageTreinador() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.titulo}>São Camilo</Text>
                    <Image source={require("../assets/sino.png")} style={styles.sino} />
                </View>
                <Text style={styles.subtitulo}>Nutri-Esportiva</Text>
                <Text style={styles.funcao}>Olá, treinador</Text>
            </View>

            <View style={styles.conteudo}>
                <TextInput style={styles.pesquisar} placeholder="Pesquisar"></TextInput>
                <View style={styles.cabecalho}>
                    <Text style={styles.time}>Meu time</Text>
                    <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Text style={styles.gerenciar}>Gerenciar </Text>
                        <Image source={require("../assets/gerenciar.png")} style={styles.icone} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={require("../assets/marcus.jpg")} style={styles.atleta} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.nome}>Marcus Silva</Text>
                            <Text style={styles.esporte}>Vôlei</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.verde}></View>
                        <Image source={require("../assets/seta-direita.png")} style={styles.seta} />
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
    pesquisar: {
        height: 50,
        borderWidth: 1,
        borderColor: "#b7b7b7",
        padding: 15,
        color: "#777"
    },
    cabecalho: {
        marginTop: 30,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    time: {
        fontSize: 16,
        fontWeight: "500",
    },
    gerenciar: {
        fontSize: 16,
        color: "#E32429",
        fontWeight: "500",
    },
    icone: {
        width: 21,
        height: 18,
    },
    container: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#b7b7b7",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    atleta: {
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    nome: {
        fontSize: 16,
        fontWeight: "500",
    },
    esporte: {
        fontSize: 14,
        color: "#777",
    },
    verde: {
        width: 16,
        height: 16,
        backgroundColor: "#72E06C",
        alignSelf: "center",
        borderRadius: 100,
    },
    seta: {
        width: 40,
        height: 40,
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