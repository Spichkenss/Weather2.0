let weather = {
    API: "a59577e36c57e9eaea429888e7636f13",
    // Запрос текущего прогноза 
    fetchWeather: function (city) {
        document.querySelector('.match-list').innerHTML = "";
        document.querySelector('.search-input input').value = "";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${this.API}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Для разработки
                this.displayCurrent(data);
                this.fetchDaily(data);
            });
    },
    // Запрос ежедневного и часаового прогноза
    fetchDaily: function (data) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&lang=ru&appid=${this.API}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Для разработки
                this.displayDaily(data);
                this.displayPopup(data);
            })
    },
    // Вывод текущего прогноза погоды
    displayCurrent: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp } = data.main;
        document.querySelector('.popup-city h1').innerHTML = name;
        document.querySelector('.current-city').innerHTML = name;
        document.querySelector('.current-icon img').src = `icons/${icon}.svg`
        document.querySelector('.current-description').innerHTML = description.charAt(0).toUpperCase(0) + description.substr(1);
        document.querySelector('.current-temp').innerHTML = `${Math.round(temp)}&deg;С`
    },
    // Вывод ежедневого прогноза на неделю
    displayDaily: function (data) {
        let months = ["Янв", "Фев", "Мар", "Апр", "Мая", "Июня", "Июля", "Авг", "Сен", "Окт", "Ноя", "Дек"];
        let daysRu = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        let days = document.querySelectorAll('.daily-card');


        days.forEach((item, index) => {
            let date = new Date(data.daily[index].dt * 1000);
            if (index > 1) {
                item.querySelector('.daily-day').innerHTML = `${date.getDate()} ${months[date.getMonth()]} | ${daysRu[date.getDay()]}`;
            }
            item.querySelector('.daily-icon img').src = `icons/${data.daily[index].weather[0].icon}.svg`;
            item.querySelector('.daily-temp').innerHTML = `${Math.round(data.daily[index].temp.max)}&deg;С`;
        })
    },

    // Вывод информации в попапе
    displayPopup: function (data) {
        let arr = document.querySelectorAll('.daily-card');
        this.createCarousel(data);
        arr.forEach((item, index) => {
            item.arrIndex = index;
            // При клике на какой-то день мы сперва собираем всю информацию...
            item.addEventListener('click', function () {
                let path = data.daily[item.arrIndex];
                let date = item.querySelector('.daily-day').innerHTML;
                document.querySelector('.popup-day').innerHTML = date;
                document.querySelector('.popup-temp h1').innerHTML = `${path.temp.max}&deg;С`;
                document.querySelector('.popup-temp img').src = `icons/${path.weather[0].icon}.svg`;
                document.querySelector('.description').innerHTML = path.weather[0].description.charAt(0).toUpperCase(0) + path.weather[0].description.substr(1);
                document.querySelector('.feels-like').innerHTML = `Ощущается как ${path.feels_like.day}&deg;С`;
                document.querySelector('.wind-speed .speed').innerHTML = `${path.wind_speed}м/с`;
                document.querySelector('.humidity .hum').innerHTML = `${path.humidity}%`;
                document.querySelector('.pressure .pres').innerHTML = `${path.pressure} мбар`;
                // ... затем открываем попап
                document.querySelector('.popup').classList.add('opened');
            });
        });
    },
    // Создание карусели почасового прогноза в попапе
    createCarousel: function (data) {
        document.querySelector('.hourly-line').innerHTML = '';
        let line = document.querySelector('.hourly-line');
        for (let i = 0; i <= 24; i++) {
            let date = new Date(data.hourly[i].dt * 1000);
            line.innerHTML += `<div class="one-hour">
                            <div class="hourly-time">${('0' + date.getHours()).slice(-2)} : 00</div>
                            <img src="icons/${data.hourly[i].weather[0].icon}.svg">
                            <div class="hourly-temp">${data.hourly[i].temp}&deg;С</div>
                          </div>`
        }
    },


};
// Запрос при загрузке страницы
weather.fetchWeather("Moscow");

// Листенер на клик по лупе
document.querySelector('.search-btn').addEventListener('click', function () {
    weather.fetchWeather(document.querySelector('.search-input input').value);
    document.querySelector('.search-input input').value = "";
});

// Листенер на Enter
document.querySelector(".search-input input").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.fetchWeather(document.querySelector('.search-input input').value);
        document.querySelector('.search-input input').value = ""
    }
})

// Листенер на клик по черной зоне для закрытия попапа
document.querySelector('.popup-close-area').addEventListener('click', function () {
    document.querySelector('.popup').classList.remove('opened');
});

// Открывает даталист при непустом инпуте
document.querySelector('.search-input input').addEventListener('change', function(){
    document.querySelectorAll('.match').forEach(match => {
        match.addEventListener('click', function(){
            let query = match.innerText;
            weather.fetchWeather(query);
        })
    })
})

