let config = {
  renderer: Phaser.AUTO,
  width: innerWidth-15,
  height: innerHeight-15,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 100 },
        debug: false
    }
  },
  scene: {
    preload, create, update
  }
};

let game = new Phaser.Game(config);
let isGameStarted=false;
let hasLanded=false;
let hasBumped=false;
let messageText;
let columnUpClass=new Phaser.Class(
  {
    Extends: Phaser.Physics.Arcade.Image,
    initialize: function columnUpClass(scene){
      Phaser.GameObjects.Image.call(this,scene,0,0,'column')
    }
  }
)
let columnDownClass=new Phaser.Class(
  {
    Extends: Phaser.Physics.Arcade.Image,
    initialize: function columnDownClass(scene){
      Phaser.GameObjects.Image.call(this,scene,0,0,'column')
    }
  }
)

function preload () {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create () {
  this.cursors = this.input.keyboard.createCursorKeys();
   this.background = this.add.image(0,0, 'background').setOrigin(0, 0);
   const screenWidth = this.sys.game.config.width;
   const screenHeight = this.sys.game.config.height;
   this.background.displayWidth = screenWidth;
   this.background.displayHeight = screenHeight;
   
   this.pipeUp=this.physics.add.group(
    {
      classType: columnUpClass,
      runChildUpdate:true,
      allowGravity:false
    }
   )
   this.pipeDown=this.physics.add.group(
    {
      classType: columnDownClass,
      runChildUpdate:true,
      allowGravity:false
    }
   )
   this.bird=this.physics.add.sprite(100,game.config.height/2,'bird').setScale(3);
   this.bird.setBounce(0.2);
this.bird.setCollideWorldBounds(true);
   
   this.physics.add.collider(this.bird,this.pipeUp,birdDie,null,this);
   this.physics.add.collider(this.bird,this.pipeDown,birdDie,null,this);
this.bird.body.onWorldBounds = true; 

this.physics.world.on('worldbounds', (body, up, down, left, right) => {
  if (down) {
    birdDie.call(this, this.bird); 
  }
});
messageText = this.add.text(
  game.config.width / 2,
  game.config.height / 2,
  'You Crashed!',
  {
    fontSize: '48px',
    fill: '#ff0000',
    fontFamily: 'Arial'
  }
).setOrigin(0.5).setVisible(false);
 

 
 



//   this.physics.add.collider(bird, topColumns);
//   this.physics.add.collider(bird, bottomColumns);
  



 }
let posX=1000;
function update (time) {
 


if(hasBumped)
{
  return;
}
if(time%9==0)
{
  if(time%6==0)
  {
    this.colU=this.pipeUp.get().setActive(true).setVisible(true).setPosition(posX+100,10);
    this.colD=this.pipeDown.get().setActive(true).setVisible(true).setPosition(posX+100,game.config.height);
  }
  else
  {
    this.colU=this.pipeUp.get().setActive(true).setVisible(true).setPosition(posX+100,40);
    this.colD=this.pipeDown.get().setActive(true).setVisible(true).setPosition(posX+100,game.config.height+40);
  }
  this.colU.setVelocityX(-200)
  this.colD.setVelocityX(-200)
  posX+=100
}
 if(this.cursors.up.isDown ) {
    this.bird.setVelocityY(-200);
}
else{
  this.bird.setVelocityY(200);
}


 }
 function birdDie(b,p)
 {
  hasBumped=true;
  b.active=false;
b.disableBody(true,true); 
  this.pipeUp.children.iterate(pipe => {
    if (pipe && pipe.body) {
      pipe.body.setVelocityX(0);
    }
  });
  this.pipeDown.children.iterate(pipe => {
    if (pipe && pipe.body) {
      pipe.body.setVelocityX(0);
    }
  });
messageText.setVisible(true);
  // Optional: stop physics simulation
  this.physics.pause();


 }