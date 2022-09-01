import playList from "./playList.js";

(function () {

  // Time and calendar

  const time = document.querySelector(".time");
  const dateDayMonth = document.querySelector(".date");
  const greetingText = ["night", "morning", "afternoon", "evening"];
  const greeting = document.querySelector(".greeting");
  let name = document.querySelector(".name");
  const body = document.querySelector(".body");
  let timeOfDayNow;
  let randomNum = getRandomNum(1, 20);
  const slideNext = document.querySelector(".slide-next");
  const slidePrev = document.querySelector(".slide-prev");
  const weatherIcon = document.querySelector(".weather-icon");
  const temperature = document.querySelector(".temperature");
  const weatherDescription = document.querySelector(".weather-description");
  const cityText = document.querySelector(".city");
  const wind = document.querySelector(".wind");
  const humidity = document.querySelector(".humidity");
  const weatherError = document.querySelector(".weather-error");
  const quote = document.querySelector(".quote");
  const author = document.querySelector(".author");
  let randomNumQuote = getRandomNum(0, 5);
  const changeQuote = document.querySelector(".change-quote");
  let isPlay = false;
  const playItem = document.querySelector(".play");
  const pauseItem = document.querySelector(".pause");
  let playNum = 0;
  const playPrevItem = document.querySelector(".play-prev");
  const playNextItem = document.querySelector(".play-next");
  const liItem = document.querySelector("li");
  const titleAll = [];

  function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    getTimeOfDay();
  }
  showTime();

  function showDate() {
    const date = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    const currentDate = date.toLocaleDateString("en-En", options);
    dateDayMonth.textContent = currentDate;
  }

  function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 0 && hours < 6) {
      timeOfDayNow = greetingText[0];
      greeting.textContent = `Good ${timeOfDayNow}`;
    } else if (hours >= 6 && hours < 12) {
      timeOfDayNow = greetingText[1];
      greeting.textContent = `Good ${timeOfDayNow}`;
    } else if (hours >= 12 && hours < 18) {
      timeOfDayNow = greetingText[2];
      greeting.textContent = `Good ${timeOfDayNow}`;
    } else {
      timeOfDayNow = greetingText[3];
      greeting.textContent = `Good ${timeOfDayNow}`;
    }
    return timeOfDayNow;
  }

  window.addEventListener("load", () => {
    cityText.value = "Минск";
    getWeather();
  });

  // Greeting

  function setLocalStorage() {
    localStorage.setItem("name", name.value);
    localStorage.setItem("cityText", cityText.value);
  }
  window.addEventListener("beforeunload", setLocalStorage);

  function getLocalStorage() {
    if (localStorage.getItem("name")) {
      name.value = localStorage.getItem("name");
    }
    if (localStorage.getItem("cityText")) {
      cityText.value = localStorage.getItem("cityText");
    }
  }
  window.addEventListener("load", getLocalStorage);

  // Slyder

  function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getRandomNum(1, 20);

  function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = randomNum.toString().padStart(2, "0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/marykashkan/momentum-backgrounds/main/${timeOfDay}/${bgNum}.webp`;
    img.onload = () => {
      body.style.backgroundImage = `url(${img.src})`;
    };
  }
  setBg();

  function getSlideNext() {
    if (randomNum === 20) {
      randomNum = 1;
    } else {
      randomNum = randomNum + 1;
    }
    setBg();
  }

  function getSlidePrev() {
    if (randomNum === 1) {
      randomNum = 20;
    } else {
      randomNum = randomNum - 1;
    }
    setBg();
  }

  slideNext.addEventListener("click", getSlideNext);
  slidePrev.addEventListener("click", getSlidePrev);

  // weather

  cityText.addEventListener("change", getWeather);

  async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityText.value}&lang=en&appid=de5db181ef97388becee213cd54f783c&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod === "400") {
      weatherError.textContent = `Error! Nothing to geocode for ''!`;
      weatherIcon.className = "weather-icon owf";
      temperature.textContent = ``;
      weatherDescription.textContent = ``;
      wind.textContent = ``;
      humidity.textContent = ``;
    } else if (data.cod === "404") {
      weatherError.textContent = `Error! city not found for '${cityText.value}'!`;
      weatherIcon.className = "weather-icon owf";
      temperature.textContent = ``;
      weatherDescription.textContent = ``;
      wind.textContent = ``;
      humidity.textContent = ``;
    } else {
      weatherError.textContent = ``;
      weatherIcon.className = "weather-icon owf";
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.floor(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
      humidity.textContent = `Humidity: ${Math.floor(data.main.humidity)}%`;
    }
  }

  // Quote

  function getNextQuote() {
    if (randomNumQuote === 5) {
      randomNumQuote = 1;
    } else {
      randomNumQuote = randomNumQuote + 1;
    }
    getQuotes();
  }

  async function getQuotes() {
    const quotes = "js/data.json";
    const res = await fetch(quotes);
    const data = await res.json();
    quote.textContent = `"${data[randomNumQuote].text}"`;
    author.textContent = `${data[randomNumQuote].author}`;
  }
  getQuotes();

  changeQuote.addEventListener("click", getNextQuote);

  // Audio

  const audio = new Audio();

  function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
  }

  function pauseAudio() {
    audio.pause();
  }

  function toggleBtn() {
    playItem.classList.toggle("pause");
    if (playItem.classList.contains("pause")) {
      isPlay = true;
      playAudio();
    } else {
      isPlay = false;
      pauseAudio();
    }
  }

  playItem.addEventListener("click", toggleBtn);

  function playNext() {
    if (playNum === 3) {
      playNum = 0;
    } else {
      playNum = playNum + 1;
    }
    playItem.classList.add("pause");
    playAudio();
  }

  function playPrev() {
    if (playNum === 0) {
      playNum = 3;
    } else {
      playNum = playNum - 1;
    }
    playItem.classList.add("pause");
    playAudio();
  }

  playNextItem.addEventListener("click", playNext);
  playPrevItem.addEventListener("click", playPrev);

  playList.forEach((el) => {
    const li = document.createElement("li");
    const playListContainer = document.querySelector(".play-list");
    li.classList.add("play-item");
    li.textContent = `${el.title}`;
    playListContainer.append(li);
    titleAll.push(el.title);
  });
  
})();
