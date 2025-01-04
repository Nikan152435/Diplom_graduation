// 1. Предотвращаем повторный вход, если токен уже есть
if (window.location.pathname === '/login.html') {
    const token = localStorage.getItem('token');
    if (token) {
      // Пользователь уже авторизован, идём на главную/админку
      window.location.href = './admin.html'; 
    }
  }
  
  // 2. Если мы не на login.html и нет токена, переходим на login.html
  if (window.location.pathname !== '/login.html') {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Токен не найден, перенаправляем на логин');
      window.location.href = './login.html';
    }
  }
  
  // 3. Ищем элементы формы только на login.html
  const form = document.querySelector(".form__login");
  const loginField = document.querySelector(".log");
  const passField = document.querySelector(".pass");
  
  if (form && loginField && passField) {
    // Если форма есть, слушаем событие 'submit'
    form.addEventListener('submit', handleFormSubmit);
  }
  
  function isFieldEmpty(field) {
    return !field.value.trim();
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isFieldEmpty(loginField) || isFieldEmpty(passField)) {
      alert("Заполните все поля");
      return;
    }
  
    const loginData = {
      Login: loginField.value,
      password: passField.value
    };
  
    try {
      const response = await fetch('https://shfe-diplom.neto-server.ru/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Данные авторизации:', data);
  
      // handleResponse
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Токен сохранен:', data.token);
        window.location.href = './admin.html';
      } else {
        alert('Неверный логин/пароль');
      }
  
    } catch (error) {
      console.error('Ошибка запроса:', error);
      alert('Произошла ошибка при авторизации. Попробуйте позже.');
    }
  }
  
  // Если нужно защищённое API:
  async function getProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Нет токена, уходим на логин');
      window.location.href = './login.html';
      return;
    }
  
    try {
      const response = await fetch('https://shfe-diplom.neto-server.ru/api/movies', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
  
      const data = await response.json();
      console.log('Защищённые данные:', data);
  
    } catch (err) {
      console.error('Ошибка при получении защищенных данных:', err);
    }
  }