window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.image('background', 'assets/cave_back.png');
        game.load.image('spiral', 'assets/spiral.png');
        game.load.audio('music', ['assets/Craved In.mp3', 'assets/Craved In.ogg']);
        game.load.spritesheet('bat', 'assets/batsheet.png',200,80);
      
        
    }
    
    var music;
    var background;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var regPosition;
    var run;
    var spaceKey;
    var resetKey;
    var duration = 0;
    var counterText;
    var deathText;
    var counter = 0;
    var tempCounter = 5;
    var round = 1;
    var start = false;
    var gameOver = false;
    var style = { font: "40px arial", fill: "black", align: "center"};
    var text;
    var textDuration = 0;
    var successText;
    var tempCounterText;
    var animation;
    var timer = 5;
    var spiral;
    var spiralSpeed = 200;
    var successBool = false;
    var spiralSize = .5;
    var spiralTween;
    
    function create() {
        music = game.add.audio('music');
        music.play("",0,1,true,true);
       
        background = game.add.sprite( '0', '0', 'background');
       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        createGame(true);
        //game.world.setBounds(0, 0, 3900, 800);
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        


    }

    function createGame()
    {
        
        //assets
      
       
         spiral = game.add.sprite(300,300,'spiral', .2);
         animation = game.add.sprite(0,200,'bat',3);
       
      
       
       animation.animations.add('fly',[0,1,2,3,4,5],15,true);
       animation.animations.play('fly');
        
        //enable physics
        game.physics.enable([animation,spiral], Phaser.Physics.ARCADE);

      
        animation.body.collideWorldBounds = true;
        spiral.body.collideWorldBounds = true;
        spiral.body.bounce.setTo(1, 1);
        game.add.tween(spiral.scale).to( { x: .9, y: .9 }, 500, Phaser.Easing.Linear.None, true, 0, 500, true);
        run = 4;

       
        deathText = game.add.text(400,150, '',{ font: "40px Arial", fill: "black", align: "center" });

        //keys
    
        
         text = game.add.text(50,30, 'Round ' + round, { font: "40px Arial", fill: "black", align: "center" });
         counterText = game.add.text(50,75, 'Time: ' + timer, { font: "40px Arial", fill: "black", align: "center" });
         successText = game.add.text(575,30, 'Ready',{ font: "40px Arial", fill: "black", align: "center" });
         tempCounterText = game.add.text(600,75, tempCounter, { font: "40px Arial", fill: "black", align: "center" });
         
        
             
        
    }


    function updateCounter()
    {

        if(!gameOver)
        {
            
            if(!start)
            {
                if (tempCounter > 0)
                {
                    tempCounter--;
                    tempCounterText.setText(tempCounter);
                }
                else
                {
                    spiralStart();
                    start = true;
                    timer = 5;
                    successText.setText('Go!');
                    tempCounterText.setText('');
                }
            }
            else
            {
                tempCounter = 5;
                 if (start && timer > 1)
                    {
                        timer--;
                        counterText.setText('Time: ' + timer);
                        
                    }
                    else
                    {
                        timer--;
                        spiral.body.velocity.setTo(0, 0);
                        spiralSpeed += 30;
                        spiralSize = spiralSize + (spiralSize * 2);

                        if(successBool)
                        {
                            round++;
                            text.setText('Round: '+ round);
                            successText.setText('Ready');
                            start = false;
                            successBool = false;
                            timer = 5;
                            counterText.setText('Time: ' + timer);
                            run++;
                        }
                        else
                        {
                            successText.setText('Game Over');
                            tempCounterText.setText('Press R\nTo Restart');
                            gameOver = true;
                        }
                    }
            }
           
        
        }


    }

    function collisionHandler()
    {
        if (timer <= 1)
        {
             successBool = true;
        }
    }


  
    function resetGame()
    {
        spiral.destroy();
        animation.destroy();
      
      
        run = 4;
        timer = 5;
        round = 1;
        tempCounter = 5;
        start = false;
        gameOver = false;
       
       
        text.destroy();
        counterText.destroy(); 
        successText.destroy();
        tempCounterText.destroy();
        createGame(true);
      
        
    }

    function spiralStart()
    {
        // spiralTween = game.add.tween(spiral.scale);
        // spiralTween.to({ y: 1.0 - spiralSize, x: 1.0 - spiralSize}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

        spiral.body.velocity.setTo(game.rnd.integerInRange(spiralSpeed, spiralSpeed + 50), game.rnd.integerInRange(spiralSpeed, spiralSpeed + 50));
        
    }

    function update() {
     
      
        game.physics.arcade.overlap(animation, spiral, collisionHandler, null, this);
      
  
        if(!gameOver && timer>0)
        {
            

            if (upKey.isDown)
            {
               animation.y -= run;
               
            }
            else if(downKey.isDown)
            {
                 animation.y += run;
            }

            if (leftKey.isDown)
            {
               
                animation.x -= run;
            
            }
            else if (rightKey.isDown)
            {
               
                animation.x += run; 
            } 

            
        }

        if(resetKey.isDown)
        {
            resetGame();
        }

    
    }

   
};
