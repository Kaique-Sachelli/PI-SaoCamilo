const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

const db = require('./db');
const bcrypt = require('bcrypt');

function parseDateBR(str) {
  const parts = String(str).split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return str;
}

function normalizarTipoPerfil(tipoPerfil) {
  const normalizado = String(tipoPerfil || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalizado === 'medico') return 'Medico';
  return tipoPerfil;
}

function isMissingTableError(err) {
  return err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146);
}

function toNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function formatDecimal(value, decimals = 1) {
  return toNumber(value).toFixed(decimals);
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Treino recente';

  return `Treino  ${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}, ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function getDiaSemana(value = new Date()) {
  const date = new Date(value);
  const dias = ['domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];
  return dias[Number.isNaN(date.getTime()) ? new Date().getDay() : date.getDay()];
}

function getHora(value = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '10:00';
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function statusHidratacao(statusColor) {
  if (statusColor === 'Amarelo') return 'Atencao';
  if (statusColor === 'Vermelho') return 'Risco';
  return 'Hidratacao OK';
}

function corPercentual(statusColor) {
  if (statusColor === 'Amarelo') return '#f59e0b';
  if (statusColor === 'Vermelho') return '#ef4444';
  return '#22c55e';
}

function montarGraficoTemperatura(temp) {
  const base = toNumber(temp, 22);
  return [base, base - 1, base - 2, base - 3, base - 3, base - 3, base - 3, base - 3, base - 3, base - 3, base - 3, base - 3];
}

async function countQuery(sql, params = []) {
  try {
    const [rows] = await db.query(sql, params);
    return Number(rows[0]?.total ?? 0);
  } catch (err) {
    if (isMissingTableError(err)) return 0;
    throw err;
  }
}

async function selectQuery(sql, params = [], fallback = []) {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (err) {
    if (isMissingTableError(err)) return fallback;
    throw err;
  }
}

const CLIMA_FALLBACK = {
  temp: 22,
  descricao: 'Nublado',
  chuva: '10%',
  umidade: '75%',
  vento: '0 km/h',
  diaSemana: 'terca-feira',
  hora: '10:00',
};

const ULTIMA_SESSAO_FALLBACK = {
  dataResumo: 'Treino  Ontem, 18:30',
  nome: 'Corrida intervalar',
  hidratacaoStatus: 'Hidratacao OK',
  taxaSudorese: '1.2',
  perdaPeso: '1.8',
  percentualVariacao: '-1.5%',
  percentualCor: '#22c55e',
};

async function buscarAtleta(usuarioId) {
  if (usuarioId) {
    const rows = await selectQuery(
      'SELECT id_usuario AS id, nome FROM Usuario WHERE id_usuario = ? AND tipo_perfil = "Atleta" LIMIT 1',
      [usuarioId]
    );
    if (rows.length > 0) return rows[0];
  }

  const rows = await selectQuery(
    'SELECT id_usuario AS id, nome FROM Usuario WHERE tipo_perfil = "Atleta" AND situacao <> "Desativado" ORDER BY situacao = "Ativo" DESC, nome ASC LIMIT 1'
  );
  return rows[0] ?? null;
}

async function montarUltimaSessao(idAtleta) {
  if (!idAtleta) {
    return { ultimaSessao: ULTIMA_SESSAO_FALLBACK, clima: CLIMA_FALLBACK, graficoTemperatura: montarGraficoTemperatura(CLIMA_FALLBACK.temp) };
  }

  const rows = await selectQuery(
    `SELECT st.id_sessao, st.data_hora_inicio, st.duracao_minutos, st.massa_pre, st.massa_pos,
       st.clima_temp, st.clima_umidade, st.clima_vento, st.status_sessao,
       rc.taxa_sudorese, rc.percentual_variacao, rc.status_color
     FROM Sessao_Treino st
     LEFT JOIN Resultado_Calculo rc ON rc.id_sessao = st.id_sessao
     WHERE st.id_atleta = ?
     ORDER BY st.data_hora_inicio DESC
     LIMIT 1`,
    [idAtleta]
  );

  if (rows.length === 0) {
    return { ultimaSessao: ULTIMA_SESSAO_FALLBACK, clima: CLIMA_FALLBACK, graficoTemperatura: montarGraficoTemperatura(CLIMA_FALLBACK.temp) };
  }

  const sessao = rows[0];
  const massaPre = toNumber(sessao.massa_pre, 0);
  const massaPos = toNumber(sessao.massa_pos, 0);
  const perdaPeso = massaPre > 0 && massaPos > 0 ? Math.max(massaPre - massaPos, 0) : 1.8;
  const percentualCalculado = massaPre > 0 && massaPos > 0 ? ((massaPos - massaPre) / massaPre) * 100 : -1.5;
  const percentualVariacao = sessao.percentual_variacao ?? percentualCalculado;
  const temp = toNumber(sessao.clima_temp, CLIMA_FALLBACK.temp);
  const umidade = toNumber(sessao.clima_umidade, 75);
  const vento = toNumber(sessao.clima_vento, 0);

  return {
    ultimaSessao: {
      dataResumo: formatDateLabel(sessao.data_hora_inicio),
      nome: sessao.status_sessao === 'Pendente' ? 'Sessao pendente' : 'Treino registrado',
      hidratacaoStatus: statusHidratacao(sessao.status_color),
      taxaSudorese: formatDecimal(sessao.taxa_sudorese ?? 1.2, 1),
      perdaPeso: formatDecimal(perdaPeso, 1),
      percentualVariacao: `${formatDecimal(percentualVariacao, 1)}%`,
      percentualCor: corPercentual(sessao.status_color),
    },
    clima: {
      temp,
      descricao: temp >= 28 ? 'Quente' : 'Nublado',
      chuva: CLIMA_FALLBACK.chuva,
      umidade: `${Math.round(umidade)}%`,
      vento: `${formatDecimal(vento, 0)} km/h`,
      diaSemana: getDiaSemana(sessao.data_hora_inicio),
      hora: getHora(sessao.data_hora_inicio),
    },
    graficoTemperatura: montarGraficoTemperatura(temp),
  };
}

async function buscarAtletasProfissional(tipoPerfil, usuarioId) {
  const params = [];
  let filtroVinculo = '';

  if (tipoPerfil === 'Treinador' && usuarioId) {
    filtroVinculo = ' AND (ap.id_treinador = ? OR ap.id_treinador IS NULL)';
    params.push(usuarioId);
  }

  if (tipoPerfil === 'Nutricionista' && usuarioId) {
    filtroVinculo = ' AND (ap.id_nutricionista = ? OR ap.id_nutricionista IS NULL)';
    params.push(usuarioId);
  }

  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario AS id, u.nome, COALESCE(ap.modalidade_esportiva, 'Sem modalidade') AS esporte, u.situacao
       FROM Usuario u
       LEFT JOIN Atleta_Perfil ap ON ap.id_atleta = u.id_usuario
       WHERE u.tipo_perfil = "Atleta" AND u.situacao <> "Desativado"${filtroVinculo}
       ORDER BY u.nome ASC`,
      params
    );

    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      esporte: row.esporte,
      ativo: row.situacao === 'Ativo',
      disponivel: row.situacao === 'Ativo',
      fotoUrl: null,
    }));
  } catch (err) {
    if (!isMissingTableError(err)) throw err;

    const rows = await selectQuery(
      'SELECT id_usuario AS id, nome, situacao FROM Usuario WHERE tipo_perfil = "Atleta" AND situacao <> "Desativado" ORDER BY nome ASC'
    );

    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      esporte: 'Sem modalidade',
      ativo: row.situacao === 'Ativo',
      disponivel: row.situacao === 'Ativo',
      fotoUrl: null,
    }));
  }
}

function enviarErro(res, contexto, err) {
  console.error(contexto, err.message);
  res.status(500).json({ sucesso: false, mensagem: 'Erro interno: ' + err.message });
}

app.get('/health', (_req, res) => res.json({ sucesso: true, mensagem: 'API online' }));

app.get('/homepage/adm', async (_req, res) => {
  try {
    const [usuariosPendentes, usuariosAtivos, atletasAtivos, sessoesConcluidas] = await Promise.all([
      countQuery('SELECT COUNT(*) AS total FROM Usuario WHERE situacao = "Pendente"'),
      countQuery('SELECT COUNT(*) AS total FROM Usuario WHERE situacao = "Ativo"'),
      countQuery('SELECT COUNT(*) AS total FROM Usuario WHERE tipo_perfil = "Atleta" AND situacao = "Ativo"'),
      countQuery('SELECT COUNT(*) AS total FROM Sessao_Treino WHERE status_sessao <> "Pendente"'),
    ]);
    res.json({ sucesso: true, resumo: { usuariosPendentes, usuariosAtivos, atletasAtivos, sessoesConcluidas } });
  } catch (err) {
    enviarErro(res, 'Erro na homepage do administrador:', err);
  }
});

app.get('/homepage/atleta', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId) || null;
  try {
    const atleta = await buscarAtleta(usuarioId);
    const dadosSessao = await montarUltimaSessao(atleta?.id);
    res.json({ sucesso: true, usuario: atleta ?? { id: null, nome: 'Atleta' }, ...dadosSessao });
  } catch (err) {
    enviarErro(res, 'Erro na homepage do atleta:', err);
  }
});

app.get('/homepage/treinador', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId) || null;
  try {
    const atletas = await buscarAtletasProfissional('Treinador', usuarioId);
    res.json({ sucesso: true, atletas });
  } catch (err) {
    enviarErro(res, 'Erro na homepage do treinador:', err);
  }
});

app.get('/homepage/medico', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId) || null;
  try {
    const atletas = await buscarAtletasProfissional('Medico', usuarioId);
    res.json({ sucesso: true, atletas });
  } catch (err) {
    enviarErro(res, 'Erro na homepage do medico:', err);
  }
});

app.get('/homepage/nutricionista', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId) || null;
  try {
    const atletas = await buscarAtletasProfissional('Nutricionista', usuarioId);
    res.json({ sucesso: true, atletas });
  } catch (err) {
    enviarErro(res, 'Erro na homepage da nutricionista:', err);
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query('SELECT id_usuario, nome, tipo_perfil, situacao, senha FROM Usuario WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    const senhaOk = await bcrypt.compare(senha, rows[0].senha);
    if (!senhaOk) return res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
    if (rows[0].situacao === 'Pendente') return res.status(401).json({ sucesso: false, mensagem: 'Aguardando confirmacao do administrador, por favor aguarde.' });
    return res.json({ sucesso: true, mensagem: 'login ok', usuario: rows });
  } catch (err) {
    enviarErro(res, 'Erro no login:', err);
  }
});

app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo_perfil, data_nascimento, telefone, registro } = req.body;
  if (!nome || !email || !senha || !tipo_perfil || !data_nascimento || !telefone) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatorios' });
  }
  const tipoNormalizado = normalizarTipoPerfil(tipo_perfil);
  const dataNascimentoFormatada = parseDateBR(data_nascimento);
  try {
    const [existe] = await db.query('SELECT id_usuario FROM Usuario WHERE email = ?', [email]);
    if (existe.length > 0) return res.status(409).json({ sucesso: false, mensagem: 'E-mail ja cadastrado' });
    const hash = await bcrypt.hash(senha, 10);
    await db.query(
      'INSERT INTO Usuario (nome, email, senha, tipo_perfil, data_nascimento, telefone, registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, email, hash, tipoNormalizado, dataNascimentoFormatada, telefone, registro || null]
    );
    res.status(201).json({ sucesso: true, mensagem: 'Usuario cadastrado, aguardando aprovacao' });
  } catch (err) {
    enviarErro(res, 'Erro no cadastro:', err);
  }
});

app.patch('/usuario/:id/aprovar', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE Usuario SET situacao = "Ativo" WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ sucesso: false, mensagem: 'Usuario nao encontrado' });
    res.json({ sucesso: true, mensagem: 'Usuario aprovado' });
  } catch (err) {
    enviarErro(res, 'Erro ao aprovar usuario:', err);
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});
