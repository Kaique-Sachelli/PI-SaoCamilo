import 'package:flutter/material.dart'; // Importa o material design do Flutter

class LoginPage extends StatefulWidget {
  const LoginPage({super.key}); // Construtor do widget de login

  @override
  State<LoginPage> createState() => _LoginPageState(); // Cria o estado mutável da página
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>(); // Chave para validar o formulário
  final TextEditingController _emailController = TextEditingController(); // Controlador do campo de e-mail
  final TextEditingController _passwordController = TextEditingController(); // Controlador do campo de senha
  bool _obscurePassword = true; // Estado para esconder/mostrar a senha

  @override
  void dispose() {
    _emailController.dispose(); // Libera o controlador de e-mail
    _passwordController.dispose(); // Libera o controlador de senha
    super.dispose(); // Chama o dispose do pai
  }

  void _submit() {
    if (_formKey.currentState?.validate() ?? false) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login realizado com sucesso')), // Mostra mensagem de sucesso
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'img/Background.png', // Carrega a imagem de background
              fit: BoxFit.cover, // Faz a imagem cobrir toda a tela
            ),
          ),
          Positioned.fill(
            child: Container(
              color: const Color.fromRGBO(255, 255, 255, 0.72), // Aplica uma camada branca translúcida
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Image.asset(
                      'img/Logo_sao_camilo.png', // Exibe a logo do São Camilo
                      height: 90, // Define altura fixa da logo
                    ),
                    const SizedBox(height: 28), // Espaço entre logo e cartão
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24), // Espaço interno do cartão
                      decoration: BoxDecoration(
                        color: Colors.white, // Fundo branco do cartão
                        borderRadius: BorderRadius.circular(24), // Cantos arredondados
                        boxShadow: [
                          const BoxShadow(
                            color: Color.fromRGBO(0, 0, 0, 0.12), // Sombra suave
                            blurRadius: 18, // Desfoque da sombra
                            offset: Offset(0, 10), // Deslocamento da sombra
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Center(
                            child: Text(
                              'LOGIN', // Título do cartão
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                          const SizedBox(height: 28),
                          Form(
                            key: _formKey, // Associa o formulário à chave de validação
                            child: Column(
                              children: [
                                TextFormField(
                                  controller: _emailController, // Texto do e-mail
                                  keyboardType: TextInputType.emailAddress, // Tipo de teclado apropriado
                                  decoration: InputDecoration(
                                    hintText: 'E-mail', // Texto de dica
                                    prefixIcon: const Icon(Icons.email, color: Color(0xFFBDBDBD)),
                                    filled: true,
                                    fillColor: const Color(0xFFF7F7F7),
                                    contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(16),
                                      borderSide: const BorderSide(color: Color(0xFFCCCCCC)),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(16),
                                      borderSide: const BorderSide(color: Color(0xFFD11A25)),
                                    ),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Informe o e-mail'; // Validação se o campo estiver vazio
                                    }
                                    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+').hasMatch(value)) {
                                      return 'E-mail inválido'; // Validação de formato de e-mail
                                    }
                                    return null; // Validação passou
                                  },
                                ),
                                const SizedBox(height: 16),
                                TextFormField(
                                  controller: _passwordController, // Texto da senha
                                  obscureText: _obscurePassword, // Esconde ou mostra a senha
                                  decoration: InputDecoration(
                                    hintText: 'Senha', // Texto de dica
                                    prefixIcon: const Icon(Icons.lock, color: Color(0xFFBDBDBD)),
                                    filled: true,
                                    fillColor: const Color(0xFFF7F7F7),
                                    contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(16),
                                      borderSide: const BorderSide(color: Color(0xFFCCCCCC)),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(16),
                                      borderSide: const BorderSide(color: Color(0xFFD11A25)),
                                    ),
                                    suffixIcon: IconButton(
                                      icon: Icon(
                                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                        color: const Color(0xFFBDBDBD),
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          _obscurePassword = !_obscurePassword; // Alterna visibilidade da senha
                                        });
                                      },
                                    ),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Informe a senha'; // Validação se a senha estiver vazia
                                    }
                                    if (value.length < 6) {
                                      return 'A senha deve ter ao menos 6 caracteres'; // Validação de tamanho mínimo
                                    }
                                    return null; // Validação passou
                                  },
                                ),
                                const SizedBox(height: 12),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: () {}, // Ação de esqueceu senha
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: const Size(50, 32),
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    child: const Text(
                                      'Esqueci minha senha?',
                                      style: TextStyle(
                                        color: Color(0xFF333333),
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _submit, // Ação de envio do login
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFFD11A25),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                    ),
                                    child: const Text(
                                      'ENTRAR',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Color.fromARGB(255, 255, 255, 255),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 18),
                                const Center(
                                  child: Text(
                                    'Política de privacidade',
                                    style: TextStyle(
                                      color: Color(0xFF9E9E9E),
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Não possui conta?', // Texto inferior de convite para cadastro
                      style: TextStyle(
                        color: Color(0xFF333333),
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () {}, // Ação de criar conta
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFD11A25), width: 2),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'Criar conta',
                          style: TextStyle(
                            color: Color(0xFFD11A25),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
