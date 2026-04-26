const express = require('express');
const app = express();

app.use(express.json());

// rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (email === 'admin@gmail.com' && senha === '1234') {
    return res.json({ sucesso: true, mensagem: 'login ok' });
  }

  res.status(401).json({ sucesso: false, mensagem: 'login invalido' });
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});