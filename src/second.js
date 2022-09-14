import greenslime from './assets/02_SmallSlime_A.png';
import redslime from './assets/02_SmallSlime_B.png';
import characterSprite from './assets/Monarch_M1.png';
import noble from './assets/Noble_M1.png';

var Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: 

  function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage;
  },
  attack: function(target) {
    target.takeDamage(this.damage);
    this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
  },
  takeDamage: function(damage) {
    this.hp -= damage;
  }
});

var Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
  function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    
    this.setScale(0.25);
  }
});

var PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
  function  PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

   // this.flipX = true;

    this.setScale(3);
  }
});

var MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

  function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 30, lineSpacing: 20 });
    
  },
  
  select: function() {
    this.setColor('#f8ff38');
  },

  deselect: function() {
    this.setColor('#ffffff');
  }
});

var Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

  function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.heroes = heroes;
    this.x = x;
    this.y = y;
  },
  addMenuItem: function(unit) {
    var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },
  moveSelectionUp: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;
    if(this.menuItemIndex < 0)
        this.menuItemIndex = this.menuItems.length - 1;
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if(this.menuItemIndex >= this.menuItems.length)
      this.menuItemIndex = 0;
    this.menuItems[this.menuItemIndex].select();
  },
  select: function(index) {
    if(!index)
      index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemsIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },
  deselect: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },
  confirm: function() {
    
  },
  clear: function() {
    for(var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap: function(units) {
    this.clear();
    for(var i = 0; i < units.length; i++) {
      var unit = units[i];
      this.addMenuItem(unit.type);
    }
  }
});

var HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:
  function HeroesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  }
});

var ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:
  function ActionsMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
  },
  confirm: function() {
    this.scene.events.emit('SelectEnemies');
  }
});

var EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:
  function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm: function() {
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
});

var Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
  function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    var graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.fillRoundedRect(150, 25, 180, 100);
    graphics.strokeRoundedRect(150, 25, 180, 100);
    graphics.fillRoundedRect(150, 25, 180, 100);
    this.text = new Phaser.GameObjects.Text(scene, 240, 75, "", { color: '#ffffff', align: 'center', fontSize: 20, wordWrap: { width: 160, useAdvancedWrap: true }});
    this.add(this.text);
    this.text.setOrigin(0.5);
    events.on("Message", this.showMessage, this);
    this.visible = false;
  },
  showMessage: function(text) {
    this.text.setText(text);
    this.visible = true;
    if(this.hideEvent)
      this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({ delay: 2500, callback: this.hideMessage, callbackScope: this});
  },
  hideMessage: function() {
    this.hideEvent = null;
    this.visible = false;
  }
});

var BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
  function BootScene ()
  {
      Phaser.Scene.call(this, { key: 'BootScene' });
  },
  preload: function ()
  {
      // load resources
      this.load.spritesheet('player', characterSprite, { frameWidth: 16, frameHeight: 20 });
      this.load.spritesheet('party1', noble, { frameWidth: 16, frameHeight: 20 });
      this.load.image('slime', greenslime);
      this.load.image('slimerange', redslime);

  },
  create: function ()
  {
      this.scene.start('BattleScene');
  }
});
var BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
  function BattleScene ()
  {
      Phaser.Scene.call(this, { key: 'BattleScene' });
  },
  nextTurn: function() {
    this.index++;
    // if there are no more units, we start again from the first one
    if(this.index >= this.units.length) {
      this.index = 0;
    }
    if(this.units[this.index]) {
      // if its player hero
      if(this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit('PlayerSelect', this.index);
      } else { // else if its enemy unit
        // pick random hero
        var r = Math.floor(Math.random() * this.heroes.length);
        // call the enemy's attack function
        this.units[this.index].attack(this.heroes[r]);
        // add timer for the next turn, so it will have smoother gameplay
        this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
      }
    }
  },
  receivePlayerSelection: function(action, target) {
    if(action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
  },
  create: function ()
  {
      // Run UI Scene at the same time
      this.cameras.main.setBackgroundColor('rgba(210, 180, 140, 0.5)');
      var monarch = new PlayerCharacter(this, 600, 100, 'player', 4, 'Monarch', 100, 20);
      this.add.existing(monarch);
      var noble = new PlayerCharacter(this, 600, 200, 'party1', 4, 'Noble', 80, 8);
      this.add.existing(noble);
      var greenslime = new Enemy(this, 200, 100, 'slime', null, 'Green Slime', 50, 3);
      this.add.existing(greenslime);
      var redslime = new Enemy(this, 160, 200, 'slimerange', null, 'Red Slime', 50, 3);
      this.add.existing(redslime);
      
      this.heroes = [monarch, noble];
      this.enemies = [greenslime, redslime];
      this.units = this.heroes.concat(this.enemies);
      
      this.scene.launch('UIScene');
      this.index = -1;
    } 
});

var UIScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
  function UIScene ()
  {
    Phaser.Scene.call(this, { key: 'UIScene' });
  },
  remapHeroes: function() {
    var heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  },
  remapEnemies: function() {
    var enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  },

  onKeyInput: function(event){
    if(this.currentMenu) {
      if(event.code === "ArrowUp") {
        this.currentMenu.moveSelectionUp();
      } else if(event.code === "ArrowDown") {
        this.currentMenu.moveSelectionDown();
      } else if(event.code === "ArrowRight" || event.code === "Shift") {
        
      } else if(event.code === "Space" || event.code === "ArrowLeft") {
        this.currentMenu.confirm();
      }
    }
  },
  onPlayerSelect: function(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },
  onSelectEnemies: function() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  },
  onEnemy: function(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },
  create: function ()
  {    
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5,0xffffff);
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.strokeRoundedRect(2, 278, 260, 200);
    this.graphics.fillRoundedRect(2, 278, 260, 200);
    this.graphics.strokeRoundedRect(270, 278, 260, 200);
    this.graphics.fillRoundedRect(270, 278, 260, 200);
    this.graphics.strokeRoundedRect(538, 278, 260, 200);
    this.graphics.fillRoundedRect(538, 278, 260, 200);
      
    // basic container to hold all menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(548, 290, this);
    this.actionsMenu = new ActionsMenu (288, 290, this);
    this.enemiesMenu = new EnemiesMenu(12, 290, this);

    // // // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // // // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    // //access battlescreen
    this.battleScene = this.scene.get('BattleScene');
    this.remapHeroes();
    this.remapEnemies();

    this.input.keyboard.on('keydown', this.onKeyInput, this);
    this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

    this.events.on("SelectEnemies", this.onSelectEnemies, this);
    this.events.on("Enemy", this.onEnemy, this);
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);
    this.battleScene.nextTurn();
  }
});


var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 480,
  zoom: 2,
  pixelArt: true,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 }
      }
  },
  scene: [ BootScene, BattleScene, UIScene ]
};

var game = new Phaser.Game(config);