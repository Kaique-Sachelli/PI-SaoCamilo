const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
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


//rota para listar atletas
app.get('/atletas', async (req, res) => {
  const busca = req.query.busca ? `%${req.query.busca}%` : null;

  try {
    let sql = `
      SELECT
        id_usuario,
        nome,
        email,
        registro,
        tipo_perfil,
        situacao
      FROM Usuario
      WHERE tipo_perfil = 'Atleta'
    `;
    const params = [];

    if (busca) {
      sql += ' AND (nome LIKE ? OR email LIKE ? OR registro LIKE ?)';
      params.push(busca, busca, busca);
    }

    sql += ' ORDER BY nome';

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: err.message
    });
  }
});

app.get('/usuarios', async (req, res) => {
  const busca = req.query.busca ? `%${req.query.busca}%` : null;

  try {
    let sql = `
      SELECT
        id_usuario,
        nome,
        email,
        registro,
        tipo_perfil,
        situacao
      FROM Usuario
    `;
    const params = [];

    if (busca) {
      sql += `
        WHERE nome LIKE ?
           OR email LIKE ?
           OR registro LIKE ?
           OR tipo_perfil LIKE ?
           OR situacao LIKE ?
      `;
      params.push(busca, busca, busca, busca, busca);
    }

    sql += ' ORDER BY nome';

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      sucesso: false,
      mensagem: err.message
    });
  }
});

// rota de salvar sessão completa
app.post('/sessao/completa', async (req, res) => {
  const {
    id_atleta,
    massa_pre, massa_pos,
    clima_temp, clima_umidade,
    duracao_minutos, volume_ml,
    perda_massa_ajustada, taxa_sudorese, percentual_variacao,
    alerta_seguranca, status_color,
  } = req.body;

  try {
    await db.query(
      'INSERT IGNORE INTO Atleta_Perfil (id_atleta) VALUES (?)',
      [id_atleta]
    );

    const [sessao] = await db.query(
      `INSERT INTO Sessao_Treino (id_atleta, data_hora_inicio, duracao_minutos, massa_pre, massa_pos, clima_temp, clima_umidade, status_sessao)
       VALUES (?, NOW(), ?, ?, ?, ?, ?, 'Concluída')`,
      [id_atleta, duracao_minutos, massa_pre, massa_pos, clima_temp || null, clima_umidade || null]
    );

    const id_sessao = sessao.insertId;

    await db.query(
      'INSERT INTO Registro_Hidratacao (id_sessao, volume_ml) VALUES (?, ?)',
      [id_sessao, volume_ml]
    );

    await db.query(
      `INSERT INTO Resultado_Calculo (id_sessao, perda_massa_ajustada, taxa_sudorese, percentual_variacao, alerta_seguranca, status_color)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_sessao, perda_massa_ajustada, taxa_sudorese, percentual_variacao, alerta_seguranca || null, status_color]
    );

    res.status(201).json({ sucesso: true, id_sessao });
  } catch (err) {
    console.error('Erro ao salvar sessão:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

// rota de buscar última sessão do atleta
app.get('/atleta/:id/ultima-sessao', async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Buscando ultima sessao para id_atleta:', id);
    const [rows] = await db.query(
      `SELECT
         st.data_hora_inicio,
         st.duracao_minutos,
         st.massa_pre,
         st.massa_pos,
         rc.taxa_sudorese,
         rc.perda_massa_ajustada,
         rc.percentual_variacao,
         rc.status_color,
         rc.alerta_seguranca
       FROM Sessao_Treino st
       LEFT JOIN Resultado_Calculo rc ON rc.id_sessao = st.id_sessao
       WHERE st.id_atleta = ? AND st.status_sessao = 'Concluída'
       ORDER BY st.data_hora_inicio DESC
       LIMIT 1`,
      [id]
    );

    console.log('Rows encontradas:', rows.length, rows[0] ?? 'nenhuma');

    if (rows.length === 0) {
      return res.json({ sucesso: true, sessao: null });
    }

    res.json({ sucesso: true, sessao: rows[0] });
  } catch (err) {
    console.error('Erro ao buscar última sessão:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });

  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});
