import 'package:flutter/material.dart';
import 'login.dart'; // Isso importa sua tela de login

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'São Camilo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
        useMaterial3: true,
      ),
      // Aqui indicamos que a LoginPage é a tela inicial
      home: const LoginPage(), 
    );
  }
}