const btnReserv = document.querySelector(".btn");
const main = document.querySelector(".main");
const body = document.querySelector(".body");
const filmTime = document.querySelector(".film__time");
const filmName = document.querySelector(".film__name");
const hallNumber = document.querySelector(".hall__number");
const places = document.querySelector(".places");
const buyingInfo = document.querySelector(".buying__info");
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

buyingInfo.addEventListener('click', () => {
    if((Number(body.getBoundingClientRect().width)) < 1199) {
        touchCount++;
        if((reversTouchCount %2 !== 0) && (reversTouchCount !== 0) && (touchCount %2 === 0)) {
            body.style.width = (Number(body.getBoundingClientRect().width) / 1.5) + 'px';
            touchCount = 0;
            reversTouchCount = 0;
            return;
        }
        if(touchCount %2 === 0) {
            body.style.width = (Number(body.getBoundingClientRect().width) * 1.5) + 'px';
            reversTouchCount++;
        } 
    }
})

    fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
    .then( response => response.json())
    .then( function(data) {
        console.log(data);
        let indSeans = data.result.seances.findIndex(el => el.id === Number(checkedSeans));
        let indFilm = data.result.films.findIndex(el => el.id === data.result.seances[indSeans].seance_filmid);  
        filmName.textContent = data.result.films[indFilm].film_name;
        filmTime.textContent = "Начало сеанса: " + data.result.seances[indSeans].seance_time;
        let findHallId = data.result.halls.findIndex(el => data.result.seances[indSeans].seance_hallid === el.id);
        hallNumber.textContent = data.result.halls[ findHallId].hall_name;
        let fullYear = localStorage.getItem('checkedYear');
        let seanceId = Number(checkedSeans);
        let checkDate = fullYear + '-' + month + '-' + day;

        fetch( `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${checkDate}` )
        
            .then( response => response.json())
            .then( function(data) {
                console.log( data );
                data.result.forEach(element => {
                    places.insertAdjacentHTML('beforeend', `<div class="rows_of_scheme"></div>`);
                });

                let maxPlaces;
                const rowsOfScheme = Array.from(document.querySelectorAll(".rows_of_scheme"));
                for(let i = 0; i < rowsOfScheme.length; i++) {
                    for(let j = 0; j < data.result[i].length; j++) {
                        rowsOfScheme[i].insertAdjacentHTML('beforeend', `<div class="place_of_scheme" data-id="${data.result[i][j]}"><img src="" class="img_place_scheme"></div>`);
                        maxPlaces = data.result[i].length;
                    }
                }

                const placeOfScheme = Array.from(document.querySelectorAll(".place_of_scheme"));
                for(let i = 0; i < placeOfScheme.length; i++) {
                if(placeOfScheme[i].dataset.id === "vip") {
                    placeOfScheme[i].firstElementChild.src = './images/свободно_вип.png';        
                }
                if(placeOfScheme[i].dataset.id === "standart") {
                    placeOfScheme[i].firstElementChild.src = './images/свободно.png';        
                }
                if(placeOfScheme[i].dataset.id === "taken") {
                    placeOfScheme[i].firstElementChild.src = './images/занято.png';        
                }      
            }

            places.addEventListener('click', (e) => {
                if(((e.target.closest('.place_of_scheme').dataset.id !== 'taken') && (e.target.dataset.id !== 'taken')) && ((e.target.closest('.place_of_scheme').dataset.id !== 'disabled') && (e.target.dataset.id !== 'disabled'))) {
                
                    if(e.target.classList.contains("check_blue")) {
                        if(e.target.closest('.place_of_scheme').dataset.id === "vip") {
                            if(e.target.classList.contains("place_of_scheme")) {
                                e.target.firstElementChild.src = './images/свободно_вип.png';
                                e.target.firstElementChild.classList.remove("check_blue");
                            }
                            if(e.target.classList.contains("img_place_scheme")) {
                                e.target.src = './images/свободно_вип.png';
                                e.target.classList.remove("check_blue");
                            } 
                        }
                        if(e.target.closest('.place_of_scheme').dataset.id === "standart") {
                            if(e.target.classList.contains("place_of_scheme")) {
                                e.target.firstElementChild.src = './images/свободно.png';
                                e.target.firstElementChild.classList.remove("check_blue");
                            }
                            if(e.target.classList.contains("img_place_scheme")) {
                                e.target.src = './images/свободно.png';
                                e.target.classList.remove("check_blue");
                            } 
                        } 
                    } else {
                        if(e.target.classList.contains("place_of_scheme")) {
                            e.target.firstElementChild.src = './images/выбрано.png';
                            e.target.firstElementChild.classList.add("check_blue");
                        }
                        if(e.target.classList.contains("img_place_scheme")) {
                            e.target.src = './images/выбрано.png';
                            e.target.classList.add("check_blue");
                        }
                    }  
                }    
            })

        btnReserv.addEventListener('click', (e) => { 
           
            for(let i = 0; i < placeOfScheme.length; i++) {
                if(placeOfScheme[i].firstElementChild.classList.contains('check_blue')) {
                    numbOfRow = Math.ceil((i + 1) / maxPlaces);
                    numbOfPlace = (i + 1) - (maxPlaces * (numbOfRow - 1));
                    if(placeOfScheme[i].dataset.id === "vip") {
                        coast = 350;
                    }
                    if(placeOfScheme[i].dataset.id === "standart") {
                        coast = 250;
                    } 
                    function Ticket(coast, numbOfPlace, numbOfRow) { 
                        this.row = `${numbOfRow}`,   
                        this.place = `${numbOfPlace}`,      
                        this.coast = `${coast}`     
                    }
                    ticket = new Ticket(coast, numbOfPlace, numbOfRow,);
                    arr.push(ticket);   
                }
            }
            localStorage.setItem('tickets', JSON.stringify(arr));
            document.location='./pay.html';
        })
    })
})