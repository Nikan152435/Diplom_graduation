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

    const formData = new FormData(form);

    try {
        const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
            method: 'POST',
            body: formData,
        });

        // Проверка статуса ответа
        if (!response.ok) {
            throw new Error('Сеть не ответила или произошла ошибка на сервере');
        }

        const data = await response.json();
        handleResponse(data);
    } catch (error) {
        // Обработка ошибок
        handleError(error);
    }
}

// Функция для проверки пустоты поля
function isFieldEmpty(field) {
    return !field.value.trim();
}

// Обработка ответа сервера
function handleResponse(data) {
    if (data.success) {
        // Успешная авторизация
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
