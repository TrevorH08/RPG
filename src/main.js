
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
    this.load.image('greenSlime', './assets/02_SmallSlime_A.png');
    this.load.image('redSlime', './assets/02_SmallSlime_B.png');
    this.load.spritesheet('noble', './assets/Noble_M1.png', {frameWidth:16, frameHeight:21});
	this.load.spritesheet('player', './assets/Monarch_M1.png', {frameWidth:16, frameHeight:21});
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
    this.load.image('tiles', './assets/Set_A_Desert1.png');
    this.load.tilemapTiledJSON('map', './assets/RPG-Map-1-embed.json');
    this.load.spritesheet('player', './assets/Monarch_M1.png', {frameWidth: 16, frameHeight:20});
    this.load.spritesheet('slime', './assets/Slime_1.png', {frameWidth: 16, rameHeight: 16});
  }

  create(){
    //Create world here
    //add tile sets! they load in order
    const overworld = this.make.tilemap({key: 'map'});
    const tiles = overworld.addTilesetImage('Set_A_Desert1', 'tiles');

    const overworldMap = overworld.createStaticLayer('Overworld', tiles, 0, 0);
    const obstacles = overworld.createStaticLayer('Obstacles', tiles, 0, 0); //these are our collision objects
    const ridge = overworld.createStaticLayer('ridge', tiles, 0, 0); //these are our collision objects
    const bridge = overworld.createStaticLayer('ridge-stair', tiles, 0, 0);

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
    onMeetEnemy(player, zone){
    //start battle

    //currently, moves that zone to another location
    //need to change slimes to spawn not outside the zone
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    //camera shake
    this.cameras.main.shake(300);
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



class BattleScene extends Phaser.Scene{
  constructor(){
    super({
      key: "BattleScene"
    });
  }

  create(){
    // change the background to tan
    this.cameras.main.setBackgroundColor('rgba(210, 180, 140, 0.5)');
    
    // player character - warrior
    const monarch = new PlayerCharacter(this, 600, 100, 'player', 3, 'Monarch', 100, 20);        
    this.add.existing(monarch);
    
    // player character - mage
    const noble = new PlayerCharacter(this, 600, 200, 'noble', 3, 'Noble', 80, 8);
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

    this.index = -1;
  }

  nextTurn(){
    this.index++;
    if(this.index >= this.units.length){ //if there are no more units, we start again from the first one
      this.index = 0;
    }
    if(this.units[this.index]){
      if(this.units[this.index] instanceof PlayerCharacter){ //if it is a player hero
        this.events.emit('PlayerSelect', this.index);
      } else { //if it's an enemy 
        var r = Math.floor(Math.random() * this.heroes.length); //pick a random hero
        this.units[this.index].attack(this.heroes[r]); //call the enemy's attack function on that hero
        this.time.addEvent({delay: 2000, callback: this.nextTurn, callbackScope: this}); //add timer before next turn for smooth gameplay
      }
    }
  }

  receivePlayerSelection(action, target){
    if(action == 'attack'){
		console.log(this.units[this.index]);
		console.log(this.enemies[target]);
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });        
  }
}

class UIScene extends Phaser.Scene{
  constructor(){
    super({key: 'UIScene'});
  }

  create(){
    this.battleScene = this.scene.get('BattleScene');

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5 ,0xffffff);
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.strokeRect(2, 277, 266, 200);
    this.graphics.fillRect(2, 277, 266, 200);
    this.graphics.strokeRect(268, 277, 266, 200);
    this.graphics.fillRect(268, 277, 266, 200);
    this.graphics.strokeRect(536, 277, 264, 200);
    this.graphics.fillRect(536, 277, 262, 200);

    //container to hold all menus
    this.menus = this.add.container();

    //one each hero, actions, enemies menu
    this.heroesMenu = new HeroesMenu(545, 280, this);           
    this.actionsMenu = new ActionsMenu(275, 280, this);            
    this.enemiesMenu = new EnemiesMenu(8, 280, this);   

    //currently selected menu
    this.currentMenu = this.actionsMenu;

    //add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);


    //map hero/enemies arrays
    this.remapHeroes();
    this.remapEnemies();

    //listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    //listen for "PlayerSelect" from battle scene, so the player can take their turn
    this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

    //listen for "SelectEnemies" from player ActionsMenu
    this.events.on("SelectEnemies", this.onSelectEnemies, this);

    //listen for "Enemy" from EnemiesMenu
    this.events.on("Enemy", this.onEnemy, this);

    //add message UI to the scene
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    //start the first turn on load
    this.battleScene.nextTurn();
  }
  
  onEnemy(index){
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }

  remapHeroes(){
    let heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  }
  remapEnemies(){
    let enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  }

  onKeyInput(event){
    if(this.currentMenu){
      if(event.code === "ArrowUp"){
        this.currentMenu.moveSelectionUp();
      } else if (event.code === "ArrowDown"){
        this.currentMenu.moveSelectionDown();
      } else if (event.code === "ArrowRight" || event.code === "Shift"){

      } else if (event.code === "Space" || event.code === "ArrowLeft"){
        this.currentMenu.confirm();
      }
    }
  }

  onPlayerSelect(id){
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectEnemies(){
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }


}

class Unit extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage;
  }
  
    takeDamage(damage){
    this.hp -= damage;
  }

  attack(target){
	target.takeDamage(this.damage);
	this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
  }


}

class Enemy extends Unit{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x, y, texture, frame, type, hp, damage);
    this.setScale(0.25);
  }
}

class PlayerCharacter extends Unit{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x,  y, texture, frame, type, hp, damage);
    this.setScale(3);
  }
}

class MenuItem extends Phaser.GameObjects.Text{
  constructor(x, y, text, scene){
   super(scene, x, y,  text, { color: '#ffffff', align: 'left', fontSize: 28});
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
    super(scene, x, y);
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
  
  moveSelectionUp(){
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;
    if(this.menuItemIndex < 0){
      this.menuItemIndex = this.menuItems.length - 1;
    }
    this.menuItems[this.menuItemIndex].select();
  }

  moveSelectionDown(){
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if(this.menuItemIndex >= this.menuItems.length){
      this.menuItemIndex = 0;
    }
    this.menuItems[this.menuItemIndex].select();
  }
  //select the menu as a whole
  select(index){
    if(!index){
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  }
  //deselect this menu
  deselect(){
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  }

  confirm(){
    //when the player confirms, do the thing
  }

  clear(){
    for(let i = 0; i< this.menuItems.length; i++){
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  }

  remap(units){
    this.clear();
    for(let i = 0; i < units.length; i++){
      const unit = units[i];
      this.addMenuItem(unit.type);
    }
  }
}

class HeroesMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
  }
}

class ActionsMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
    this.addMenuItem('Attack');
  }

  confirm(){
    this.scene.events.emit('SelectEnemies');
  }
}

class EnemiesMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
  }

  confirm(){
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
}

class Message extends Phaser.GameObjects.Container{
  constructor(scene, events){
    super(scene, 160, 130);
    let graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);        
    graphics.strokeRect(150, -100, 180, 75);
    graphics.fillRect(150, -100, 180, 75);
    this.text = new Phaser.GameObjects.Text(scene, 240, -60, "", { color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true }});
    this.add(this.text);
    this.text.setOrigin(0.5);        
    events.on("Message", this.showMessage, this);
    this.visible = false;
  }

  showMessage(text){
    this.text.setText(text);
        this.visible = true;
        if(this.hideEvent){
          this.hideEvent.remove(false);
        }
        this.hideEvent = this.scene.time.addEvent({ delay: 1000, callback: this.hideMessage, callbackScope: this });
  }
  hideMessage(){
    this.hideEvent = null;
    this.visible = false;
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
