import Phaser from 'phaser';
import {Unit} from './unit.js';
import {Enemy} from './unit.js';
import {PlayerCharacter} from './unit.js';
import {BattleScene} from './battleScene.js';
import {Menu} from './menu.js';
import {ActionsMenu} from './menu.js';
import {EnemiesMenu} from './menu.js';
import {HeroesMenu} from './menu.js';
import {MenuItem} from './menu.js';
import {WorldScene} from './worldscene.js';

export class UIScene extends Phaser.Scene{
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

export class Message extends Phaser.GameObjects.Container{
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
    this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
  }
  hideMessage(){
    this.hideEvent = null;
    this.visible = false;
  }
}
