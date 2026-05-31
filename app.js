const tg = window.Telegram.WebApp;

const userId =
tg.initDataUnsafe.user?.id || 1;

async function spin() {

    const bet =
    Number(
        document.getElementById("bet").value
    );

    const response =
    await fetch(
        "https://YOUR_SERVER/spin",
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
                userId,
                bet
            })
        }
    );

    const data =
    await response.json();

    if(data.error) {

        alert(data.error);
        return;
    }

    let html = "";

    data.reels.forEach(row=>{

        html += row.join(" ");

        html += "<br>";
    });

    document
        .getElementById("slot")
        .innerHTML = html;

    document
        .getElementById("balance")
        .innerText =
        "Баланс: " +
        data.balance;

    if(data.win > 0) {

        alert(
            "Выигрыш: " +
            data.win
        );
    }
}