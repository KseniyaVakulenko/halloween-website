// Основные элементы
const themeToggle = document.getElementById('themeToggle');
const spiderButton = document.getElementById('spiderButton');
const pumpkinButton = document.getElementById('pumpkinButton');
const batButton = document.getElementById('batButton');
const candleButton = document.getElementById('candleButton');
const trickButton = document.getElementById('trickButton');
const candyCountEl = document.getElementById('candyCount');
const candyMessageEl = document.getElementById('candyMessage');
const startGameBtn = document.getElementById('startGame');
const ghostEl = document.getElementById('ghost');
const timeLeftEl = document.getElementById('timeLeft');
const scoreEl = document.getElementById('score');
const nameInput = document.getElementById('nameInput');
const generateMessageBtn = document.getElementById('generateMessage');
const predictionText = document.getElementById('predictionText');
const spookyText = document.getElementById('spookyText');
const pumpkinField = document.getElementById('pumpkinField');
const spidersContainer = document.getElementById('spidersContainer');
const batsContainer = document.getElementById('batsContainer');
const candlesContainer = document.getElementById('candlesContainer');
const dangerCountEl = document.getElementById('dangerCount');
const livesCountEl = document.getElementById('livesCount');
const explosionEl = document.getElementById('explosion');
const trickMessageEl = document.getElementById('trickMessage');
const footerMessageEl = document.getElementById('footerMessage');

// Аудио элементы
const spookySound = document.getElementById('spookySound');
const gameSound = document.getElementById('gameSound');
const explosionSound = document.getElementById('explosionSound');
const clickSound = document.getElementById('clickSound');
const candleSound = document.getElementById('candleSound');

// Переменные состояния
let candyCount = 10;
let gameActive = false;
let gameTime = 10;
let gameScore = 0;
let gameTimer;
let ghostInterval;
let dangerousPumpkins = 0;
let lives = 3;
let pumpkinCounter = 0;

// Инициализация
updateCandyCounter();
updateLives();
createInitialPumpkins();

// Смена темы
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.className = 'fas fa-sun';
        this.style.background = 'linear-gradient(145deg, #ff8c00, #ffaa00)';
        this.style.borderColor = '#ff5500';
    } else {
        icon.className = 'fas fa-moon';
        this.style.background = 'linear-gradient(145deg, #8b0000, #5a0000)';
        this.style.borderColor = '#ff8c00';
    }
    playSound(clickSound);
});

// Создание опасных тыкв (внешне как обычные)
pumpkinButton.addEventListener('click', function() {
    if (lives <= 0) {
        alert('💀 У вас закончились жизни! Обновите страницу для новой игры.');
        return;
    }
    
    createPumpkin();
    playSound(clickSound);
});

function createPumpkin() {
    pumpkinCounter++;
    
    const pumpkin = document.createElement('div');
    pumpkin.className = 'pumpkin';
    pumpkin.innerHTML = '🎃';
    
    // Случайный шанс создания опасной тыквы (25%)
    const isDangerous = Math.random() < 0.25 && dangerousPumpkins < 3;
    
    if (isDangerous) {
        dangerousPumpkins++;
        pumpkin.classList.add('dangerous');
        pumpkin.dataset.dangerous = 'true';
        pumpkin.title = '💣 ОПАСНАЯ ТЫКВА! Может взорваться!';
        
        // Случайный "трещинный" эффект для опасной тыквы
        const hue = 0 + Math.random() * 20; // Более красный оттенок
        pumpkin.style.filter = `hue-rotate(${hue}deg) brightness(1.3)`;
    } else {
        pumpkin.title = '🎃 Обычная тыква. Нажмите для сбора!';
        const hue = 20 + Math.random() * 40;
        pumpkin.style.filter = `hue-rotate(${hue}deg)`;
    }
    
    // Обработчик клика
    pumpkin.addEventListener('click', function() {
        if (this.dataset.dangerous === 'true') {
            // Взрывная тыква
            explodePumpkin(this);
            dangerousPumpkins--;
            lives--;
            updateLives();
            
            if (lives <= 0) {
                setTimeout(() => {
                    alert('💥💀 КАТАСТРОФА! Вы проиграли! Страница перезагрузится...');
                    location.reload();
                }, 800);
            } else if (dangerousPumpkins >= 3) {
                setTimeout(() => {
                    alert('💣💣💣 Вы нашли 3 взрывные тыквы подряд! Игра окончена!');
                    location.reload();
                }, 800);
            }
        } else {
            // Обычная тыква
            this.style.transform = 'scale(1.8) rotate(45deg)';
            this.style.opacity = '0';
            
            setTimeout(() => {
                this.remove();
                pumpkinCounter--;
                candyCount += Math.floor(Math.random() * 2) + 1; // 1-2 конфеты
                updateCandyCounter();
                playSound(clickSound);
            }, 300);
        }
        updateDangerCount();
    });
    
    pumpkinField.appendChild(pumpkin);
    
    // Ограничение количества тыкв
    if (pumpkinCounter > 15) {
        const firstPumpkin = pumpkinField.querySelector('.pumpkin');
        if (firstPumpkin && firstPumpkin.dataset.dangerous !== 'true') {
            firstPumpkin.remove();
            pumpkinCounter--;
        }
    }
}

function explodePumpkin(pumpkin) {
    const rect = pumpkin.getBoundingClientRect();
    explosionEl.style.left = (rect.left + rect.width/2 - 75) + 'px';
    explosionEl.style.top = (rect.top + rect.height/2 - 75) + 'px';
    
    explosionEl.style.animation = 'none';
    setTimeout(() => {
        explosionEl.style.animation = 'explosion 1s forwards';
    }, 10);
    
    playSound(explosionSound);
    
    setTimeout(() => {
        pumpkin.remove();
        pumpkinCounter--;
        explosionEl.style.animation = 'none';
    }, 1000);
}

function updateDangerCount() {
    dangerCountEl.textContent = dangerousPumpkins;
    dangerCountEl.style.color = dangerousPumpkins > 0 ? '#ff0000' : '#ff8c00';
}

function updateLives() {
    livesCountEl.textContent = lives;
    if (lives === 3) {
        livesCountEl.style.color = '#00ff00';
    } else if (lives === 2) {
        livesCountEl.style.color = '#ffa500';
    } else if (lives === 1) {
        livesCountEl.style.color = '#ff0000';
        livesCountEl.style.animation = 'pulse 0.8s infinite';
    } else {
        livesCountEl.style.color = '#8b0000';
    }
}

function createInitialPumpkins() {
    for (let i = 0; i < 6; i++) {
        createPumpkin();
    }
}

// Паучий дождь (ИСПРАВЛЕННЫЙ!)
spiderButton.addEventListener('click', function() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createSpider();
        }, i * 150); // Пауки появляются с задержкой
    }
    playSound(spookySound);
});

function createSpider() {
    const spider = document.createElement('div');
    spider.innerHTML = '🕷';
    spider.className = 'spider';
    
    // Случайная позиция
    const startX = Math.random() * (window.innerWidth - 50);
    spider.style.left = startX + 'px';
    
    // Случайная скорость
    const duration = 1 + Math.random() * 3;
    spider.style.animationDuration = duration + 's';
    
    // Случайное направление вращения
    spider.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    spidersContainer.appendChild(spider);
    
    // Удаление после анимации
    setTimeout(() => {
        if (spider.parentNode) {
            spider.remove();
        }
    }, duration * 1000);
}

// Мышиная стая
batButton.addEventListener('click', function() {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createBat();
        }, i * 100);
    }
    playSound(spookySound);
});

function createBat() {
    const bat = document.createElement('div');
    bat.innerHTML = '🦇';
    bat.className = 'bat';
    
    const startY = Math.random() * (window.innerHeight - 100);
    bat.style.top = startY + 'px';
    
    const duration = 0.8 + Math.random() * 1.5;
    bat.style.animationDuration = duration + 's';
    
    batsContainer.appendChild(bat);
    
    setTimeout(() => {
        if (bat.parentNode) {
            bat.remove();
        }
    }, duration * 1000);
}

// Призыв свечей (новая кнопка вместо звуков)
candleButton.addEventListener('click', function() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createCandle();
        }, i * 200);
    }
    playSound(candleSound);
});

function createCandle() {
    const candle = document.createElement('div');
    candle.innerHTML = '🕯️';
    candle.className = 'candle';
    
    const startX = Math.random() * (window.innerWidth - 50);
    candle.style.left = startX + 'px';
    
    const duration = 2 + Math.random() * 2;
    candle.style.animationDuration = duration + 's';
    
    candlesContainer.appendChild(candle);
    
    setTimeout(() => {
        if (candle.parentNode) {
            candle.remove();
        }
    }, duration * 1000);
}

// Фокус или угощение (сообщение показывается в отдельном блоке)
trickButton.addEventListener('click', function() {
    const tricks = [
        "🎭 Фокус! Призрак стащил у вас 2 конфеты!",
        "🕸️ Уловка! Паутина опутала ваши конфеты!",
        "👻 Сюрприз! Привидение съело вашу конфету!",
        "💀 Неудача! Скелет забрал угощение!",
        "🔥 Ой! Ваша конфета испарилась!"
    ];
    
    const treats = [
        "🍭 Угощение! Волшебный леденец добавил 3 конфеты!",
        "🎃 Удача! Тыква подарила вам 5 конфет!",
        "👻 Щедрость! Призрак поделился 4 конфетами!",
        "🦇 Подарок! Летучие мыши принесли 2 конфеты!",
        "🍬 Сюрприз! Вы нашли спрятанные 3 конфеты!"
    ];
    
    const isTrick = Math.random() > 0.5;
    const messages = isTrick ? tricks : treats;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Изменение количества конфет
    if (isTrick && candyCount > 0) {
        candyCount -= Math.floor(Math.random() * 2) + 1;
        if (candyCount < 0) candyCount = 0;
    } else if (!isTrick) {
        candyCount += Math.floor(Math.random() * 3) + 2;
    }
    
    updateCandyCounter();
    
    // Показ сообщения в отдельном блоке
    trickMessageEl.textContent = randomMessage;
    trickMessageEl.style.color = isTrick ? '#ff4444' : '#44ff44';
    trickMessageEl.style.borderColor = isTrick ? 'rgba(255, 68, 68, 0.5)' : 'rgba(68, 255, 68, 0.5)';
    
    playSound(isTrick ? spookySound : clickSound);
    
    // Автоочистка через 4 секунды
    setTimeout(() => {
        trickMessageEl.textContent = '';
        trickMessageEl.style.borderColor = 'rgba(255, 140, 0, 0.3)';
    }, 4000);
});

// Обновление счётчика конфет
function updateCandyCounter() {
    candyCountEl.textContent = candyCount;
    
    if (candyCount === 0) {
        candyMessageEl.textContent = "😱 Конфеты закончились! Ищите угощения!";
        candyMessageEl.style.color = "#ff4444";
    } else if (candyCount < 5) {
        candyMessageEl.textContent = "😟 Мало конфет... Будьте экономны!";
        candyMessageEl.style.color = "#ffa500";
    } else if (candyCount > 20) {
        candyMessageEl.textContent = "😃 Богатый запас! Щедро угощайте!";
        candyMessageEl.style.color = "#44ff44";
    } else {
        candyMessageEl.textContent = "😊 Хватит для всех призраков!";
        candyMessageEl.style.color = "#d4af37";
    }
}

// Игра с призраком
startGameBtn.addEventListener('click', startGame);

function startGame() {
    if (gameActive || lives <= 0) return;
    
    gameActive = true;
    gameTime = 10;
    gameScore = 0;
    
    timeLeftEl.textContent = gameTime;
    scoreEl.textContent = gameScore;
    
    startGameBtn.disabled = true;
    startGameBtn.innerHTML = '<i class="fas fa-play-circle"></i> Игра идёт...';
    
    // Таймер игры
    gameTimer = setInterval(() => {
        gameTime--;
        timeLeftEl.textContent = gameTime;
        
        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);
    
    // Запуск призрака
    moveGhost();
    ghostInterval = setInterval(moveGhost, 650);
    
    playSound(gameSound);
}

function moveGhost() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    const areaWidth = gameArea.clientWidth - 80;
    const areaHeight = gameArea.clientHeight - 80;
    
    const randomX = Math.random() * areaWidth;
    const randomY = Math.random() * areaHeight;
    
    ghostEl.style.left = randomX + 'px';
    ghostEl.style.top = randomY + 'px';
}

ghostEl.addEventListener('click', function() {
    if (!gameActive) return;
    
    gameScore++;
    scoreEl.textContent = gameScore;
    
    // Анимация
    this.style.transform = 'scale(1.6) rotate(25deg)';
    this.style.filter = 'drop-shadow(0 0 25px #00ffff) brightness(1.5)';
    
    setTimeout(() => {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) brightness(1)';
    }, 200);
    
    moveGhost();
    playSound(clickSound);
});

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(ghostInterval);
    
    startGameBtn.disabled = false;
    startGameBtn.innerHTML = '<i class="fas fa-play-circle"></i> Начать охоту!';
    
    // Награда за игру
    let reward = 0;
    let message;
    
    if (gameScore >= 15) {
        message = `👑 Отлично! ${gameScore} призраков! +5 конфет и +1 жизнь!`;
        reward = 5;
        if (lives < 5) lives++;
    } else if (gameScore >= 10) {
        message = `🎯 Хорошо! ${gameScore} призраков! +3 конфеты!`;
        reward = 3;
    } else if (gameScore >= 5) {
        message = `👍 Неплохо! ${gameScore} призраков! +1 конфета!`;
        reward = 1;
    } else {
        message = `👻 Всего ${gameScore} призраков. Попробуйте ещё!`;
    }
    
    candyCount += reward;
    updateCandyCounter();
    updateLives();
    
    // Показ результата в шаре
    predictionText.innerHTML = `<div style="color: #ff8c00; font-size: 1.1rem;">${message}</div>`;
    
    setTimeout(() => {
        predictionText.innerHTML = 'Шар ждёт вашего вопроса...';
    }, 4000);
}

// Генератор предсказаний
generateMessageBtn.addEventListener('click', function() {
    const name = nameInput.value || "Смельчак";
    
    const places = ["старом замке", "заброшенном лесу", "глубоких катакомбах", "проклятом доме", "мрачном кладбище"];
    const creatures = ["призрак рыцаря", "древний вампир", "сборщик душ", "ночной охотник", "хранитель тайн"];
    const actions = ["предложит вам сделку", "раскроет древнюю тайну", "подарит магический артефакт", "испытает вашу храбрость", "предскажет ваше будущее"];
    const outcomes = ["изменит вашу судьбу", "принесёт неожиданное богатство", "откроет портал в иной мир", "наложит древнее заклятье", "дарует бессмертие"];
    
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    const message = `${name}, сегодня ночью в ${randomPlace} ${randomCreature} ${randomAction}. Это ${randomOutcome}.`;
    
    predictionText.innerHTML = `<div style="color: #9400d3; font-size: 1.1rem;">${message}</div>`;
    
    playSound(spookySound);
    
    // Автоочистка через 6 секунд
    setTimeout(() => {
        predictionText.innerHTML = 'Шар ждёт вашего вопроса...';
    }, 6000);
});

// Интерактивный подвал как в старой версии
spookyText.addEventListener('mouseover', function() {
    const spookyMessages = [
        "Буууу! Испугался? 😱",
        "За тобой кто-то следит... 👁️",
        "Тени двигаются... 👣",
        "Не оборачивайся... 💀",
        "Кто-то в твоей комнате... 👻",
        "Они идут за тобой... 🧟",
        "Шёпот из темноты... 🔥",
        "Окна закрываются сами... 🪟",
        "Зеркало показывает не тебя... 🪞",
        "Часы остановились в полночь... 🕛"
    ];
    
    const randomMessage = spookyMessages[Math.floor(Math.random() * spookyMessages.length)];
    footerMessageEl.textContent = randomMessage;
    footerMessageEl.style.color = '#ff4444';
    
    // Случайный эффект
    if (Math.random() > 0.5) {
        createSpider();
    } else {
        createBat();
    }
    
    playSound(spookySound);
});

spookyText.addEventListener('mouseout', function() {
    setTimeout(() => {
        footerMessageEl.textContent = '';
    }, 3000);
});

// Воспроизведение звука
function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Звук временно заблокирован"));
}