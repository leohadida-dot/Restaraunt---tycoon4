const SAVE_NAME = "leoRestaurantTycoon";

let game = {
money: 10000,
customers: 0,
rating: 4,
level: 1,
xp: 0,
xpMax: 100,
day: 1,
timer: 60,
open: false,
todayCustomers: 0,
todayRevenue: 0,
revenue: 0,
foodCosts: 0,
staffCosts: 0,
chefs: 1,
waiters: 1,
tables: 3,
locations: 1,

```
menu: {
    burger: true,
    fries: true,
    drink: true,
    pizza: false,
    tacos: false,
    pasta: false
},

upgrades: {
    tables: 0,
    kitchen: 0,
    marketing: 0
},

news: [
    "Welcome to Leo's Restaurant Tycoon!"
]
```

};

var restaurantTimer = null;
var clockTimer = null;

/* FOOD */

var foods = {
burger: {
name: "🍔 Classic Burger",
price: 14,
cost: 4
},

```
fries: {
    name: "🍟 Fries",
    price: 6,
    cost: 1
},

drink: {
    name: "🥤 Soft Drink",
    price: 5,
    cost: 1
},

pizza: {
    name: "🍕 Pizza",
    price: 19,
    cost: 5
},

tacos: {
    name: "🌮 Tacos",
    price: 17,
    cost: 4
},

pasta: {
    name: "🍝 Pasta",
    price: 24,
    cost: 7
}
```

};

/* LOCATIONS */

var locations = [
{
name: "🏙️ City Centre",
price: 0,
multiplier: 1
},

```
{
    name: "🏖️ Beachfront",
    price: 15000,
    multiplier: 1.3
},

{
    name: "🏬 Mega Mall",
    price: 35000,
    multiplier: 1.6
},

{
    name: "✈️ Airport",
    price: 75000,
    multiplier: 2
},

{
    name: "🗼 Tokyo",
    price: 250000,
    multiplier: 3
}
```

];

/* UPGRADES */

var upgrades = {
tables: {
name: "🪑 More Tables",
description: "Serve more customers.",
base: 1500
},

```
kitchen: {
    name: "🔥 Better Kitchen",
    description: "Increase income from customers.",
    base: 2500
},

marketing: {
    name: "📣 Marketing",
    description: "Attract more customers.",
    base: 3000
}
```

};

/* SAVE GAME */

function saveGame() {
localStorage.setItem(
SAVE_NAME,
JSON.stringify(game)
);
}

/* LOAD GAME */

function loadGame() {

```
var saved = localStorage.getItem(SAVE_NAME);

if (!saved) {
    return;
}

try {

    var data = JSON.parse(saved);

    game.money = data.money || game.money;
    game.customers = data.customers || 0;
    game.rating = data.rating || 4;
    game.level = data.level || 1;
    game.xp = data.xp || 0;
    game.xpMax = data.xpMax || 100;
    game.day = data.day || 1;
    game.timer = data.timer || 60;
    game.open = false;

    game.todayCustomers = 0;
    game.todayRevenue = 0;

    game.revenue = data.revenue || 0;
    game.foodCosts = data.foodCosts || 0;
    game.staffCosts = data.staffCosts || 0;

    game.chefs = data.chefs || 1;
    game.waiters = data.waiters || 1;
    game.tables = data.tables || 3;
    game.locations = data.locations || 1;

    if (data.menu) {
        game.menu = data.menu;
    }

    if (data.upgrades) {
        game.upgrades = data.upgrades;
    }

    if (data.news) {
        game.news = data.news;
    }

} catch (error) {

    console.log("Could not load save.");

}
```

}

/* PAGE SWITCHING */

function showPage(pageName) {

```
var pages = document.querySelectorAll(".page");

for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
}

var page = document.getElementById(pageName);

if (page) {
    page.classList.add("active");
}
```

}

/* MONEY */

function money(value) {

```
return "$" + Math.floor(value).toLocaleString();
```

}

/* TEXT */

function setText(id, value) {

```
var element = document.getElementById(id);

if (element) {
    element.textContent = value;
}
```

}

/* MESSAGE */

function toast(message) {

```
var container = document.getElementById("toast");

if (!container) {
    return;
}

var box = document.createElement("div");

box.className = "toast";

box.textContent = message;

container.appendChild(box);

setTimeout(function () {
    box.remove();
}, 2500);
```

}

/* UPDATE GAME */

function update() {

```
setText("money", money(game.money));
setText("homeMoney", money(game.money));

setText("customers", game.customers);

setText(
    "rating",
    game.rating.toFixed(1)
);

setText("level", game.level);

setText("xp", game.xp);
setText("xpMax", game.xpMax);

setText(
    "todayCustomers",
    game.todayCustomers
);

setText(
    "todayRevenue",
    money(game.todayRevenue)
);

setText("day", game.day);
setText("restaurantDay", game.day);

setText("timer", game.timer);

setText("served", game.todayCustomers);

setText("tableNumber", game.tables);

setText("chefNumber", game.chefs);

setText("waiterNumber", game.waiters);

setText(
    "chefDisplay",
    game.chefs + " Chef" +
    (game.chefs === 1 ? "" : "s")
);

setText("revenue", money(game.revenue));

setText(
    "foodCosts",
    money(game.foodCosts)
);

setText(
    "staffCosts",
    money(game.staffCosts)
);

var profit =
    game.revenue -
    game.foodCosts -
    game.staffCosts;

setText(
    "profit",
    money(profit)
);


var xpBar =
    document.getElementById("xpBar");

if (xpBar) {

    xpBar.style.width =
        Math.min(
            100,
            (game.xp / game.xpMax) * 100
        ) + "%";
}


var openButton =
    document.getElementById("openButton");

if (openButton) {

    openButton.textContent =
        game.open
            ? "🔴 CLOSE RESTAURANT"
            : "🟢 OPEN RESTAURANT";
}


setText(
    "status",
    game.open
        ? "🟢 OPEN"
        : "🔴 CLOSED"
);


renderTables();
renderMenu();
renderStaff();
renderUpgrades();
renderLocations();
renderNews();
```

}

/* TABLES */

function renderTables() {

```
var container =
    document.getElementById("tables");

if (!container) {
    return;
}

container.innerHTML = "";


for (
    var i = 0;
    i < game.tables;
    i++
) {

    var table =
        document.createElement("div");

    table.className = "table";

    table.textContent = "🪑";


    var column = i % 4;

    var row = Math.floor(i / 4);


    table.style.left =
        (28 + column * 17) + "%";

    table.style.top =
        (18 + row * 30) + "%";


    container.appendChild(table);
}
```

}

/* MENU */

function renderMenu() {

```
var menu =
    document.getElementById("menu");

if (!menu) {
    return;
}

menu.innerHTML = "";


for (var key in game.menu) {

    if (!game.menu[key]) {
        continue;
    }

    var food = foods[key];

    var row =
        document.createElement("p");

    var name =
        document.createElement("span");

    var price =
        document.createElement("b");

    name.textContent = food.name;

    price.textContent = money(food.price);

    row.appendChild(name);
    row.appendChild(price);

    menu.appendChild(row);
}
```

}

/* STAFF */

function renderStaff() {

```
var grid =
    document.getElementById("staffGrid");

if (!grid) {
    return;
}

grid.innerHTML = "";


var chefPrice =
    1000 + game.chefs * 500;

var waiterPrice =
    700 + game.waiters * 350;


createStaffCard(
    grid,
    "👨‍🍳",
    "Chef",
    game.chefs,
    chefPrice,
    "Chefs help your restaurant serve customers.",
    hireChef
);


createStaffCard(
    grid,
    "🧑‍💼",
    "Waiter",
    game.waiters,
    waiterPrice,
    "Waiters help bring in more customers.",
    hireWaiter
);
```

}

function createStaffCard(
grid,
icon,
name,
amount,
price,
description,
action
) {

```
var card =
    document.createElement("div");


var iconBox =
    document.createElement("div");

iconBox.style.fontSize = "42px";

iconBox.textContent = icon;


var title =
    document.createElement("h3");

title.textContent = name;


var descriptionBox =
    document.createElement("p");

descriptionBox.textContent =
    description;


var amountBox =
    document.createElement("p");

amountBox.textContent =
    "Current: " + amount;


var button =
    document.createElement("button");

button.textContent =
    "Hire for " + money(price);

if (game.money >= price) {
    button.className = "buy";
}

button.onclick = action;


card.appendChild(iconBox);
card.appendChild(title);
card.appendChild(descriptionBox);
card.appendChild(amountBox);
card.appendChild(button);

grid.appendChild(card);
```

}

/* CHEF */

function hireChef() {

```
var price =
    1000 + game.chefs * 500;


if (game.money < price) {

    toast("❌ You need more money!");

    return;
}


game.money -= price;

game.chefs++;


toast("👨‍🍳 New chef hired!");

addNews("👨‍🍳 You hired a new chef.");


saveGame();

update();
```

}

/* WAITER */

function hireWaiter() {

```
var price =
    700 + game.waiters * 350;


if (game.money < price) {

    toast("❌ You need more money!");

    return;
}


game.money -= price;

game.waiters++;


toast("🧑‍💼 New waiter hired!");

addNews("🧑‍💼 You hired a new waiter.");


saveGame();

update();
```

}

/* UPGRADES */

function renderUpgrades() {

```
var grid =
    document.getElementById("upgradeGrid");

if (!grid) {
    return;
}

grid.innerHTML = "";


for (var key in upgrades) {

    var upgrade = upgrades[key];

    var level =
        game.upgrades[key];


    var price =
        Math.floor(
            upgrade.base *
            Math.pow(1.6, level)
        );


    var card =
        document.createElement("div");


    var icon =
        document.createElement("div");

    icon.style.fontSize = "40px";

    icon.textContent =
        upgrade.name.split(" ")[0];


    var title =
        document.createElement("h3");

    title.textContent =
        upgrade.name.substring(
            upgrade.name.indexOf(" ") + 1
        );


    var description =
        document.createElement("p");

    description.textContent =
        upgrade.description;


    var levelBox =
        document.createElement("p");

    levelBox.textContent =
        "Level: " + level;


    var button =
        document.createElement("button");

    button.textContent =
        "Upgrade for " + money(price);


    if (game.money >= price) {
        button.className = "buy";
    }


    button.onclick =
        function (upgradeKey) {

            return function () {
                buyUpgrade(upgradeKey);
            };

        }(key);


    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(levelBox);
    card.appendChild(button);

    grid.appendChild(card);
}
```

}

/* BUY UPGRADE */

function buyUpgrade(key) {

```
var upgrade = upgrades[key];

var level =
    game.upgrades[key];


var price =
    Math.floor(
        upgrade.base *
        Math.pow(1.6, level)
    );


if (game.money < price) {

    toast("❌ Not enough money!");

    return;
}


game.money -= price;

game.upgrades[key]++;


if (key === "tables") {
    game.tables += 2;
}


if (key === "kitchen") {

    game.rating =
        Math.min(
            5,
            game.rating + 0.15
        );
}


if (key === "marketing") {

    game.rating =
        Math.min(
            5,
            game.rating + 0.1
        );
}


toast("⬆️ Upgrade purchased!");

addNews(
    "⬆️ " + upgrade.name + " upgraded!"
);


saveGame();

update();
```

}

/* LOCATIONS */

function renderLocations() {

```
var grid =
    document.getElementById("locationGrid");

if (!grid) {
    return;
}

grid.innerHTML = "";


for (
    var index = 0;
    index < locations.length;
    index++
) {

    var location =
        locations[index];


    var owned =
        index < game.locations;


    var current =
        index === game.locations - 1;


    var card =
        document.createElement("div");


    var icon =
        document.createElement("div");

    icon.style.fontSize = "42px";

    icon.textContent =
        location.name.split(" ")[0];


    var title =
        document.createElement("h3");

    title.textContent =
        location.name.substring(
            location.name.indexOf(" ") + 1
        );


    var description =
        document.createElement("p");

    description.textContent =
        "Customer income ×" +
        location.multiplier;


    var button =
        document.createElement("button");


    if (current) {

        button.textContent =
            "📍 CURRENT LOCATION";

        button.disabled = true;

    } else if (owned) {

        button.textContent =
            "✅ OWNED";

        button.disabled = true;

    } else {

        button.textContent =
            "Buy for " +
            money(location.price);


        if (game.money >= location.price) {
            button.className = "buy";
        }


        button.onclick =
            function (locationIndex) {

                return function () {
                    buyLocation(locationIndex);
                };

            }(index);
    }


    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);

    grid.appendChild(card);
}
```

}

/* BUY LOCATION */

function buyLocation(index) {

```
var location =
    locations[index];


if (index < game.locations) {
    return;
}


if (game.money < location.price) {

    toast("❌ Not enough money!");

    return;
}


game.money -= location.price;

game.locations++;


toast(
    "🌎 " +
    location.name +
    " unlocked!"
);


addNews(
    "🌎 You opened " +
    location.name
);


saveGame();

update();
```

}

/* OPEN RESTAURANT */

function openRestaurant() {

```
if (game.open) {
    return;
}


game.open = true;

game.timer = 60;


toast(
    "🟢 YOUR RESTAURANT IS OPEN!"
);


addNews(
    "🟢 Restaurant opened for business."
);


restaurantTimer =
    setInterval(
        serveCustomers,
        2000
    );


clockTimer =
    setInterval(
        restaurantClock,
        1000
    );


saveGame();

update();
```

}

/* CLOSE RESTAURANT */

function closeRestaurant() {

```
game.open = false;


clearInterval(
    restaurantTimer
);

clearInterval(
    clockTimer
);


restaurantTimer = null;

clockTimer = null;


toast(
    "🔴 Restaurant closed."
);


saveGame();

update();
```

}

/* TOGGLE */

function toggleRestaurant() {

```
if (game.open) {
    closeRestaurant();
} else {
    openRestaurant();
}
```

}

/* CLOCK */

function restaurantClock() {

```
if (!game.open) {
    return;
}


game.timer--;


if (game.timer <= 0) {
    finishDay();
}


update();
```

}

/* FINISH DAY */

function finishDay() {

```
clearInterval(
    restaurantTimer
);

clearInterval(
    clockTimer
);


restaurantTimer = null;

clockTimer = null;


game.open = false;


var target =
    15 + game.day * 5;


if (
    game.todayCustomers >= target
) {

    var bonus =
        500 + game.day * 100;


    game.money += bonus;


    toast(
        "🎯 Daily goal complete! +" +
        money(bonus)
    );

} else {

    toast(
        "📅 Day complete!"
    );
}


game.day++;

game.timer = 60;

game.todayCustomers = 0;

game.todayRevenue = 0;


saveGame();

update();
```

}

/* SERVE CUSTOMERS */

function serveCustomers() {

```
if (!game.open) {
    return;
}


var amount =
    1 +
    Math.floor(
        Math.random() *
        (
            1 +
            game.waiters +
            game.upgrades.marketing
        )
    );


if (amount > 8) {
    amount = 8;
}


var location =
    locations[
        Math.min(
            game.locations - 1,
            locations.length - 1
        )
    ];


var menuItems = [];


for (var key in game.menu) {

    if (game.menu[key]) {
        menuItems.push(key);
    }
}


if (menuItems.length === 0) {
    return;
}


var revenue = 0;

var cost = 0;


for (
    var i = 0;
    i < amount;
    i++
) {

    var randomIndex =
        Math.floor(
            Math.random() *
            menuItems.length
        );


    var food =
        foods[
            menuItems[randomIndex]
        ];


    revenue += food.price;

    cost += food.cost;
}


revenue *= location.multiplier;

revenue *=
    1 +
    game.upgrades.kitchen * 0.1;

revenue *=
    1 +
    game.rating * 0.02;


var staffCost =
    game.chefs * 2 +
    game.waiters * 1.5;


var profit =
    revenue -
    cost -
    staffCost;


/* NEVER REMOVE CASH DURING SERVICE */

if (profit > 0) {
    game.money += profit;
}


game.customers += amount;

game.todayCustomers += amount;

game.todayRevenue += revenue;

game.revenue += revenue;

game.foodCosts += cost;

game.staffCosts += staffCost;

game.xp += amount * 5;


checkLevelUp();

addCustomerAnimation();


saveGame();

update();
```

}

/* LEVEL UP */

function checkLevelUp() {

```
while (
    game.xp >= game.xpMax
) {

    game.xp -= game.xpMax;

    game.level++;


    game.xpMax =
        Math.floor(
            game.xpMax * 1.4
        );


    var bonus =
        game.level * 500;


    game.money += bonus;


    toast(
        "🏆 LEVEL " +
        game.level +
        "! +" +
        money(bonus)
    );


    addNews(
        "🏆 You reached Level " +
        game.level + "!"
    );
}
```

}

/* CUSTOMER ANIMATION */

function addCustomerAnimation() {

```
var area =
    document.getElementById("people");


if (!area) {
    return;
}


var person =
    document.createElement("div");


person.className =
    "customer";


var people = [
    "🧑",
    "👨",
    "👩",
    "🧒"
];


person.textContent =
    people[
        Math.floor(
            Math.random() *
            people.length
        )
    ];


area.appendChild(person);


setTimeout(
    function () {
        person.remove();
    },
    2500
);
```

}

/* NEWS */

function addNews(message) {

```
game.news.unshift(message);

game.news =
    game.news.slice(0, 8);


renderNews();
```

}

function renderNews() {

```
var news =
    document.getElementById("news");


if (!news) {
    return;
}


news.innerHTML = "";


for (
    var i = 0;
    i < game.news.length;
    i++
) {

    var p =
        document.createElement("p");

    p.textContent =
        game.news[i];

    news.appendChild(p);
}
```

}

/* START */

loadGame();

update();

/* AUTOSAVE */

setInterval(
saveGame,
10000
);
