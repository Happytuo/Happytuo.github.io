(function() {

  //障礙產生時的Y座標
  const getRandomYaxis = () => {
    return Math.floor(Math.random() * 9) * 50 + 125;
  }

  //障礙是否產生
  const isBarrierSpawn = () => {
    const random = Math.random();
    return random >= 0.98;
  }

  //信封是否產生
  const isMailSpawn = () => {
    const random = Math.random();
    return random >= 0.95;
  }

  //障礙種類
  const barrierTypeArr = ['bucket', 'stone'];

   //陣列隨機選擇器
  const arrayRandomSelector = (arr) => {
    const random = Math.random() * arr.length;

    return arr[Math.floor(random)];
  }

  const randomNumberSelector = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //當前角色的Y座標
  let playerCurrentYaxis = 375;
  
  //最大障礙數量
  let maxBarriers = 7;

  //最大信封數量
  let maxMails = 5;

  const gameStart = {
    key: 'gameStart',
    preload: function() {
      this.load.image('sky', '../images/sky.jpg');
      this.load.image('mountain', '../images/mountain.png');
      this.load.image('ground', '../images/ground.jpg');

      this.load.image('bucket', '../images/bucket.png');
      this.load.image('stone', '../images/stone.png');

      this.load.image('single_mail', '../images/simgle_mail.png');

      this.load.spritesheet('player', '../images/player.png', {frameWidth: 69 , frameHeight: 50});
      this.load.spritesheet('mail', '../images/mail.png', {frameWidth: 35 , frameHeight: 35});

      this.barrierArr = [];
      this.mailArr = [];
    },
    create: function() {
      this.sky = this.add.tileSprite(400, 50, 800, 100, 'sky');
      this.mountain = this.add.tileSprite(400, 90, 800, 50, 'mountain');
      this.ground = this.add.tileSprite(400, 350, 800, 500, 'ground');
      
      this.player = this.physics.add.sprite(250, playerCurrentYaxis, 'player');
      this.player.setCollideWorldBounds(true);
      this.player.setSize(50, 40);
      this.player.setDepth(1);

      this.barriers = this.physics.add.group();
      this.physics.add.collider(this.player, this.barriers);

      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 17 }),
        frameRate: 10,
        repeat: -1
      });

      for (let i = 1; i <= maxBarriers; i++) {
        const barrierType = arrayRandomSelector(barrierTypeArr);
        this.barrierArr.push(this.barriers.create(randomNumberSelector(1000, 0) + 850, getRandomYaxis(), barrierType));
        this.physics.add.collider(this.player, this.barrierArr[this.barrierArr.length - 1]);
      }

      for (let i = 1; i <= maxMails; i++) {
        this.mailArr.push(this.physics.add.sprite(randomNumberSelector(1000, 0) + 850, getRandomYaxis(), 'single_mail'));
        this.physics.add.collider(this.player, this.mailArr[this.mailArr.length - 1], getMail);
      }

      function getMail() {
        console.log(game);
      }

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
      });
    },
    update: function() {
      if(this.gameStop) return;
      this.sky.tilePositionX += 2;
      this.mountain.tilePositionX += 4;
      this.ground.tilePositionX += 4;
      this.player.anims.play('run', true);

      //判斷障礙物產生
      // if (isBarrierSpawn() && this.barrierArr.length !== maxBarriers) {
      //   const barrierType = arrayRandomSelector(barrierTypeArr);
      //   this.barrierArr.push(this.barriers.create(randomNumberSelector(500, 0) + 850, getRandomYaxis(), barrierType));

      //   this.barrierArr[this.barrierArr.length - 1].setSize(80, 50);
      //   this.physics.add.collider(this.player, this.barrierArr[this.barrierArr.length - 1]);
      // }

      //判斷信封產生
      // if (isMailSpawn() && this.mailArr.length !== maxMails) {
      //   this.mailArr.push(this.physics.add.sprite(randomNumberSelector(500, 0) + 850, getRandomYaxis(), 'single_mail'));

      //   this.physics.add.collider(this.player, this.mail);
      // }

      //偵測角色是否需要移動
      if (this.player.y > playerCurrentYaxis) {
        this.player.y -= 5;
      } else if (this.player.y < playerCurrentYaxis) {
        this.player.y += 5;
      }

      //移動信封
      if (this.mailArr) {
        this.mailArr.forEach((mail) => {
          if (mail.x <= -50) {
            mail.x = randomNumberSelector(500, 0) + 850;
            mail.y
          } else {
            mail.x -= 4;
          }
        });
      }

      //移動障礙
      if (this.barrierArr) {
        this.barrierArr.forEach((barrier) => {
          if (barrier.x <= -50) {
            barrier.x = randomNumberSelector(500, 0) + 850;
            barrier.y
          } else {
            barrier.x -= 4;
          }
        });
      }
    }
  }

  const gameOver = {
    key: 'gameOver'
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