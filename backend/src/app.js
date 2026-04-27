const express = require('express');
const cors = require('cors');

require('./config/db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const loginRoutes = require('./routes/loginRoutes');
const monitoriaRoutes = require('./routes/monitoriaRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/monitorias', monitoriaRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/inscricoes', inscricaoRoutes);    


app.get('/', (req, res) => {
  res.json({ mensagem: 'API UniMonitor funcionando' });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
}); 
