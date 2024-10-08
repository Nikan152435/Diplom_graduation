// Получение элементов DOM
const btnPay = document.querySelector(".btn_pay");
const filmName = document.querySelector('.name__payment').firstElementChild;
const searchPlace = document.querySelector('.place__payment').firstElementChild;
const hall = document.querySelector('.hall__payment').firstElementChild;
const time = document.querySelector('.time__payment').firstElementChild;
const price = document.querySelector(".price__payment").firstElementChild;

// Получение данных из localStorage
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
let checkedDate = localStorage.getItem('checkedDate');
let searchMonth = localStorage.getItem('searchMonth');
let year = localStorage.getItem('checkedYear');
let checkedSeans = Number(localStorage.getItem('checkedSeans'));

let arrForSumm = [];

// Функция для получения данных о сеансах и фильмах
async function fetchData() {
    try {
        const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
        if (!response.ok) throw new Error('Ошибка сети при получении данных');
        
        const data = await response.json();
        populatePaymentDetails(data);
    } catch (error) {
        console.error(error);
        alert('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте снова.');
    }
}

// Функция для заполнения информации о платеже
function populatePaymentDetails(data) {
    const indSeans = data.result.seances.findIndex(el => el.id === checkedSeans);
    if (indSeans === -1) {
        alert('Сеанс не найден!');
        return;
    }
    
    const indFilm = data.result.films.findIndex(el => el.id === data.result.seances[indSeans].seance_filmid);
    filmName.textContent = data.result.films[indFilm]?.film_name || 'Фильм не найден';
    time.textContent = data.result.seances[indSeans]?.seance_time || 'Время не найдено';

    const findHallId = data.result.halls.findIndex(el => data.result.seances[indSeans].seance_hallid === el.id);
    hall.textContent = data.result.halls[findHallId]?.hall_name || 'Зал не найден';

    tickets.forEach((ticket, index) => {
        const searchPlaces = ticket.place;
        searchPlace.textContent += (index + 1 < tickets.length) ? `${searchPlaces}, ` : searchPlaces;
        arrForSumm.push(Number(ticket.coast));
    });

    const totalPrice = arrForSumm.reduce((acc, number) => acc + number, 0);
    price.textContent = totalPrice;
    localStorage.setItem('searchPrice', totalPrice);

    btnPay.addEventListener('click', () => handlePayment());
}

// Функция для обработки платежа
async function handlePayment() {
    try {
        const formData = new FormData();
        formData.set('seanceId', checkedSeans);
        formData.set('ticketDate', `${year}-${searchMonth}-${checkedDate}`);
        formData.set('tickets', JSON.stringify(tickets));

        const response = await fetch('https://shfe-diplom.neto-server.ru/ticket', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            document.location = './ticket.html';
        } else {
            alert('Не удалось забронировать места!');
        }
    } catch (error) {
        console.error('Ошибка при бронировании:', error);
        alert('Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.');
    }
}

// Инициализация
fetchData();
