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
    if ((Number(body.getBoundingClientRect().width)) < 1199) {
        touchCount++;
        if ((reversTouchCount % 2 !== 0) && (reversTouchCount !== 0) && (touchCount % 2 === 0)) {
            body.style.width = (Number(body.getBoundingClientRect().width) / 1.5) + 'px';
            touchCount = 0;
            reversTouchCount = 0;
            return;
        }
        if (touchCount % 2 === 0) {
            body.style.width = (Number(body.getBoundingClientRect().width) * 1.5) + 'px';
            reversTouchCount++;
        }
    }
});

// Функция для получения данных о сеансах
async function fetchSeanceData() {
    try {
        // Запрос на получение данных
        const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
        if (!response.ok) {
            console.log(response); // Проверяем ответ
            throw new Error('Ошибка сети: ' + response.statusText); // Обработка ошибок сети
        }

        const data = await response.json(); // Парсим ответ в формате JSON
        console.log(data); // Проверка структуры данных

        // Находим индекс сеанса
        let indSeans = data.result.seances.findIndex(el => el.id === Number(checkedSeans));
        if (indSeans === -1) {
            console.error('Сеанс с данным id не найден');
            return; // Останавливаем выполнение, если сеанс не найден
        }
      

        // Заполняем информацию о фильме
        let indFilm = data.result.films.findIndex(el => el.id === data.result.seances[indSeans].seance_filmid);
        console.log('Индекс фильма:', indFilm);
        filmName.textContent = data.result.films[indFilm].film_name;
        filmTime.textContent = "Начало сеанса: " + data.result.seances[indSeans].seance_time;
        
        // Получаем номер зала
        let findHallId = data.result.halls.findIndex(el => data.result.seances[indSeans].seance_hallid === el.id);
        hallNumber.textContent = data.result.halls[findHallId].hall_name;

        // Формируем дату сеанса
        let fullYear = localStorage.getItem('checkedYear');
        let seanceId = Number(checkedSeans);
        let checkDate = `${fullYear}-${month}-${day}`;

        // Запрос на получение конфигурации зала
        await fetchHallConfig(seanceId, checkDate);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Функция для получения конфигурации зала
async function fetchHallConfig(seanceId, checkDate) {
    try {
        const response = await fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${checkDate}`);
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }

        const data = await response.json();
        console.log(data); // Проверка данных конфигурации зала

        // Генерация схемы мест
        data.result.forEach(element => {
            places.insertAdjacentHTML('beforeend', `<div class="rows_of_scheme"></div>`);
        });

        const rowsOfScheme = Array.from(document.querySelectorAll(".rows_of_scheme"));
        for (let i = 0; i < rowsOfScheme.length; i++) {
            for (let j = 0; j < data.result[i].length; j++) {
                rowsOfScheme[i].insertAdjacentHTML('beforeend', `<div class="place_of_scheme" data-id="${data.result[i][j]}"><img src="" class="img_place_scheme"></div>`);
            }
        }

        const placeOfScheme = Array.from(document.querySelectorAll(".place_of_scheme"));
        for (let i = 0; i < placeOfScheme.length; i++) {
            // Устанавливаем изображения в зависимости от статуса места
            const placeId = placeOfScheme[i].dataset.id;
            if (placeId === "vip") {
                placeOfScheme[i].firstElementChild.src = './images/free_vip.png';        
            } else if (placeId === "standart") {
                placeOfScheme[i].firstElementChild.src = './images/free.png';        
            } else if (placeId === "taken") {
                placeOfScheme[i].firstElementChild.src = './images/занято.png';        
            }      
        }

        // Обработчик события на выбор мест
        places.addEventListener('click', (e) => {
            const selectedPlace = e.target.closest('.place_of_scheme');
            if (!selectedPlace) return; // Выход, если кликнули не по месту

            if (selectedPlace.dataset.id !== 'taken' && selectedPlace.dataset.id !== 'disabled') {
                if (selectedPlace.firstElementChild.classList.contains("check_blue")) {
                    // Отмена выбора
                    if (selectedPlace.dataset.id === "vip") {
                        selectedPlace.firstElementChild.src = './images/free_vip.png';
                        selectedPlace.firstElementChild.classList.remove("check_blue");
                    } else if (selectedPlace.dataset.id === "standart") {
                        selectedPlace.firstElementChild.src = './images/free.png';
                        selectedPlace.firstElementChild.classList.remove("check_blue");
                    }
                } else {
                    // Выбор места
                    selectedPlace.firstElementChild.src = './images/выбрано.png';
                    selectedPlace.firstElementChild.classList.add("check_blue");
                }
            }
        });

        // Обработчик события на клик по кнопке резервирования
        btnReserv.addEventListener('click', () => { 
            for (let i = 0; i < placeOfScheme.length; i++) {
                if (placeOfScheme[i].firstElementChild.classList.contains('check_blue')) {
                    numbOfRow = Math.ceil((i + 1) / data.result[i].length);
                    numbOfPlace = (i + 1) - (data.result[i].length * (numbOfRow - 1));
                    coast = placeOfScheme[i].dataset.id === "vip" ? 350 : 250; // Определяем стоимость

                    // Создание объекта тикета
                    function Ticket(coast, numbOfPlace, numbOfRow) { 
                        this.row = `${numbOfRow}`;   
                        this.place = `${numbOfPlace}`;      
                        this.coast = `${coast}`;     
                    }
                    ticket = new Ticket(coast, numbOfPlace, numbOfRow);
                    arr.push(ticket);   
                }
            }
            localStorage.setItem('tickets', JSON.stringify(arr));
            document.location='./pay.html'; // Переход на страницу оплаты
        });
    } catch (error) {
        console.error('Ошибка при получении конфигурации зала:', error);
    }
}

// Запуск функции получения данных о сеансах
fetchSeanceData();