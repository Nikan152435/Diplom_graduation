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

    // Проверка, что поля заполнены
    if (isFieldEmpty(login) || isFieldEmpty(password)) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    // Данные для авторизации
    const loginData = {
        username: login.value,
        password: password.value
    };

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
}

// Обработка ответа сервера
function handleResponse(data) {
    if (data.token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        console.log('Токен сохранен:', data.token);
        // Перенаправление после успешной авторизации
        document.location = './admin.html';
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
        return;
    }

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

// Вызываем асинхронную функцию для получения защищенных данных
getProtectedData();