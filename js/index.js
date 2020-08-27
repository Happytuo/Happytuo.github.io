(function() {
  //障礙產生時的Y座標
  const getRandomYaxis = () => {
    return Math.floor(Math.random() * 9) * 50 + 125;
  }

  //障礙是否產生
  const isBarrierSpawn = () => {
    const random = Math.random();
    if (random < 0.95) {
      return false;
    } else {
      return true;
    }
  }

  //當前角色的Y座標
  let playerCurrentYaxis = 375;

  const gameStart = {
    key: 'gameStart',
    preload: function() {
      this.load.image('sky', '../images/sky.jpg');
      this.load.image('mountain', '../images/mountain.png');
      this.load.image('ground', '../images/ground.jpg');

      this.load.image('bucket', '../images/bucket.png');
      this.load.image('stone', '../images/stone.png');

      this.load.image('mail', '../images/mail.png');

      this.load.spritesheet('player', '../images/player.png', {frameWidth: 69 , frameHeight: 50});
    },
    create: function() {
      this.sky = this.add.tileSprite(400, 50, 800, 100, 'sky');
      this.mountain = this.add.tileSprite(400, 90, 800, 50, 'mountain');
      this.ground = this.add.tileSprite(400, 350, 800, 500, 'ground');
      
      this.player = this.physics.add.sprite(250, playerCurrentYaxis, 'player');
      this.player.setCollideWorldBounds(true);

      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 17 }),
        frameRate: 10,
        repeat: -1
      });

      //keyboard event
      this.input.keyboard.on('keydown', function(event) {
        switch (event.keyCode) {
          case 38:
            if (this.scene.player.y >= 150 && this.scene.player.y === playerCurrentYaxis) {
              playerCurrentYaxis -= 50;
            }
            break;
          case 40:
            if (this.scene.player.y <= 500 && this.scene.player.y === playerCurrentYaxis) {
              playerCurrentYaxis += 50;
            }
            break;
        }
      })

    },
    update: function() {
      this.sky.tilePositionX += 2;
      this.mountain.tilePositionX += 4;
      this.ground.tilePositionX += 4;
      this.player.anims.play('run', true);

      //偵測角色是否需要移動
      if (this.player.y > playerCurrentYaxis) {
        this.player.y -= 5;
      } else if (this.player.y < playerCurrentYaxis) {
        this.player.y += 5;
      }
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 0
        },
        debug: true
      }
    },
    scene: [
      gameStart
    ]
  }
  const game = new Phaser.Game(config);
})();