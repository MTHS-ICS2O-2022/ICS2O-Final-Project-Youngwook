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
let GameSceneInfo = null

class GameScene extends Phaser.Scene {
    createAlien() {
        // get target word
        var wordDataList = this.cache.json.get('wordDataFile')
        var random = Math.floor(Math.random() * wordDataList.length)
        var targetWord = wordDataList[random]

        // get random alien location
        const alienYLocation = Math.floor(Math.random() * 680) + 100
        let alienXVelocity = Math.floor(Math.random() * 200) + 200 - (targetWord.length * 25) + (this.level * 10)
        if (alienXVelocity < 50) {
          alienXVelocity = 50
        }
        const anAlien = this.physics.add.sprite(0, alienYLocation, 'alien')
        anAlien.body.velocity.x = alienXVelocity 
        anAlien.body.velocity.y = 0
        anAlien.target = targetWord
        console.log(targetWord)
        
        const targetText = this.add.text(0, alienYLocation, targetWord, this.targetTextStyle).setOrigin(0.5)
        this.physics.world.enableBody(targetText)
        targetText.body.setVelocity(alienXVelocity , 0)
        targetText.target = targetWord

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
        this.ultActive = false
        this.score = 0
        this.ult = 0
        this.life = 3
        this.level = 1
        this.scoreText = null
        this.inputText = null
        this.ultimateText = null
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
        this.inputTextStyle = { font: '64px Arial', fill: '#ffffff', align: 'center' }
        this.scoreTextStyle = { font: '50px Arial', fill: '#00ffff', align: 'center' }
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
        
        this.load.image('ship', './assets/spaceShip.png')
        this.load.image('missile', './assets/missile.png')
        this.load.image('alien', './assets/alien.png')

        this.load.image('space0', './assets/space/space.png')
        this.load.image('space1', './assets/space/front.png')
        this.load.image('space2', './assets/space/back.png')
        this.load.image('space3', './assets/space/top.png')
        this.load.image('space4', './assets/space/bottom.png')
        this.load.image('space5', './assets/space/right.png')
        this.load.image('space6', './assets/space/left.png')

        this.load.audio('laser', './assets/laser1.wav')
        this.load.audio('bomb', './assets/barrelExploding.wav')
        this.load.audio('over', './assets/laserbig.wav')
        this.load.audio('ult', './assets/laserblast.wav')
        this.load.audio('spark', './assets/spark.wav')
    }
  
    create(data) {
        GameSceneInfo = this
        // text field
        this.textField = this.add.rexInputText(960, 980, 2000, 100, this.inputStyle).on('textchange', function(i, e, scene = GameSceneInfo) {
          inputText = scene.textField.text
        })
      
        // background
        // this.background = this.add.image(0, 0, 'space0').setScale(2.0)
        // this.background.setOrigin(0, 0)

        const space0 = this.add.image(0,0, 'space0').setOrigin(0 , 0).setScale(2.0)
        space0.visible = true
        const space1 = this.add.image(0,0, 'space1').setOrigin(0 , 0).setScale(2.0)
        space1.visible = false
        const space2 = this.add.image(0,0, 'space2').setOrigin(0 , 0).setScale(2.0)
        space2.visible = false
        const space3 = this.add.image(0,0, 'space3').setOrigin(0 , 0).setScale(2.0)
        space3.visible = false
        const space4 = this.add.image(0,0, 'space4').setOrigin(0 , 0).setScale(2.0)
        space4.visible = false
        const space5 = this.add.image(0,0, 'space5').setOrigin(0 , 0).setScale(2.0)
        space5.visible = false
        const space6 = this.add.image(0,0, 'space6').setOrigin(0 , 0).setScale(2.0)
        space6.visible = false
      
        this.spaceList = [space0, space1, space2, space3, space4, space5, space6]

        // score
        this.inputText = this.add.text(10, 850, 'Input: ' + inputText, this.inputTextStyle)
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
        this.ultText = this.add.text(300, 10, this.ult.toString() + " %", this.scoreTextStyle)
        this.lifeText = this.add.text(600, 10, 'Life: ' + this.life.toString(), this.scoreTextStyle)

        // ship
        this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, "ship")

        // missile
        this.missileGroup = this.physics.add.group()

        // alien
        this.alienGroup = this.add.group()
        this.targetGroup = this.add.group()
        this.createAlien()
        this.createAlien()
        this.createAlien()
      
        // // destroy function
        // this.physics.add.collider(this.missileGroup, this.alienGroup, function(missileCollide, alienCollide) {
        //     alienCollide.destroy()
        //     missileCollide.destroy()
            
        //     this.sound.play('explosion')
        //     this.score = this.score + 1
        //     this.scoreText.setText('Score: ' + this.score.toString())
        //     this.createAlien()
        // }.bind(this))

        // // game over function
        // this.physics.add.collider(this.ship, this.alienGroup, function(shipCollide, alienCollide) {
        //     this.sound.play('bomb')
        //     this.physics.pause()
        //     alienCollide.destroy()
        //     shipCollide.destroy()
        //     this.gameOverText = this.add.text(1920 / 2, 1080 / 2, "Game Over!\nClick to play again", this.gameOverTextStyle).setOrigin(0.5)
        //     this.gameOverText.setInteractive({ useHandCursor: true })
        //     this.gameOverText.on("pointerdown", () => this.scene.start("gameScene"))
        // }.bind(this))
    }


  
    update(time, delta) {
      GameSceneInfo = this
      if (this.ultActive == true) {
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
      }
      
        // level count
        if (this.score >= this.level * 10) {
          this.level = this.level + 1
          var returnIndex = this.spaceList.findIndex(function (data) {return data.visible === true})
          if (returnIndex != -1){
            this.spaceList[returnIndex].visible = false
            var spaceListRandom = Math.floor(Math.random() * this.spaceList.length)
            console.log(spaceListRandom)
            this.spaceList[spaceListRandom].visible = true
          }
          this.createAlien()
        }

        // text input
        const keyEnterObj = this.input.keyboard.addKey('ENTER')
      
        if (keyEnterObj.isDown === true) {
          if (this.submitInput === false) {
            this.submitInput = true
            
            this.inputText.setText('Input: ' + inputText)

            if (inputText != null) {
              var returnIndex = this.targetGroup.children.entries.findIndex(function (data) {return data.target === inputText})
              // console.log("returnIndex = " + returnIndex)
              
              if (returnIndex != -1){   
                this.targetGroup.children.entries[returnIndex].destroy()
                
                this.ult = Math.round(this.ult + this.alienGroup.children.entries[returnIndex].target.length + (this.alienGroup.children.entries[returnIndex].target.length * this.level / 10))
                this.ultText.setText(this.ult.toString() + " %")
                
                this.alienGroup.children.entries[returnIndex].destroy()
                // create alien
                this.createAlien()
                this.sound.play('laser')
                this.score = this.score + 1
                this.scoreText.setText('Score: ' + this.score.toString())
              } else {
                this.sound.play('spark')
              }
            }
          }
          this.textField.setText("")
        }

        if (keyEnterObj.isUp === true) {
          this.submitInput = false
        }

        // debug
        const keySlashObj = this.input.keyboard.addKey('FORWARD_SLASH')
        if (keySlashObj.isDown === true) {
          if (this.debugInput === false) {
            this.debugInput = true
            
            console.log(this)
            this.inputText.setText('Input:')
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
          this.sound.play('over')
          this.physics.pause()
          this.textField.destroy()

          localStorage.setItem('score', this.score)
          this.localScore = localStorage.getItem('score')
          console.log(this.localScore)

          this.score = 0
          this.ult = 0
          this.level = 1
          this.life = 3
          inputText = ""

          this.spaceList[0].visible = true
          this.spaceList[1].visible = false
          this.spaceList[2].visible = false
          this.spaceList[3].visible = false
          this.spaceList[4].visible = false
          this.spaceList[5].visible = false
          this.spaceList[6].visible = false
          
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
              const alienNumber = this.alienGroup.children.entries.length
              console.log(this.alienGroup.children.entries.length)

              this.alienGroup.children.each(function(item) {
                item.destroy()
              })

              this.targetGroup.children.each(function(item) {
                item.destroy()
              })

              for (let count = 0; count < alienNumber; count++) {
                this.createAlien()
                this.score = this.score + 1
                this.scoreText.setText('Score: ' + this.score.toString())
                this.sound.play('ult')
              }
            
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

