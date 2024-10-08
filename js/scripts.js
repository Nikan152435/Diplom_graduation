document.addEventListener('DOMContentLoaded', () => {
    const hallList = document.querySelector('.hall-list');
    const hallConfigList = document.querySelector('.hall-config-list');
    const filmList = document.querySelector('.film-list');
    const seanceList = document.querySelector('.seance-list');

    const addHallButton = document.querySelector('.add_hall');
    const addFilmButton = document.querySelector('.add_film');
    const addSeanceButton = document.querySelector('.add_seance');

    // Загрузка и отображение списков залов, фильмов и сеансов
    async function loadData(endpoint, targetElement) {
        try {
            const response = await fetch(`https://shfe-diplom.neto-server.ru/api/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            targetElement.innerHTML = '';  // Очищаем перед вставкой новых данных
            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'list-item';
                div.textContent = item.name || item.title || 'Нет данных';
                targetElement.appendChild(div);
            });
        } catch (error) {
            console.error(`Ошибка загрузки данных (${endpoint}):`, error);
        }
    }

    // Загрузка данных при инициализации
    loadData('halls', hallList);
    loadData('films', filmList);
    loadData('seances', seanceList);

    // Обработчик для создания нового зала
    addHallButton.addEventListener('click', () => {
        const hallName = prompt("Введите название нового зала:");
        if (hallName) {
            fetch('https://shfe-diplom.neto-server.ru/api/halls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: hallName })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadData('halls', hallList);
            })
            .catch(error => console.error('Ошибка добавления зала:', error));
        }
    });

    // Обработчик для создания нового фильма
    addFilmButton.addEventListener('click', () => {
        const filmName = prompt("Введите название фильма:");
        const filmDuration = prompt("Введите продолжительность фильма (в минутах):");
        const filmDescription = prompt("Введите описание фильма:");
        const filmOrigin = prompt("Введите страну производства:");

        if (filmName && filmDuration && filmDescription && filmOrigin) {
            fetch('https://shfe-diplom.neto-server.ru/api/films', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: filmName,
                    duration: parseInt(filmDuration),
                    description: filmDescription,
                    origin: filmOrigin
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadData('films', filmList);
            })
            .catch(error => console.error('Ошибка добавления фильма:', error));
        }
    });

    // Обработчик для создания нового сеанса
    addSeanceButton.addEventListener('click', () => {
        const hallId = prompt("Введите ID зала для сеанса:");
        const filmId = prompt("Введите ID фильма для сеанса:");
        const startTime = prompt("Введите время начала сеанса (например, 14:30):");

        if (hallId && filmId && startTime) {
            fetch('https://shfe-diplom.neto-server.ru/api/seances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    hallId: parseInt(hallId),
                    filmId: parseInt(filmId),
                    startTime: startTime
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadData('seances', seanceList);
            })
            .catch(error => console.error('Ошибка добавления сеанса:', error));
        }
    });
});
