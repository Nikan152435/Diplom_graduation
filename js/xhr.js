// Функция для получения данных о залах, фильмах и сеансах
fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        allForHalls(data);
        allForFilms(data);
        allForSeances(data);
    })
    .catch(error => console.error('Ошибка при получении данных:', error));

// Удаление зала по ID
function delHall(hallId) {
    fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch(error => console.error('Ошибка при удалении зала:', error));
}

// Добавление нового зала
function addHalls() {
    const formData = new FormData();
    formData.set('hallName', inp.value);

    if (inp.value.trim()) {
        fetch('https://shfe-diplom.neto-server.ru/hall', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            hallList.insertAdjacentHTML('beforeend', `
                <div class="remove_hall">
                    <div class="hall-list_numb" data-id="${data.result.halls.id}">
                        <div class="def">- </div>
                        <div class="adm_hall-number">${inp.value}</div>
                    </div>
                    <button class="btn_remove"></button>
                </div>
            `);
            inp.value = "";
            containerAddHall.classList.remove('container__popup_active');
            location.reload();
        })
        .catch(error => console.error('Ошибка при добавлении зала:', error));
    }
}

// Сохранение конфигурации зала
function saveConfig(hallConfId, arrayConfig) {
    const params = new FormData();
    params.set('rowCount', rows.value);
    params.set('placeCount', places.value);
    params.set('config', JSON.stringify(arrayConfig));

    fetch(`https://shfe-diplom.neto-server.ru/hall/${hallConfId}`, {
        method: 'POST',
        body: params,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            updateHallConfig(data.result);
        }
    })
    .catch(error => console.error('Ошибка при сохранении конфигурации зала:', error));
}

// Обновление визуализации схемы зала
function updateHallConfig(hallData) {
    const hallConfigList = document.querySelector(".ul_hall__config");
    hallConfigList.addEventListener('click', (e) => {
        if (Number(e.target.dataset.id) === hallData.id) {
            admschemeTap.innerHTML = `<div class="scheme_of_hall"></div>`;
            const schemeOfHall = document.querySelector('.scheme_of_hall');

            hallData.hall_config.forEach(row => {
                schemeOfHall.insertAdjacentHTML('beforeend', `<div class="conf-step__row"></div>`);
            });

            const confStepRows = document.querySelectorAll(".conf-step__row");
            hallData.hall_config.forEach((row, i) => {
                row.forEach(seat => {
                    confStepRows[i].insertAdjacentHTML('beforeend', `
                        <div class="conf-step__chair" data-id="${seat}">
                            <img src="" class="">
                        </div>
                    `);
                });
            });

            updateChairImages();
        }
    });
}

// Обновление изображений кресел
function updateChairImages() {
    const confStepChairs = document.querySelectorAll(".conf-step__chair");

    confStepChairs.forEach(chair => {
        if (chair.dataset.id === "vip") {
            chair.firstElementChild.src = './images/adm__chair1.png';
        } else if (chair.dataset.id === "standart") {
            chair.firstElementChild.src = './images/adm__chair.png';
        } else if (chair.dataset.id === "disabled") {
            chair.firstElementChild.src = './images/adm__chair2.png';
        }
    });
}

// Добавление цены зала
function addPrice(hallPriceId, params) {
    fetch(`https://shfe-diplom.neto-server.ru/price/${hallPriceId}`, {
        method: 'POST',
        body: params,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            updateHallPrice(data.result);
        }
    })
    .catch(error => console.error('Ошибка при добавлении цены:', error));
}

// Обновление цены зала
function updateHallPrice(priceData) {
    const ulHallPrice = document.querySelector(".ul_hall__price");
    ulHallPrice.addEventListener('click', (e) => {
        if (Number(e.target.dataset.id) === priceData.id) {
            inpChip.value = priceData.hall_price_standart;
            inpVip.value = priceData.hall_price_vip;
        }
    });
}

// Открытие зала
function openHalls(searchIndOpen, hallOpenId) {
    const params = new FormData();
    params.set('hallOpen', searchIndOpen);

    fetch(`https://shfe-diplom.neto-server.ru/open/${hallOpenId}`, {
        method: 'POST',
        body: params,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch(error => console.error('Ошибка при открытии зала:', error));
}

// Добавление фильма
function addFilms(file) {
    const formData = new FormData();
    const numbDuration = Number(filmDuration.value);
    formData.set('filmName', filmName.value);
    formData.set('filmDuration', numbDuration);
    formData.set('filmDescription', filmDescription.value);
    formData.set('filmOrigin', filmOrigin.value);
    formData.set('filePoster', file);

    fetch('https://shfe-diplom.neto-server.ru/film', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        filmContainer.classList.remove("container__popup_active");
        body.classList.remove('hidden');
        location.reload();
    })
    .catch(error => console.error('Ошибка при добавлении фильма:', error));
}

// Удаление фильма
function delFilms(filmId) {
    fetch(`https://shfe-diplom.neto-server.ru/film/${filmId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch(error => console.error('Ошибка при удалении фильма:', error));
}

// Добавление сеанса
function addSeances(params) {
    fetch(`https://shfe-diplom.neto-server.ru/seance`, {
        method: 'POST',
        body: params,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Ошибка при добавлении сеанса:', error));
}

// Удаление сеанса
function delSeances(checkSeans) {
    fetch(`https://shfe-diplom.neto-server.ru/seance/${checkSeans}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Ошибка при удалении сеанса:', error));
}
