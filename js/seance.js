const mainIndex = document.querySelector(".main__index");
let arr = [];

fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
.then( response => response.json())
.then( function(data) {
  console.log(data);
  function print() {
    data.result.seances.sort(function(a, b) {
      return a.seance_time.replace(':', '') - b.seance_time.replace(':', '');
    });
    
    for(let i = 0; i < data.result.seances.length; i++) {
      let countHalls = 0;
      let indOfHall = data.result.halls.findIndex(el => data.result.seances[i].seance_hallid === el.id);
      let nameOfHall = data.result.halls[indOfHall].hall_name;
        if(data.result.halls[indOfHall].hall_open === 1) {

          const arrMovie = Array.from(document.querySelectorAll(".movie"));
          let indOfFilm = arrMovie.findIndex( el => Number(el.dataset.id) === data.result.seances[i].seance_filmid);

          if(indOfFilm < 0) {
            let indFilm = data.result.films.findIndex(el => data.result.seances[i].seance_filmid === el.id);
            mainIndex.insertAdjacentHTML("afterbegin", 
            `<section class="movie" data-id=${data.result.seances[i].seance_filmid}>
                <div class="movie__info">
                    <img class="movie__poster" src="${data.result.films[indFilm].film_poster}" alt="постер">
                    <div class="movie__description">
                        <h5 class="heading">${data.result.films[indFilm].film_name}</h5>
                        <p class="movie__synopsis">${data.result.films[indFilm].film_description}</p>
                        <div class="movie__data">
                            <p class="time">${data.result.films[indFilm].film_duration}</p>
                            <p class="origin">${data.result.films[indFilm].film_origin}</p>
                        </div>
                    </div>
                </div>
                <div class="halls-block">
                  <div class="movie-seances__hall" data-id=${data.result.seances[i].seance_hallid}>
                    <h6 class="number__hall">${nameOfHall}</h6>
                    <ul class="time__list">  
                        <li class="time__list-item time__list__text" data-id="${data.result.seances[i].id}">${data.result.seances[i].seance_time}</li>
                    </ul>
                </div>
              </div> 
          </section>`);

          } else {
            for (let j = 0; j < arrMovie[indOfFilm].lastElementChild.children.length; j++) {        
              if(Number(arrMovie[indOfFilm].lastElementChild.children[j].dataset.id) !== data.result.seances[i].seance_hallid) {
                countHalls++;
                if(countHalls === Number(arrMovie[indOfFilm].lastElementChild.children.length)) {
                  arrMovie[indOfFilm].lastElementChild.insertAdjacentHTML("beforeend", ` <div class="movie-seances__hall" data-id=${data.result.seances[i].seance_hallid}>
                      <h6 class="number__hall">${nameOfHall}</h6>
                      <ul class="time__list">  
                          <li class="time__list-item time__list__text" data-id="${data.result.seances[i].id}">${data.result.seances[i].seance_time}</li>
                      </ul>
                  </div>`);
                  break;
                }
              } else {
                arrMovie[indOfFilm].lastElementChild.children[j].lastElementChild.insertAdjacentHTML("beforeend", `<li class="time__list-item time__list__text" data-id="${data.result.seances[i].id}">${data.result.seances[i].seance_time}</li>`);
              }
            }
          }
        }
      }
    }
    print();

    const timeListItem = document.querySelectorAll(".time__list-item");
    const arrTimeListItem = Array.from(timeListItem);
    
    if(Number(checkedDate) === Number(currentDate.getDate())) {
      for(let i = 0; i < arrTimeListItem.length; i++) {   
          if(Number(currentDate.getHours()) > Number(arrTimeListItem[i].textContent.slice(0,2))) {
            arrTimeListItem[i].classList.add("no_active");
          } else if(Number(currentDate.getHours()) === Number(arrTimeListItem[i].textContent.slice(0,2))) {
            if(Number(currentDate.getMinutes()) > Number(arrTimeListItem[i].textContent.slice(3)) ) {//мин
              arrTimeListItem[i].classList.add("no_active");
            } else {
              return;
            }
          } 
        }
      }

    for(let i = 0; i < arrTimeListItem.length; i++) {
      if(!arrTimeListItem[i].classList.contains("no_active")) {
       
        arrTimeListItem[i].addEventListener("click", (e) => {
          if(e.target.classList.contains("time__list-item") || e.target.classList.contains("time__list__text")) {
            let checkedSeans = Number(e.target.dataset.id);
            localStorage.setItem('checkedSeans', checkedSeans);
            document.location='./hall.html';
          }
        })
      }
      }
})