import { Component, OnInit, OnDestroy,HostBinding, HostListener} from '@angular/core';
import { HttpService } from '../http.service'
import { generate, Observable } from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router'
import { DataService } from '../data.service';

@Component({
  selector: 'app-gamepage',
  templateUrl: './gamepage.component.html',
  styleUrls: ['./gamepage.component.css']
})
export class GamepageComponent implements OnInit {

  dict = {
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

  pokemon = {
    char:'',
    x: 0,
    y: 11,
    img: '',
    lastDir: "right",
    frame: 1,
    jumping: false,
    actionCode : [],
    style:{
      left:null,
      top:null,
    },
    walkCycle: 0,
    jumpCycle: 0,
  }

  world=[]  
  worldnew: Observable<any[]>;
  boxinfo:Observable<any>;
  positionOfBoxinfo=[];
  // display:Observable<any>;
  score=0;
  gamersposition:Observable<string[]>;
  displaypokemonname:Observable<string[]>;
  displayimgAndTitle:Observable<any[]>;
  topfive:Observable<any[]>;
  mapBg = {
    style: {
      background: null,
    }
  };
  mapBl = {
    style: {
      background: null,
    }
  };
    
  constructor(private _gamepage: HttpService,private _route: ActivatedRoute,private _data: DataService) { }

  ngOnInit() {
    this.displaypokemonname=this._gamepage.displaypokemonname;
    this.displayimgAndTitle=this._gamepage.displayimgAndTitle;
    ////
    this._gamepage.sendReConnect();
    this.topfive=this._gamepage.topfive;
    this._route.params.subscribe((params: Params) => {
      this.pokemon.char = params['pokemon'];
      //socket
      this._gamepage.sendImNew({playername:params['user']});
      this._data.changeUser('Hunter ⟿ '+params['user']);
    });
     // this.generateBox();
    this._gamepage.world.subscribe(data=>{
      this.world=data;
    });
    // this.display=this._gamepage.display;
       // this.drawworld();
    this._gamepage.boxinfo.subscribe(data=>{
      this.boxinfo=data;
    });
    this.worldnew=this._gamepage.worldnew;
    if (this.pokemon.char == "pikachu"){
      this.pokemon.walkCycle = 6;
      this.pokemon.jumpCycle = 3;
    }
    else if (this.pokemon.char == "squirtle"){
      this.pokemon.walkCycle = 6;
      this.pokemon.jumpCycle = 4;
    }
    else if (this.pokemon.char == "teddiursa"){
      this.pokemon.walkCycle = 8;
      this.pokemon.jumpCycle = 3;
    }
    else if (this.pokemon.char == "meowth") {
      this.pokemon.walkCycle = 8;
      this.pokemon.jumpCycle = 4;
    }
    this.pokemon.img = './assets/images/'+this.pokemon.char+'/walk-mirror/1.png';
    this.drawPokemon();
    setInterval(this.gravity, 75);
    ///12秒自动换地图
    setInterval(this.getBg, 12000); 
  };

  getBg=()=>{
    let possible = [{bgUrl:"url(../../assets/images/purple-cloud.gif) center / 70%",
    blockUrl:"url(../../assets/images/cloud-platform-sq.png) center / cover"}, {bgUrl:"url(../../assets/images/mountain-map.png) center / 70%",
    blockUrl:"url(../../assets/images/ground.jpg) center / cover"}, {bgUrl:"url(../../assets/images/forest.png) center / 100%",
    blockUrl:"url(../../assets/images/ground.jpg) center / cover"}, {bgUrl:"url(../../assets/images/space.png) center / 100%",
    blockUrl:"url(../../assets/images/cloud-platform-sq.png) center / cover"}, {bgUrl:"url(../../assets/images/candy.png) center / 110%",
    blockUrl:"url(../../assets/images/cloud-platform-sq.png) center / cover"}]

    let chosen = Math.floor(Math.random()*possible.length);
    this.mapBg.style.background = possible[chosen].bgUrl;
    console.log(this.mapBg.style.background);
    this.mapBl.style.background = possible[chosen].blockUrl;  
    console.log(this.mapBl.style.background);
  }


  gravity=()=> {
    let ark = 0;
    if (this.pokemon.y < 11 && this.pokemon.jumping == false && this.world[this.pokemon.y+1][this.pokemon.x]==0){   
      if (this.pokemon.actionCode.length > 1){
        // console.log(this.pokemon.actionCode);
        if(this.pokemon.actionCode.includes(37)){
          --ark;
        };
        if (this.pokemon.actionCode.includes(39)){            
          ++ark;
        };
      };
      if (this.pokemon.x + ark < this.world[0].length && this.pokemon.x + ark > 0 && this.world[this.pokemon.y+1][this.pokemon.x+ark]==0){
        this.pokemon.x += ark;
      };
      this.pokemon.y += 1;
      this.drawPokemon();
    };
    if (this.pokemon.y == 11 || this.world[this.pokemon.y+1][this.pokemon.x] !=0){
      this.pokemon.actionCode=[];
    };
  };

  drawPokemon() {
    this.pokemon.style.left=this.pokemon.x*30;
    this.pokemon.style.top=this.pokemon.y*30;
      //socket.io
    this._gamepage.sendPosition(this.pokemon);
    this.gamersposition=this._gamepage.gamersposition;
  };

  @HostListener('document:keydown',['$event'])
  onKeydown(e:KeyboardEvent) { 
    this.pokemon.actionCode.push(e.keyCode);

    if (e.keyCode == 37) {
      // console.log('trigger a key event left:',this.pokemon);
      if (this.pokemon.x>0 ) {
        this.pokemon.lastDir = "left";
        if (this.pokemon.frame < this.pokemon.walkCycle) {
          this.pokemon.frame += 1;
        }
        else {
          this.pokemon.frame = 1;
        };
        this.pokemon.x--;
        this.pokemon.img = './assets/images/'+this.pokemon.char+'/walk-cycle/' + this.pokemon.frame + '.png';
      };
      this.drawPokemon();
    };

    if (e.keyCode == 39) {
      // console.log('trigger a key event right:',this.pokemon);
      if (this.pokemon.x <30 ) {
        this.pokemon.lastDir = "right";
        if (this.pokemon.frame < this.pokemon.walkCycle) {
          this.pokemon.frame += 1;
        }
        else {
           this.pokemon.frame = 1;
        };
        this.pokemon.x++;
        this.pokemon.img = './assets/images/'+this.pokemon.char+'/walk-mirror/' + this.pokemon.frame + '.png';
      };
      this.drawPokemon();
    };
      
    if (e.keyCode == 38) {
      // console.log('trigger a key event jump:',this.pokemon);
      this.pokemon.frame = 1;
      let count = 0;
      if (this.pokemon.lastDir == "left") {
        var spriteDir = './assets/images/'+this.pokemon.char+'/jump-cycle/';
      }
      else {
        var spriteDir = './assets/images/'+this.pokemon.char+'/jump-mirror/';
      };
      let jump = () => {    
        if (this.pokemon.y>0 && this.pokemon.x<31 && this.pokemon.x>=0 && this.world[this.pokemon.y-1][this.pokemon.x]==0){    
          this.pokemon.jumping = true;
          if (this.pokemon.frame > this.pokemon.jumpCycle){
            this.pokemon.frame = this.pokemon.jumpCycle;
          }
          else if (this.pokemon.frame < this.pokemon.jumpCycle){
            this.pokemon.frame += 1;
          };
          this.pokemon.img = spriteDir + this.pokemon.frame + '.png';
          this.pokemon.y-= 1;
          this.drawPokemon();
          if (count < 3){
            ++count;
            setTimeout(jump, 75);
          }
          else{
            this.pokemon.jumping = false;
          };
        }
        else{
            //show info in the unchecked box
          if(this.pokemon.y>0 && this.world[this.pokemon.y-1][this.pokemon.x]==2){
            this.score++;
            //socket.io改变分值
            this._gamepage.sendChangeScore({sco:this.score});
            for(let g=0;g<this.boxinfo['position'].length;g++){    
              if(this.boxinfo['position'][g]['x']==this.pokemon.x && this.boxinfo['position'][g]['y']==(this.pokemon.y-1)){
                this._gamepage.sendDisPokemonname({
                  index:g,
                  value:this.boxinfo['position'][g].value
                });
                //socket.io改变world坐标点
                this._gamepage.sendChangeWorld({
                  x:this.pokemon.x,
                  y:this.pokemon.y-1,
                  boxvalue:this.boxinfo['position'][g].value
                });   
                this.world[this.pokemon.y-1][this.pokemon.x]=3;
                //socket.io改变count数值
                this._gamepage.sendChangeCount({}); 
                this._gamepage.sendCompareCount({});    
                break;
              };
            };      
          };
          this.pokemon.jumping = false;  
        };
      };
      jump();
    };
    // console.log('actioncode:', this.pokemon.actionCode)
  };


}
