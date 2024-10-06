const menuList = document.querySelector(".menu-list");
const arrowItem = document.querySelector(".right");
const btnIndex = document.querySelector(".btn__index");
const menuListItem = document.querySelectorAll(".menu-list-item");
const menuListItemArr = Array.from(menuListItem);
const today = document.querySelector(".today");
let currentDate = new Date();
let count = 1;
const revers = document.querySelector(".revers");
let checkedDate;
let checkedmonth;
let searchMonth;
let checkedYear;

function updateTodayClass() {
  if (today) {
    today.classList.add("menu-list-item__checked");
    today.firstElementChild.classList.add("text-menu__bold");
    
    today.lastElementChild.classList.add("text-menu__bold");
  }
}
// today.classList.add("menu-list-item__checked");

// Загрузка DOM
document.addEventListener("DOMContentLoaded", function() {
  const today = document.querySelector(".today");
  updateTodayClass();
// Проверяем, существует ли элемент с классом .today
if (!today) {
  console.error("Элемент с классом 'today' не найден");
  return; // Прекращаем выполнение, если элемент не найден
}
if (today) {
  // Если элемент найден, выполняем следующие действия


  if (today.classList.contains("menu-list-item__checked")) {
      let checkedDate = currentDate.getDate();
      if (checkedDate < 10) {
          checkedDate = "0" + checkedDate;
      }
      let checkedmonth = currentDate.getMonth();
      let searchMonth;
      if (checkedmonth < 9) {
          searchMonth = "0" + (checkedmonth + 1);
      } else {
          searchMonth = checkedmonth + 1;
      }
      let checkedYear = currentDate.getFullYear();
      localStorage.setItem('checkedDate', checkedDate);
      localStorage.setItem('checkedYear', checkedYear);
  }
} else {
  // Если элемента нет, выводим ошибку в консоль
  console.error("Элемент с классом 'today' не найден");
  const todayElement = document.querySelector('.today');
if (!todayElement) {
    console.error('Элемент с классом "today" не найден');
}
}
});







today.firstElementChild.classList.add("text-menu__bold");
let someElement = document.querySelector('.someClass');
if (someElement && someElement.firstElementChild) {
    // работа с someElement.firstElementChild
}
today.lastElementChild.classList.add("text-menu__bold");
if(today.classList.contains("menu-list-item__checked")) {
  checkedDate = currentDate.getDate();
  if(checkedDate < 10) {
    checkedDate = "0" + checkedDate;
  }
  checkedmonth = currentDate.getMonth();
  if(checkedmonth < 9) {
    searchMonth = "0" + (checkedmonth + 1);
  } else {
    searchMonth = checkedmonth + 1;
  }
  checkedYear = currentDate.getFullYear();
  localStorage.setItem('checkedDate', checkedDate);
  localStorage.setItem('checkedYear', checkedYear);
}

let days = [
    'Пн,',
    'Вт,',
    'Ср,',
    'Чт,',
    'Пт,',
    'Сб,',
    'Вс,'
  ];

let currentDay = currentDate.getDay();
let counter = 0;

let dayOFMonth;
function dayOFMonths(){ 
  let month = currentDate.getMonth();
  let fullYear = currentDate.getFullYear();
  let date1 = new Date(fullYear, month, 1);
  let date2;

  if(month === 11) {
    date2 = new Date(fullYear + 1, 0, 1);
  } else {
    date2 = new Date(fullYear, month + 1, 1);
  }
  dayOFMonth = Math.round((date2 - date1) / 1000 / 3600 / 24);
  console.log(dayOFMonth);
  return dayOFMonth;
}
dayOFMonths();

if(currentDay > 0) {
  today.lastElementChild.textContent = days[`${currentDay - 1}`] + currentDate.getDate();
} else  {
  today.lastElementChild.textContent = days[6] + currentDate.getDate();
}

btnIndex.addEventListener('click', () => {
  document.location='./login.html';
})

function dayOfMenu() {
  for(let i = 0; i < menuListItemArr.length; i++) {
    for(let j = `${currentDay}`; j < days.length; j++) {
      if(counter < 5) {
        menuListItemArr[`${i + counter}`].firstElementChild.textContent = `${days[j]}`;
        counter++;
          if(days[j] === 'Вс,') {
            j = -1;
          }
        } else {
          return;
          }
    }
  }
}
dayOfMenu();

for(let i = 0; i < menuListItemArr.length; i++) { 
  if((Number(currentDate.getDate()) + count) <= dayOFMonth) {
    menuListItemArr[i].lastElementChild.textContent = Number(currentDate.getDate()) + count;
    count++; 
    menuListItemArr[i].dataset.id = currentDate.getMonth();
    menuListItemArr[i].dataset.year = currentDate.getFullYear();
  } else {
    break;
  }
}

let anotherCount = 1;
for(let i = count - 1; i < menuListItemArr.length; i++) {
  menuListItemArr[i].lastElementChild.textContent = anotherCount;
  anotherCount++;
  menuListItemArr[i].dataset.id = currentDate.getMonth() + 1;
  if(checkedmonth === 11) {
    menuListItemArr[i].dataset.year = currentDate.getFullYear() + 1;
  } else {
    menuListItemArr[i].dataset.year = currentDate.getFullYear();
  }
}

today.addEventListener('click', () => {
  checkedDate = currentDate.getDate();
  today.classList.add("menu-list-item__checked");
  today.firstElementChild.classList.add("text-menu__bold");
  today.lastElementChild.classList.add("text-menu__bold");
  for(let i = 0; i < menuListItemArr.length; i++) {
      menuListItemArr[i].classList.remove("menu-list-item__checked");
      menuListItemArr[i].classList.add("menu-list-item");
      menuListItemArr[i].firstElementChild.classList.remove("text-menu__bold");
      menuListItemArr[i].lastElementChild.classList.remove("text-menu__bold");
    }
})

for(let i = 0; i < menuListItemArr.length; i++) {
  menuListItemArr[i].addEventListener('click', () => {
    menuListItemArr[i].classList.add("menu-list-item__checked");
    menuListItemArr[i].classList.remove("menu-list-item");
    menuListItemArr[i].firstElementChild.classList.add("text-menu__bold");
    menuListItemArr[i].lastElementChild.classList.add("text-menu__bold");

    today.classList.remove('menu-list-item__checked');
    today.firstElementChild.classList.remove('text-menu__bold');
    today.lastElementChild.classList.remove('text-menu__bold');
    
    if(menuListItemArr[i].classList.contains("menu-list-item__checked")) {
      checkedDate = menuListItemArr[i].lastElementChild.textContent;
      checkedYear = menuListItemArr[i].dataset.year;
      if(Number(checkedDate) < 10) {
        checkedDate = "0" + checkedDate;
      }
      checkedmonth = menuListItemArr[i].dataset.id;
      if(checkedmonth < 9) {
        searchMonth = "0" + (Number(checkedmonth) + 1);
      } else {
        searchMonth = Number(checkedmonth) + 1;
      }
      localStorage.setItem('checkedDate', checkedDate);
    }

    for(let j = 0; j < menuListItemArr.length; j++) {
      if(j!== i){
        if(menuListItemArr[j].classList.contains("menu-list-item__checked")) {
          menuListItemArr[j].classList.remove("menu-list-item__checked");
          menuListItemArr[j].firstElementChild.classList.remove("text-menu__bold");
          menuListItemArr[j].lastElementChild.classList.remove("text-menu__bold");
          menuListItemArr[j].classList.add("menu-list-item");
          menuListItemArr[j].firstElementChild.classList.add("text-menu");
          menuListItemArr[j].lastElementChild.classList.add("text-menu");

        }
      }
    }
    const timeListItem = document.querySelectorAll(".time__list-item");
    const arrTimeListItem = Array.from(timeListItem);
    if(Number(checkedDate) !== Number(currentDate.getDate())) {
      for(let i = 0; i < arrTimeListItem.length; i++) {   
        if(arrTimeListItem[i].classList.contains("no_active")){
          arrTimeListItem[i].classList.remove("no_active");
          arrTimeListItem[i].addEventListener("click", (e) => {
            if(e.target.classList.contains("time__list-item") || e.target.classList.contains("time__list__text")) {
              let checkedSeans = Number(e.target.dataset.id);
              localStorage.setItem('checkedSeans', checkedSeans);
              document.location='./hall.html';
            }
          })
        }
        
      }
        }
  })
}

for(let i = 0; i < menuListItemArr.length; i++) {
  if((menuListItemArr[i].firstElementChild.textContent === "Сб,") || (menuListItemArr[i].firstElementChild.textContent === "Вс,")) {
    menuListItemArr[i].firstElementChild.classList.add("menu__weekend");
    menuListItemArr[i].lastElementChild.classList.add("menu__weekend");
    } 
}
if((today.lastElementChild.textContent.includes("Сб,")) || (today.lastElementChild.textContent.includes("Вс,"))) {
  today.lastElementChild.classList.add("menu__weekend");
}

let countOfClick = 0;
let countRevers = 0;

arrowItem.addEventListener('click', () => {
  countOfClick++;
  today.classList.remove('menu-list-item__checked');
  today.firstElementChild.classList.remove('text-menu__bold');
  today.lastElementChild.classList.remove('text-menu__bold');
  today.firstElementChild.textContent = '<';
  today.lastElementChild.textContent = '';
  today.firstElementChild.classList.add("arrow_text");
  today.classList.add("arrow_item");
  revers.classList.remove("today");
  for(let i = 0; i < menuListItemArr.length; i++) { 
    if(menuListItemArr[i].classList.contains('menu-list-item__checked')) {
      menuListItemArr[i].classList.remove('menu-list-item__checked');
      menuListItemArr[i].classList.add('menu-list-item');
      menuListItemArr[i].firstElementChild.classList.remove('text-menu__bold');
      menuListItemArr[i].lastElementChild.classList.remove('text-menu__bold');
    }
  }

  for(let i = 0; i < menuListItemArr.length; i++) { 
    if(Number(menuListItemArr[i].lastElementChild.textContent) !== dayOFMonth) {
      menuListItemArr[i].lastElementChild.textContent = Number(menuListItemArr[i].lastElementChild.textContent) + 1; 
    } else {
      menuListItemArr[i].lastElementChild.textContent = '1';
      if(menuListItemArr[i].dataset.id === '11') {
        menuListItemArr[i].dataset.year = currentDate.getFullYear() + 1;
        menuListItemArr[i].dataset.id = 0;
      }
      menuListItemArr[i].dataset.id = Number(menuListItemArr[i].dataset.id) + 1;
    }
  }

  let indOfEl = 0;
  function removeDay() {
      for(let i = 0; i < menuListItemArr.length; i++) {
        for( let j = 0; j < days.length; j++) {
          if(indOfEl < menuListItemArr.length) {
          if( menuListItemArr[i + indOfEl].firstElementChild.textContent === `${days[j]}`) {

            if(menuListItemArr[i + indOfEl].firstElementChild.textContent !== 'Вс,') {
              menuListItemArr[i + indOfEl].firstElementChild.textContent = days[j + 1]; 
              indOfEl++; 
            } else {
              menuListItemArr[i + indOfEl].firstElementChild.textContent = days[0];
              indOfEl++;
              j = -1;               
            }
          }
        } else {
          return;
        }
      }
    }
  }
  removeDay();

  for(let i = 0; i < menuListItemArr.length; i++) {
    if((menuListItemArr[i].firstElementChild.textContent === "Сб,") || (menuListItemArr[i].firstElementChild.textContent === "Вс,")) {
      menuListItemArr[i].firstElementChild.classList.add("menu__weekend");
      menuListItemArr[i].lastElementChild.classList.add("menu__weekend");
    } else {
      menuListItemArr[i].firstElementChild.classList.remove("menu__weekend");
      menuListItemArr[i].lastElementChild.classList.remove("menu__weekend");
    }
  }
})

revers.addEventListener('click', () => {
  countRevers++;
  for(let i = 0; i < menuListItemArr.length; i++) { 
    if(menuListItemArr[i].classList.contains('menu-list-item__checked')) {
      menuListItemArr[i].classList.remove('menu-list-item__checked');
      menuListItemArr[i].firstElementChild.classList.remove('text-menu__bold');
      menuListItemArr[i].lastElementChild.classList.remove('text-menu__bold');
    }
  }

  function a() {
    if(countRevers <= countOfClick) {
  
      for(let i = 0; i < menuListItemArr.length; i++) { 
        if(Number(menuListItemArr[i].lastElementChild.textContent) !== 1){
        menuListItemArr[i].lastElementChild.textContent = Number(menuListItemArr[i].lastElementChild.textContent) - 1; 
        } else {
          menuListItemArr[i].lastElementChild.textContent = dayOFMonth;
          if(menuListItemArr[i].dataset.id === '0') {
            menuListItemArr[i].dataset.year = currentDate.getFullYear() - 1;
            menuListItemArr[i].dataset.id = 11;
          }
          menuListItemArr[i].dataset.id = Number(menuListItemArr[i].dataset.id) - 1;
        }
      }
    }

    if(countRevers > countOfClick) {
      return;
    }

    if(countRevers === countOfClick) {
      revers.firstElementChild.textContent = 'Сегодня';
      if(currentDay > 0){
        revers.lastElementChild.textContent = days[`${currentDay - 1}`] + currentDate.getDate();
      } else {
        revers.lastElementChild.textContent = days[6] + currentDate.getDate();
      }
      revers.firstElementChild.classList.remove("arrow_text");
      revers.classList.remove("arrow_item");
      revers.classList.add("today");
      today.classList.remove("revers");
      checkedDate = currentDate.getDate();
    
      if(checkedDate < 10) {
        checkedDate = "0" + checkedDate;
      }
      checkedmonth = currentDate.getMonth();
      if(checkedmonth < 9) {
        searchMonth = "0" + (checkedmonth + 1);
      } else {
        searchMonth = checkedmonth + 1;
      }
      checkedYear = currentDate.getFullYear();
      localStorage.setItem('checkedDate', checkedDate);
      localStorage.setItem('checkedYear', checkedYear);
      
      for(let i = 0; i < menuListItemArr.length; i++) {
        if(menuListItemArr[i].classList.contains('menu-list-item__checked')) {
          menuListItemArr[i].classList.remove('menu-list-item__checked');
          menuListItemArr[i].firstElementChild.classList.remove('text-menu__bold');
          menuListItemArr[i].lastElementChild.classList.remove('text-menu__bold');
        }
      }
    }
  }
  a();

  function reversDay() {
    if(countRevers <= countOfClick) {
      for(let i = 0; i < menuListItemArr.length; i++) {
        for( let j = 0; j < days.length; j++) {
          if( menuListItemArr[i].firstElementChild.textContent === days[j]) {

            if(menuListItemArr[i].firstElementChild.textContent !== 'Пн,') {
            menuListItemArr[i].firstElementChild.textContent = days[j - 1];
            break;
              } else {
                menuListItemArr[i].firstElementChild.textContent = days[6];
                break;
              }
          }
        }
      }
    }
    if(countRevers > countOfClick) {
      return;
    }  
  }
  reversDay();

  for(let i = 0; i < menuListItemArr.length; i++) {
    if((menuListItemArr[i].firstElementChild.textContent === "Сб,") || (menuListItemArr[i].firstElementChild.textContent === "Вс,")) {
      menuListItemArr[i].firstElementChild.classList.add("menu__weekend");
      menuListItemArr[i].lastElementChild.classList.add("menu__weekend");
      } else {
        menuListItemArr[i].firstElementChild.classList.remove("menu__weekend");
       menuListItemArr[i].lastElementChild.classList.remove("menu__weekend");
      }
  }
})

localStorage.setItem('searchMonth', searchMonth);
localStorage.setItem('checkedYear', checkedYear);