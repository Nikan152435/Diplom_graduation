// Получаем ссылки на элементы страницы
const btnReserv = document.querySelector(".btn");
const main = document.querySelector(".main");
const body = document.querySelector(".body");
const filmTime = document.querySelector(".film__time");
const filmName = document.querySelector(".film__name");
const hallNumber = document.querySelector(".hall__number");
const places = document.querySelector(".places");
const buyingInfo = document.querySelector(".buying__info");

// Получаем данные из localStorage
let checkedSeans = localStorage.getItem('checkedSeans');
let arr = [];
let ticket;
let coast;
let numbOfRow;
let numbOfPlace;
let day = localStorage.getItem('checkedDate');
let month = localStorage.getItem('searchMonth');
let touchCount = 0;
let reversTouchCount = 0;

// Обработчик события на клик по элементу buyingInfo
buyingInfo.addEventListener('click', () => {
    const bodyWidth = Number(body.getBoundingClientRect().width);
    
    if (bodyWidth < 1199) {
        touchCount++;
        if ((reversTouchCount % 2 !== 0) && (reversTouchCount !== 0) && (touchCount % 2 === 0)) {
            body.style.width = `${bodyWidth / 1.5}px`;
            touchCount = 0;
            reversTouchCount = 0;
            return;
        }
        if (touchCount % 2 === 0) {
            body.style.width = `${bodyWidth * 1.5}px`;
            reversTouchCount++;
        }
    }
});

// Функция для получения данных о сеансах
async function fetchSeanceData() {
    try {
        const response = await fetch('./data/alldata.json'); // Измените на путь к локальному файлу
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.statusText}`);
        }

        const data = await response.json();
        let indSeans = data.result.seances.findIndex(el => el.id === Number(checkedSeans));
        if (indSeans === -1) {
            console.error('Сеанс с данным id не найден');
            return; 
        }

        // Заполняем информацию о фильме
        let indFilm = data.result.films.findIndex(el => el.id === data.result.seances[indSeans].seance_filmid);
        filmName.textContent = data.result.films[indFilm].film_name;
        filmTime.textContent = `Начало сеанса: ${data.result.seances[indSeans].seance_time}`;

        // Получаем номер зала
        let findHallId = data.result.halls.findIndex(el => data.result.seances[indSeans].seance_hallid === el.id);
        hallNumber.textContent = data.result.halls[findHallId].hall_name;

        // Формируем дату сеанса
        let fullYear = localStorage.getItem('checkedYear');
        let checkDate = `${fullYear}-${month}-${day}`;

        // Запрос на получение конфигурации зала
        await fetchHallConfig(Number(checkedSeans), checkDate);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Функция для получения конфигурации зала
async function fetchHallConfig(seanceId, checkDate) {
    try {
        const response = await fetch('./data/hallconfig.json'); // Измените на путь к локальному файлу
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }

        const data = await response.json();
        generateSeatScheme(data.result);

        // Обработчик события на выбор мест
        places.addEventListener('click', handleSeatSelection);

        // Обработчик события на клик по кнопке резервирования
        btnReserv.addEventListener('click', reserveTickets.bind(null, data.result));
    } catch (error) {
        console.error('Ошибка при получении конфигурации зала:', error);
    }
}

// Функция для генерации схемы мест
function generateSeatScheme(seatData) {
    seatData.forEach(() => {
        places.insertAdjacentHTML('beforeend', `<div class="rows_of_scheme"></div>`);
    });

    const rowsOfScheme = Array.from(document.querySelectorAll(".rows_of_scheme"));
    for (let i = 0; i < rowsOfScheme.length; i++) {
        seatData[i].forEach((place) => {
            rowsOfScheme[i].insertAdjacentHTML('beforeend', `<div class="place_of_scheme" data-id="${place}"><img src="" class="img_place_scheme"></div>`);
        });
    }

    setImageForSeats();
}

// Функция для установки изображений в зависимости от статуса места
function setImageForSeats() {
    const placeOfScheme = Array.from(document.querySelectorAll(".place_of_scheme"));
    placeOfScheme.forEach(place => {
        const placeId = place.dataset.id;
        if (placeId === "vip") {
            place.firstElementChild.src = './images/free_vip.png';        
        } else if (placeId === "standart") {
            place.firstElementChild.src = './images/free.png';        
        } else if (placeId === "taken") {
            place.firstElementChild.src = './images/занято.png';        
        }      
    });
}

// Функция для обработки выбора мест
function handleSeatSelection(e) {
    const selectedPlace = e.target.closest('.place_of_scheme');
    if (!selectedPlace) return; // Выход, если кликнули не по месту

    if (selectedPlace.dataset.id !== 'taken' && selectedPlace.dataset.id !== 'disabled') {
        const img = selectedPlace.firstElementChild;
        if (img.classList.contains("check_blue")) {
            // Отмена выбора
            img.src = selectedPlace.dataset.id === "vip" ? './images/free_vip.png' : './images/free.png';
            img.classList.remove("check_blue");
        } else {
            // Выбор места
            img.src = './images/выбрано.png';
            img.classList.add("check_blue");
        }
    }
}

// Функция для резервирования билетов
function reserveTickets(seatData) { 
    const placeOfScheme = Array.from(document.querySelectorAll(".place_of_scheme"));
    placeOfScheme.forEach((place, i) => {
        if (place.firstElementChild.classList.contains('check_blue')) {
            numbOfRow = Math.ceil((i + 1) / seatData[i].length);
            numbOfPlace = (i + 1) - (seatData[i].length * (numbOfRow - 1));
            coast = place.dataset.id === "vip" ? 350 : 250; // Определяем стоимость

            // Создание объекта тикета
            ticket = {
                row: `${numbOfRow}`,
                place: `${numbOfPlace}`,
                coast: `${coast}`
            };
            arr.push(ticket);   
        }
    });

    localStorage.setItem('tickets', JSON.stringify(arr));
    document.location='./pay.html'; // Переход на страницу оплаты
}

// Запуск функции получения данных о сеансах
fetchSeanceData();