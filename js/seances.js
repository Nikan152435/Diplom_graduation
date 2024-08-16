const timeLineList = document.querySelector(".time-line__list");
const containerSeans = document.querySelector(".seans");
const btnFilmSeanseSave = document.querySelector(".save_seanse_film");
const deleteFilmSeanse = document.querySelector(".delete_film_seanse");
const deleteSeances = document.querySelector(".delete__seances");
let hourWidth;
let position;
let minutWidth;
let movieWidth;
let inpTime;
let inpInMin;
const btnCloseSeanse = document.querySelector(".close__seanse");
const contSeans = document.querySelector(".seans");
const formSeans = document.querySelector(".form_popup_seans");
const cancelSeanse = document.querySelector(".btn__popup_cancel");
const filmNameSeanse = document.querySelector(".select__addseans_film");
const hallNameSeanse = document.querySelector(".select__addseans_hall");
const timeNameSeanse = document.querySelector('.select_time');
const btnAdds = document.querySelector(".btn__popup_adds");
let arrr = [];
let arrForTime = [];
let checkFilmDuration;
let resultForTime = [];
let diffrens;
let result;
let checkedIdHall;
let checkedIdfilm;
let checkedTime;
let countOfTime = 0;
let timeCount = 1;
let resultHour;
let resultMin;
let checkedIdfilmName;
let searchDuration;
let firstSeans;
let firstSeansInMin;
let counOfHalls;
const closeDelSeans = document.querySelector(".close_del_seans");
const containerDelSeans = document.querySelector(".delete__seances");
const labelFilm = document.querySelector(".label_delete__seanse");
let nameOfFilms = localStorage.getItem('name');
const delSeans = document.querySelector(".del_seans");
const delSeansCancel = document.querySelector(".del_seans_cancel");
let checkDel;

function allForSeances(data) {
  signal.addEventListener('abort', () => console.log("отмена!"));

  for(let i = 0; i < data.result.halls.length; i++) {
    timeLineList.insertAdjacentHTML('beforeend', `
      <div class="conf-step__seances-hall" data-id="${data.result.halls[i].id}">
      <p class="time-line_hall">${data.result.halls[i].hall_name}</p>
      <div class="conf-step__seances-timeline"></div>
      </div>`);
  }
  const confStepSeancesHall = Array.from(document.querySelectorAll(".conf-step__seances-hall"));
  const confStepSeancesTimeLine = Array.from(document.querySelectorAll(".conf-step__seances-timeline"));
      
  for(let i = 0; i < data.result.seances.length; i++) {
    arrr.push(data.result.seances[i]);
  }

  arrr.sort(function(a, b) {
    return a.seance_time.replace(':', '') - b.seance_time.replace(':', '');
  });

  window.addEventListener('resize', (e) => {
    timeWidth();

    for(let i = 0; i < confStepSeancesTimeLine.length; i++){
      for(let j = 0; j < confStepSeancesTimeLine[i].children.length; j++){
        if(confStepSeancesTimeLine[i].children[j].lastElementChild.dataset.id === "00") {
          hourWidth = confStepSeancesHall[0].getBoundingClientRect().width / 24;
          minutWidth = hourWidth / 60;
          for(let i = 0; i < movieArr.length; i++) {
            let timesForWidth = confStepSeancesTimeLine[i].children[j].lastElementChild.textContent.split(':', [2]);
            let hour = Number(timesForWidth[0]); 
            let minutes = Number(timesForWidth[1]);
            position = hour * hourWidth + minutes * minutWidth;
            confStepSeancesTimeLine[i].children[j].style.left = position + "px";
            if(confStepSeancesTimeLine[i].children[j].dataset.width === "change") {
              confStepSeancesTimeLine[i].children[j].style.width = 80 + 'px';
            }
            movieWidth = confStepSeancesTimeLine[i].children[j].getBoundingClientRect().width;
            if((position + movieWidth) > confStepSeancesHall[0].getBoundingClientRect().width) {
              confStepSeancesTimeLine[i].children[j].style.width = confStepSeancesHall[0].getBoundingClientRect().width - position + "px";
              confStepSeancesTimeLine[i].children[j].dataset.width = "change";
            } 
          }
        } else {
          return;
        }
      }
    }
  });

  for(let i = 0; i < arrr.length; i++) {
    let indFilm = data.result.films.findIndex(el => el.id === Number(arrr[i].seance_filmid));
    for(let j = 0; j < confStepSeancesHall.length; j++) {
      if(Number(arrr[i].seance_hallid) === Number(confStepSeancesHall[j].dataset.id)) {

        confStepSeancesHall[j].lastElementChild.insertAdjacentHTML('beforeend', `
          <div draggable="true" class="conf-step__seances-movie" data-id="${data.result.films[indFilm].id}">
          <p class="seances-movie-tittle">${data.result.films[indFilm].film_name}</p>
          <div class="movie-start" data-id="${arrr[i].id}">${arrr[i].seance_time}</div>
          </div>`);
      } 
    }
  }
  let searchClass;
  const arrAdmFilm = Array.from(document.querySelectorAll(".adm_film"));
  const movieArr = Array.from(document.querySelectorAll(".conf-step__seances-movie"));

  function timeWidth() {
    hourWidth = confStepSeancesHall[0].getBoundingClientRect().width / 24;
    minutWidth = hourWidth / 60;
    for(let i = 0; i < movieArr.length; i++) {
      let timesForWidth = movieArr[i].lastElementChild.textContent.split(':', [2]);
      let hour = Number(timesForWidth[0]); 
      let minutes = Number(timesForWidth[1]);
      position = hour * hourWidth + minutes * minutWidth;
      movieArr[i].style.left = position + "px";
      if(movieArr[i].dataset.width === "change") {
        movieArr[i].style.width = 80 + 'px';
      }
      movieWidth = movieArr[i].getBoundingClientRect().width;
      if((position + movieWidth) > confStepSeancesHall[0].getBoundingClientRect().width) {
        movieArr[i].style.width = confStepSeancesHall[0].getBoundingClientRect().width - position + "px";
        movieArr[i].dataset.width = "change";
      } 
    }
  }
  timeWidth();

  for(let i = 0; i < arrAdmFilm.length; i++) {
    for(let j = 0; j < movieArr.length; j++) {
      if(Number(arrAdmFilm[i].dataset.id) === Number(movieArr[j].dataset.id)) {
        searchClass = arrAdmFilm[i].className.slice(9);
        movieArr[j].classList.add(searchClass);
      }
    }
  }

  hallNameSeanse.addEventListener('change', (e) => {
    timeNameSeanse.value = "";
    resultForTime.length = 0; 
    arrForTime.length = 0;       
    targetHall = Number(e.target.options[e.target.selectedIndex].dataset.id);   
  })

  filmNameSeanse.addEventListener('change', (e) => { 
    timeNameSeanse.value = "";
    resultForTime.length = 0;
    arrForTime.length = 0;
    targetFilm = Number(e.target.options[e.target.selectedIndex].dataset.id);
    checkedIdfilmName = e.target.options[e.target.selectedIndex].text;
    for(let i = 0; i < data.result.films.length; i++) {
      if(data.result.films[i].id === Number(targetFilm)) {
        checkFilmDuration = Number(data.result.films[i].film_duration);
      }
    }
  })

  timeNameSeanse.addEventListener('change', (e) => { 
    resultForTime.length = 0; 
    arrForTime.length = 0;  

    if(timeNameSeanse.value.length === 5 && timeNameSeanse.value.includes(':')) {
      let arrSort = [];
      for(let i = 0; i < data.result.seances.length; i++) {
        arrSort.push(data.result.seances[i]);
      }
      arrSort.sort(function(a, b) {
        return a.seance_time.replace(':', '') - b.seance_time.replace(':', '');
      });
        
      if(filmNameSeanse.value.trim() && hallNameSeanse.value.trim()) {
        countOfTime = 0;
        counOfHalls = 0;
        inpTime = timeNameSeanse.value.split(':', [2]);
        inpInMin = Number(inpTime[0]) * 60 + Number(inpTime[1]);
        for(let i = 0; i < arrSort.length; i++) { 
          for(j = 0; j < data.result.films.length; j++) {

            if(Number(arrSort[i].seance_hallid) === Number(targetHall)) {
                             
              if(Number(arrSort[i].seance_filmid) === Number(data.result.films[j].id)) {
                searchDuration = Number(data.result.films[j].film_duration) - 1;
                let hourAndMinutes = arrSort[i].seance_time.split(':', [2]);
                let inMinutes = Number(hourAndMinutes[0]) * 60 + Number(hourAndMinutes[1]);                             
                let searchTime = inMinutes + Number(searchDuration);
                              
                if((inMinutes <= inpInMin) && (inpInMin <= searchTime)) {
                  alert('зачение времени не доступно!');
                  return;
                } else if((inMinutes <= (checkFilmDuration + inpInMin)) && ((checkFilmDuration + inpInMin) <= searchTime)) {
                  alert('зачение времени не доступно!');
                  return;
                } else if((inpInMin <= inMinutes) && (inMinutes <= (checkFilmDuration + inpInMin))) {
                  alert('зачение времени не доступно!');
                  return;
                } else if ((checkFilmDuration + inpInMin) < 1439){
                  checkedTime = timeNameSeanse.value;
                } else {
                  alert('зачение времени не доступно!');
                  return;
                }                          
              }
            } else {
              counOfHalls++;
              if(counOfHalls === arrSort.length) {
                checkedTime = timeNameSeanse.value;
              }
            } 
          }
        }
      }
    } else {
      alert('не корректное значение!');
      return;
    }
  })

  btnAdds.addEventListener('click', (e) => {
    e.preventDefault();
    if(checkedTime.length === 5) {   
      localStorage.setItem('countAdd', 'add');
      localStorage.setItem('targetHall', `${targetHall}`);
      localStorage.setItem('targetFilm', `${targetFilm}`);
      localStorage.setItem('checkedTime', `${checkedTime}`);
      localStorage.setItem('checkedIdfilmName', `${checkedIdfilmName}`);
      addSeans();
      contSeans.classList.remove("container__popup_active");
      body.classList.remove('hidden');
      formSeans.reset();
    } else {
      return;
    }
  })

  let idCheckedFilm;
  let targetTime;
  let checkHall;
        
  function addSeans() {
    let newEl;
    idCheckedFilm = localStorage.getItem('targetFilm');
    let checkedNameFilm = localStorage.getItem('checkedIdfilmName');
    targetTime = localStorage.getItem('checkedTime');
    localStorage.removeItem('checkedTime');
    checkHall = localStorage.getItem('targetHall');

    for(let i = 0; i < arrAdmFilm.length; i++) {
      if(Number(arrAdmFilm[i].dataset.id) === Number(idCheckedFilm)) {
        searchClass = arrAdmFilm[i].className.slice(9);
      }
    }
    let timesForWidth = targetTime.split(':', [2]);
    let hour = Number(timesForWidth[0]); 
    let minutes = Number(timesForWidth[1]);
    let position = hour * hourWidth + minutes * minutWidth;
    let nextElInd;
          
    for(let i = 0; i < confStepSeancesHall.length; i++) {
      if(Number(checkHall) === Number(confStepSeancesHall[i].dataset.id)) {
        if(confStepSeancesHall[i].lastElementChild.children.length > 0) {
          for(let j = 0; j < confStepSeancesHall[i].lastElementChild.children.length; j++) {
            if(confStepSeancesHall[i].lastElementChild.children[j].lastElementChild.textContent.split(':', [1]) > targetTime.split(':', [1])) {
              nextElInd = confStepSeancesHall[i].lastElementChild.children[j];
              nextElInd.insertAdjacentHTML('beforebegin', `
                <div draggable="true" class="conf-step__seances-movie ${searchClass}" data-id="${idCheckedFilm}" style='left: ${position}px'>
                  <p class="seances-movie-tittle">${checkedNameFilm}</p>
                  <div class="movie-start" data-id="00">${targetTime}</div>
                </div>`);
              newEl = nextElInd.previousElementSibling;
              break;   
            } else if(j === confStepSeancesHall[i].lastElementChild.children.length - 1) {
              confStepSeancesHall[i].lastElementChild.children[j].insertAdjacentHTML('afterend', `
                <div draggable="true" class="conf-step__seances-movie ${searchClass}" data-id="${idCheckedFilm}" style='left: ${position}px'>
                <p class="seances-movie-tittle">${checkedNameFilm}</p>
                <div class="movie-start" data-id="00">${targetTime}</div>
                </div>`);
              newEl = confStepSeancesHall[i].lastElementChild.children[j].nextElementSibling;
                break;
            }
          }
        } else {
          confStepSeancesHall[i].lastElementChild.insertAdjacentHTML('beforeend', `
            <div draggable="true" class="conf-step__seances-movie ${searchClass}" data-id="${idCheckedFilm}" style='left: ${position}px'>
            <p class="seances-movie-tittle">${checkedNameFilm}</p>
            <div class="movie-start" data-id="00">${targetTime}</div>
            </div>`);
          newEl = confStepSeancesHall[i].lastElementChild.firstElementChild;
        }

        if(newEl.dataset.width === "change") {
          newEl.style.width = 80 + 'px';
        }
        movieWidth = newEl.getBoundingClientRect().width;
        if((position + movieWidth) > confStepSeancesHall[0].getBoundingClientRect().width) {
          newEl.style.width = confStepSeancesHall[0].getBoundingClientRect().width - position + "px";
          newEl.dataset.width = "change";
        } 
        const movieArr = Array.from(document.querySelectorAll(".conf-step__seances-movie"));        
        newEl.addEventListener('dragstart', () => {          
          hiddenDelete.classList.add("show"); 
          activeEl = newEl;
          nameFilmLine = newEl.firstElementChild.textContent;
          seanceId = newEl.dataset.id;
          localStorage.setItem('name', nameFilmLine);
        })
        hiddenDelete.addEventListener('dragover', (evt) => {
          evt.preventDefault();         
        }) 
        
        hiddenDelete.addEventListener('drop', (evt) => {
          evt.preventDefault();
          hiddenDelete.classList.remove("show");
          deleteSeances.classList.add("container__popup_active");
          labelFilm.textContent = nameFilmLine;
        })
      }   
    } 
  }

  cancelSeanse.addEventListener('click', (e) => {
    e.preventDefault();
    inpChip.value = "";
    inpVip.value = "";
    controller.abort();
    hallNameSeanse.length = 0;
    filmNameSeanse.length = 0;
    timeNameSeanse.value = "";  
    resultForTime.length = 0;
    arrForTime.length = 0;
    countOfTime = 0;
    contSeans.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  })

  btnCloseSeanse.addEventListener('click', () => {
    hallNameSeanse.length = 0;
    filmNameSeanse.length = 0;
    timeNameSeanse.value = "";  
    resultForTime.length = 0;
    arrForTime.length = 0;
    countOfTime = 0;
    contSeans.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  })

  const line = Array.from(document.querySelectorAll(".conf-step__seances-timeline"));
  const hiddenDelete = document.querySelector(".hidden_delete");
  let targetFilm;
  let targetHall;
  const filmList = document.querySelector('.film__list');

  filmList.addEventListener('dragstart', (evt) => {
    targetFilm = evt.target.dataset.id;
  })

  for(let i = 0; i < line.length; i++) {
    line[i].addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });

    line[i].addEventListener('drop', (evt) => {
      evt.preventDefault();
      targetHall = evt.target.closest('.conf-step__seances-hall').dataset.id;         
      containerSeans.classList.add("container__popup_active");
      body.classList.add('hidden');
      for(let j = 0; j < data.result.films.length; j++) {
        filmNameSeanse.insertAdjacentHTML('beforeend', `<option class="option_addseans name_of_film" data-id="${data.result.films[j].id}">${data.result.films[j].film_name}</option>`);
        if(Number(data.result.films[j].id) === Number(targetFilm)) {
          filmNameSeanse.value = data.result.films[j].film_name;
          checkedIdfilmName = filmNameSeanse.value;
          checkFilmDuration = Number(data.result.films[j].film_duration);
        }
      } 

      for(let j = 0; j < data.result.halls.length; j++) {
        hallNameSeanse.insertAdjacentHTML('beforeend', `<option class="option_addseans name_of_hall" data-id="${data.result.halls[j].id}">${data.result.halls[j].hall_name}</option>`);
        if(Number(data.result.halls[j].id) === Number(targetHall)) {
          hallNameSeanse.value = data.result.halls[j].hall_name;
        }
      }
    })
  }

  let nameFilmLine;
  let activeEl;
  for(let i = 0; i < movieArr.length; i++){    
    movieArr[i].addEventListener('dragstart', () => {        
      hiddenDelete.classList.add("show"); 
      activeEl = movieArr[i];
      nameFilmLine = movieArr[i].firstElementChild.textContent;
      seanceId = movieArr[i].dataset.id;
      localStorage.setItem('name', nameFilmLine); 
    })     
  }
      
  hiddenDelete.addEventListener('dragover', (evt) => {
    evt.preventDefault();         
  }) 

  hiddenDelete.addEventListener('drop', (evt) => {
    evt.preventDefault();
    hiddenDelete.classList.remove("show");
    deleteSeances.classList.add("container__popup_active");
    body.classList.add('hidden');
    labelFilm.textContent = nameFilmLine;      
  })
  closeDelSeans.addEventListener("click", () => {
    containerDelSeans.classList.remove("container__popup_active");
    body.classList.remove('hidden');
    localStorage.removeItem('name'); 
  })

  delSeans.addEventListener('click', () => {       
    containerDelSeans.classList.remove("container__popup_active");
    body.classList.remove('hidden');
    activeEl.remove();
    localStorage.removeItem('name');   
  }) 
 
  delSeansCancel.addEventListener('click', () => {
    containerDelSeans.classList.remove("container__popup_active");
    body.classList.remove('hidden');
  })

  btnFilmSeanseSave.addEventListener('click', (e) => {
    e.preventDefault();
    const movieArr = Array.from(document.querySelectorAll(".conf-step__seances-movie"));
    for(let i = 0; i < movieArr.length; i++) {
      if(movieArr[i].lastElementChild.dataset.id === '00') {
        movieArr[i].lastElementChild.dataset.id = '';
        const params = new FormData();
        params.set('seanceHallid', `${movieArr[i].closest('.conf-step__seances-hall').dataset.id}`);
        params.set('seanceFilmid', `${movieArr[i].dataset.id}`);
        params.set('seanceTime', `${movieArr[i].lastElementChild.textContent}`);
        addSeances(params);
      }
    }
  
    for(let i = 0; i < arrr.length; i++) {
      for(let j = 0; j < movieArr.length; j++) {
        if(arrr[i].id === Number(movieArr[j].lastElementChild.dataset.id)) {
          j = 0;
          break;
        } else if(Number(j) === Number(movieArr.length - 1)) {
          let checkSeans = arrr[i].id;
          delSeances(checkSeans);
        }        
      }           
    }    
  })

  deleteFilmSeanse.addEventListener('click', () => {
    controller.abort();
  })
}