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
  let randomNumQuote = getRandomNum(0, 8);
  const changeQuote = document.querySelector(".change-quote");
  let isPlay = false;
  const playItem = document.querySelector(".play");
  const pauseItem = document.querySelector(".pause");
  let playNum = 0;
  const playPrevItem = document.querySelector(".play-prev");
  const playNextItem = document.querySelector(".play-next");
  const liItem = document.querySelector("li");
  const titleAll = [];
  const playerDuration = document.querySelector(".player-duration");
  let sec;
  let min = 0;
  let mySetInterval;
  let mySetInterval2;
  const playerTimer = document.querySelector(".player-timer");
  let devidedTimerArray;
  let devidedDurationTime;
  let timeSec;
  const soundPicture = document.querySelector(".sound-pic");
  let isMute = false;

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
    getLocalStorage();
    getWeather();
  });

  // Greeting

  function setLocalStorage() {
    localStorage.setItem("name", name.value);
    localStorage.setItem("cityText", cityText.value);
  }
  window.addEventListener("beforeunload", setLocalStorage);

  function setTimerLocalStorage() {
    localStorage.setItem("timer", playerTimer.textContent);
  }

  function getTimerLocalStorage() {
    if (localStorage.getItem("timer")) {
      playerTimer.textContent = localStorage.getItem("timer");
      devidedTimerArray = playerTimer.textContent.split(":");
      sec = `${devidedTimerArray[1]}`;
      audio.currentTime = sec;
    }
  }

  function getLocalStorage() {
    if (localStorage.getItem("name")) {
      name.value = localStorage.getItem("name");
    } else {
      cityText.value = "Минск";
    }
    if (localStorage.getItem("cityText")) {
      cityText.value = localStorage.getItem("cityText");
    }
    if (localStorage.getItem("timer")) {
      playerTimer.textContent = "00:00";
      localStorage.setItem("timer", playerTimer.textContent);
    }
  }

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
    if (randomNumQuote === 8) {
      randomNumQuote = 0;
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
    audio.title = playList[playNum].title;
    audio.play();
    audio.durationTime = playList[playNum].duration;
    devidedDurationTime = audio.durationTime.split(":");
    timeSec = +devidedDurationTime[0] * 60 + +devidedDurationTime[1];
    document.querySelector(".player-range").max = `${timeSec / 10}`;
    initTime();
    playerDuration.textContent = `${playList[playNum].duration}`;
    for (let titleLi of titleAll) {
      if (titleLi.classList.contains("selected")) {
        titleLi.classList.remove("selected");
      }
    }
    colorButton();
    ended;
  }

  function pauseAudio() {
    audio.pause();
    clearInterval(mySetInterval);
    setTimerLocalStorage();
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
    titleAll.push(li);
  });

  function colorButton() {
    for (let i = 0; i < titleAll.length; i++) {
      if (audio.title === titleAll[i].textContent) {
        titleAll[i].classList.add("selected");
      }
    }
  }

  function initTime() {
    sec = 0;
    getTimerLocalStorage();
    mySetInterval = setInterval(stopwatch, 1000);
  }

  function stopwatch() {
    sec++;
    if (sec >= 60) {
      min++;
      sec = sec - 60;
    }
    if (sec < 10) {
      if (min < 10) {
        playerTimer.textContent = "0" + min + ":0" + sec;
      } else {
        playerTimer.textContent = min + ":0" + sec;
      }
    } else {
      if (min < 10) {
        playerTimer.textContent = "0" + min + ":" + sec;
      } else {
        playerTimer.textContent = min + ":" + sec;
      }
    }
  }

  function changeEndingAudio() {
    if (sec > +timeSec) {
      console.log(sec > +timeSec);
      audio.pause();
      playNum = playNum + 1;
    }
  }

  function toggleSound() {
    soundPicture.classList.toggle("no-mute");
    if (soundPicture.classList.contains("no-mute")) {
      isMute = true;
    } else {
      isMute - false;
    }
  }

  soundPicture.addEventListener("click", toggleSound);

  const toDoItems = document.querySelector(".to-do-items");
  const toDoItemsStorage = localStorage.getItem("toDoItems");
  const toDoText = document.querySelector(".to-do-text");
  const toDoItem = document.querySelector(".to-do-item");
  const toDoAddButton = document.querySelector(".to-do-add");
  const toDoInput = document.querySelector(".to-do");
  const toDoList = document.querySelector(".to-do-list");
  const deleteItem = document.querySelector(".delete");

  const toDo = {
    print() {
      console.log(555);
    },
    init() {
      if (toDoItemsStorage) {
        toDoItems.innerHTML = toDoItemsStorage;
      }
      document.addEventListener("click", this.action.bind(this));
    },
    save() {
      localStorage.setItem("toDoItems", toDoItems.innerHTML);
    },
    add() {
      if (!toDoInput.value) {
        return;
      }

      toDoList.style.top = "0px";
      var li = document.createElement("li");
      li.className = "to-do-item";
      li.innerHTML = `${toDoInput.value}<div class="done"></div>
      <div class="delete"></div>`;
      toDoItems.append(li);
      toDoInput.value = "";
    },
    action() {
      toDoItems.onclick = function (event) {
        let target = event.target;
        if (target.classList.contains("delete")) {
          console.log(target);
          document.querySelector(".delete").parentElement.remove();
          return;
        }
        console.log("no");
      };
    },
    close() {
      console.log("d");
    },
  };

  toDoAddButton.addEventListener("click", toDo.add);

  document
    .querySelector("input[name=do]")
    .addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        toDo.add();
      }
    });

  toDo.action();
  toDo.save();
})();
