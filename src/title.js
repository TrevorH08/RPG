import playerSprite from './assets/Monarch_M1.png';
import Phaser from 'phaser';
import worldTiles from './assets/Set_A_Desert1.png';
import titleMap from './assets/title.json';
import slimesprite from './assets/Slime_1.png'
import noble from './assets/Noble_M1.png';
import sprFont from './assets/sprFont.png';
import sprFontXML from './assets/sprFont.fnt';
import swish2 from './assets/swish_2.wav';
import swish4 from './assets/swish_4.wav';
import menuTheme from './assets/AlaFlair.ogg';
import {Unit} from './unit.js';
import {Enemy} from './unit.js';
import {PlayerCharacter} from './unit.js';
import {BattleScene} from './battleScene.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
import {WorldScene} from './worldscene.js';

// import startMusic from './assets/startMusic.wav';

export class StartScene extends Phaser.Scene{
  constructor(){
    super({key:'StartScene'});
  }
  preload(){
    this.load.spritesheet('player', playerSprite, {frameWidth: 16, frameHeight:20});
    this.load.image('tiles', worldTiles);
    this.load.tilemapTiledJSON('titleMap', titleMap);
    this.load.spritesheet('slime', slimesprite, {frameWidth: 16, frameHeight: 20});
    this.load.spritesheet('noble', noble, {frameWidth: 16, frameHeight:20});
    this.load.bitmapFont('sprFont', sprFont, sprFontXML);
    this.load.audio('swish2', [swish2]);
    this.load.audio('swish4', [swish4]);
    this.load.audio('menuTheme', [menuTheme]);
    // this.load.image('startBg', startBg);
    // this.load.audio('startMusic', startMusic);
  }

  create(){
    const swish2 = this.sound.add('swish2', {loop: false});
    const swish4 = this.sound.add('swish4', {loop: false});
    const menuTheme = this.sound.add('menuTheme', {loop: true});
    this.menuTheme = menuTheme;
    this.swish2 = swish2;
    this.swish4 = swish4;
    this.menuTheme.play();
    const titleBg = this.make.tilemap({key: 'titleMap'});
    const tiles = titleBg.addTilesetImage('Set_A_Desert1', 'tiles');
    const titleMap = titleBg.createLayer('Overworld', tiles, 0, 0);
    const obstacles = titleBg.createLayer('Obstacles', tiles, 0, 0);
    const ridge = titleBg.createLayer('ridge', tiles, 0, 0);
    const bridge = titleBg.createLayer('ridge-stair', tiles, 0, 0);
    const obstacleCollision = obstacles.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = 800;
    this.physics.world.bounds.height = 480;

    this.anims.create({
      key: 'playerspin',
      frames: this.anims.generateFrameNumbers('player', {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'noblespin',
      frames: this.anims.generateFrameNumbers('noble', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'slimeMove',
      frames: this.anims.generateFrameNumbers('slime', {
        frames: [0, 1, 2]
      }),
    frameRate: 8,
    repeat: -1
    });

    this.player = this.physics.add.sprite(400, 400, 'player', 6);
    this.noble = this.physics.add.sprite(450, 150, 'noble', 6);

    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, obstacles);
    this.player.body.bounce.setTo(1, 1);
    this.player.anims.play('playerspin', true);


    let directionX = (Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1))*100;
    let directionY = (Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1))*100;
    this.player.body.setVelocityX(directionX);
    this.player.body.setVelocityY(directionY);

    this.noble.setCollideWorldBounds(true);
    this.physics.add.collider(this.noble, obstacles);
    this.noble.body.bounce.setTo(1, 1);
    this.noble.anims.play('noblespin', true);

    let nobleDirectionX = (Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1))*100;
    let nobleDirectionY = (Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1))*100;
    this.noble.body.setVelocityX(nobleDirectionX);
    this.noble.body.setVelocityY(nobleDirectionY);

    this.physics.add.collider(this.noble, this.player);

    
  this.emptyTiles = obstacles.getTilesWithin().filter(function(tile){
    if(tile.index === -1){
      return true;
    }
  });

    this.slime = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite });
    for(let i = 0; i < 20; i++){
        // const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        // const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        // this.slime.get(x, y, 'slime', 6); 
        const randomTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
        const mySlime = this.slime.get(randomTile.pixelX, randomTile.pixelY, 'slime', 6);
        const randX = Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1)*30;
        const randY = Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1)*30;
        mySlime.setVelocityX(randX);
        mySlime.setVelocityY(randY);
        mySlime.setBounce(1, 1);
        mySlime.anims.play('slimeMove', true);
    }
     //this makes players and zones interact (in this case, the Spawns zone)
     //when the this.player interacts with this.spawns, it triggers this.onMeetEnemy()
    this.physics.add.overlap(this.player, this.slime, this.onMeetEnemy, false, this);
    this.physics.add.overlap(this.noble, this.slime, this.onMeetEnemy, false, this);
    this.physics.add.collider(obstacles, this.slime);
    this.physics.add.collider(this.slime, this.slime);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => this.gameStart());

    this.text = this.add.text(10, 10, "Move the mouse", {color:'#000000', fontSize:16}); //mouse cursor debug
    this.title = this.add.bitmapText(110, 125, 'sprFont', "MONARCH'S REVENGE", 60);
    this.title.setDropShadow(3, 4, "#000000");
    this.title.setCharacterTint(0, -1, true, '#ffffff');
    this.pressStart = this.add.bitmapText(230, 350, 'sprFont', "PRESS SPACE TO BEGIN", 30);
    // this.pressStart.setCharacterTint(0, -1, true, '#ffffff');
    this.time.addEvent({delay:750, callback:this.flashTitle, callbackScope:this, loop:true});
    // this.title.setFontSize(20);


  }
  flashTitle(){
    if (this.pressStart.visible === true){
      this.pressStart.visible = false;
    } else {
      this.pressStart.visible = true;
    }
  }

  onMeetEnemy(player, zone){
    const randomTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
    zone.x = randomTile.pixelX;
    zone.y = randomTile.pixelY;
    zone.setOrigin(0,0);

    const randTwo = Phaser.Math.RND.between(1, 2);
    if(randTwo === 1){
      this.swish4.play();
    } else {
      this.swish2.play();
    }

    //camera shake
    this.cameras.main.shake(100, 0.01);

    
  }
  

  gameStart(){
    this.menuTheme.pause();
    this.scene.switch('WorldScene');
  }

  update(time, delta){  //Updates mouse cursor location
    var pointer = this.input.activePointer;

    this.text.setText([
      'x: ' + pointer.x,
      'y: ' + pointer.y,
      'mid x: ' + pointer.midPoint.x,
      'mid y: ' + pointer.midPoint.y,
      'velocity x: ' + pointer.velocity.x,
      'velocity y: ' + pointer.velocity.y,
      'movementX: ' + pointer.movementX,
      'movementY: ' + pointer.movementY
    ]);
  }
}