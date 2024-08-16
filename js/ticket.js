const qr = document.querySelector('.qr');
let checkedSeans = localStorage.getItem('checkedSeans');
let tickets = JSON.parse(localStorage.getItem('tickets'));
let checkedDate = localStorage.getItem('checkedDate');
let searchMonth = localStorage.getItem('searchMonth');
let searchPrice = localStorage.getItem('searchPrice');
let year = localStorage.getItem('checkedYear');
const filmName = document.querySelector('.name__payment').firstElementChild;
const placeInHeader = document.querySelector('.place__payment').firstElementChild;
const hall = document.querySelector('.hall__payment').firstElementChild;
const time = document.querySelector('.time__payment').firstElementChild;
let arrOfRow = [];

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
          placeInHeader.textContent += Array.from(searchPlaces) + ',';
        } else if((i + 1) === tickets.length) {
          placeInHeader.textContent += Array.from(searchPlaces);
        }
    }
    let alldata =  {
        дата: `${checkedDate}-${searchMonth}-${year}`,
        время: `${time.textContent}`,
        фильм: `${filmName.textContent}`,
        зал: `${hall.textContent}`,
        ряд: `${arrOfRow.join(",")}`,
        место: `${placeInHeader.textContent}`, 
        стоимость: `${searchPrice}`
    }

    const qrcode = QRCreator(`${alldata}`, 
    {mode: 4,
      eccl: 0,
      version: 3,
      mask: -1,
      image: 'html',
      modsize: 7,
      margin: 0}
      );
    const content = (qrcode) =>{
        return qrcode.error ?
          `недопустимые исходные данные ${qrcode.error}`:
          qrcode.result;
      };
    console.log(qrcode.result);
    qr.append(content(qrcode));
})

localStorage.clear();