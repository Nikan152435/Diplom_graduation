const filmList = document.querySelector(".film__list");
const btnClose = document.querySelector(".close_popup");
const btnAddsFilm = document.querySelector(".save__film");
const btnCancel = document.querySelector(".cancel");
const filmContainer = document.querySelector(".film");
const formAddFilm = document.querySelector(".form_popup");
let file;
const btnAddsFilms = document.querySelector(".adds__films");
const body = document.querySelector(".body");

function allForFilms(data) {
  filmList.innerHTML = ''; // Очистка списка перед добавлением новых фильмов
  let countOfFilms = 0;

  data.result.films.forEach((film, index) => {
    countOfFilms = (countOfFilms % 5) + 1; // Обновляем countOfFilms от 1 до 5
    filmList.insertAdjacentHTML('beforeend', `
      <div draggable="true" class="adm_film bg_${countOfFilms}" data-id=${film.id}>
        <img src="${film.film_poster}" alt="постер" class="adm_film-img">
        <div class="adm_film-info">
          <p class="adm_film-name">${film.film_name}</p>
          <p class="adm_film-timer">${film.film_duration}</p>
        </div>
        <button class="delete_film"></button>
      </div>
    `);
  });

  // Открытие попапа добавления фильма
  btnAddsFilms.addEventListener('click', () => {
    filmContainer.classList.add('container__popup_active');
    body.classList.add('hidden');
  });

  // Закрытие попапа
  btnClose.addEventListener('click', () => {
    filmContainer.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  });

  // Валидация выбранного постера
  document.querySelector(".poster_add").onchange = function() {
    const allowedExtensions = ['png', 'jpg', 'jpeg']; // Допустимые форматы
    const selectedFile = this.files[0];

    if (selectedFile) {
      const size = selectedFile.size;
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert("Не верный формат!");
        this.value = ''; // Очистить ввод
      } else if (size > 3000000) {
        alert("Превышение размера");
        this.value = ''; // Очистить ввод
      } else {
        file = selectedFile;
      }
    }
  };

  // Добавление фильма
  btnAddsFilm.addEventListener('click', () => {
    addFilms(file); 
  });

  // Удаление фильма
  filmList.addEventListener('click', (e) => {  
    if (e.target.classList.contains("delete_film")) {
      const filmId = e.target.closest(".adm_film").dataset.id;
      delFilms(filmId);
    }
  }); 

  // Сброс формы и закрытие попапа
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    formAddFilm.reset();
    controller.abort();
    filmContainer.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  });
}
