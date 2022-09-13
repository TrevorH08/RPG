import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import worldTiles from './assets/Set_A_Desert1.png';
import tileMap from './assets/RPG-Map-1-embed.json';
import characterSprite from './assets/Monarch_M1.png';
import noble from './assets/Noble_M1.png';
import slime from './assets/Slime_1.png';
import greenslime from './assets/02_SmallSlime_A.png';
import redslime from './assets/02_SmallSlime_B.png';

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

class BootScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'BootScene'
        });
    }

    preload(){
        this.load.image('greenSlime', greenslime);
        this.load.image('redSlime', redslime);
        this.load.spritesheet('noble', noble, {frameWidth:16, frameHeight:20});
    }

    create(){
        this.scene.start('BattleScene');
    }
}

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
        this.load.spritesheet('slime', slime, {frameWidth: 16, rameHeight: 16});
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

        //spawns player
        this.player = this.physics.add.sprite(400, 400, 'player', 6);

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


        

        //spawns enemy slimes randomly
        this.slime = this.physics.add.group({ classType: Phaser.GameObjects.Sprite });
        for(let i = 0; i < 30; i++){
            const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            this.slime.get(x, y, 'slime', 6); 
            this.physics.add.collider(this.slime, obstacles);
        }
        //this makes players and zones interact (in this case, the Spawns zone)
        //when the this.player interacts with this.spawns, it triggers this.onMeetEnemy()
        this.physics.add.overlap(this.player, this.slime, this.onMeetEnemy, false, this);
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

    onMeetEnemy(player, slime){
        //start battle

        //currently, moves that zone to another location
        //need to change slimes to spawn not outside the zone
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    
        //camera shake
        this.cameras.main.shake(300);
    }
}



class BattleScene extends Phaser.Scene{
    constructor(){
        Phaser.Scene.call(this, {key: 'BattleScene'});
    }

    create(){
        // change the background to tan
        this.cameras.main.setBackgroundColor('rgba(210, 180, 140, 0.5)');
        
        // player character - warrior
        const monarch = new PlayerCharacter(this, 60, 100, 'player', 4, 'Monarch', 100, 20);        
        this.add.existing(monarch);
        
        // player character - mage
        const noble = new PlayerCharacter(this, 600, 200, 'noble', 4, 'Noble', 80, 8);
        this.add.existing(noble);
        
        const slime1 = new Enemy(this, 200, 100, 'greenSlime', null, 'Green Slime', 50, 3);
        this.add.existing(slime1);
        
        const slime2 = new Enemy(this, 160, 200, 'redSlime', null,'Red Slime', 50, 3);
        this.add.existing(slime2);
        
        // array with heroes
        this.heroes = [ monarch, noble ];
        // array with enemies
        this.enemies = [ slime1, slime2 ];
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);
        
        // Run UI Scene at the same time
        this.scene.launch('UIScene');
    }
}

class UIScene extends Phaser.Scene{
    constructor(){
        Phaser.Scene.call(this, {key: 'UIScene'});
    }

    create(){
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(5 ,0xffffff);
        this.graphics.fillStyle(0x031f4c, 1)
        this.graphics.strokeRect(2, 277, 266, 200);
        this.graphics.fillRect(2, 277, 266, 200);
        this.graphics.strokeRect(268, 277, 266, 200);
        this.graphics.fillRect(268, 277, 266, 200);
        this.graphics.strokeRect(536, 277, 264, 200);
        this.graphics.fillRect(536, 277, 262, 200);
    }
}

class Unit extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, type, hp, damage){
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage;
    }

    attack(target){
        target.takeDamage(this.damage);
    }

    takeDamage(damage){
        this.hp -= damage;
    }
}

class Enemy extends Unit{
    constructor(scene, x, y, texture, frame, type, hp, damage){
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
        this.setScale(0.25);
    }
}

class PlayerCharacter extends Unit{
    constructor(scene, x, y, texture, frame, type, hp, damage){
        Unit.call(this, scene, x,  y, texture, frame, type, hp, damage);
        this.setScale(3);
    }
}

class MenuItem extends Phaser.GameObjects.Text{
    constructor(x, y, text, scene){
        Phaser.GameObjects.Text.call(this, scene, x, y,  text, { color: '#ffffff', align: 'left', fontSize: 15});
    }
    
    select() {
        this.setColor('#f8ff38');
    }
    
    deselect() {
        this.setColor('#ffffff');
    }
}

class Menu extends Phaser.GameObjects.Container{
    constructor(x, y, scene, heroes){
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
    }

    addMenuItem(unit){
        const menuItem = new MenuItem (0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
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
