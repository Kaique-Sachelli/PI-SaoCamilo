// App.js
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Topo */}
      <View style={styles.header}>
        <View style={styles.sessionContainer}>
          <View style={styles.greenDot} />
          <Text style={styles.sessionText}>SESSÃO ATIVA</Text>
        </View>

        <Text style={styles.trainingType}>Corrida intervalar</Text>
      </View>

      {/* Tempo */}
      <View style={styles.timeContainer}>
        <Text style={styles.label}>TEMPO DESCORRIDO</Text>
        <Text style={styles.time}>00:47:22</Text>
      </View>

      {/* Hidratação */}
      <View style={styles.waterCircle}>
        {/* <Ionicons name="water-outline" size={40} color="#fff" /> */}
        <Text style={styles.waterValue}>400</Text>
        <Text style={styles.waterText}>ml ingeridos</Text>
      </View>

      {/* Cards */}
      <Text style={styles.sectionTitle}>ADICIONAR HIDRATAÇÃO</Text>

      <View style={styles.cardsContainer}>
        {/* Copinho */}
        <View style={styles.card}>
          {/* <MaterialCommunityIcons
            name="glass-cocktail"
            size={26}
            color="#21409A"
          /> */}

          <Text style={styles.cardTitle}>Copinho</Text>
          <Text style={styles.cardSubtitle}>200 ml</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.circleButton}>
              {/* <Ionicons name="add" size={26} color="#21409A" /> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton}>
              {/* <Ionicons name="remove" size={26} color="#E53935" /> */}
            </TouchableOpacity>
          </View>
        </View>

        {/* Garrafa */}
        <View style={styles.card}>
          {/* <MaterialCommunityIcons
            name="bottle-soda-outline"
            size={26}
            color="#21409A"
          /> */}

          <Text style={styles.cardTitle}>Garrafa</Text>
          <Text style={styles.cardSubtitle}>1000 ml</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.circleButton}>
              {/* <Ionicons name="add" size={26} color="#21409A" /> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton}>
              {/* <Ionicons name="remove" size={26} color="#E53935" /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Alimentação */}
      <TouchableOpacity style={styles.foodButton}>
        {/* <MaterialCommunityIcons
          name="food-outline"
          size={24}
          color="#111"
        /> */}

        <Text style={styles.foodText}>
          Registrar alimento (opcional)
        </Text>
      </TouchableOpacity>

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          {/* <Ionicons name="play-outline" size={34} color="red" /> */}
          <Text style={styles.primaryButtonText}>Retomar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          {/* <Ionicons name="stop-outline" size={34} color="red" /> */}
          <Text style={styles.primaryButtonText}>Encerrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d90416",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sessionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#39ff14",
    marginRight: 8,
  },

  sessionText: {
    color: "#fff",
    fontSize: 16,
  },

  trainingType: {
    color: "#fff",
    fontSize: 16,
  },

  timeContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  label: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 10,
  },

  time: {
    color: "#fff",
    fontSize: 82,
    fontWeight: "bold",
  },

  waterCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 10,
    borderColor: "rgba(255,255,255,0.45)",
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  waterValue: {
    color: "#fff",
    fontSize: 58,
    fontWeight: "300",
  },

  waterText: {
    color: "#fff",
    fontSize: 20,
  },

  sectionTitle: {
    alignSelf: "center",
    marginTop: 42,
    color: "#fff",
    fontSize: 22,
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  card: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  cardSubtitle: {
    color: "#f4d6d6",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 26,
    marginTop: 20,
  },

  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  foodButton: {
    height: 64,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 12,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  foodText: {
    fontSize: 18,
    color: "#111",
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 20,
  },

  primaryButton: {
    width: "47%",
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  primaryButtonText: {
    color: "red",
    fontSize: 24,
    fontWeight: "bold",
  },
});
