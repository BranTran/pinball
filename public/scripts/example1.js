class example1 extends Phaser.Scene {
  constructor(){
    super{{key:'example1'}};
  }


  preload(){//Preload stuff, set with key
      this.load.image('space','assets/space.jpg');
      this.load.image('pinball','assets/pinball.jpg');
  }

  create(){
    this.image = this.add.image(400,300,'space');
  }
}
