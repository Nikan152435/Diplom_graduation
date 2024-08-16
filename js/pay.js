const btnPay = document.querySelector(".btn_pay");
let tickets = JSON.parse(localStorage.getItem('tickets'));
console.log(tickets);
let arrForSumm = [];
let searchPrice;
let checkedDate = localStorage.getItem('checkedDate');
let searchMonth = localStorage.getItem('searchMonth');
let year = localStorage.getItem('checkedYear');
let arrOfRow = [];
const filmName = document.querySelector('.name__payment').firstElementChild;
const searchPlace = document.querySelector('.place__payment').firstElementChild;
const hall = document.querySelector('.hall__payment').firstElementChild;
const time = document.querySelector('.time__payment').firstElementChild;
const price = document.querySelector(".price__payment").firstElementChild;
let checkedSeans = Number(localStorage.getItem('checkedSeans'));

fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
.then( response => response.json())
.then( function(data) {
    console.log(data);

    let indSeans = data.result.seances.findIndex(el => el.id === Number(checkedSeans));
    let indFilm = data.result.films.findIndex(el => el.id === data.result.seances[indSeans].seance_filmid);  
    filmName.textContent = `${data.result.films[indFilm].film_name}`;
    time.textContent = `${data.result.seances[indSeans].seance_time}`;
    let findHallId = data.result.halls.findIndex(el => data.result.seances[indSeans].seance_hallid === el.id);
    hall.textContent = data.result.halls[ findHallId].hall_name;
    for(let i = 0; i < tickets.length; i++) {
         let searchPlaces = tickets[i].place;
         let numbOfRows = tickets[i].row;
         arrOfRow.push(numbOfRows);
         if((i + 1) < tickets.length) {
            searchPlace.textContent += Array.from(searchPlaces) + ',';
         } else if((i + 1) === tickets.length) {
            searchPlace.textContent += Array.from(searchPlaces);
         }
        arrForSumm.push(Number(tickets[i].coast));
         
    }
    searchPrice = arrForSumm.reduce((acc, number) => acc + number, 0);
    price.textContent = searchPrice;
    localStorage.setItem('searchPrice', searchPrice);

    btnPay.addEventListener('click', () => {
        const formData = new FormData();
        formData.set('seanceId', checkedSeans);
        formData.set('ticketDate', `${year}-${searchMonth}-${checkedDate}`);
        formData.set('tickets', JSON.stringify(tickets));
        fetch( 'https://shfe-diplom.neto-server.ru/ticket',{
            method: 'POST',
            body: formData
        })
            .then( response => response.json())
            .then( function(data) {
                console.log(data); 
                if(data.success === true){ 
                    document.location='./ticket.html';
                } else {
                    alert('не возможно забронировать места!');
                    return;
                }
        })  
    })
})