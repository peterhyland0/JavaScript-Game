let canvas;
let context;

let request_id;
let fpsInterval = 1000 / 30; // the denominator is fps
let now;
let then = Date.now();

let player = {
    x : 0,
    y : 0,
    width : 48,
    height : 64,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0,
    
};

let score = 0;

let xhttp;

let liked_count_element;

let meatball = [];

let fruits = [];

let floor;

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

let a = {
    x : 250,
    y : 150,
    size : 10,
    xChange : randint(-10, 10),
    yChange : randint(-10, 10)
}



let background = [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,46,47,-1,-1,-1,-1,-1,46,47,-1,-1,-1,-1,-1,-1,-1,46,47,-1,-1,-1,46,47,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,46,47,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,46,47,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,46,47,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
];

let tilesPerRow = 6;
let tileSize = 16;

let IMAGES = {player: "https://cs1.ucc.ie/~pcjh1/cgi-bin/ca2/run.py/static/maid.png", 
meatball: "https://cs1.ucc.ie/~pcjh1/cgi-bin/ca2/run.py/static/meatball.png", 
fruits: "https://cs1.ucc.ie/~pcjh1/cgi-bin/ca2/run.py/static/fruits.png", 
background: "https://cs1.ucc.ie/~pcjh1/cgi-bin/ca2/run.py/static/tiles.png"};

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");


    floor = canvas.height - 27;
    player.x = canvas.width / 2;
    player.y = floor - player.height;
    

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

   load_images(draw);
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    // draw background on canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#87cefa"; // light blue sky
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < 20; r += 1) {
        for (let c = 0; c < 32; c += 1) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(IMAGES.background,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }
    // draw player
    context.fillStyle = "red";
    context.drawImage(IMAGES.player,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight) && ! (moveLeft && moveRight) && ! player.in_air) {
        player.frameX = (player.frameX + 1) % 3;
    }

    // draw other objects
    if (meatball.length < 10) {
        let a = {
            x : randint(0, canvas.width),
            y : 0,
            size : randint(5, 15), 
            xChange : 0,
            yChange : randint(1, 10),
        };
        meatball.push(a);
    }
    // meatballs
    context.fillStyle = "yellow";
    // context.drawImage(IMAGES.meatball ,a.x, a.y, a.size, a.size);
    for (let a of meatball) {
        context.fillRect(a.x, a.y, a.size, a.size);
        context.drawImage(IMAGES.meatball ,a.x, a.y, a.size, a.size);
    }
    

    
    
    console.log(canvas.height)
    for (let a of meatball) {
        if (player_colloids(a)) {
            console.log(player, a);
            stop("Your score: " + score);
            return;
        }    
    }
    
    for (let a of meatball) {
        if (a.y+32 + a.size > canvas.height) {
            a.y = -a.size;
            a.x = randint(0, canvas.width);
        } else {
            a.x = a.x + a.xChange;
            a.y = a.y + a.yChange;
        }
    }
   
    // Fruit
    if (fruits.length < 3) {
        let fruit = {
            x : randint(0, canvas.width),
            y : 0,
            size : randint(5, 15), 
            xChange : 0,
            yChange : randint(10, 1),
            notCollided: true
        };
        fruits.push(fruit);
    }
    // fruit
    context.fillStyle = "green";
    // context.drawImage(IMAGES.fruit ,a.x, a.y, a.size, a.size);
    for (let fruit of fruits) {
        context.fillRect(fruit.x, fruit.y, fruit.size, fruit.size);
        context.drawImage(IMAGES.fruits,fruit.x, fruit.y, fruit.size, fruit.size);
            console.log("collided or not", fruit.notCollided);
            if (player_colloids_fruit(fruit) && fruit.notCollided) {
                // alert("fruit")
                console.log("collided fruit")
                score++ 
                fruit.notCollided = false
            }
    }
    
    for (let fruit of fruits) {
        if (fruit.y+32 + fruit.size > canvas.height) {
            fruit.y = -fruit.size;
            fruit.x = randint(0, canvas.width);
        } else{
            fruit.x = fruit.x + fruit.xChange;
            fruit.y = fruit.y + fruit.yChange;
        }
    }
    

    // handle key presses
    if (moveLeft) {
        player.xChange = player.xChange - 0.5;
        player.frameY = 3;
    }
    if (moveRight) {
        player.xChange = player.xChange + 0.5;
        player.frameY = 1;
    }
    
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // physics
    player.yChange = player.yChange + 1.5; // gravity
    player.xChange = player.xChange * 0.9; // friction
    player.yChange = player.yChange * 0.9; // friction

    // collisions
    if (player.y + player.height > floor) {
        player.in_air = false;
        player.y = floor - player.height;
        player.yChange = 0;
    }
    // going left or right
    if (player.x + player.width < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = -player.width;
    }
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

  

function activate(event) {
    let key = event.key;
    if (key ==="ArrowLeft") {
        moveLeft = true;
    } else if (key ==="ArrowUp") {
        moveUp = true;
    } else if (key ==="ArrowRight") {
        moveRight = true;
    } else if (key ==="ArrowDown") {
        moveDown = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key ==="ArrowLeft") {
        moveLeft = false;
    } else if (key ==="ArrowUp") {
        moveUp = false;
    } else if (key ==="ArrowRight") {
        moveRight = false;
    } else if (key ==="ArrowDown") {
        moveDown = false;
    }
}



function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images -1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img; 
    }
}
function player_colloids(a) {
    if (player.x-10 + player.width < a.x ||
        a.x-20 + a.size < player.x ||
        player.y > a.y-10 + a.size ||
        a.y-30 > player.y + player.width) {
        return false;
    } else {
        return true;
    }
}

function player_colloids_fruit(fruit) {
    if (player.x-10 + player.width < fruit.x ||
        fruit.x-20 + fruit.size < player.x ||
        player.y > fruit.y-10 + fruit.size ||
        fruit.y-30 > player.y + player.width) {
        return false;
    } else {
        return true;
    }
}

function stop(outcome) {
    // alert(outcome)
    window.cancelAnimationFrame(request_id)
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = outcome;

    let data = new FormData();
    data.append("score", score);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/store_score", true);
    xhttp.send(data);
}

function handle_response() {
    if ( xhttp.readyState === 4 ) {

        if ( xhttp.status === 200 ) {

            if ( xhttp.responseText === "success" ) {
                // score was successfully stored in database
            } else {
                // score was not successfully stored in database
            }
        }
    }
}

function update_liked_count() {
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response2, false);

    xhttp.addEventListener("GET", "/get_num_likes", true);
    xhttp.send(null);
}

function handle_response2() {
    if ( xhttp.readyState === 4 ) {

        if ( xhttp.status === 200 ) {
            let response = JSON.parse(xhttp.responseText)
            liked_count_element.innerHTML = response.count
        }
    }
}
