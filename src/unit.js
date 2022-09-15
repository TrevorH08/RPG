import Phaser from 'phaser';
import {BattleScene} from './battleScene.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
// import swish2 from './assets/swish_2.wav';
// import swish4 from './assets/swish_4.wav';
import {WorldScene} from './worldscene.js';

export class Unit extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage;
    this.living = true;
    this.menuItem = null;
    this.xp = 0;
    this.level = 1;
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

export class Enemy extends Unit{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x, y, texture, frame, type, hp, damage);
    this.setScale(0.25);
  }
}

export class PlayerCharacter extends Unit{
  constructor(scene, x, y, texture, frame, type, hp, damage){
    super(scene, x,  y, texture, frame, type, hp, damage);
    this.setScale(3);
  }
}