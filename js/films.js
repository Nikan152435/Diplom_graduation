const filmList = document.querySelector(".film__list");
const admFilm = document.querySelectorAll(".adm_film");
signal.addEventListener('abort', () => console.log("отмена!"));
const btnClose = document.querySelector(".close_popup");
const btnAddsFilm = document.querySelector(".save__film");
const btnCancel = document.querySelector(".cancel");
const filmContainer = document.querySelector(".film");
const formAddfilm = document.querySelector(".form_popup");
let file;
const filmName = document.querySelector(".filmname");
const filmDuration = document.querySelector(".filmtime");
const filmDescription = document.querySelector(".description");
const filmOrigin = document.querySelector(".origin");
const btnAddsFilms = document.querySelector(".adds__films");
const body = document.querySelector(".body");

function allForFilms(data) {
  let countOfFilms = 0;
  for(let i = 0; i < data.result.films.length; i++) {
    countOfFilms++;
    if(countOfFilms < 6){
      filmList.insertAdjacentHTML('beforeend', `<div draggable="true" class="adm_film bg_${countOfFilms}" data-id=${data.result.films[i].id}>
        <img src="${data.result.films[i].film_poster}" alt="постер" class="adm_film-img">
        <div class="adm_film-info">
        <p class="adm_film-name">${data.result.films[i].film_name}</p>
        <p class="adm_film-timer">${data.result.films[i].film_duration}</p>
        </div>
        <button class="delete_film"></button>
        </div>`);
    } else {
      countOfFilms = 1;
      filmList.insertAdjacentHTML('beforeend', `<div draggable="true" class="adm_film bg_${countOfFilms}" data-id=${data.result.films[i].id}>
        <img src="${data.result.films[i].film_poster}" alt="постер" class="adm_film-img">
        <div class="adm_film-info">
        <p class="adm_film-name">${data.result.films[i].film_name}</p>
        <p class="adm_film-timer">${data.result.films[i].film_duration}</p>
        </div>
        <button class="delete_film"></button>
        </div>`);
      countOfFilms++;
    }
  }

  btnAddsFilms.addEventListener('click', () => {
    addFilm.classList.add('container__popup_active');
    body.classList.add('hidden');
  })

  btnClose.addEventListener('click', () => {
    filmContainer.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  })

  document.querySelector(".poster_add").onchange = function() {
    let size = this.files[0].size;
    let fileExtension = ['png'];
    if(3000000 < size) {
      alert("не верный формат!");
    } else if (fileExtension == 1) {
      alert("превышение размера");
    } else {
      file = this.files[0];           
    }
  }

  btnAddsFilm.addEventListener('click', (e) => {
    addFilms(file); 
  })

  let filmId;
  filmList.addEventListener('click', (e) => {  
    if(e.target.classList.contains("delete_film")) {
      filmId = e.target.closest(".adm_film").dataset.id;
      delFilms(filmId);
    } else {
      return;
    }
  }) 
 
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    formAddfilm.reset();
    controller.abort();
    filmContainer.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  }) 
}
     