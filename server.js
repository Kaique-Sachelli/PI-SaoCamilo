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

function campoTexto(valor) {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  return texto || null;
}

async function inicializarBanco() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS Dieta (
      id_dieta INT PRIMARY KEY AUTO_INCREMENT,
      id_atleta INT NOT NULL,
      id_nutricionista INT,
      titulo VARCHAR(120) NOT NULL,
      descricao TEXT NOT NULL,
      nome_arquivo VARCHAR(255),
      tipo_arquivo VARCHAR(50),
      data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_atleta) REFERENCES Atleta_Perfil(id_atleta),
      FOREIGN KEY (id_nutricionista) REFERENCES Usuario(id_usuario)
    )
  `);
}

// rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, email, tipo_perfil, situacao, senha, data_nascimento, telefone, registro FROM Usuario WHERE email = ?',
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
        u.id_usuario,
        u.nome,
        u.email,
        u.telefone,
        u.data_nascimento,
        u.registro,
        u.tipo_perfil,
        u.situacao,
        ap.idade,
        ap.sexo,
        ap.altura,
        ap.peso,
        ap.modalidade_esportiva
      FROM Usuario u
      LEFT JOIN Atleta_Perfil ap ON ap.id_atleta = u.id_usuario
      WHERE u.tipo_perfil = 'Atleta'
    `;
    const params = [];

    if (busca) {
      sql += ' AND (u.nome LIKE ? OR u.email LIKE ? OR u.registro LIKE ? OR ap.modalidade_esportiva LIKE ?)';
      params.push(busca, busca, busca, busca);
    }

    sql += ' ORDER BY u.nome';

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

// rota para enviar dieta do nutricionista para um atleta
app.post('/dietas', async (req, res) => {
  const {
    id_atleta,
    id_nutricionista,
    titulo,
    descricao,
    nome_arquivo,
    tipo_arquivo,
  } = req.body;

  const idAtleta = Number(id_atleta);
  const idNutricionista = Number(id_nutricionista);
  const tituloNormalizado = campoTexto(titulo) || 'Plano alimentar';
  const descricaoNormalizada = campoTexto(descricao);
  const nomeArquivoNormalizado = campoTexto(nome_arquivo);
  const tipoArquivoNormalizado = campoTexto(tipo_arquivo);

  if (!Number.isInteger(idAtleta) || idAtleta <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Atleta inválido' });
  }

  if (!Number.isInteger(idNutricionista) || idNutricionista <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Nutricionista inválido' });
  }

  if (!descricaoNormalizada) {
    return res.status(400).json({ sucesso: false, mensagem: 'Descreva a dieta antes de enviar' });
  }

  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [atleta] = await conn.query(
      'SELECT id_usuario FROM Usuario WHERE id_usuario = ? AND tipo_perfil = "Atleta"',
      [idAtleta]
    );

    if (atleta.length === 0) {
      await conn.rollback();
      return res.status(404).json({ sucesso: false, mensagem: 'Atleta não encontrado' });
    }

    const [nutricionista] = await conn.query(
      'SELECT id_usuario FROM Usuario WHERE id_usuario = ? AND tipo_perfil = "Nutricionista"',
      [idNutricionista]
    );

    if (nutricionista.length === 0) {
      await conn.rollback();
      return res.status(404).json({ sucesso: false, mensagem: 'Nutricionista não encontrado' });
    }

    await conn.query(
      'INSERT IGNORE INTO Atleta_Perfil (id_atleta, id_nutricionista) VALUES (?, ?)',
      [idAtleta, idNutricionista]
    );

    await conn.query(
      'UPDATE Atleta_Perfil SET id_nutricionista = COALESCE(id_nutricionista, ?) WHERE id_atleta = ?',
      [idNutricionista, idAtleta]
    );

    const [resultado] = await conn.query(
      `INSERT INTO Dieta
        (id_atleta, id_nutricionista, titulo, descricao, nome_arquivo, tipo_arquivo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idAtleta,
        idNutricionista,
        tituloNormalizado,
        descricaoNormalizada,
        nomeArquivoNormalizado,
        tipoArquivoNormalizado,
      ]
    );

    await conn.commit();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Dieta enviada com sucesso',
      id_dieta: resultado.insertId,
    });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Erro ao enviar dieta:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  } finally {
    if (conn) conn.release();
  }
});

// rota para buscar a dieta mais recente de um atleta
app.get('/atleta/:id/dieta', async (req, res) => {
  const idAtleta = Number(req.params.id);

  if (!Number.isInteger(idAtleta) || idAtleta <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Atleta inválido' });
  }

  try {
    const [rows] = await db.query(
      `SELECT
         d.id_dieta,
         d.id_atleta,
         d.id_nutricionista,
         d.titulo,
         d.descricao,
         d.nome_arquivo,
         d.tipo_arquivo,
         d.data_envio,
         u.nome AS nutricionista_nome
       FROM Dieta d
       LEFT JOIN Usuario u ON u.id_usuario = d.id_nutricionista
       WHERE d.id_atleta = ?
       ORDER BY d.data_envio DESC
       LIMIT 1`,
      [idAtleta]
    );

    res.json({ sucesso: true, dieta: rows[0] || null });
  } catch (err) {
    console.error('Erro ao buscar dieta:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
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
// rota para listar por tipo de perfil
app.get('/dashboard/usuarios-por-perfil', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        tipo_perfil,
        COUNT(*) AS quantidade
      FROM Usuario
      GROUP BY tipo_perfil
    `);

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
    intensidade_percebida, roupas_encharcadas, urina_pre_cor,
    volume_urina_ml,
    nivel_fadiga, sintomas_gastrointestinais,
  } = req.body;

  try {
    await db.query(
      'INSERT IGNORE INTO Atleta_Perfil (id_atleta) VALUES (?)',
      [id_atleta]
    );

    const [sessao] = await db.query(
      `INSERT INTO Sessao_Treino
         (id_atleta, data_hora_inicio, duracao_minutos, massa_pre, massa_pos,
          clima_temp, clima_umidade, status_sessao,
          intensidade_percebida, roupas_encharcadas, urina_pre_cor, volume_urina_ml)
       VALUES (?, NOW(), ?, ?, ?, ?, ?, 'Concluída', ?, ?, ?, ?)`,
      [
        id_atleta, duracao_minutos, massa_pre, massa_pos,
        clima_temp || null, clima_umidade || null,
        intensidade_percebida || null,
        roupas_encharcadas != null ? roupas_encharcadas : 0,
        urina_pre_cor || null,
        volume_urina_ml || null,
      ]
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

    if (nivel_fadiga || sintomas_gastrointestinais) {
      await db.query(
        `INSERT INTO Saude_Sintomas (id_sessao, nivel_fadiga, sintomas_gastrointestinais)
         VALUES (?, ?, ?)`,
        [id_sessao, nivel_fadiga || null, sintomas_gastrointestinais || null]
      );
    }

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

// rota de buscar todas as sessões do atleta (mais recente → mais antiga)
app.get('/atleta/:id/sessoes', async (req, res) => {
  const { id } = req.params;
  const { data } = req.query;

  try {
    let query = `
      SELECT
        st.id_sessao,
        st.data_hora_inicio,
        st.duracao_minutos,
        st.massa_pre,
        st.massa_pos,
        st.clima_temp,
        st.clima_umidade,
        rc.taxa_sudorese,
        rc.perda_massa_ajustada,
        rc.percentual_variacao,
        rc.alerta_seguranca,
        rc.status_color,
        rh.volume_ml
      FROM Sessao_Treino st
      LEFT JOIN Resultado_Calculo rc ON rc.id_sessao = st.id_sessao
      LEFT JOIN Registro_Hidratacao rh ON rh.id_sessao = st.id_sessao
      WHERE st.id_atleta = ? AND st.status_sessao = 'Concluída'
    `;

    const params = [id];

    if (data) {
      const parts = data.split('/');
      if (parts.length === 3) {
        query += ' AND DATE(st.data_hora_inicio) = ?';
        params.push(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }

    query += ' ORDER BY st.data_hora_inicio DESC';

    const [rows] = await db.query(query, params);
    res.json({ sucesso: true, sessoes: rows });
  } catch (err) {
    console.error('Erro ao buscar sessões:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

// rota de buscar detalhes de uma sessão específica
app.get('/sessao/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT
        st.id_sessao,
        st.data_hora_inicio,
        st.duracao_minutos,
        st.massa_pre,
        st.massa_pos,
        st.clima_temp,
        st.clima_umidade,
        rc.taxa_sudorese,
        rc.perda_massa_ajustada,
        rc.percentual_variacao,
        rc.alerta_seguranca,
        rc.status_color,
        rh.volume_ml,
        ap.modalidade_esportiva
      FROM Sessao_Treino st
      LEFT JOIN Resultado_Calculo rc ON rc.id_sessao = st.id_sessao
      LEFT JOIN Registro_Hidratacao rh ON rh.id_sessao = st.id_sessao
      LEFT JOIN Atleta_Perfil ap ON ap.id_atleta = st.id_atleta
      WHERE st.id_sessao = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Sessão não encontrada' });
    }

    res.json({ sucesso: true, sessao: rows[0] });
  } catch (err) {
    console.error('Erro ao buscar sessão:', err.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
  }
});

app.get('/peso/:id', async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    `SELECT peso
     FROM Atleta_Perfil
     WHERE id_atleta = ?`,
    [id]
  );

    res.json({ peso: rows[0] });
});

inicializarBanco()
  .then(() => {
    app.listen(3000, () => {
      console.log('rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar banco:', err.message);
    process.exit(1);
  });
