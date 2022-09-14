# Monarch's Revenge

#### By Skylan Lew, Trevor Hunter, Joseph Jackson, Samuel Majerus, Spencer Dennis

#### Epicodus Team Week 1 Javascript - A small RPG game made in Phaser

## Technologies Used

* Phaser.js
* Javascript
* HTML
* Webpack
* Babel

## Asset Used
* [SeraphCircle Monster Pack 1](https://seraphcircle.itch.io/sc-monster-pack-1) https://seraphcircle.itch.io/sc-monster-pack-1
* [Tiny Tales Overworld Tiles](https://megatiles.itch.io/tiny-tales-overworld-2d-tileset-asset-pack) https://megatiles.itch.io/tiny-tales-overworld-2d-tileset-asset-pack
* [Tiny Tales Character Sprites - NPC Wild Beasts](https://megatiles.itch.io/tiny-tales-wild-beasts-npc-sprite-pack) https://megatiles.itch.io/tiny-tales-wild-beasts-npc-sprite-pack
* [Tiny Tales Character Sprites - NPC Nobility](https://megatiles.itch.io/tiny-tales-human-npc-nobility-sprite-pack) https://megatiles.itch.io/tiny-tales-human-npc-nobility-sprite-pack
* Music By: Jordan Atkins

## Description

This is a simple turn based RPG game made with Phaser.js. The player spawns on the map, and can walk around the map, but not on the water, through rocks, into the pit, or outside the coliseum. They may walk along the rope bridge to cross the river. When the player runs into a slime enemy, the battle starts. The player's party is has two characters, the Monarch and the Noble. The player takes their character turns first, in order, and then the monsters attack. If the player wins, they are returned to the overworld. If they lose, they get a game over screen.

## Setup/Installation Requirements

### Website

* TBA

### Requirements

* Node.js

### Installation

* git clone
* $npm install
* $npm start

## Known Bugs

* screen shakes after battle, not before
* slime sprite is not cropped correctly
* some world tiles have collission when they should not

## License

_{Let people know what to do if they run into any issues or have questions, ideas or concerns.  Encourage them to contact you or make a contribution to the code.}_

Copyright (c) _date_ _author name(s)_

# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/) that includes hot-reloading for development and production-ready builds.

This has been updated for Phaser 3.50.0 version and above.

Loading images via JavaScript module `import` is also supported, although not recommended.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder and webpack will automatically recompile and reload your server (available at `http://localhost:8080` by default).

## Customizing the Template

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

 ```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
 ```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at `dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), you should be able to open `http://mycoolserver.com/index.html` and play your game.
