/* Global Phaser */

// Copyright (c) Youngwook All rights reserved
//
// Created by: Youngwook
// Created on: Nov 2022
// This file contains the JS functions for index.html

/**
 * This class is the Title Scene
**/
let inputText = ""

class GameScene extends Phaser.Scene {
    createAlien() {
        // get target word
        var wordDataList = this.cache.json.get('wordDataFile')
        var random = Math.floor(Math.random() * wordDataList.length)
        var targetWord = wordDataList[random]

        // get random alien location
        const alienYLocation = Math.floor(Math.random() * 680) + 100
        let alienXVelocity = Math.floor(Math.random() * 300) + 160 - (targetWord.length * 10)
        const anAlien = this.physics.add.sprite(0, alienYLocation, 'alien')
        anAlien.body.velocity.x = alienXVelocity 
        anAlien.body.velocity.y = 0

        const targetText = this.add.text(0, alienYLocation, targetWord, this.targetTextStyle).setOrigin(0.5)
      
        this.physics.world.enableBody(targetText)
        targetText.body.setVelocity(alienXVelocity , 0)
      
        this.alienGroup.add(anAlien)
        this.targetGroup.add(targetText)
    }
  
    submit() {
      console.log("input : " + inputText)
      this.inputText.setText('input: ' + inputText)

    }

    constructor() {
        super({ key: 'gameScene' })

        this.background = null
        this.ship = null
        this.fireMissile = false
        this.submitInput = false
        this.score = 0
        this.scoreText = null
        this.inputText = null
        this.level = 1

        this.inputStyle = {
          
          // Element properties
          type: 'text',    // 'text'|'password'|'textarea'|'number'|'color'|...
          id: "inputTextStyle",
          text: "",
          placeholder: "enter the word",
          readOnly: false,
          spellCheck: false,
          autoComplete: 'off',
          
          // Style properties
          align: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "32pt",
          color: '#ffffff',
          border: 1,
          backgroundColor: '#000000',
          borderColor: '#ffffff',
          selectAll: true,
          direction: 'ltr'
        }

        this.targetTextStyle = { font: '32px Arial', fill: '#ff0000', align: 'center' }
        this.wordTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
        this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
        this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
    }


  
    init(data) {
        this.cameras.main.setBackgroundColor('#0x5f6e7a')
    }
  
    preload() {
        console.log('Game Scene')
      
        // plugin
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true)
      
        // assets
        this.load.json('wordDataFile', 'https://random-word-api.herokuapp.com/all')
        this.load.image('starBackground', './assets/starBackground.png')
        this.load.image('ship', './assets/spaceShip.png')
        this.load.image('missile', './assets/missile.png')
        this.load.image('alien', './assets/alien.png')

        this.load.audio('laser', './assets/laser1.wav')
        this.load.audio('explosion', './assets/barrelExploding.wav')
        this.load.audio('bomb', './assets/bomb.wav')
    }


  
    create(data) {
        var textField = this.add.rexInputText(960, 980, 2000, 100, this.inputStyle).on('textchange', function() {
          inputText = textField.text
          console.log(inputText)
        })
      
        // background
        this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
        this.background.setOrigin(0, 0)

        // score
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
        this.inputText = this.add.text(350, 10, 'Input: ' + inputText, this.scoreTextStyle)

        // ship
        this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, "ship")

        // missile
        this.missileGroup = this.physics.add.group()

        // alien
        this.alienGroup = this.add.group()
        this.targetGroup = this.add.group()
        this.createAlien()
      
        // destroy function
        this.physics.add.collider(this.missileGroup, this.alienGroup, function(missileCollide, alienCollide) {
            alienCollide.destroy()
            missileCollide.destroy()
            
            this.sound.play('explosion')
            this.score = this.score + 1
            this.scoreText.setText('Score: ' + this.score.toString())
            this.createAlien()
        }.bind(this))

        // game over function
        this.physics.add.collider(this.ship, this.alienGroup, function(shipCollide, alienCollide) {
            this.sound.play('bomb')
            this.physics.pause()
            alienCollide.destroy()
            shipCollide.destroy()
            this.gameOverText = this.add.text(1920 / 2, 1080 / 2, "Game Over!\nClick to play again", this.gameOverTextStyle).setOrigin(0.5)
            this.gameOverText.setInteractive({ useHandCursor: true })
            this.gameOverText.on("pointerdown", () => this.scene.start("gameScene"))
        }.bind(this))
    }


  
    update(time, delta) {
        // control the ship
        const keyLeftObj = this.input.keyboard.addKey('LEFT')
        const keyRightObj = this.input.keyboard.addKey('RIGHT')
        const keySpaceObj = this.input.keyboard.addKey('SPACE')
        if (keyLeftObj.isDown === true) {
            this.ship.x -= 15
            if (this.ship.x < 0) {
                this.ship.x = 0
            }
        }

        if (keyRightObj.isDown === true) {
            this.ship.x += 15
            if (this.ship.x > 1920) {
                this.ship.x = 1920
            }
        }

        if (keySpaceObj.isDown === true) {
            if (this.fireMissile === false) {
                this.fireMissile = true
                const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
                this.missileGroup.add(aNewMissile)
                this.sound.play('laser')
            }
        }

        if (keySpaceObj.isUp === true) {
            this.fireMissile = false
        }

        // missile interaction
        this.missileGroup.children.each(function(item) {
            item.y = item.y - 15
            if (item.y < 0) {
                item.destroy
            }
        })

        // level count
        if (this.score >= this.level * 10) {
          this.createAlien()
          this.level = this.level + 1
        }

        // text input
        const keyEnterObj = this.input.keyboard.addKey('ENTER')
      
        if (keyEnterObj.isDown === true) {
          if (this.submitInput === false) {
            this.submitInput = true
            this.submit()
          }
        }

        if (keyEnterObj.isUp === true) {
          this.submitInput = false
        }

    }
}

export default GameScene
