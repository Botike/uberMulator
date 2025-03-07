const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = 5674;

const requiredEnvVars = ['BOTPRESS_CHAT_URL'];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Erro: Variável de ambiente ${varName} é requerida mas não é localizada`);
        process.exit(1);
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minut0s
    max: 100 // limiata cada IP para 100 requisições duante os 10 minutos
});

app.use('/send-data', limiter);

app.get('/', (req, res) => {
    res.render('index', { message: null, responseData: null });
});

const sendDataRouter = require('./routes/sendData');
app.use('/', sendDataRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
