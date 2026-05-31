const tg = window.Telegram.WebApp;

const userId =
tg.initDataUnsafe.user?.id || 1;

async function spin() {
  const tg = window.Telegram.WebApp;
  const userId = tg.initDataUnsafe.user.id;

  const bet = 10;

  // 1. получаем пользователя
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user || user.balance < bet) {
    alert("❌ Нет денег");
    return;
  }

  // 2. генерируем слот
  const symbols = ["🍒", "🍋", "💎", "7️⃣"];

  const r1 = symbols[Math.floor(Math.random() * symbols.length)];
  const r2 = symbols[Math.floor(Math.random() * symbols.length)];
  const r3 = symbols[Math.floor(Math.random() * symbols.length)];

  const result = r1 + r2 + r3;

  // 3. считаем выигрыш
  let win = 0;

  if (r1 === r2 && r2 === r3) {
    win = bet * 5;
  } else if (r1 === r2 || r2 === r3 || r1 === r3) {
    win = bet * 2;
  }

  // 4. обновляем баланс
  const newBalance = user.balance - bet + win;

  await supabase
    .from("users")
    .update({ balance: newBalance })
    .eq("id", userId);

  alert(`Result: ${result}\nWin: ${win}\nBalance: ${newBalance}`);
}
