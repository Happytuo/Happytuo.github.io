(function() {
  const gameStart = {
    key: 'gameStart',
    preload: function() {
      this.load.image('sky', '../images/sky.jpg');
      this.load.image('mountain', '../images/mountain.png');
      this.load.image('ground', '../images/ground.jpg');

      this.load.spritesheet('player', '../images/player.png', {frameWidth: 69 , frameHeight: 50});
    },
    create: function() {
      this.sky = this.add.tileSprite(400, 50, 800, 100, 'sky');
      this.mountain = this.add.tileSprite(400, 90, 800, 50, 'mountain');
      this.ground = this.add.tileSprite(400, 350, 800, 500, 'ground');

      this.player = this.physics.add.sprite(50, 375, 'player');

      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 17 }),
        frameRate: 10,
        repeat: -1
      });

      this.input.keyboard.on('keyup', function(event) {
        console.log(event);
        console.log(this);
        switch (event.keyCode) {
          case 38:
            this.scene.player.y -= 50;
            break;
          case 40:
            this.scene.player.y += 50;
            break;
        }
      })

    },
    update: function() {
      this.sky.tilePositionX += 2;
      this.mountain.tilePositionX += 4;
      this.ground.tilePositionX += 4;

      this.player.anims.play('run', true);

      // console.log(this);

      // this.player.y -= 50;

      // let cursors = this.input.keyboard.createCursorKeys();

      // if (cursors.up.isDown) {
      //   this.player.setVelocityY(-100);
      //   console.log('up');
      // } else if (cursors.down.isDown) {
      //   this.player.setVelocityY(100);
      // } else {
      //   this.player.anims.play('run', true);
      //   this.player.setVelocityY(0);
      // }
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