const timeLineList = document.querySelector(".time-line__list");
const containerSeans = document.querySelector(".seans");
const btnFilmSeanseSave = document.querySelector(".save_seanse_film");
const deleteFilmSeanse = document.querySelector(".delete_film_seanse");
const deleteSeances = document.querySelector(".delete__seances");
const closeDelSeans = document.querySelector(".close_del_seans");
const containerDelSeans = document.querySelector(".delete__seances");
const labelFilm = document.querySelector(".label_delete__seanse");
const delSeans = document.querySelector(".del_seans");
const delSeansCancel = document.querySelector(".del_seans_cancel");
const hiddenDelete = document.querySelector(".hidden_delete");
const filmList = document.querySelector('.film__list');
const btnCloseSeanse = document.querySelector(".close__seanse");
const contSeans = document.querySelector(".seans");
const formSeans = document.querySelector(".form_popup_seans");
const cancelSeanse = document.querySelector(".btn__popup_cancel");
const filmNameSeanse = document.querySelector(".select__addseans_film");
const hallNameSeanse = document.querySelector(".select__addseans_hall");
const timeNameSeanse = document.querySelector('.select_time');
const btnAdds = document.querySelector(".btn__popup_adds");
const body = document.body;

let arrr = [];
let arrForTime = [];
let checkFilmDuration;
let checkedIdfilmName;
let targetHall;
let targetFilm;
let checkedTime = '';
let position;

function initializeSeances(data) {
  populateHalls(data);
  populateSeances(data);
  setUpEventListeners(data);
  setUpWindowResizeHandler();
}

function populateHalls(data) {
  data.result.halls.forEach(hall => {
    timeLineList.insertAdjacentHTML('beforeend', `
      <div class="conf-step__seances-hall" data-id="${hall.id}">
        <p class="time-line_hall">${hall.hall_name}</p>
        <div class="conf-step__seances-timeline"></div>
      </div>`);
  });
}

function populateSeances(data) {
  arrr = [...data.result.seances].sort((a, b) => a.seance_time.replace(':', '') - b.seance_time);
  const confStepSeancesHall = Array.from(document.querySelectorAll(".conf-step__seances-hall"));

  arrr.forEach(seance => {
    const film = data.result.films.find(f => f.id === Number(seance.seance_filmid));
    const hall = confStepSeancesHall.find(h => Number(seance.seance_hallid) === Number(h.dataset.id));

    if (film && hall) {
      hall.lastElementChild.insertAdjacentHTML('beforeend', `
        <div draggable="true" class="conf-step__seances-movie" data-id="${film.id}">
          <p class="seances-movie-tittle">${film.film_name}</p>
          <div class="movie-start" data-id="${seance.id}">${seance.seance_time}</div>
        </div>`);
    }
  });

  adjustMoviePositions();
}

function adjustMoviePositions() {
  const confStepSeancesHall = Array.from(document.querySelectorAll(".conf-step__seances-hall"));
  const movieArr = Array.from(document.querySelectorAll(".conf-step__seances-movie"));

  const hourWidth = confStepSeancesHall[0].getBoundingClientRect().width / 24;
  const minutWidth = hourWidth / 60;

  movieArr.forEach(movie => {
    const [hour, minutes] = movie.lastElementChild.textContent.split(':').map(Number);
    const posX = hour * hourWidth + minutes * minutWidth;

    movie.style.left = `${posX}px`;

    if (movie.dataset.width === "change") {
      movie.style.width = '80px';
    }

    if ((posX + movie.getBoundingClientRect().width) > confStepSeancesHall[0].getBoundingClientRect().width) {
      movie.style.width = `${confStepSeancesHall[0].getBoundingClientRect().width - posX}px`;
      movie.dataset.width = "change";
    }
  });
}

function setUpEventListeners(data) {
  hallNameSeanse.addEventListener('change', handleHallChange);
  filmNameSeanse.addEventListener('change', handleFilmChange);
  timeNameSeanse.addEventListener('change', handleTimeChange);
  btnAdds.addEventListener('click', handleAddSeans);
  btnCloseSeanse.addEventListener('click', closePopup);
  cancelSeanse.addEventListener('click', closePopup);
  filmList.addEventListener('dragstart', handleFilmDragStart);
  deleteFilmSeanse.addEventListener('click', cancelController);

  const line = Array.from(document.querySelectorAll(".conf-step__seances-timeline"));
  line.forEach(lineElement => {
    lineElement.addEventListener('dragover', handleDragOver);
    lineElement.addEventListener('drop', handleLineDrop);
  });

  // Установка слушателей для удаления сеансов
  setUpDeleteEventListeners();
}

function handleHallChange(e) {
  timeNameSeanse.value = "";
  arrForTime.length = 0;
  targetHall = Number(e.target.options[e.target.selectedIndex].dataset.id);
}

function handleFilmChange(e) {
  timeNameSeanse.value = "";
  arrForTime.length = 0;
  targetFilm = Number(e.target.options[e.target.selectedIndex].dataset.id);
  checkedIdfilmName = e.target.options[e.target.selectedIndex].text;

  checkFilmDuration = getFilmDuration(targetFilm);
}

function handleTimeChange() {
  if (isValidTimeFormat(timeNameSeanse.value)) {
    arrForTime.length = 0;
    checkedTime = checkAvailableTime();
  } else {
    alert('Некорректное значение времени!');
  }
}

function isValidTimeFormat(time) {
  return time.length === 5 && time.includes(':');
}

function getFilmDuration(targetFilm) {
  return data.result.films.find(film => film.id === targetFilm).film_duration;
}

function checkAvailableTime() {
  const arrSort = [...arrr].sort((a, b) => a.seance_time.replace(':', '') - b.seance_time);
  const inpTime = timeNameSeanse.value.split(':').map(Number);
  const inpInMin = inpTime[0] * 60 + inpTime[1];

  for (const seance of arrSort) {
    if (isTimeConflict(seance, inpInMin)) {
      alert('Значение времени недоступно!');
      return '';
    }
  }
  return timeNameSeanse.value;
}

function isTimeConflict(seance, inpInMin) {
  const filmDuration = getFilmDuration(seance.seance_filmid);
  const inMinutes = convertToMinutes(seance.seance_time);
  const searchTime = inMinutes + filmDuration;

  return (inMinutes <= inpInMin && inpInMin <= searchTime) ||
         (inpInMin <= inMinutes && inMinutes <= (filmDuration + inpInMin));
}

function convertToMinutes(time) {
  const [hour, minutes] = time.split(':').map(Number);
  return hour * 60 + minutes;
}

function handleAddSeans(e) {
  e.preventDefault();
  if (checkedTime.length === 5) {
    saveSeanceToLocalStorage();
    addSeans();
    resetForm();
  }
}

function saveSeanceToLocalStorage() {
  localStorage.setItem('countAdd', 'add');
  localStorage.setItem('targetHall', targetHall);
  localStorage.setItem('targetFilm', targetFilm);
  localStorage.setItem('checkedTime', checkedTime);
  localStorage.setItem('checkedIdfilmName', checkedIdfilmName);
}

function resetForm() {
  contSeans.classList.remove("container__popup_active");
  body.classList.remove('hidden');
  formSeans.reset();
}

function closePopup() {
  hallNameSeanse.length = 0;
  filmNameSeanse.length = 0;
  timeNameSeanse.value = "";  
  arrForTime.length = 0;
  contSeans.classList.remove("container__popup_active");
  body.classList.remove('hidden');
}

function handleFilmDragStart(evt) {
  targetFilm = evt.target.dataset.id;
}

function handleDragOver(evt) {
  evt.preventDefault();
}

function handleLineDrop(evt) {
  evt.preventDefault();
  targetHall = evt.target.closest('.conf-step__seances-hall').dataset.id;
  openAddSeansPopup();
}

function openAddSeansPopup() {
  containerSeans.classList.add("container__popup_active");
  body.classList.add('hidden');

  populateFilmOptions();
  populateHallOptions();
}

function populateFilmOptions() {
  data.result.films.forEach(film => {
    filmNameSeanse.insertAdjacentHTML('beforeend', `<option class="option_addseans name_of_film" data-id="${film.id}">${film.film_name}</option>`);

    if (Number(film.id) === Number(targetFilm)) {
      filmNameSeanse.value = film.film_name;
      checkedIdfilmName = filmNameSeanse.value;
      checkFilmDuration = Number(film.film_duration);
    }
  });
}

function populateHallOptions() {
  data.result.halls.forEach(hall => {
    hallNameSeanse.insertAdjacentHTML('beforeend', `<option class="option_addseans hall" data-id="${hall.id}">${hall.hall_name}</option>`);

    if (Number(hall.id) === Number(targetHall)) {
      hallNameSeanse.value = hall.hall_name;
    }
  });
}

function addSeans() {
  const newSeans = {
    id: Date.now(),
    seance_time: checkedTime,
    seance_filmid: targetFilm,
    seance_hallid: targetHall,
  };

  arrr.push(newSeans);
  populateSeances({ result: { seances: arrr, films: data.result.films, halls: data.result.halls } });
  adjustMoviePositions();
}

function cancelController() {
  containerDelSeans.classList.add('container__popup_active');
  body.classList.add('hidden');
  labelFilm.textContent = `Удаление времени для фильма ${checkedIdfilmName}`;
}

function setUpDeleteEventListeners() {
  deleteSeances.addEventListener('click', openDeleteSeansPopup);
  delSeansCancel.addEventListener('click', closeDeletePopup);
  closeDelSeans.addEventListener('click', closeDeletePopup);
  delSeans.addEventListener('click', deleteSeans);
}

function openDeleteSeansPopup() {
  containerDelSeans.classList.add('container__popup_active');
  body.classList.add('hidden');
  labelFilm.textContent = `Удаление времени для фильма ${checkedIdfilmName}`;
}

function closeDeletePopup() {
  containerDelSeans.classList.remove('container__popup_active');
  body.classList.remove('hidden');
}

function deleteSeans() {
  const selectedSeanceId = getSelectedSeanceId(); // Реализуйте эту функцию для получения id выбранного сеанса

  if (selectedSeanceId) {
    arrr = arrr.filter(seance => seance.id !== selectedSeanceId);
    closeDeletePopup();
    populateSeances({ result: { seances: arrr, films: data.result.films, halls: data.result.halls } }); // Обновите UI
  } else {
    alert('Выберите сеанс для удаления.'); // Сообщение об ошибке
  }
}

function getSelectedSeanceId() {
  const selectedMovie = document.querySelector('.conf-step__seances-movie.selected'); // Измените селектор, если требуется
  return selectedMovie ? Number(selectedMovie.dataset.id) : null; // Возвращаем id выбранного сеанса
}

function setUpWindowResizeHandler() {
  window.addEventListener('resize', adjustMoviePositions); // Настройка позиции фильмов при изменении размера окна
}

// Вызов функции инициализации с вашими данными
initializeSeances(data);
