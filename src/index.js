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
import {BattleScene} from './battleScene.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
// import desertMusic from './assets/DesertCave.wav';


export class BootScene extends Phaser.Scene{
  constructor(){
    super({
        key: 'BootScene'
    });
  }

  preload(){

  }

  create(){
    this.scene.start('WorldScene');
  }
}

export class WorldScene extends Phaser.Scene {
  constructor(){
    super({
        key: 'WorldScene'
    });
  }
  

  preload(){
    //load resources
    this.load.image('tiles', worldTiles);
    this.load.tilemapTiledJSON('map', tileMap);
    this.load.spritesheet('player', characterSprite, {frameWidth: 16, frameHeight:20});
    this.load.spritesheet('slime', slimesprite, {frameWidth: 16, frameHeight: 16});
    // this.load.audio("music", desertMusic);
  }

  create(){
    //Create world here
    // overworld1Music = this.sound.add("music", {loop: true});
    //add tile sets! they load in order
    // overworld1Music.play();
    const overworld = this.make.tilemap({key: 'map'});
    const tiles = overworld.addTilesetImage('Set_A_Desert1', 'tiles');

    const overworldMap = overworld.createLayer('Overworld', tiles, 0, 0);
    const obstacles = overworld.createLayer('Obstacles', tiles, 0, 0); //these are our collision objects
    const ridge = overworld.createLayer('ridge', tiles, 0, 0); //these are our collision objects
    const bridge = overworld.createLayer('ridge-stair', tiles, 0, 0);

    //set collision for obstacles and ridge layer
    obstacles.setCollisionByExclusion([-1]);

    //spawns player
    this.player = this.physics.add.sprite(400, 400, 'player', 6);
    //this.player.party1 = new PlayerCharacter object
    //this.player.party2 = new PlayerCharacter object

    //SET the world bounds to overworld height and width
    this.physics.world.bounds.width = overworld.widthInPixels;
    this.physics.world.bounds.height = overworld.heightInPixels;
    this.player.setCollideWorldBounds(true); //set player to collide with world bounds
    // this.physics.add.collider(this.player, obstacles); //makes player collide with obstacles
    this.cursors = this.input.keyboard.createCursorKeys();

    //set camera to stay within boundaries and follow players
    this.cameras.main.setBounds(0, 0, overworld.widthInPixels, overworld.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; //hack to prevent tile bleeding


    //animations with key left
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [3, 4, 5]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [6, 7, 8]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [9, 10, 11]
        }), 
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key:'down',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [0, 1, 2]
        }),
        frameRate: 10,
        repeat: -1
    });


    

    //spawns enemy slimes randomly
    this.slime = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
    for(let i = 0; i < 1; i++){
        const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        this.slime.get(x, y, 'slime', 6); 
        // this.physics.add.collider(this.slime, obstacles);
    }
    //this makes players and zones interact (in this case, the Spawns zone)
    //when the this.player interacts with this.spawns, it triggers this.onMeetEnemy()
    this.physics.add.overlap(this.player, this.slime, this.onMeetEnemy, false, this);

    this.sys.events.on('wake', this.wake, this);

  }
  
  wake(){
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  onMeetEnemy(player, zone){
    //moves that zone to another location
    //need to change slimes to spawn not outside the zone
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    //camera shake
    this.cameras.main.shake(300);

   //start battle
    this.scene.switch('BattleScene');
  }

  update(time, delta){
    this.player.body.setVelocity(0);
    //horizontal movement
    if (this.cursors.left.isDown){
        this.player.body.setVelocityX(-80);
    } else if (this.cursors.right.isDown){
        this.player.body.setVelocityX(80);
    }
    //vertical movement
    if (this.cursors.up.isDown){
        this.player.body.setVelocityY(-80);
    } else if (this.cursors.down.isDown){
        this.player.body.setVelocityY(80);
    }

    //movement animation
    if(this.cursors.left.isDown){
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown){
        this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown){
        this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown){
        this.player.anims.play('down', true);
    } else {
        this.player.anims.stop();
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y:0 },
        debug: true //turns on physics debugging
    }
  },
  scene: [
    BootScene,
    WorldScene,
    BattleScene,
    UIScene
  ]
};

const game = new Phaser.Game(config);





