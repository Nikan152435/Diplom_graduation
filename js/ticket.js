const qr = document.querySelector('.qr');
const filmName = document.querySelector('.name__payment').firstElementChild;
const placeInHeader = document.querySelector('.place__payment').firstElementChild;
const hall = document.querySelector('.hall__payment').firstElementChild;
const time = document.querySelector('.time__payment').firstElementChild;

const checkedSeans = localStorage.getItem('checkedSeans');
const tickets = JSON.parse(localStorage.getItem('tickets'));
const checkedDate = localStorage.getItem('checkedDate');
const searchMonth = localStorage.getItem('searchMonth');
const searchPrice = localStorage.getItem('searchPrice');
const year = localStorage.getItem('checkedYear');

let arrOfRow = [];

function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function displayTicketInfo(data) {
    const seansIndex = data.result.seances.findIndex(el => el.id === Number(checkedSeans));
    const filmIndex = data.result.films.findIndex(el => el.id === data.result.seances[seansIndex].seance_filmid);

    filmName.textContent = data.result.films[filmIndex].film_name;
    time.textContent = data.result.seances[seansIndex].seance_time;

    const hallIndex = data.result.halls.findIndex(el => el.id === data.result.seances[seansIndex].seance_hallid);
    hall.textContent = data.result.halls[hallIndex].hall_name;

    populatePlacesHeader();
    generateQRCode();
}

function populatePlacesHeader() {
    tickets.forEach((ticket, index) => {
        const searchPlaces = ticket.place;
        const numbOfRows = ticket.row;
        arrOfRow.push(numbOfRows);
        const separator = index + 1 < tickets.length ? ',' : ''; // Add comma if not the last ticket
        placeInHeader.textContent += Array.from(searchPlaces) + separator;
    });
}

function generateQRCode() {
    const alldata = {
        дата: `${checkedDate}-${searchMonth}-${year}`,
        время: time.textContent,
        фильм: filmName.textContent,
        зал: hall.textContent,
        ряд: arrOfRow.join(","),
        место: placeInHeader.textContent,
        стоимость: searchPrice
    };

    const qrcode = QRCreator(JSON.stringify(alldata), {
        mode: 4,
        eccl: 0,
        version: 3,
        mask: -1,
        image: 'html',
        modsize: 7,
        margin: 0
    });

    const content = (qrcode) => {
        return qrcode.error ?
            `недопустимые исходные данные ${qrcode.error}` :
            qrcode.result;
    };

    console.log(qrcode.result);
    qr.append(content(qrcode));
}

// Main function to initiate the ticket display process
function init() {
    fetchData('https://shfe-diplom.neto-server.ru/alldata')
        .then(data => {
            console.log(data);
            displayTicketInfo(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
        .finally(() => {
            localStorage.clear(); // Clear localStorage after processing
        });
}

// Start the application
init();
