document.addEventListener("DOMContentLoaded", function() {
  const menuList = document.querySelector(".menu-list");
  const arrowItem = document.querySelector(".right");
  const btnIndex = document.querySelector(".btn__index");
  const menuListItem = document.querySelectorAll(".menu-list-item");
  const menuListItemArr = Array.from(menuListItem);
  const today = document.querySelector(".today");
  const revers = document.querySelector(".revers");
  
  // Проверка на наличие элемента с классом today
  if (!today) {
      console.warn("Элемент с классом 'today' не найден");
      return; // Прекращаем выполнение, если элемент не найден
  }

  let currentDate = new Date();
  const days = ['Пн,', 'Вт,', 'Ср,', 'Чт,', 'Пт,', 'Сб,', 'Вс,'];

  // Функция обновления классов для today
  function updateTodayClass() {
      today.classList.add("menu-list-item__checked");
      today.firstElementChild.classList.add("text-menu__bold");
      today.lastElementChild.classList.add("text-menu__bold");
  }

  // Установка текста для today
  function setTodayText() {
      const currentDay = currentDate.getDay();
      today.lastElementChild.textContent = days[currentDay > 0 ? currentDay - 1 : 6] + currentDate.getDate();
  }

  // Сохранение даты в localStorage
  function saveCheckedDate() {
      const checkedDate = String(currentDate.getDate()).padStart(2, '0');
      const checkedMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
      const checkedYear = currentDate.getFullYear();
      localStorage.setItem('checkedDate', checkedDate);
      localStorage.setItem('checkedYear', checkedYear);
      localStorage.setItem('searchMonth', checkedMonth);
  }

  // Инициализация
  updateTodayClass();
  setTodayText();
  saveCheckedDate();

  // Обработка события клика на today
  today.addEventListener('click', () => {
      // Сброс классов на остальных элементах
      menuListItemArr.forEach(item => {
          item.classList.remove("menu-list-item__checked");
          item.classList.add("menu-list-item");
          item.firstElementChild.classList.remove("text-menu__bold");
          item.lastElementChild.classList.remove("text-menu__bold");
      });
      updateTodayClass(); // Установка классов для today
  });

  // Обработка клика по кнопке перехода
  btnIndex.addEventListener('click', () => {
      window.location.href = './login.html';
  });

  // Обработка кликов на элементы меню
  menuListItemArr.forEach(item => {
      item.addEventListener('click', () => {
          // Устанавливаем класс для выбранного элемента
          item.classList.add("menu-list-item__checked");
          item.classList.remove("menu-list-item");
          item.firstElementChild.classList.add("text-menu__bold");
          item.lastElementChild.classList.add("text-menu__bold");

          // Обновление класса today
          today.classList.remove('menu-list-item__checked');
          today.firstElementChild.classList.remove('text-menu__bold');
          today.lastElementChild.classList.remove('text-menu__bold');

          // Сохранение информации о выбранном дне
          const checkedDate = item.lastElementChild.textContent;
          const checkedYear = item.dataset.year;
          localStorage.setItem('checkedDate', checkedDate);
          localStorage.setItem('checkedYear', checkedYear);
      });
  });

  // Добавьте дополнительную логику для обработки arrowItem и revers здесь...
});
