// --- Инициализация Telegram WebApp (безопасно) ---
let tg;
if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.hide();
} else {
    // Запуск в обычном браузере – просто заглушка
    console.warn("Telegram WebApp not found, running in browser mode");
    tg = {
        sendData: (data) => console.log("Mock sendData:", data),
        ready: () => {}
    };
}

// --- Игровые переменные ---
let balance = 1000;
const spinCost = 10;
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const balanceSpan = document.getElementById('balance');
const spinButton = document.getElementById('spinButton');
const messageDiv = document.getElementById('message');

// Символы и их множители
const symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣'];
const multipliers = { '🍒': 2, '🍋': 3, '🍊': 4, '💎': 10, '7️⃣': 20 };

function updateUI() {
    balanceSpan.innerText = balance;
    spinButton.innerText = `🎰 Крутить (${spinCost})`;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
    let spinInterval = setInterval(() => {
        reelElements.forEach(reel => { reel.innerText = getRandomSymbol(); });
    }, 50);
    setTimeout(() => {
        clearInterval(spinInterval);
        const results = reelElements.map(reel => {
            const symbol = getRandomSymbol();
            reel.innerText = symbol;
            return symbol;
        });
        checkWin(results);
    }, 500);
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let winMessage = '';

    if (r1 === r2 && r2 === r3) {
        winAmount = spinCost * multipliers[r1];
        winMessage = `🎉 ДЖЕКПОТ! Три ${r1} - Вы выиграли ${winAmount} 🎉`;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        let matchedSymbol = r1 === r2 ? r1 : (r2 === r3 ? r2 : r3);
        winAmount = spinCost * (multipliers[matchedSymbol] / 2);
        winMessage = `✨ Выигрыш! Два ${matchedSymbol} - +${winAmount} ✨`;
    } else {
        winMessage = `😔 Повезёт в следующий раз! Выпало: ${r1} ${r2} ${r3}`;
    }

    if (winAmount > 0) {
        balance += winAmount;
    }
    updateUI();
    messageDiv.innerText = winMessage;

    // Отправка данных в бота (только если есть настоящий Telegram WebApp)
    const gameResult = {
        bet: spinCost,
        result: results.join(''),
        win: winAmount,
        new_balance: balance
    };
    tg.sendData(JSON.stringify(gameResult));
}

// --- Назначение обработчика кнопки ---
if (spinButton) {
    spinButton.addEventListener('click', () => {
        if (balance >= spinCost) {
            balance -= spinCost;
            updateUI();
            messageDiv.innerText = '🎲 Крутим...';
            spinButton.disabled = true;
            spinReels();
            setTimeout(() => { spinButton.disabled = false; }, 600);
        } else {
            messageDiv.innerText = '❌ Недостаточно средств! Обновите страницу.';
        }
    });
} else {
    console.error("Кнопка #spinButton не найдена в DOM");
}

// --- Завершаем инициализацию ---
updateUI();
tg.ready();
