import playerSprite from './assets/Monarch_M1.png';
import Phaser from 'phaser';
import worldTiles from './assets/Set_A_Desert1.png';
import titleMap from './assets/title.json';
import slimesprite from './assets/Slime_1.png'
import noble from './assets/Noble_M1.png';
import sprFont from './assets/sprFont.png';
import sprFontXML from './assets/sprFont.fnt';
// import swish2 from './assets/swish_2.wav';
// import swish4 from './assets/swish_4.wav';
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
import {StartScene} from './title.js';

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
    StartScene,
    WorldScene,
    BattleScene,
    UIScene,
  ]
};

const game = new Phaser.Game(config);  //This is a block-scoped variable
