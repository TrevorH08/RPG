import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import worldTiles from './assets/Set_A_Desert1.png';
import tileMap from './assets/RPG-Map-1-embed.json';
import characterSprite from './assets/Monarch_M1.png';

// class BootScene extends Phaser.Scene {
//     constructor(){
//         super({
//             key: "BootScene"
//         });
//     }

//     preload(){
//         //load resources
//         this.load.image('image', logoImg);
//     }

//     create(){
//         this.scene.start('WorldScene');
//     }
// }

class WorldScene extends Phaser.Scene {
    constructor(){
        super({
            key: "WorldScene"
        });
    }

    preload(){
        //load resources
        this.load.image('tiles', worldTiles);
        this.load.tilemapTiledJSON('map', tileMap);
        this.load.spritesheet('player', characterSprite, {frameWidth: 16, frameHeight:20});
    }

    create(){
        //Create world here
        //add tile sets! they load in order
        const overworld = this.make.tilemap({key: 'map'});
        const tiles = overworld.addTilesetImage('Set_A_Desert1', 'tiles');

        const overworldMap = overworld.createLayer('Overworld', tiles, 0, 0);
        const obstacles = overworld.createLayer('Obstacles', tiles, 0, 0); //these are our collision objects
        const ridge = overworld.createLayer('ridge', tiles, 0, 0); //these are our collision objects
        const bridge = overworld.createLayer('ridge-stair', tiles, 0, 0);

        //set collision for obstacles and ridge layer
        obstacles.setCollisionByExclusion([-1]);
        ridge.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(400, 400, 'player', 6);
        //SET the world bounds to overworld height and width
        this.physics.world.bounds.width = overworld.widthInPixels;
        this.physics.world.bounds.height = overworld.heightInPixels;
        this.player.setCollideWorldBounds(true); //set player to collide with world bounds
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

        this.physics.add.collider(this.player, obstacles); //makes player collide with obstacles
        this.physics.add.collider(this.player, ridge);

        // this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        // for(let i = 0; i < 30; i++){
        //     const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        //     const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        //     this.spawns.create(x, y, 20, 20); 
        // }
        // //this makes players and zones interact (in this case, the Spawns zone)
        // //when the this.player interacts with this.spawns, it triggers this.onMeetEnemy()
        // this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
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

    onMeetEnemy(player, zone){
        //start battle

        //currently, moves that zone to another location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    
        //camera shake
        this.cameras.main.shake(300);
        this.cameras.flash(500);
        this.cameras.fade(500);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:0 },
            debut: true //turns on physics debugging
        }
    },
    scene: [
        // BootScene,
        WorldScene
    ]
};

const game = new Phaser.Game(config);
