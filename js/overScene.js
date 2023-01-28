/* Global Phaser */

// Copyright (c) Youngwook All rights reserved
//
// Created by: Youngwook
// Created on: Nov 2022
// This file contains the JS functions for index.html

/**
 * This class is the Menu Scene
**/
class OverScene extends Phaser.Scene {
  /**
   * This method is the constructor
  **/
  constructor () {
    super({ key: "overScene" })

    this.overSceneBackgroundImage = null
    this.startButton = null

    this.gameOverText = null
    this.againText = null

    this.gameOverTextStyle = { font: '200px Arial', fill: '#00ff00', align: 'center' }
    this.againTextStyle = { font: '100px Arial', fill: '#00ff00', align: 'center' }
    this.infoTextStyle = { font: '64px Arial', fill: '#00ff00', align: 'center' }
  }
  
  init(data) {
    this.cameras.main.setBackgroundColor("ffffff")
  }
  
  preload() {
    console.log("Over Scene")
    this.load.image("overSceneBackground", "./assets/aliens_screen_image2.jpg")
    this.load.image("startButton", "./assets/start.png")
  }
  
  create(data) {
    this.overSceneBackgroundImage = this.add.sprite(0,0,"menuSceneBackground")
    this.overSceneBackgroundImage.x = 1920 / 2
    this.overSceneBackgroundImage.y = 880 / 2

    this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, "startButton")
    this.startButton.setInteractive({ useHandCursor: true })
    this.startButton.on("pointerdown", () => this.clickButton())
    this.gameOverText = this.add.text(1920 / 2, 480 / 2, 'Game Over!', this.gameOverTextStyle).setOrigin(0.5)
    this.againText = this.add.text(1920 / 2, 800 / 2, 'Click to play again', this.againTextStyle).setOrigin(0.5)

    
  }

  update(time, delta) {
    //pass
  }

  clickButton() {
    this.scene.start("gameScene")
  }
}

export default OverScene
