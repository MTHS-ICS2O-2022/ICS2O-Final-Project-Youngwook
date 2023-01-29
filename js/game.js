/* Global Phaser */

// Copyright (c) Youngwook All rights reserved
//
// Created by: Youngwook
// Created on: Nov 2022
// This file contains the JS functions for index.html

// Scene import statements
import MenuScene from "./menuScene.js"
import GameScene from "./gameScene.js"
import OverScene from "./overScene.js"

// Create the new scenes
const menuScene = new MenuScene()
const gameScene = new GameScene()
const overScene = new OverScene()

/**
 * Start Phaser Game
 **/
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  //set background color
  backgroundColor: 0x5f6e7a,
  scale: {
    mode: Phaser.Scale.FIT,
    //we place it in the middle of the page
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },

  // text field plugin
  parent: "phaser-game",
  dom: {
    createContainer: true
  }, 
}

const game = new Phaser.Game(config)

// load scenes
// NOTE: remember any "key" is global and can't be reused!
game.scene.add("menuScene", menuScene)
game.scene.add("gameScene", gameScene)
game.scene.add("overScene", overScene)

// start title
game.scene.start("menuScene")