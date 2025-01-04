// Данные для локальной работы проекта
window.data = {
  success: true,
  result: {
    halls: [
      {
        id: 2541,
        hall_name: "Большой",
        hall_rows: 8,
        hall_places: 5,
        hall_config: [
          ["standart", "standart", "standart", "standart", "standart"],
          ["standart", "standart", "standart", "standart", "standart"],
          ["standart", "disabled", "vip", "vip", "standart"],
          ["standart", "vip", "vip", "vip", "standart"],
          ["standart", "disabled", "vip", "vip", "standart"],
          ["standart", "standart", "vip", "vip", "standart"],
          ["standart", "standart", "standart", "standart", "standart"],
          ["disabled", "disabled", "disabled", "standart", "standart"]
        ],
        hall_price_standart: 504,
        hall_price_vip: 350,
        hall_open: 0
      },
      {
        id: 2543,
        hall_name: "VIP зал",
        hall_rows: 10,
        hall_places: 10,
        hall_config: [
          ["disabled", "disabled", "disabled", "standart", "standart", "standart", "standart", "disabled", "disabled", "disabled"],
          ["disabled", "disabled", "standart", "standart", "standart", "standart", "standart", "standart", "disabled", "disabled"],
          ["disabled", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "disabled"],
          // Остальная конфигурация...
        ],
        hall_price_standart: 100,
        hall_price_vip: 350,
        hall_open: 0
      },
      {
        id: 2564,
        hall_name: "Огроменный",
        hall_rows: 15,
        hall_places: 10,
        hall_config: [
          ["standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart"],
          ["standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart"],
          // Остальная конфигурация...
        ],
        hall_price_standart: 277,
        hall_price_vip: 556,
        hall_open: 0
      },
      {
        id: 2567,
        hall_name: "Малый зал",
        hall_rows: 6,
        hall_places: 6,
        hall_config: [
          ["standart", "standart", "standart", "standart", "standart", "standart"],
          ["standart", "standart", "vip", "vip", "standart", "standart"],
          // Остальная конфигурация...
        ],
        hall_price_standart: 500,
        hall_price_vip: 700,
        hall_open: 1
      }
    ],
    films: [
      {
        id: 196,
        film_name: "Меч короля",
        film_duration: 127,
        film_description: "Дания, XVIII век...",
        film_origin: "Дания, Швеция, Норвегия, Германия",
        film_poster: "./images/posters/placeholder.png"
      },
      {
        id: 198,
        film_name: "Остров проклятых",
        film_duration: 138,
        film_description: "Два американских судебных пристава...",
        film_origin: "США",
        film_poster: "./images/posters/placeholder.png"
      },
      // Остальные фильмы...
    ],
    seances: [
      {
        id: 1090,
        seance_hallid: 2541,
        seance_filmid: 198,
        seance_time: "17:00"
      },
      {
        id: 1099,
        seance_hallid: 2543,
        seance_filmid: 199,
        seance_time: "10:00"
      },
      {
        id: 1101,
        seance_hallid: 2541,
        seance_filmid: 247,
        seance_time: "00:00"
      },
      {
        id: 1104,
        seance_hallid: 2541,
        seance_filmid: 196,
        seance_time: "11:00"
      },
      {
        id: 1105,
        seance_hallid: 2564,
        seance_filmid: 864,
        seance_time: "11:00"
      },
      {
        id: 1106,
        seance_hallid: 2567,
        seance_filmid: 872,
        seance_time: "14:00"
      }
    ]
  }
};
console.log("Загружен ли data.js?", window.data);
// Экспорт данных для использования в других файлах
// export default data;