/* Global Phaser */

// Copyright (c) Youngwook All rights reserved
//
// Created by: Youngwook
// Created on: Nov 2022
// This file contains the JS functions for index.html

// Scene import statements
import MenuScene from "./menuScene.js"
import GameScene from "./gameScene.js"

// Create the new scenes
const menuScene = new MenuScene()
const gameScene = new GameScene()

/**
 * Start Phaser Game
 **/
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 880,
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
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
  },
}

const game = new Phaser.Game(config)
// comsole.log(game)

// load scenes
// NOTE: remember any "key" is global and can't be reused!
game.scene.add("menuScene", menuScene)
game.scene.add("gameScene", gameScene)
// start title
game.scene.start("menuScene")