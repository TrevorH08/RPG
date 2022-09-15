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
import {SewerScene} from './sewerScene.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
import desertMusic from './assets/DesertCave.wav';


export class StartScene extends Phaser.Scene{
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
    this.load.audio('music', [desertMusic]);
  }

  create(arguement){
    //Create world here
    console.log("create function ran")
    const overworld1Music = this.sound.add('music', {loop: true});
    this.overworld1Music = overworld1Music;
    if (!this.health) { 
      this.health = 90
    }
    
    //add tile sets! they load in order
    this.overworld1Music.play();
    const overworld = this.make.tilemap({key: 'map'});
    const tiles = overworld.addTilesetImage('Set_A_Desert1', 'tiles');

    const overworldMap = overworld.createLayer('Overworld', tiles, 0, 0);
    const obstacles = overworld.createLayer('Obstacles', tiles, 0, 0); //these are our collision objects
    const ridge = overworld.createLayer('ridge', tiles, 0, 0); //these are our collision objects
    const bridge = overworld.createLayer('ridge-stair', tiles, 0, 0);
    const sewerWarp = overworld.createLayer('sewer_warp', tiles, 0, 0);

    //set collision for obstacles and ridge layer
    obstacles.setCollisionByExclusion([-1]);

    //spawns player
    // // this.party = object//pseudocode
    this.player = this.physics.add.sprite(400, 400, 'player', 6);
    // this.party.monarch = new PlayerCharacter(this, 600, 100, 'player', 2, 'Monarch', 100, 20);
    // //this.player.party1 = new PlayerCharacter object
    //this.player.party2 = new PlayerCharacter object

    // this.player = new PlayerCharacter(this, 600, 100, 'player', 2, 'Monarch', 100, 20);
    // this.add.existing(this.player);

    //SET the world bounds to overworld height and width
    this.physics.world.bounds.width = overworld.widthInPixels;
    this.physics.world.bounds.height = overworld.heightInPixels;
    this.player.setCollideWorldBounds(true); //set player to collide with world bounds
    this.physics.add.collider(this.player, obstacles); //makes player collide with obstacles
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

    this.anims.create({
      key: 'slimeMove',
      frames: this.anims.generateFrameNumbers('slime', {
        frames: [0, 1, 2]
        }),
      frameRate: 10,
      repeat: -1
      });


      this.emptyTiles = obstacles.getTilesWithin().filter(function(tile){
        if(tile.index === -1){
          return true;
        }
      });
    

    //spawns enemy slimes randomly
    //spawns enemy slimes randomly
    this.slime = this.physics.add.group({classType: Phaser.Physics.Arcade.Sprite})
    for(let i = 0; i < 10; i++){
      const randomTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
      const mySlime = this.slime.get(randomTile.pixelX, randomTile.pixelY, 'slime', 6);
      const randX = Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1)*10;
      const randY = Phaser.Math.RND.between(1, 3) * (Math.round(Math.random()) * 2 - 1)*10;
      mySlime.setVelocityX(randX);
      mySlime.setVelocityY(randY);
      mySlime.setBounce(1, 1);
      mySlime.anims.play('slimeMove', true);
    }
    this.physics.add.collider(this.player, this.slime, this.onMeetEnemy, false, this);
    this.physics.add.collider(obstacles, this.slime);
    this.physics.add.collider(this.slime, this.slime);

    this.sys.events.on('wake', this.wake, this);

    this.warp = this.physics.add.group({classType: Phaser.GameObjects.Zone });
    this.warp.create(440, 275, 16, 16);
    this.physics.add.overlap(this.warp, this.player, this.warpSewer, false, this);


  }

  warpSewer(player, warp) {
    console.log("we go to the rats now");
    this.scene.start('SewerScene');
  }
  
  wake(){
    //bring out the hp value
    console.log("wake function happens")
    // this.health = arguement
    // console.log("hp should have transferred: " + this.health)
    this.overworld1Music.resume();
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  onMeetEnemy(player, zone){
    
    //moves that zone to another location
    //need to change slimes to spawn not outside the zone
    let randomTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
    if(randomTile.pixelX === player.pixelX && randomTile.pixelY === player.pixelY){
      randomTile = Phaser.Utils.Array.GetRandom(this.emptyTiles);
    }
    zone.x = randomTile.pixelX;
    zone.y = randomTile.pixelY;
    zone.setOrigin(0,0);

    //camera shake
    this.cameras.main.shake(300);

   //start battle
   //this.time.delayedCall(500, this.scene.switch, ['BattleScene'], this);
   this.scene.switch('BattleScene', this.health);
   this.overworld1Music.pause();
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






