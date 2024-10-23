const mainIndex = document.querySelector(".main__index");
let arr = [];

// Функция для получения данных с сервера
async function fetchData(url) {
    // try {
    //     const response = await fetch(url);
    //      const data = await response.json();
    //     if (!response.ok) {
    //         throw new Error('Ошибка сети: ' + response.status);
    //     }
    //     // return await response.json();
    //     console.log('Данные с сервера:', data);  // Логируем все данные, которые приходят с сервера

    // } catch (error) {
    //     console.error('Ошибка при загрузке данных:', error);
    //     alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
    // }
    try {
        const response = await fetch(url);

        // Проверяем успешность ответа
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        // Проверяем, является ли ответ JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Ответ не является JSON.");
        }

        const data = await response.json();
        console.log('Данные с сервера:', data);  // Логируем данные для проверки
        return data;

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
    }
}

// Вызываем асинхронную функцию
fetchData();

// Функция для сортировки и отображения сеансов
function displaySeances(data) {
      // Логируем залы и фильмы перед обработкой сеансов
      console.log('Все залы:', data.result.halls);  // Логируем все залы
      console.log('Все фильмы:', data.result.films);  // Логируем все фильмы
    if (!data.result || !data.result.seances || data.result.seances.length === 0) {
        console.error('Нет данных для отображения сеансов');
        return;
    }

    // Сортировка по времени
    data.result.seances.sort((a, b) => a.seance_time.localeCompare(b.seance_time));

    data.result.seances.forEach(seance => {
        console.log('Сеанс:', seance);//Какие данные загружаются о сеансе
        const hall = data.result.halls.find(h => h.id === seance.seance_hallid);
        const film = data.result.films.find(f => f.id === seance.seance_filmid);

        if (hall && hall.hall_open === 1 && film) {
            const existingFilmElement = document.querySelector(`.movie[data-id="${film.id}"]`);

            if (existingFilmElement) {
                // Если фильм уже существует, добавляем новый сеанс
                addSeanceToExistingFilm(existingFilmElement, hall, seance);
            } else {
                // Если фильм не существует, создаем новый элемент
                createFilmElement(film, hall, seance);
            }
        } else {
            console.error('Зал или фильм не найдены для сеанса', seance);
        }
    });
}

// Функция для создания элемента фильма
function createFilmElement(film, hall, seance) {
    const filmElement = document.createElement('section');
    filmElement.classList.add('movie');
    filmElement.setAttribute('data-id', film.id);

    filmElement.innerHTML = `
        <div class="movie__info">
            <img class="movie__poster" src="${film.film_poster}" alt="постер">
            <div class="movie__description">
                <h5 class="heading">${film.film_name}</h5>
                <p class="movie__synopsis">${film.film_description}</p>
                <div class="movie__data">
                    <p class="time">${film.film_duration}</p>
                    <p class="origin">${film.film_origin}</p>
                </div>
            </div>
        </div>
        <div class="halls-block">
            <div class="movie-seances__hall" data-id="${hall.id}">
                <h6 class="number__hall">${hall.hall_name}</h6>
                <ul class="time__list">
                    <li>
                        <a href="hall.html?seance_id=${seance.id}" class="seance-time">${seance.seance_time}</a>
                    </li>
                </ul>
            </div>
        </div>
    `;

    mainIndex.insertAdjacentElement("afterbegin", filmElement);
}

// Функция для добавления сеанса к существующему фильму
function addSeanceToExistingFilm(filmElement, hall, seance) {
    const hallElement = filmElement.querySelector(`.movie-seances__hall[data-id="${hall.id}"]`);

    if (hallElement) {
        hallElement.querySelector('.time__list').insertAdjacentHTML("beforeend", `
            <li class="time__list-item" data-id="${seance.id}">
                <a href="hall.html?seance_id=${seance.id}" class="seance-time">${seance.seance_time}</a>
            </li>
        `);
    } else {
        // Если зал не существует, создаем новый элемент зала
        const newHallElement = document.createElement('div');
        newHallElement.classList.add('movie-seances__hall');
        newHallElement.setAttribute('data-id', hall.id);
        newHallElement.innerHTML = `
            <h6 class="number__hall">${hall.hall_name}</h6>
            <ul class="time__list">
                <li class="time__list-item" data-id="${seance.id}">
                    <a href="hall.html?seance_id=${seance.id}" class="seance-time">${seance.seance_time}</a>
                </li>
            </ul>
        `;
        filmElement.querySelector('.halls-block').appendChild(newHallElement);
    }
}

// Функция для проверки доступности времени сеанса
function isTimeAvailable(seanceTime) {
    const currentTime = new Date();
    const [hour, minute] = seanceTime.split(':').map(Number);
    const seanceDate = new Date();
    seanceDate.setHours(hour, minute);
    return seanceDate >= currentTime;
}

// Функция для отображения доступных сеансов по времени
function displayAvailableSeances() {
    const timeListItems = document.querySelectorAll(".time__list-item");
    timeListItems.forEach(item => {
        if (!isTimeAvailable(item.textContent)) {
            item.classList.add("no_active");
        }
    });
}

// Основной процесс загрузки и отображения данных
async function main() {
    const data = await fetchData('https://shfe-diplom.neto-server.ru/alldata');
    if (data) {
        displaySeances(data);
        displayAvailableSeances();

        // Обработка выбора сеансов
        document.querySelectorAll('.time__list-item').forEach(item => {
            item.addEventListener('click', function(event) {
                // Убираем выделение со всех мест
                document.querySelectorAll('.time__list-item').forEach(el => el.classList.remove('selected'));
                
                // Проверка на наличие target перед добавлением класса
                if (event.target) {
                    event.target.classList.add('selected');
                }

                // Сохраняем выбранное время сеанса
                let checkedSeans = Number(event.target.dataset.id);
                localStorage.setItem('checkedSeans', checkedSeans);

                // Переход на другую страницу
                window.location.href = './hall.html';
            });
        });
    }
}

// Запуск основного процесса
main();
