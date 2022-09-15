import Phaser from 'phaser';
import worldTiles from './assets/Set_A_Desert1.png';
import tileMap from './assets/RPG-Map-1-embed.json';
import greenslime from './assets/02_SmallSlime_A.png';
import redslime from './assets/02_SmallSlime_B.png';
import slimesprite from './assets/Slime_1.png'
import characterSprite from './assets/Monarch_M1.png';
import noble from './assets/Noble_M1.png';
import {Unit} from './unit.js';
import {Enemy} from './unit.js';
import {PlayerCharacter} from './unit.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
import battleMusic from './assets/DesertCaveBattle.wav';
import swish2 from './assets/swish_2.wav';
import swish4 from './assets/swish_4.wav';

export class BattleScene extends Phaser.Scene{
  constructor(){
    super({
      key: 'BattleScene'
    });
  }

  preload(){
    this.load.image('greenSlime', greenslime);
    this.load.image('redSlime', redslime);
    this.load.spritesheet('noble', noble, {frameWidth:16, frameHeight:21});
	  this.load.spritesheet('monarch', characterSprite, {frameWidth:16, frameHeight:21});
    this.load.audio('battleMusic', [battleMusic]);
    this.load.audio('swish2', [swish2]);
    this.load.audio('swish4', [swish4]);
  }

  exitBattle(){
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  create(arguement){
    console.log('battle scene created')
    console.log(arguement)
    this.health = arguement;
    const swish2 = this.sound.add('swish2', {loop: false});
    this.swish2 = swish2;
    const battleMusic = this.sound.add('battleMusic', {loop: true});
    this.battleMusic = battleMusic;
    battleMusic.play();
    console.log("battle scene create");
    console.log("party 1 " + this.party1);
    console.log("party 2 " + this.party2);
    // change the background to tan
    this.cameras.main.setBackgroundColor('rgba(210, 180, 140, 0.5)');
    console.log("hi youtube")
    this.startBattle();
    console.log("remember to like comment and subscribe")
    this.sys.events.on('wake', this.startBattle, this);

  }

  nextTurn(){
    if(this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      //currently active unit 
      this.index++;
      //if there are no more units, we start again from the first one
      if(this.index >= this.units.length){ 
        this.index = 0;
      }
    } while (!this.units[this.index].living);
   

    if(this.units[this.index] instanceof PlayerCharacter){ //if it is a player hero
      this.events.emit('PlayerSelect', this.index);
    } else { //if it's an enemy 
      let r; //pick a random hero to be attacked 
      do{
        r = Math.floor(Math.random() * this.heroes.length);
      } while(!this.heroes[r].living);
      this.units[this.index].attack(this.heroes[r]); //call the enemy's attack function on that hero
      this.time.addEvent({delay: 2500, callback: this.nextTurn, callbackScope: this}); //add timer before next turn for smooth gameplay
    }
  }

  checkEndBattle(){
    let victory = true; 

    //If all enemies dead => Victory! 
    for(let i=0; i < this.enemies.length; i++){
      if(this.enemies[i].living){
        victory = false; 
      } 
    }
    let gameOver = true; 
    // If all heroes are dead => Game Over! 
    for(let i=0; i < this.heroes.length; i++){
      if(this.heroes[i].living){
        gameOver = false; 
      }
    } 
    return victory || gameOver; 
  } 

  startBattle(argument){
    console.log('start battle');
    console.log(argument);
    this.battleMusic.play();
    const monarch = new PlayerCharacter(this, 600, 100, 'monarch', 3, 'Monarch', this.health, 20);
    const noble = new PlayerCharacter(this, 600, 200, 'noble', 3, 'Noble', 80, 8);
    const slime1 = new Enemy(this, 200, 100, 'greenSlime', null, 'Green Slime', 2, 3);
    const slime2 = new Enemy(this, 160, 200, 'redSlime', null,'Red Slime', 2, 3);
    this.add.existing(monarch); //we'll keep this line tho
    console.log(monarch.hp);
    this.add.existing(noble);
    this.add.existing(slime1);
    this.add.existing(slime2);
    // array with heroes
    this.heroes = [ monarch, noble ];
    // array with enemies
    this.enemies = [ slime1, slime2 ];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);
    
    this.index = -1; // currently active unit
    
    this.scene.run("UIScene");
  }
  
  endBattle(){
    //Clear st8, remove sprites 
    this.heroes.length = 0; 
    this.enemies.length = 0; 
    for (let i=0; i < this.units.length; i++){
      //link item 
      this.units[i].destroy(); 
    }
    this.units.length = 0; 
    //Sleep the UI 
    this.scene.sleep('UIScene');
    //Return to WorldScene and sleep current BattleScene 
    this.scene.switch('WorldScene', /*{arg:'teststring'}/*, this.monarch.hp*/); //DO WE NEED TO SEND OUT THE HP HERE?
    this.battleMusic.pause();
  } 

  receivePlayerSelection(action, target){
    if(action === 'attack'){
      this.units[this.index].attack(this.enemies[target]);
    } else {
      console.log(action)
    }
    this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
  } 

  wake(){
    console.log('battle wake');
    this.scene.run('UIScene');
    //this.time.addEvent({delay: 2000, callback:this.exitBattle, callbackScope: this});
  }
}

