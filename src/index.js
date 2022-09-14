import Phaser from 'phaser';
import worldTiles from './assets/Set_A_Desert1.png';
import tileMap from './assets/RPG-Map-1-embed.json';
import greenslime from './assets/02_SmallSlime_A.png';
import redslime from './assets/02_SmallSlime_B.png';
import slimesprite from './assets/Slime_1.png'
import characterSprite from './assets/Monarch_M1.png';
import noble from './assets/Noble_M1.png';
// import battlescene
// import uiscene
// import worldscene
// import unit


class BootScene extends Phaser.Scene{
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

class WorldScene extends Phaser.Scene {
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
    //start battle

    //moves that zone to another location
    //need to change slimes to spawn not outside the zone
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

    //camera shake
    this.cameras.main.shake(300);

    //this.time.addEvent({delay: 2500, callback: this.nextTurn, callbackScope: this}); //add timer before next turn for smooth gameplay
    //this.time.addEvent({delay:1000, callback:this.scene.switch, callbackScope:'BattleScene'});//this attempt doesn't work to make it shake then start the battle
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

class BattleScene extends Phaser.Scene{
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
  }

  exitBattle(){
    this.scene.sleep('UIScene');
    this.scene.switch('WorldScene');
  }

  create(){
    // change the background to tan
    this.cameras.main.setBackgroundColor('rgba(210, 180, 140, 0.5)');
    this.startBattle();
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

  startBattle(){
    const monarch = new PlayerCharacter(this, 600, 100, 'monarch', 3, 'Monarch', 100, 20);
    this.add.existing(monarch);
    
    const noble = new PlayerCharacter(this, 600, 200, 'noble', 3, 'Noble', 80, 8);
    this.add.existing(noble);
    
    const slime1 = new Enemy(this, 200, 100, 'greenSlime', null, 'Green Slime', 29, 3);
    this.add.existing(slime1);
    
    const slime2 = new Enemy(this, 160, 200, 'redSlime', null,'Red Slime', 29, 3);
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
    this.scene.switch('WorldScene'); 
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
    this.scene.run('UIScene');
    this.time.addEvent({delay: 2000, callback:this.exitBattle, callbackScope: this});
  }
}

class UIScene extends Phaser.Scene{
  constructor(){
    super({key: 'UIScene'});
  }

  create(){
    this.battleScene = this.scene.get('BattleScene');

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5,0xffffff);
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.strokeRoundedRect(2, 278, 260, 200);
    this.graphics.fillRoundedRect(2, 278, 260, 200);
    this.graphics.strokeRoundedRect(270, 278, 260, 200);
    this.graphics.fillRoundedRect(270, 278, 260, 200);
    this.graphics.strokeRoundedRect(538, 278, 260, 200);
    this.graphics.fillRoundedRect(538, 278, 260, 200);

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

    this.battleScene = this.scene.get('BattleScene');

    //listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    //listen for "PlayerSelect" from battle scene, so the player can take their turn
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    this.events.on('SelectEnemies', this.onSelectEnemies, this)


    //listen for "Enemy" from EnemiesMenu
    this.events.on('Enemy', this.onEnemy, this);

    this.sys.events.on('wake', this.createMenu, this);

    //add message UI to the scene
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);
    this.createMenu();
  }
  
  createMenu() {
    //RESET hero/enemies arrays
    this.remapHeroes();
    this.remapEnemies();
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
    if(this.currentMenu && this.currentMenu.selected){
      if(event.code === "ArrowUp"){
        this.currentMenu.moveSelectionUp();
      } else if (event.code === "ArrowDown"){
        this.currentMenu.moveSelectionDown();
      } else if (event.code === "ArrowRight" || event.code === "Shift"){

      } else if (event.code === "Space"){
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
    this.living = true;
    this.menuItem = null;
  }
  setMenuItem(item) { //tells the menu item when the unit is dead
    this.menuItem = item;
  }

  takeDamage(damage){
    this.hp -= damage;
    if(this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  }

  attack(target){
    if(target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
      console.log("remaining health: " + target.hp);
    }
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
    super(scene, x, y, text, {color: '#ffffff', align: 'left', fontSize: 28});
  }

  select() {
    this.setColor('#f8ff38');
  }

  deselect() {
    this.setColor('#ffffff');
  }

  unitKilled(){
    this.active = false;
    this.visible = false;
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
    this.selected = false;
  }

  addMenuItem(unit){
    const menuItem = new MenuItem (0, this.menuItems.length * 30, unit, this.scene); //controls line height
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  }
  
  moveSelectionUp(){
    this.menuItems[this.menuItemIndex].deselect();
    do{
      this.menuItemIndex--;
      if(this.menuItemIndex < 0){
        this.menuItemIndex = this.menuItems.length - 1;
      }
    } while(!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  moveSelectionDown(){
    this.menuItems[this.menuItemIndex].deselect();
    do {    
      this.menuItemIndex++;
      if(this.menuItemIndex >= this.menuItems.length){
        this.menuItemIndex = 0;
      }
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }
  //select the menu as a whole
  select(index){
    if(!index){
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while(!this.menuItems[this.menuItemIndex].active){
      this.menuItemIndex++;
      if(this.menuItemIndex >= this.menuItems.length){
        this.menuItemIndex = 0;
      }
      if(this.menuItemIndex === index){
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  }
  //deselect this menu
  deselect(){
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
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
      let unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
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
    this.addMenuItem('Block');
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
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}

class Message extends Phaser.GameObjects.Container{
  constructor(scene, events){
    super(scene, 160, 130);
    let graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.fillRoundedRect(150, -100, 180, 100);
    graphics.strokeRoundedRect(150, -100, 180, 100);
    graphics.fillRoundedRect(150, -100, 180, 100); //consider making boxes and font bigger
    this.text = new Phaser.GameObjects.Text(scene, 240, -50, "", { color: '#ffffff', align: 'center', fontSize: 18, wordWrap: { width: 160, useAdvancedWrap: true }});
    this.add(this.text);
    this.text.setOrigin(0.5); //mess around see what this does
    events.on('Message', this.showMessage, this);
    this.visible = false;
  }

  showMessage(text){
    this.text.setText(text);
        this.visible = true;
        if(this.hideEvent){
          this.hideEvent.remove(false);
        }
        this.hideEvent = this.scene.time.addEvent({ delay: 2500, callback: this.hideMessage, callbackScope: this });
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
