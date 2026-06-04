const express = require('express');
const app = express();
app.use(express.json());

const db = require('./db');

// rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, tipo_perfil FROM Usuario WHERE email = ? AND senha = ?',
      [email, senha]
    );
    if (rows.length === 0) {
      res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    } else {
      return res.json({ sucesso: true, mensagem: 'login ok', usuario: rows });
    }
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});