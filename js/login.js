const form = document.querySelector(".form__login");
const login = document.querySelector(".log");
const password = document.querySelector(".pass");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(login.value.trim() && password.value.trim()) {
        const formData = new FormData(form);
        fetch( 'https://shfe-diplom.neto-server.ru/login',{
            method: 'POST',
            body: formData
        })
            .then( response => response.json())
            .then( function(data) {
                console.log(data);
                if(data.success === true) {
                    document.location='./admin.html';
                }
                if(data.success === false){
                    alert("Неверный логин/пароль");
                }   
        })
    }
})