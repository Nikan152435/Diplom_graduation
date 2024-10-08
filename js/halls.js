// Получение элементов из DOM
const btnAddHall = document.querySelector(".add_hall");
const containerAddHall = document.querySelector(".hall");
const btnAddFilm = document.querySelector(".adm_add-film");
const hallList = document.querySelector(".hall-list");
const hallConfigList = document.querySelector(".ul_hall__config");
const rows = document.getElementById("rows");
const places = document.getElementById("places");
const btnDeleteConfig = document.querySelector(".delete_config__btn");
const btnSaveConfig = document.querySelector(".save_config__btn");
const ulHallPrice = document.querySelector(".ul_hall__price");
const installPrice = document.querySelector(".install_price");
const inpChip = document.querySelector(".chip");
const inpVip = document.querySelector(".vip");
const btnOpen = document.getElementById("btn_open");
const openSellBtn = document.getElementById("open__sell_btn");
const closeBtn = document.querySelector(".close_popup_halls");
const form = document.querySelector(".form_popup");
const addHall = document.querySelector(".hall");

let controller = new AbortController();
let signal = controller.signal;
let arrayConfig = []; 

// Функция инициализации событий
function initEventListeners(data) {
    closeBtn.addEventListener('click', closeAddHallPopup);
    btnRemove.addEventListener('click', resetFormAndClose);
    btnAddHall.addEventListener('click', showAddHallPopup);
    hallList.addEventListener('click', handleHallRemoval);
    btnAdd.addEventListener('click', addHallsToData);

    setupHallConfigurations(data);
    setupHallPrices(data);
    setupHallOpenState(data);
}

// Закрытие попапа
function closeAddHallPopup() {
    addHall.classList.remove("container__popup_active");  
    document.body.classList.remove('hidden');
}

// Сброс формы и закрытие попапа
function resetFormAndClose(e) {
    e.preventDefault();
    closeAddHallPopup();
    form.reset();
}

// Показ попапа добавления зала
function showAddHallPopup() {
    containerAddHall.classList.add('container__popup_active');
    document.body.classList.add('hidden');
}

// Обработка удаления зала
function handleHallRemoval(e) {
    if (e.target.classList.contains("btn_remove")) {
        const hallId = e.target.previousElementSibling.dataset.id;
        delHall(hallId);
    }
}

// Добавление нового зала
function addHallsToData(e) {
    e.preventDefault();
    addHalls(inp.value); 
}

// Установка конфигураций залов
function setupHallConfigurations(data) {
    const hallItemConfig = Array.from(document.querySelectorAll(".hall_item__config"));
    let hallConfId = hallItemConfig[0].dataset.id;

    hallItemConfig.forEach((item, index) => {
        item.classList.toggle("hall_item_checked", index === 0);
        item.addEventListener('click', () => {
            hallConfId = item.dataset.id;
            updateHallConfigurations(data, hallConfId);
        });
    });

    // Инициализация схемы для первого зала
    updateHallConfigurations(data, hallConfId);
}

// Обновление конфигураций залов
function updateHallConfigurations(data, hallConfId) {
    const indHall = data.result.halls.findIndex(hall => hall.id === Number(hallConfId));
    const schemeOfHall = document.createElement('div');
    schemeOfHall.className = "scheme_of_hall";
    
    admschemeTap.innerHTML = ''; // Очистить старую схему
    admschemeTap.appendChild(schemeOfHall);
    
    data.result.halls[indHall].hall_config.forEach(() => {
        schemeOfHall.insertAdjacentHTML('beforeend', `<div class="conf-step__row"></div>`);
    });

    const confStepRow = Array.from(document.querySelectorAll(".conf-step__row"));
    const hallConfig = data.result.halls[indHall].hall_config;

    for (let j = 0; j < confStepRow.length; j++) {
        for (let k = 0; k < hallConfig[j].length; k++) {
            const chairType = hallConfig[j][k];
            confStepRow[j].insertAdjacentHTML('beforeend', `<div class="conf-step__chair" data-id="${chairType}"><img src="" class=""></div>`);
        }
    }
    
    updateChairImages();
}

// Обновление изображений стульев
function updateChairImages() {
    const confStepChair = Array.from(document.querySelectorAll(".conf-step__chair"));
    confStepChair.forEach(chair => {
        const chairId = chair.dataset.id;
        if (chairId === "vip") {
            chair.firstElementChild.src = './images/adm__chair1.png';
        } else if (chairId === "standart") {
            chair.firstElementChild.src = './images/adm__chair.png';
        } else if (chairId === "disabled") {
            chair.firstElementChild.src = './images/adm__chair2.png';
        }
    });
}

// Установка цен залов
function setupHallPrices(data) {
    const hallItemPrice = Array.from(document.querySelectorAll(".hall_item__price"));
    let hallPriceId = hallItemPrice[0].dataset.id;

    hallItemPrice.forEach((item, index) => {
        item.classList.toggle("hall_item_checked", index === 0);
        item.addEventListener('click', () => {
            hallPriceId = item.dataset.id;
            updatePriceInputs(data, hallPriceId);
        });
    });

    updatePriceInputs(data, hallPriceId);
    
    saveBtnPrice.addEventListener('click', (e) => {
        e.preventDefault();
        savePrices(hallPriceId);
    });

    deleteBtnPrice.addEventListener('click', () => {
        controller.abort();
    });
}

// Обновление цен на входе
function updatePriceInputs(data, hallPriceId) {
    const hallData = data.result.halls.find(hall => hall.id === Number(hallPriceId));
    if (hallData) {
        inpChip.value = hallData.hall_price_standart;
        inpVip.value = hallData.hall_price_vip;
    }
}

// Сохранение цен на билеты
function savePrices(hallPriceId) {
    const params = new FormData();
    if (inpChip.value.trim()) { 
        params.set('priceStandart', inpChip.value);
    }  
    if (inpVip.value.trim()) {
        params.set('priceVip', inpVip.value);
    } 
    addPrice(hallPriceId, params);
}

// Установка состояния открытых залов
function setupHallOpenState(data) {
    const hallItemOpen = Array.from(document.querySelectorAll(".hall_item__open"));
    let hallOpenId = hallItemOpen[0].dataset.id;

    hallItemOpen.forEach((item, index) => {
        item.classList.toggle("hall_item_checked", index === 0);
        item.addEventListener('click', () => {
            hallOpenId = item.dataset.id;
            toggleOpenState(data, hallOpenId);
        });
    });

    toggleOpenState(data, hallOpenId);
    
    openSellBtn.addEventListener('click', () => {
        openHalls(serchIndOpen, hallOpenId);
    });
}

// Переключение состояния открытых залов
function toggleOpenState(data, hallOpenId) {
    const hallData = data.result.halls.find(hall => hall.id === Number(hallOpenId));
    if (hallData) {
        const indif = hallData.hall_open;
        btnOpen.textContent = indif === 0 ? 'Открыть продажу билетов' : 'Приостановить продажу билетов';
        serchIndOpen = indif === 0 ? 1 : 0;
    }
}

// Основная функция
function allForHalls(data) {
    signal.addEventListener('abort', () => console.log("Запрос отменён!"));
    initEventListeners(data);
    
    data.result.halls.forEach(hall => {
        addHallToList(hall);
    });
}

// Функция для добавления зала в список
function addHallToList(hall) {
    hallList.insertAdjacentHTML('beforeend', `<div class="remove_hall">
        <div class="hall-list_numb" data-id="${hall.id}">
            <div class="def">- </div>
            <div class="adm_hall-number">${hall.hall_name}</div>
        </div>
        <button class="btn_remove"></button>
    </div>`);
    
    hallConfigList.insertAdjacentHTML('beforeend', `<li class="hall_item hall_item__config" data-id="${hall.id}">${hall.hall_name}</li>`);
    ulHallPrice.insertAdjacentHTML('beforeend', `<li class="hall_item hall_item__price" data-id="${hall.id}">${hall.hall_name}</li>`);
    ulHallOpen.insertAdjacentHTML('beforeend', `<li class="hall_item hall_item__open" data-id="${hall.id}">${hall.hall_name}</li>`);
}

// Запуск функции для работы с залами
// Передайте данные зала, чтобы инициализировать интерфейс
