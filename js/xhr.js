fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
.then( response => response.json())
.then( function(data) {
    console.log(data);
    allForHalls(data);
    allForFilms(data);
    allForSeances(data);
})

function delHall(halllId) {
fetch( `https://shfe-diplom.neto-server.ru/hall/${halllId}`, {
           method: 'DELETE',
        })
          .then( response => response.json())
          .then( function(data) {
            console.log( data );
            location.reload();
          })
}

function addHalls() {
  const formData = new FormData();
  formData.set('hallName', `${inp.value}`)
  if(inp.value.trim()) {
fetch( 'https://shfe-diplom.neto-server.ru/hall',{
      method: 'POST',
      body: formData
    })
      .then( response => response.json())
      .then( function(data) {
        console.log(data);  
        hallList.insertAdjacentHTML('beforeend', `<div class="remove_hall">
          <div class="hall-list_numb" data-id="${data.result.halls.id}">
          <div class="def">- </div>
          <div class="adm_hall-number">${inp.value}</div>
          </div>
          <button class="btn_remove"></button>
          </div>`);
        inp.value = "";
        containerAddHall.classList.remove('container__popup_active');
        location.reload(); 
      })
  } 
}

function saveConfig(hallConfId, arrayConfig) {
  const params = new FormData();
  params.set('rowCount', `${rows.value}`);
  params.set('placeCount', `${places.value}`);
  params.set('config', JSON.stringify(arrayConfig));
fetch( `https://shfe-diplom.neto-server.ru/hall/${hallConfId}`, {
  method: 'POST',
  body: params 
  })
      .then( response => response.json())
      .then( function(data) { 
        console.log( data );
        if(data.success === true) {
          const hallConfigList = document.querySelector(".ul_hall__config");
          hallConfigList.addEventListener('click', (e) => {
            if(Number(e.target.dataset.id) === data.result.id) {
              admschemeTap.removeChild(admschemeTap.firstElementChild);
              admschemeTap.insertAdjacentHTML('beforeend', `<div class="scheme_of_hall"></div>`);
              const schemeOfHall = document.querySelector('.scheme_of_hall');
              data.result.hall_config.forEach(element => {
                schemeOfHall.insertAdjacentHTML('beforeend', `<div class="conf-step__row"></div>`);
              });
              const confStepRow = Array.from(document.querySelectorAll(".conf-step__row"));
              for(let i = 0; i < confStepRow.length; i++) {
                for(let j = 0; j < data.result.hall_config[0].length; j++) {
                  confStepRow[i].insertAdjacentHTML('beforeend', `<div class="conf-step__chair" data-id="${data.result.hall_config[i][j]}"><img src="" class=""></div>`);
                }
              }
              const confStepChair = Array.from(document.querySelectorAll(".conf-step__chair"));
          
              for(let i = 0; i < confStepChair.length; i++) {
                if(confStepChair[i].dataset.id === "vip") {
                  confStepChair[i].firstElementChild.src = './images/adm__chair1.png';        
                }
                if(confStepChair[i].dataset.id === "standart") {
                  confStepChair[i].firstElementChild.src = './images/adm__chair.png';        
                }
                if(confStepChair[i].dataset.id === "disabled") {
                  confStepChair[i].firstElementChild.src = './images/adm__chair2.png';        
                } 
              }
            } else {
              return;
            }
          })
        }
      })
}

function addPrice(hallPriceId, params) {
fetch( `https://shfe-diplom.neto-server.ru/price/${hallPriceId}`, {
      method: 'POST',
      body: params 
  })
    .then( response => response.json())
    .then( function(data) {
      console.log( data );
      if(data.success === true) {
        const ulHallPrice = document.querySelector(".ul_hall__price");
        ulHallPrice.addEventListener('click', (e) => {
          if(Number(e.target.dataset.id) === data.result.id) {
            inpChip.value = data.result.hall_price_standart;
            inpVip.value = data.result.hall_price_vip;
          }
        })
      }
    })
}

function openHalls(serchIndOpen, hallOpenId) {
  const params = new FormData();
  params.set('hallOpen', `${serchIndOpen}`)
fetch( `https://shfe-diplom.neto-server.ru/open/${hallOpenId}`, {
        method: 'POST',
        body: params 
  })
      .then( response => response.json())
      .then( function(data) { 
        console.log( data );
        location.reload();
      })
         
}

function addFilms(file) {
const formData = new FormData();
let numbDuration = Number(filmDuration.value);
      formData.set('filmName', `${filmName.value}`);
      formData.set('filmDuration', numbDuration);
      formData.set('filmDescription', `${filmDescription.value}`);
      formData.set('filmOrigin', `${filmOrigin.value}`);
      formData.set('filePoster', file);
fetch( 'https://shfe-diplom.neto-server.ru/film',{
       method: 'POST',
       body: formData
     })
       .then( response => response.json())
       .then( function(data) {
         console.log(data);  
         filmContainer.classList.remove("container__popup_active");
         body.classList.remove('hidden');
         location.reload();  
       })
}

function delFilms(filmId) {
fetch( `https://shfe-diplom.neto-server.ru/film/${filmId}`, {
          method: 'DELETE',
       })
         .then( response => response.json())
         .then( function(data) {
           console.log( data );
           location.reload();
         })
}

function addSeances(params) {                
fetch( `https://shfe-diplom.neto-server.ru/seance`, {
  method: 'POST',
  body: params 
})
  .then( response => response.json())
  .then( function(data) { 
    console.log( data );
  })
}

function delSeances(checkSeans) {
fetch( `https://shfe-diplom.neto-server.ru/seance/${checkSeans}`, {
  method: 'DELETE',
})
  .then( response => response.json())
  .then(function(data) {
    console.log( data );
  })
}