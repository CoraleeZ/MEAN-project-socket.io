const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 8000;
app.use(express.static(__dirname + '/public/dist/public'));
const server = http.listen(port, () => console.log(`Server is running on port ${port}`));
const io = require('socket.io')(server);

////
app.all('*', (req, res) => {
    res.sendFile(__dirname + '/public/dist/public/index.html');
});
/////////以下是变量///////
let gamer = {};
let score = {};
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
    //统一
    pokemonname: '',
    //统一
    img: '',
    //统一
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

function generateBox() {
    boxinfo.position = [];
    let idx = Math.floor(Math.random() * spiritesInfo.length);
    boxinfo.pokemonname = spiritesInfo[idx];
    boxinfo.img = './assets/images/inbox/' + spiritesInfo[idx] + '.gif';
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

    socket.emit('World', world);
    socket.emit('Worldnew', worldnew);
    socket.emit('Display', display);
    socket.emit('Boxinfo', boxinfo);
    /////////////////////
    socket.on('ImNew', data => {
        gamer[socket.id] = data.playername;
        // console.log(gamer);
        msg = "Sprite hunter" + gamer[socket.id] + ' just joined team! Welcome!';
        socket.broadcast.emit('Newplayer', msg);
    });

    socket.on('Position', data => {
        let str = {
            img: data.img,
            left: data.style.left,
            top: data.style.top
        };
        gamersposition[socket.id] = str;
        // console.log('gamersposition', Object.values(gamersposition));
        io.emit('Move', Object.values(gamersposition));
    });

    socket.on('ChangeWorld', data => {
        world[data.y][data.x] = data.boxvalue;
        worldnew[data.y][data.x] = dict[data.boxvalue];
    });

    socket.on('ChangeScore', data => {
        score[socket.id] = data;
        let temp = score;
        let forsort = [];
        for (let key in temp) {
            // temp[score[key]] = key;
            forsort.push(parseInt(temp[key]));
        }
        forsort.sort(function(a, b) { return b - a });
        if (forsort.length > 5) {
            forsort.length = 5;
        }
        let Tops = [];
        let eachOfTop = {};
        for (let idx = 0; idx < forsort.length; idx++) {
            for (let k in temp) {
                if (temp[k] == forsort[idx]) {
                    eachOfTop['name'] = gamer[k];
                    eachOfTop['score'] = forsort[idx];
                    Tops.push(eachOfTop);
                    delete temp[k];
                }
            }
        }
        console.log('top!!!!!', Tops)
        io.emit('TopFive', Tops);
    });

    socket.on('DisPokemonname', data => {
        display.pokemonname.splice(data.index, 1, data.value);
        // console.log('display.imgAndTitle:', display.imgAndTitle)
        io.emit('Display', display);
    });

    socket.on('ChangeCount', data => {
        count++;
    });

    socket.on('CompareCount', data => {
        console.log('^^^^^^^count:', count);
        if (count == boxinfo.position.length) {
            console.log('changeworld!!!!!');
            display.pokemonname = [];
            count = 0;
            display.imgAndTitle = [{ title: boxinfo.pokemonname, url: boxinfo.img }]
            cleanOldPosition();
            generateBox();
        };
        worldnew = [];
        drawworld();
        io.emit('World', world);
        io.emit('Worldnew', worldnew);
        io.emit('Display', display);
        io.emit('Boxinfo', boxinfo);
    });

    socket.on('disconnect', data => {
        msg = "Hunter " + gamer[socket.id] + ' leave the team! Bye...';
        socket.broadcast.emit('Newplayer', msg);
        delete score[socket.id];
        delete gamer[socket.id];
        delete gamersposition[socket.id];
        io.emit('Move', Object.values(gamersposition));
    });

});