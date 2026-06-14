const express = require('express');
const app = express();
app.use(express.json());

const db = require('./db');
const bcrypt = require('bcrypt');

// rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, tipo_perfil, situacao, senha FROM Usuario WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    }
    const senhaOk = await bcrypt.compare(senha, rows[0].senha);
    if (!senhaOk) {
      return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    }

    //confere situação do usuário no banco para validar a sua entrada no sistema
    if (rows.situacao === 'Pendente') {
      return res.status(401).json({ sucesso: false, mensagem: 'Aguardando confirmação do administrador' });
    }
    
    return res.json({ sucesso: true, mensagem: 'login ok', usuario });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

// rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo_perfil } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);
    await db.query(
      'INSERT INTO Usuario (nome, email, senha, tipo_perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, tipo_perfil]
    );
    res.status(201).json({ sucesso: true, mensagem: 'Usuário cadastrado, aguardando aprovação' });
  } catch (err) {
    console.error('Erro no cadastro:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

// rota para adm aprovar usuário
app.patch('/usuario/:id/aprovar', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE Usuario SET situacao = "Ativo" WHERE id_usuario = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Usuário aprovado' });
  } catch (err) {
    console.error('Erro ao aprovar usuário:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});
