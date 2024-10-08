const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const secretKey = 'your-secret-key';
let halls = [];
let films = [];
let seances = [];

// Мидлвар для авторизации
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Получение всех залов
app.get('/api/halls', authenticateToken, (req, res) => {
    res.json(halls);
});

// Добавление нового зала
app.post('/api/halls', authenticateToken, (req, res) => {
    const hall = { id: halls.length + 1, name: req.body.name };
    halls.push(hall);
    res.json({ message: 'Зал добавлен успешно', hall });
});

// Получение всех фильмов
app.get('/api/films', authenticateToken, (req, res) => {
    res.json(films);
});

// Добавление нового фильма
app.post('/api/films', authenticateToken, (req, res) => {
    const film = { id: films.length + 1, ...req.body };
    films.push(film);
    res.json({ message: 'Фильм добавлен успешно', film });
});

// Получение всех сеансов
app.get('/api/seances', authenticateToken, (req, res) => {
    res.json(seances);
});

// Добавление нового сеанса
app.post('/api/seances', authenticateToken, (req, res) => {
    const seance = { id: seances.length + 1, ...req.body };
    seances.push(seance);
    res.json({ message: 'Сеанс добавлен успешно', seance });
});

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
