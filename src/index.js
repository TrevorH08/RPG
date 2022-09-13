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
    Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 30});
  },
  
  select: function() {
    this.setColor('#f8ff38');
  },

  deslect: function() {
    this.setColor('#ffffff');
  }
});

var Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialze:

  function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    
  }
})



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
  } 
});

var UIScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
  function UIScene ()
  {
      Phaser.Scene.call(this, { key: 'UIScene' });
  },
  create: function ()
  {    
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5,0xffffff);
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.strokeRect(2, 277, 266, 200);
    this.graphics.fillRect(2, 277, 266, 200);
    this.graphics.strokeRect(268, 277, 266, 200);
    this.graphics.fillRect(268, 277, 266, 200);
    this.graphics.strokeRect(536, 277, 264, 200);
    this.graphics.fillRect(536, 277, 262, 200);
      
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