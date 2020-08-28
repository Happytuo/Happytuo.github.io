(function() {

  //障礙產生時的Y座標
  const getRandomYaxis = () => {
    return Math.floor(Math.random() * 9) * 50 + 125;
  }

  //障礙是否產生
  const isBarrierSpawn = () => {
    const random = Math.random();
    if (random < 0.98) {
      return false;
    } else {
      return true;
    }
  }

  //障礙種類
  const barrierTypeArr = ['bucket', 'stone'];

  //障礙選擇器
  const barrierSelector = (arr) => {
    const random = Math.random() * arr.length;

    return Math.floor(random);
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

      this.load.spritesheet('player', '../images/player.png', {frameWidth: 69 , frameHeight: 50});
      this.load.spritesheet('mail', '../images/mail.png', {frameWidth: 35 , frameHeight: 35});

      this.barrierArr = [];
    },
    create: function() {
      this.sky = this.add.tileSprite(400, 50, 800, 100, 'sky');
      this.mountain = this.add.tileSprite(400, 90, 800, 50, 'mountain');
      this.ground = this.add.tileSprite(400, 350, 800, 500, 'ground');
      
      this.player = this.physics.add.sprite(250, playerCurrentYaxis, 'player');
      this.player.setCollideWorldBounds(true);
      this.player.setSize(50, 40);

      this.barrierGroup = this.physics.add.group();

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

      //判斷障礙物產生
      if (isBarrierSpawn()) {
        const barrierType = barrierTypeArr[barrierSelector(barrierTypeArr)];
        this.barrierArr.push(this.physics.add.image(900, getRandomYaxis(), barrierType));
        console.log(this);
        // this.barrierGroup.add(this.physics.add.image(900, getRandomYaxis(), barrierType))
        // console.log(this.barrierArr);
        // this.barrierArr.pop().setSize(this.barrierArr.pop().width, 50);
        // this.physics.add.collider(this.player, this.barrierArr.pop());
        // this.barrier[barrierType] = this.physics.add.image(900, getRandomYaxis(), barrierType);
        // this.barrier[barrierType].setSize(this.barrier[barrierType].width, 50);
        // this.physics.add.collider(this.player, this.barrier[barrierType]);
      }

      //偵測角色是否需要移動
      if (this.player.y > playerCurrentYaxis) {
        this.player.y -= 5;
      } else if (this.player.y < playerCurrentYaxis) {
        this.player.y += 5;
      }

      //移動障礙
      if (this.barrierArr) {
        this.barrierArr.forEach((barrier, index) => {
          if (barrier.x <= -50) {
            barrier.destroy();
          } else {
            barrier.x -= 4;
          }
        });
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