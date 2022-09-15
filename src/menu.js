import Phaser from 'phaser';
import {Unit} from './unit.js';
import {Enemy} from './unit.js';
import {PlayerCharacter} from './unit.js';
import {BattleScene} from './battleScene.js';
import {UIScene} from './ui.js';
import {Message} from './ui.js';


export class MenuItem extends Phaser.GameObjects.Text{
  constructor(x, y, text, scene){
    super(scene, x, y, text, {color: '#ffffff', align: 'left', fontSize: 28});
  }

  select() { //turns yellow for "selected"
    this.setColor('#f8ff38');
  }

  deselect() { //turns white for "deselected"
    this.setColor('#ffffff');
  }

  unitKilled(){
    this.active = false;
    this.visible = false;
  }
}

export class Menu extends Phaser.GameObjects.Container{
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

export class HeroesMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
  }
}

export class ActionsMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
    this.addMenuItem('Attack');
    this.addMenuItem('Block');
  }
  confirm(){
    this.scene.events.emit('SelectEnemies');
  }
}

export class EnemiesMenu extends Menu{
  constructor(x, y, scene){
    super(x, y, scene);
  }

  confirm(){
    this.scene.events.emit('Enemy', this.menuItemIndex);
  }
}


