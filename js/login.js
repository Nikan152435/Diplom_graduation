// Защита от циклических перенаправлений
if (window.location.pathname === '/login.html' && localStorage.getItem('token')) {
    window.location.href = './index.html';
}

// Получение элементов формы
const form = document.querySelector(".form__login");
const login = document.querySelector(".log");
const password = document.querySelector(".pass");

// Функция для проверки токена
function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('Токен не найден. Необходимо авторизоваться.');
        // Перенаправляем только один раз
        if (window.location.pathname !== '/login.html') {
            window.location.href = './login.html';
        }
        return false;
    }
    return true;
}

// Вызов функции проверки токена
if (!checkToken()) {
    console.log('Пользователь не авторизован. Перенаправление на страницу входа.');


}



// Проверка наличия элементов формы
if (!form || !login || !password) {
    console.error("Не удалось найти один из элементов формы.");
} else {
    form.addEventListener('submit', handleFormSubmit);
}

// Обработка события отправки формы
async function handleFormSubmit(e) {
    e.preventDefault();

    // Проверка, что поля заполнены
    if (isFieldEmpty(login) || isFieldEmpty(password)) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    // Проверка токена и перенаправление на страницу авторизации
const token = localStorage.getItem('token');
if (!token) {
    console.warn('Токен не найден. Необходимо авторизоваться.');
    document.location = './login.html'; // Перенаправляем на страницу авторизации
    return; // Остановим выполнение дальнейшего кода
}
    // Данные для авторизации
    const loginData = {
        Login: login.value,
        password: password.value
    };
    if (window.location.pathname !== '/login.html') {
        // redirect на login.html
    }
// Проверка: если нет токена, а мы не на login.html, то перенаправляемся на login.html.
function checkToken() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login.html') {
      console.warn('Токен не найден. Перенаправляем на страницу входа.');
      document.location = './login.html';
    }
  }
  
  // Вызовем эту функцию сразу:
  checkToken();

    try {
        const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Отправляем данные как JSON
            },
            body: JSON.stringify(loginData) // Преобразуем данные в JSON-строку
        });

        // Проверяем успешность ответа
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        // Читаем данные один раз
        const data = await response.json();

        // Логируем данные для отладки
        console.log('Данные POST запроса:', data);

        // Обработка ответа
        handleResponse(data);

    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка запроса:', error);
        handleError(error);
    }
    // Функция для проверки пустоты поля
function isFieldEmpty(field) {
    return !field.value.trim();
}

// Обработка ответа сервера
function handleResponse(data) {
  if (data.token) {
    localStorage.setItem('token', data.token);
    document.location = './admin.html'; // Перенаправление при успешном входе
  } else {
    alert('Неверный логин/пароль');
  }
}
}

// Обработка ответа сервера
function handleResponse(data) {
    if (data.token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);// Сохраняем токен
        console.log('Токен сохранен:', data.token);
        // Перенаправление после успешной авторизации
        document.location = './admin.html';// Перенаправляем на страницу администратора
    } else {
        // Ошибка авторизации
        alert("Неверный логин/пароль");
    }
}

// Обработка ошибок
function handleError(error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при авторизации. Пожалуйста, попробуйте еще раз.');
}

// Функция для проверки пустоты поля
function isFieldEmpty(field) {
    return !field.value.trim();
}

// Функция для получения данных с защищенного ресурса
async function getProtectedData() {
    const token = localStorage.getItem('token'); // Получаем токен
    if (!token) {
        console.error('Токен не найден. Необходимо авторизоваться.');
        document.location = './login.html'; // Перенаправляем пользователя на страницу авторизации
        return;
    }
    // Получение элементов формы
    const form = document.querySelector(".form__login");
    const login = document.querySelector(".log");
    const password = document.querySelector(".pass");
    
    // Проверка наличия элементов
    if (!form || !login || !password) {
        console.error("Не удалось найти один из элементов формы.");
    } else {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Обработка события отправки формы
    async function handleFormSubmit(e) {
        e.preventDefault();
    
        if (isFieldEmpty(login) || isFieldEmpty(password)) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }
    
        const loginData = {
            Login: login.value,
            password: password.value
        };

    try {
        const response = await fetch('https://shfe-diplom.neto-server.ru/api/movies', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Отправляем токен в заголовке
            }
        });

        // Проверка успешности ответа
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        // Проверяем, является ли ответ JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Ответ не является JSON.");
        }

        // Получаем данные из ответа
        const data = await response.json();
        console.log('Данные с защищенного ресурса:', data);

    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при получении данных:', error);
    }
}
}
// Вызываем асинхронную функцию для получения защищенных данных
getProtectedData();