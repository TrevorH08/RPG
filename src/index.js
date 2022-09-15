import Phaser from 'phaser';
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
import {SewerScene} from './sewerScene.js';

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
    SewerScene
  ]
};

const game = new Phaser.Game(config);  //This is a block-scoped variable
