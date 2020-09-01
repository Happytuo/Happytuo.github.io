(function() {

  //障礙產生時的Y座標
  const getRandomYaxis = () => {
    return Math.floor(Math.random() * 9) * 50 + 125;
  }

  //障礙種類
  const barrierTypeArr = ['bucket', 'stone'];

   //陣列隨機選擇器
  const arrayRandomSelector = (arr) => {
    const random = Math.random() * arr.length;

    return arr[Math.floor(random)];
  }

  //數值隨機選擇器
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
      this.load.image('score_mail', '../images/score_mail.png');

      this.load.spritesheet('player', '../images/player.png', {frameWidth: 69 , frameHeight: 50});

      this.barrierArr = [];
      this.mailArr = [];
      
      this.score = 0;
      this.gameStop = false;
    },
    create: function() {
      //基本背景
      this.sky = this.add.tileSprite(400, 50, 800, 100, 'sky');
      this.mountain = this.add.tileSprite(400, 90, 800, 50, 'mountain');
      this.ground = this.add.tileSprite(400, 350, 800, 500, 'ground');
      
      //玩家設定
      this.player = this.physics.add.sprite(250, playerCurrentYaxis, 'player');
      this.player.setCollideWorldBounds(true);
      this.player.setSize(30, 30);
      this.player.setDepth(1);

      //群組設定
      this.barriers = this.physics.add.group();

      //玩家動畫
      this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 17 }),
        frameRate: 10,
        repeat: -1
      });
      
      //Game over
      const hittest  = (player, barrier) => {
        this.gameStop = true;
        this.physics.pause();
        alert(`遊戲結束, 你的分數是${this.score}分!`);
        this.scene.start('gameStart')
      }

      //得分!
      const getMail = (player, mail) => {
        this.score = this.score + 1;
        mail.destroy(true);
      }

      //產生障礙物
      for (let i = 1; i <= maxBarriers; i++) {
        const barrierType = arrayRandomSelector(barrierTypeArr);
        this.barrierArr.push(this.barriers.create(randomNumberSelector(1000, 0) + 850, getRandomYaxis(), barrierType));
        this.physics.add.collider(this.player, this.barrierArr[this.barrierArr.length - 1], hittest);
        this.barrierArr[this.barrierArr.length - 1].setSize(this.barrierArr[this.barrierArr.length - 1].width - 40, 40, true);
      }

      //產生信封
      for (let i = 1; i <= maxMails; i++) {
        this.mailArr.push(this.physics.add.sprite(randomNumberSelector(1000, 0) + 850, getRandomYaxis(), 'single_mail'));
        this.physics.add.collider(this.player, this.mailArr[this.mailArr.length - 1], getMail);
      }

      //計分區域
      this.score_mail = this.add.image(40, 560, 'score_mail');
      this.scoreText = this.add.text(70, 550, `X ${this.score}`, { fontSize: '22px', fill: '#FFFFFF' });

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

      //pointer event
      this.input.on('pointerdown', function(pointer) {
        if (pointer.y < 400 && this.scene.player.y >= 150 && this.scene.player.y === playerCurrentYaxis) {
            playerCurrentYaxis -= 50;
        } 

        if (pointer.y > 400 && this.scene.player.y <= 500 && this.scene.player.y === playerCurrentYaxis) {
          playerCurrentYaxis += 50;
      } 
      });
    },
    update: function() {
      if(this.gameStop) return;
      //基本背景畫面移動
      this.sky.tilePositionX += 2;
      this.mountain.tilePositionX += 4;
      this.ground.tilePositionX += 4;
      this.player.anims.play('run', true);

      //更新分數
      this.scoreText.setText(`X ${this.score}`);

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
            mail.y = getRandomYaxis();
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
            barrier.y = getRandomYaxis();
          } else {
            barrier.x -= 4;
          }
        });
      }

      //檢查物件位置避免重疊
      const checkPosition = () => {
        const allObj = this.barrierArr.concat(this.mailArr);
        const allObjSort = allObj.sort(function(a, b) {
          return b.x - a.x;
        });

        allObjSort.forEach((item, index) => {
          if (allObjSort[index + 1] && Math.abs(allObjSort[index].x - allObjSort[index + 1].x) < 100) {
            allObjSort[index].x = allObjSort[index + 1].x + 100;
          }
        });

      }
      checkPosition();
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
        }
      }
    },
    scene: [
      gameStart
    ]
  }
  const game = new Phaser.Game(config);
})();