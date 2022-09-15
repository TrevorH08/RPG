import Phaser from 'phaser';
import slimesprite from './assets/Slime_1.png'
import characterSprite from './assets/Monarch_M1.png';
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
import desertMusic from './assets/DesertCave.wav';
import sewerTiles from './assets/sewer_1.png';
import sewerObjects from './assets/sewer_objects.png';
import sewer_map from './assets/sewer_map.json';

export class SewerScene extends Phaser.Scene {
  constructor(){
    super({
      key: 'SewerScene'
    });
  }

  preload(){
    //load resources
    this.load.image('sewer_tiles', sewerTiles);
    this.load.tilemapTiledJSON('sewer_map', sewer_map);
    this.load.spritesheet('player', characterSprite, {frameWidth: 16, frameHeight:20});
    this.load.spritesheet('slime', slimesprite, {frameWidth: 16, frameHeight: 16});
    this.load.audio('music', [desertMusic]);
    this.load.image('objectsobstacle', sewerObjects);
  }

  create(){
    //Create world here
    const overworld1Music = this.sound.add('music', {loop: true});
    this.overworld1Music = overworld1Music;
    this.health = 90
    //add tile sets! they load in order
    this.overworld1Music.play();
    const overworld = this.make.tilemap({key: 'sewer_map'});
    const tiles = overworld.addTilesetImage('sewer_1', 'sewer_tiles');

    const water = overworld.createLayer('water', tiles, 0, 0);
    const backwall = overworld.createLayer('backwall', tiles, 0, 0); 
    const overworld2 = overworld.createLayer('overworld2', tiles, 0, 0); 
    const waterDecoration = overworld.createLayer('waterdecoration', tiles, 0, 0);
    const archways = overworld.createLayer('archways', tiles, 0, 0);
    const stairsRightSide = overworld.createLayer('stairsrightside', tiles, 0, 0);
    const torches = overworld.createLayer('torches', tiles, 0, 0);
    const torches2 = overworld.createLayer('torches2.0lol', tiles, 0, 0);
    const objectsObstacle = overworld.createLayer('objectsobstacle', tiles, 0, 0);
    const objectsDecoration = overworld.createLayer('objectsdecoration', tiles, 0,0);

    //set collision for obstacles and ridge layer
    objectsObstacle.setCollisionByExclusion([-1]);
    backwall.setCollisionByExclusion([-1]);
    water.setCollisionByExclusion([-1]);

    //spawns player
    this.player = this.physics.add.sprite(400, 400, 'player', 6);

    //SET the world bounds to overworld height and width
    this.physics.world.bounds.width = overworld.widthInPixels;
    this.physics.world.bounds.height = overworld.heightInPixels;
    this.player.setCollideWorldBounds(true); //set player to collide with world bounds
    this.physics.add.collider(this.player, objectsObstacle, false, null); //makes player collide with obstacles
    this.physics.add.collider(this.player, water, false, null);
    this.physics.add.collider(this.player, backwall, false, null); 
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


      this.emptyTiles = objectsObstacle.getTilesWithin().filter(function(tile){
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
    this.physics.add.collider(objectsObstacle, this.slime);
    this.physics.add.collider(this.slime, this.slime);

    this.sys.events.on('wake', this.wake, this);
  }

  wake(/*arguement*/){
    //bring out the hp value
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
    this.scene.start('BattleScene', this.health);
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