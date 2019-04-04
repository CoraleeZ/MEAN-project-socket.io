//------------------------------------------------------------------------------------------------------------
// <copyright file="server.js" >
//     Copyright (p) Coralee_Z All rights reserved.
// </copyright>
//------------------------------------------------------------------------------------------------------------

const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
app.use(express.static(__dirname + '/public/dist/public'));
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
const io = require('socket.io')(server);

////
app.all('*', (req, res) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});
/////////以下是变量///////
let userscore = {};
let Tops = [];
let gamer = {};
let world = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let dict = {
    0: "board",
    1: "land",
    2: "box",
    3: 'checked',
    a: 'a checked',
    b: 'b checked',
    c: 'c checked',
    d: 'd checked',
    e: 'e checked',
    f: 'f checked',
    g: 'g checked',
    h: 'h checked',
    i: 'i checked',
    j: 'j checked',
    k: 'k checked',
    l: 'l checked',
    m: 'm checked',
    n: 'n checked',
    o: 'o checked',
    p: 'p checked',
    q: 'q checked',
    r: 'r checked',
    s: 's checked',
    t: 't checked',
    u: 'u checked',
    v: 'v checked',
    w: 'w checked',
    x: 'x checked',
    y: 'y checked',
    z: 'z checked',
    '-': 'space checked'
};
let worldnew = [];
let boxinfo = {
    pokemonname: '',
    img: '',
    position: [],
};
let display = {
    pokemonname: [],
    imgAndTitle: [],
};
let count = 0;
let gamersposition = {};
let spiritesInfo = ["pikachu-zaps", "squirtle-watergun", "charmander-blaze", "bulbasaur-vine",
    "teddiursa-is-cute", "eevee-adapt", "mew-dna", "jigglypuff-sing", "meowth-scratch",
    "gengar-curse", "snorlax-snooze", "magikarp-splash", "metapod-harden", "mudkip-leik",
    "lucario-aura", "togepi-egg"
];
///////刚连接时候构造世界///
generateBox();
drawworld();
console.log('restart server!')

function generateBox() {
    boxinfo.position = [];
    let idx = Math.floor(Math.random() * spiritesInfo.length);
    boxinfo.pokemonname = spiritesInfo[idx];
    boxinfo.img = 'assets/images/inbox/' + spiritesInfo[idx] + '.gif';
    let letter = boxinfo.pokemonname.split('');
    for (let k = 0; k < letter.length; k++) {
        let point = { x: null, y: null, value: '' };
        point.x = Math.floor(Math.random() * 30 + 1);
        point.y = Math.floor(Math.random() * 8 + 1);
        if (world[point.y][point.x] != 0 || world[point.y + 1][point.x] != 0 || world[point.y - 1][point.x] != 0) {
            k -= 1;
        } else {
            point.value = letter[k];
            world[point.y][point.x] = 2;
            boxinfo.position.push(point);
            display.pokemonname.push(' ');
        };
    };
};

function drawworld() {
    for (let y = 0; y < world.length; y++) {
        let row = [];
        for (let x = 0; x < world[y].length; x++) {
            row.push(dict[world[y][x]]);
        };
        worldnew.push(row);
    };
};

function cleanOldPosition() {
    world = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
};

/////////////////////////////////////////

io.on('connection', socket => {

    socket.on('recon', data => {
        socket.emit('World', world);
        socket.emit('Worldnew', worldnew);
        socket.emit('Display', display);
        socket.emit('Boxinfo', boxinfo);
        socket.emit('TopFive', Tops);
        socket.emit('Dis_pokemonname', display.pokemonname);
        socket.emit('Dis_imgAndTitle', display.imgAndTitle);
        console.log('connect!@@')
    });

    socket.on('ImNew', data => {
        gamer[socket.id] = data.playername;
        // console.log('userscore:', userscore, "gamer:", gamer)
        msg = "Pokémon hunter " + gamer[socket.id] + ' just joined us! Welcome!';
        socket.broadcast.emit('Newplayer', msg);
    });

    socket.on('Position', data => {
        let str = {
            img: data.img,
            left: data.style.left,
            top: data.style.top
        };
        gamersposition[socket.id] = str;
        io.emit('Move', Object.values(gamersposition));
    });

    socket.on('ChangeWorld', data => {
        world[data.y][data.x] = data.boxvalue;
        worldnew[data.y][data.x] = dict[data.boxvalue];
    });

    socket.on('ChangeScore', data => {
        userscore[socket.id] = data.sco;
        // console.log('userscore after change:', userscore)
        let temp = {...userscore };
        // console.log('temp:&&&&&&&&&', temp)
        let forsort = [];
        for (let key in temp) {
            // temp[userscore[key]] = key;
            forsort.push(parseInt(temp[key]));
        }
        forsort.sort(function(a, b) { return b - a });
        if (forsort.length > 1) {
            forsort.length = 1;
        }
        // console.log('forsort', forsort);
        Tops = [];
        let eachOfTop = {};
        for (let i = 0; i < forsort.length; i++) {
            for (let k in temp) {
                if (temp[k] == forsort[i]) {
                    eachOfTop['name'] = gamer[k];
                    eachOfTop['score'] = forsort[i];
                    Tops.push(eachOfTop);
                    // console.log('gammer:', gamer)
                    // console.log('before delete', temp, 'key is', k, 'name:', gamer[k], "eachtop:", eachOfTop)
                    delete temp[k];
                    // console.log('after delete', temp)
                    break;
                }
            }
        }
        // console.log('top!!!!!', Tops)
        io.emit('TopFive', Tops);
    });

    socket.on('DisPokemonname', data => {
        display.pokemonname.splice(data.index, 1, data.value);
        // console.log('display.imgAndTitle:', display.imgAndTitle)
        // io.emit('Display', display);
        io.emit('Dis_pokemonname', display.pokemonname);
        io.emit('Dis_imgAndTitle', display.imgAndTitle);
    });

    socket.on('ChangeCount', data => {
        count++;
    });

    socket.on('CompareCount', data => {
        console.log('^^^^^^^count:', count);
        if (count == boxinfo.position.length) {
            display.pokemonname = [];
            count = 0;
            display.imgAndTitle = [{ title: boxinfo.pokemonname, url: boxinfo.img }]
            cleanOldPosition();
            generateBox();
            console.log('changeworld!!!!!');
        };
        worldnew = [];
        drawworld();
        io.emit('World', world);
        io.emit('Worldnew', worldnew);
        io.emit('Display', display);
        io.emit('Boxinfo', boxinfo);
        io.emit('Dis_pokemonname', display.pokemonname);
        io.emit('Dis_imgAndTitle', display.imgAndTitle);
    });

    socket.on('disconnect', data => {
        msg = "Hunter " + gamer[socket.id] + ' leave the team! Bye...';
        socket.broadcast.emit('Newplayer', msg);
        delete userscore[socket.id];
        delete gamer[socket.id];
        delete gamersposition[socket.id];
        io.emit('Move', Object.values(gamersposition));
        console.log('disconnet')
    });

});