/* Global Phaser */

// Copyright (c) Youngwook All rights reserved
//
// Created by: Youngwook
// Created on: Nov 2022
// This file contains the JS functions for index.html

/**
 * This class is the Title Scene
**/
let inputText = null
let GameSceneInfo = null

class GameScene extends Phaser.Scene {
    createAlien() {
        // get target word
        var wordDataList = this.cache.json.get('wordDataFile')
        var random = Math.floor(Math.random() * wordDataList.length)
        var targetWord = wordDataList[random]

        // get random alien location
        const alienYLocation = Math.floor(Math.random() * 680) + 100
        let alienXVelocity = 100 // Math.floor(Math.random() * 300) + 160 - (targetWord.length * 10)
        const anAlien = this.physics.add.sprite(0, alienYLocation, 'alien')
        anAlien.body.velocity.x = alienXVelocity 
        anAlien.body.velocity.y = 0
        anAlien.target = targetWord
        console.log(targetWord)
        
        const targetText = this.add.text(0, alienYLocation, targetWord, this.targetTextStyle).setOrigin(0.5)
        this.physics.world.enableBody(targetText)
        targetText.body.setVelocity(alienXVelocity , 0)

        this.alienGroup.add(anAlien)
        this.targetGroup.add(targetText)

        // anAlien.setInteractive()
        // anAlien.on('pointerdown', function (pointer) {
        //   console.log("click")
        //   if (inputText == anAlien.target) {
        //     anAlien.destroy()
        //     targetText.destroy()

        //     console.log(this)
        //   }
        // })
    }

    constructor() {
        super({ key: 'gameScene' })

        this.background = null
        this.ship = null
        this.fireMissile = false
        this.submitInput = false
        this.debugInput = false
        this.ultInput = false
        this.score = 0
        this.ult = 0
        this.life = 3
        this.scoreText = null
        this.inputText = null
        this.ultimateText = null
        this.level = 1
        this.localScore = null

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

        this.targetTextStyle = { font: '48px Arial', fill: '#ff0000', align: 'center' }
        this.inputTextStyle = { font: '64px Arial', fill: '#00ff00', align: 'center' }
        this.scoreTextStyle = { font: '50px Arial', fill: '#ffffff', align: 'center' }
        this.gameOverTextStyle = { font: '64px Arial', fill: '#ff0000', align: 'center' }
    }


  
    init(data) {
        this.cameras.main.setBackgroundColor('#0x5f6e7a')
    }
  
    preload() {
        console.log('Game Scene')
        console.log(this)
      
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
        GameSceneInfo = this
        this.textField = this.add.rexInputText(960, 980, 2000, 100, this.inputStyle).on('textchange', function(i, e, scene = GameSceneInfo) {
          inputText = scene.textField.text
          console.log(inputText)
        })
      
        // background
        this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
        this.background.setOrigin(0, 0)

        // score
        this.inputText = this.add.text(10, 850, 'Input: ' + inputText, this.inputTextStyle)
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
        this.ultText = this.add.text(300, 10, this.ult.toString() + " %", this.scoreTextStyle)
        this.lifeText = this.add.text(600, 10, 'life: ' + this.life.toString(), this.scoreTextStyle)

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
      GameSceneInfo = this
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
                item.destroy()
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
            
            console.log("input : " + inputText)
            this.inputText.setText('input: ' + inputText)

            if (inputText != null) {
              var returnIndex = this.targetGroup.children.entries.findIndex(function (data) {return data._text === inputText})
              // console.log("returnIndex = " + returnIndex)
              
              if (returnIndex != -1){   
                this.targetGroup.children.entries[returnIndex].destroy()
                
               // if (returnIndex != 0){
                  this.targetGroup.children.entries.splice(returnIndex, 1)
                //}
              }

              var spriteIndex = this.alienGroup.children.entries.findIndex(function (data) {return data.target === inputText})
              // console.log("spriteIndex = " + spriteIndex)
              // console.log(this)
              
              if (spriteIndex != -1){   
                this.ult = this.ult + this.alienGroup.children.entries[spriteIndex].target.length + 100
                this.ultText.setText(this.ult.toString() + " %")
                
                this.alienGroup.children.entries[spriteIndex].destroy()
                // create alien
                this.createAlien()
                this.sound.play('explosion')
                this.score = this.score + 1
                this.scoreText.setText('Score: ' + this.score.toString())
                
                if (spriteIndex != 0){
                  this.alienGroup.children.entries.splice(spriteIndex, 1)
                }
              }
              console.log(this)
            }
          }
        }

        if (keyEnterObj.isUp === true) {
          this.submitInput = false
        }

        // debug
        const keySlashObj = this.input.keyboard.addKey('FORWARD_SLASH')
      
        if (keySlashObj.isDown === true) {
          if (this.debugInput === false) {
            this.debugInput = true
            console.log(this.missileGroup.children)
            console.log(this.alienGroup.children)
            console.log(this)
          }
        }

        if (keySlashObj.isUp === true) {
          this.debugInput = false
        }

        // game over
        this.alienGroup.children.each(function(item, e, scene = GameSceneInfo) {
          if (item.x >= 1920) {
            scene.sound.play('bomb')
            scene.life = scene.life - 1
            scene.lifeText.setText('Life: ' + scene.life.toString())
            scene.createAlien()
            
            item.destroy()
          }
        })

        this.targetGroup.children.each(function(item) {
          if (item.x >= 1920) {
              item.destroy()
          }
        })

        if (this.life <= 0) {
          this.physics.pause()
          this.textField.destroy()

          localStorage.setItem('score', this.score)
          this.localScore = localStorage.getItem('score')
          console.log(this.localScore)

          this.score = 0
          this.ult = 0
          this.life = 3
          
          this.scene.start("overScene")
        }

        // ult
        const keyTabObj = this.input.keyboard.addKey('TAB')
        if (keyTabObj.isDown === true) {
          if (this.ultInput === false) {
            this.ultInput = true

            if (this.ult >= 100) {
              console.log("ult")
              this.ult = this.ult - 100
              this.ultText.setText(this.ult.toString() + " %")
            } else {
              console.log("ult failed")
            }
          }
        }

        if (keyTabObj.isUp === true) {
          this.ultInput = false
        }
    }
}

export default GameScene
