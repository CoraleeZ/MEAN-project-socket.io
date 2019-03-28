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

////////////////
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
]



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
}

let worldnew = [];

let boxinfo = {
    //统一
    pokemonname: '',
    //统一
    img: '',
    //统一
    position: [],
}

let display = {
    pokemonname: [],
    imgAndTitle: [],
    // count: 0,
    // score: 0,
    // playername: ''
}
let count = 0;

let gamersposition = {}

let spiritesInfo = ["pikachu-zaps", "squirtle-watergun", "charmander-blaze", "bulbasaur-vine",
    "teddiursa-is-cute", "eevee-adapt", "mew-dna", "jigglypuff-sing", "meowth-scratch",
    "gengar-curse", "snorlax-snooze", "magikarp-splash", "metapod-harden", "mudkip-leik",
    "lucario-aura", "togepi-egg"
];


///////刚连接时候构造世界
generateBox();
drawworld();
// console.log('-------------restart server!!!!!')
// console.log('------worldnew:', worldnew)


function generateBox() {
    boxinfo.position = [];
    let idx = Math.floor(Math.random() * spiritesInfo.length);
    boxinfo.pokemonname = spiritesInfo[idx];
    boxinfo.img = './assets/images/' + spiritesInfo[idx] + '.gif';

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
            display.pokemonname.push(' ')
        };
    };
}

function drawworld() {
    for (let y = 0; y < world.length; y++) {
        let row = [];
        for (let x = 0; x < world[y].length; x++) {
            row.push(dict[world[y][x]])
        }
        worldnew.push(row)
    }
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

}


/////////////////////////////////////////



io.on('connection', socket => { //2

    // socket.emit('greeting', { msg: 'Greetings, from server Node, brought to you by Sockets! -Server' }); //3
    // socket.on('thankyou', data => { //7
    //     console.log(data.msg); //8 (note: this log will be on your server's terminal)
    // });
    ////////////////////////////////////


    socket.emit('World', world)
    socket.emit('Worldnew', worldnew)
    socket.emit('Display', display)
    socket.emit('Boxinfo', boxinfo)
        /////////////////////

    socket.on('ImNew', data => {
        gamer[socket.id] = data.playername;
        console.log(gamer);
        msg = "Welcome " + gamer[socket.id] + ' join game !'
        socket.broadcast.emit('Newplayer', msg);
    });

    socket.on('Position', data => {
        let str = {
            img: data.img,
            left: data.style.left,
            top: data.style.top
        }
        gamersposition[socket.id] = str;
        console.log('gamersposition', Object.values(gamersposition))
        io.emit('Move', Object.values(gamersposition))
    });

    socket.on('ChangeWorld', data => {
        world[data.y][data.x] = data.boxvalue;
        worldnew[data.y][data.x] = dict[data.boxvalue];
    });


    socket.on('ChangeScore', data => {
        score[socket.id] = data;
        ///发送啥？
    });


    socket.on('DisPokemonname', data => {
        display['pokemonname'].splice(data.index, 1, data.value);
        io.emit('Display', display);
    });

    socket.on('ChangeCount', data => {
        count++;
    });

    socket.on('CompareCount', data => {
        console.log('^^^^^^^count:', count)
        if (count == boxinfo.position.length) {
            console.log('changeworld!!!!!')
            display.pokemonname = [];
            count = 0;
            display.imgAndTitle = [{ title: boxinfo.pokemonname, url: boxinfo.img }]
            cleanOldPosition();
            generateBox();
        }
        worldnew = [];
        drawworld();

        io.emit('World', world)
        io.emit('Worldnew', worldnew)
        io.emit('Display', display)
        io.emit('Boxinfo', boxinfo)
    });


    socket.on('disconnect', data => {
        msg = gamer[socket.id] + ' leave the game! Bye!'
        socket.broadcast.emit('Newplayer', msg);
        delete score[socket.id];
        delete gamer[socket.id];
        delete gamersposition[socket.id];
        io.emit('Move', Object.values(gamersposition))
    });




});