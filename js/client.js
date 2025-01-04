document.addEventListener("DOMContentLoaded", () => {
  //////////////////////////////////////////
  // 1. Ищем элементы (кнопки, меню, т.д.)
  //////////////////////////////////////////

  const menuList = document.querySelector(".menu-list");
  const arrowItem = document.querySelector(".right");
  const btnIndex = document.querySelector(".btn__index");
  const menuListItem = document.querySelectorAll(".menu-list-item");
  const menuListItemArr = Array.from(menuListItem);
  const today = document.querySelector(".today");
  const revers = document.querySelector(".revers");
  const bigFeatureButton = document.querySelector(".big-feature");

  //////////////////////////////////////////
  // 2. Ленивая загрузка (bigFeatureButton)
  //////////////////////////////////////////
  // Если кнопка .big-feature есть в HTML, навешиваем обработчик
  if (bigFeatureButton) {
    bigFeatureButton.addEventListener("click", async () => {
      const module = await import("./data/largeScript.js");
      module.default();
    });
  }

  //////////////////////////////////////////
  // 3. Проверяем, есть ли глобальная data
  //////////////////////////////////////////
  if (!window.data) {
    console.warn("Глобальная переменная data не определена,пропускаем логику с данными.");
    return; // Остановимся, чтобы не ловить ошибок
  } else {
    console.log("Данные залов:", data.result.halls);
    // Пример: выводим названия залов в консоль
    data.result.halls.forEach((hall) => {
      console.log(`Название зала: ${hall.hall_name}, Ряды: ${hall.hall_rows}`);
    });

    // Обрабатываем фильмы (пример)
    data.result.films.forEach((film) => {
      if (!film.film_poster) {
        film.film_poster = "./images/posters/placeholder.png";
      }
    });
    console.log("Список фильмов:", data.result.films);
  }

  //////////////////////////////////////////
  // 4. Проверка наличия элемента .today
  //////////////////////////////////////////
  if (!today) {
    console.warn("Элемент с классом 'today' не найден");
    return; // Прекращаем выполнение, если элемент не найден
  } else {
    console.log("Элемент с классом 'today' найден.");
  }

  //////////////////////////////////////////
  // 5. Логика работы с датами и классами
  //////////////////////////////////////////

  let currentDate = new Date();
  const days = ["Пн,", "Вт,", "Ср,", "Чт,", "Пт,", "Сб,", "Вс,"];

  function updateTodayClass() {
    today.classList.add("menu-list-item__checked");
    today.firstElementChild.classList.add("text-menu__bold");
    today.lastElementChild.classList.add("text-menu__bold");
  }

  function setTodayText() {
    const currentDay = currentDate.getDay();
    today.lastElementChild.textContent =
      days[currentDay > 0 ? currentDay - 1 : 6] + currentDate.getDate();
  }

  function saveCheckedDate() {
    const checkedDate = String(currentDate.getDate()).padStart(2, "0");
    const checkedMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const checkedYear = currentDate.getFullYear();
    localStorage.setItem("checkedDate", checkedDate);
    localStorage.setItem("checkedYear", checkedYear);
    localStorage.setItem("searchMonth", checkedMonth);
  }

  // Инициализация
  updateTodayClass();
  setTodayText();
  saveCheckedDate();

  //////////////////////////////////////////
  // 6. Обработчики событий на today и других элементах
  //////////////////////////////////////////

  // Клик по .today
  today.addEventListener("click", () => {
    menuListItemArr.forEach((item) => {
      item.classList.remove("menu-list-item__checked");
      item.classList.add("menu-list-item");
      item.firstElementChild.classList.remove("text-menu__bold");
      item.lastElementChild.classList.remove("text-menu__bold");
    });
    updateTodayClass();
  });

  // Клик на кнопку перехода
  if (btnIndex) {
    btnIndex.addEventListener("click", () => {
      window.location.href = "./login.html";
    });
  }

  // Клики на элементы меню
  menuListItemArr.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.add("menu-list-item__checked");
      item.classList.remove("menu-list-item");
      item.firstElementChild.classList.add("text-menu__bold");
      item.lastElementChild.classList.add("text-menu__bold");

      // Сброс класса у today
      today.classList.remove("menu-list-item__checked");
      today.firstElementChild.classList.remove("text-menu__bold");
      today.lastElementChild.classList.remove("text-menu__bold");

      // Сохранение информации о выбранном дне
      const checkedDate = item.lastElementChild.textContent;
      const checkedYear = item.dataset.year;
      localStorage.setItem("checkedDate", checkedDate);
      localStorage.setItem("checkedYear", checkedYear);
    });
  });
  if (!window.data) {
    console.error("Глобальная переменная data не определена!");
    return;
  }
  //////////////////////////////////////////
  // Дополнительная логика (arrowItem, revers) здесь...
  //////////////////////////////////////////
});