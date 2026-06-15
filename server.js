const express = require('express');
const app = express();
app.use(express.json());

const db = require('./db');
const bcrypt = require('bcrypt');

function parseDateBR(str) {
  const parts = str.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return str;
}

// rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, tipo_perfil, situacao, senha, data_nascimento, telefone, registro FROM Usuario WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    }
    const senhaOk = await bcrypt.compare(senha, rows[0].senha);
    if (!senhaOk) {
      return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    }
    if (rows[0].situacao === 'Pendente') {
      return res.status(401).json({ sucesso: false, mensagem: 'Aguardando aprovação do administrador, por favor aguarde.' });
    }

    return res.json({ sucesso: true, mensagem: 'login ok', usuario: rows });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

//rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo_perfil, data_nascimento, telefone, registro } = req.body;

  if (!nome || !email || !senha || !tipo_perfil || !data_nascimento || !telefone) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios' });
  }

  const tipoNormalizado = tipo_perfil === 'Médico' ? 'Medico' : tipo_perfil;
  const dataNascimentoFormatada = parseDateBR(data_nascimento);

  try {
    const [existe] = await db.query('SELECT id_usuario FROM Usuario WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    await db.query(
      'INSERT INTO Usuario (nome, email, senha, tipo_perfil, data_nascimento, telefone, registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, email, hash, tipoNormalizado, dataNascimentoFormatada, telefone, registro || null]
    );
    res.status(201).json({ sucesso: true, mensagem: 'Usuário cadastrado, aguardando aprovação' });
  } catch (err) {
    console.error('Erro no cadastro:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

// rota de aprovação de cadastro
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
