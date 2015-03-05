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
    
    var game = new Phaser.Game( 1000, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        game.load.image('background', 'assets/background.png');
        game.load.image('lava', 'assets/lava.png');
        game.load.image('platform', 'assets/platform.png');
        game.load.audio('music', ['assets/What Beats Lava-.mp3', 'assets/What Beats Lava-.ogg']);
        game.load.spritesheet('bcMan', 'assets/BCSpriteSheet2.png',150,189);
        
        
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
    var counter = 0;
    var enemyCounter = 0;
    var hitCounter = 0;
    var chaosCounter = 0;
    var gameOver = false;
    var style = { font: "40px arial", fill: "black", align: "center"};
    var text;
    var textDuration = 0;
    var text2;
    var text3;
    var lava;
    var platform1;
    var platform2;
    var animation;
    var burn = false;
    var plat1Tween;
    var plat2Tween;
    var platform1Done = true;
    var platform2Done = true;
    var platSpeed = 0;
    var score = 0;
    var platBool = false;
    var jumpBool = true;
    
    function create() {
        music = game.add.audio('music');
        music.play("",0,1,true,true);
         background = game.add.sprite( '0', '0', 'background');

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        createGame();
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        


    }

    function createGame()
    {

        //assets
      
        platform1 = game.add.sprite( 0, 600, 'platform');
        platform2 = game.add.sprite(700,600, 'platform');
        animation = game.add.sprite(0,200,'bcMan',5);
        lava = game.add.sprite(0, 650, 'lava');
        animation.animations.add('burn',[18,19,20,21,22,23,24,25,26,27,28,29,30,31],15,false);
        animation.animations.add('walk',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],15,true);
    
        //enable physics
        game.physics.enable([animation,platform1,platform2,lava], Phaser.Physics.ARCADE);

        animation.body.allowGravity = true;
        animation.body.collideWorldBounds = true;
        animation.body.gravity.y = 300;
        run = 4;

        platform1.body.immovable = true;
        platform2.body.immovable = true;

        //keys
      
        regPosition = true;
       
        counterText = game.add.text(50,150, 'Score: 0', { font: "40px Arial", fill: "black", align: "center" });
       
       
        platSpeed = 1000;

    }

    function updateCounter()
    {
        if(!gameOver)
        {
            counter++;
            if (counter % 2 == 0)
            {
                platforms(1);
            }
            if (counter % 3 == 0)
            {
                platforms(2);
            }
            
        }
    }

    function platforms(choice)
    {
        if (plat1Tween == null && choice == 1)
        {
           plat1Tween = game.add.tween(platform1);
           plat1Tween.to({ x: game.rnd.integerInRange(-300, 200) }, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
           plat1Tween.start();
           platSpeed -= 10;
        }
        else if(choice == 1)
        {
            plat1Tween.stop();
            plat1Tween = null;
        }

        if (plat2Tween == null && choice == 2)
        {
            plat2Tween = game.add.tween(platform2);
            plat2Tween.to({ x: game.rnd.integerInRange(600, 1100)}, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
            plat2Tween.resume();
            platSpeed -= 10;
        }
        else if(choice == 2)
        {
            plat2Tween.stop();
            plat2Tween  = null;
        }
    }



    function walkAnimation()
    {
        if(upKey.isUp && downKey.isUp && leftKey.isUp && rightKey.isUp && burn == false)
        {
            animation.animations.stop(true,false);
        }
        else if(burn == false)
        {
            animation.animations.play('walk');
        }
    }

    function burnAnimation()
    {
        burn = true;
        if (!gameOver)
        {
            
             animation.animations.play('burn',15,false,false);
             gameOver = true;

             counterText.destroy();
           
           
             text = game.add.text( 50, 200, "Game Over!!!", style );
             text2 = game.add.text( 50, 250, "Your score was: " + score, style );
             text3 = game.add.text( 50, 300, "Press R to restart game!", style );

        }

    }

    function plat1Handler()
    {
        if(platBool)
        {
            score++;
            counterText.setText('Score: ' + score);
            platBool = !platBool;
        }
        jumpBool = true;
    }

    function plat2Handler()
    {
        if(!platBool)
        {
            score++;
            counterText.setText('Score: ' + score);
            platBool = !platBool;
        }
        jumpBool = true;
    }

    function resetGame()
    {
        if(gameOver)
        {
            text.destroy();
            text2.destroy()
            text3.destroy();
            gameOver = false;
            burn = false;
        }
        else
        {
            counterText.destroy();
        }
        platSpeed = 1000;
        platBool = false;
        score = 0;
        animation.destroy();
        platform1.destroy();
        platform2.destroy();
        counter = 0;
        createGame();
    }

    function update() {
     
       game.physics.arcade.collide(animation, platform1, plat1Handler, null, this);
       game.physics.arcade.collide(animation, platform2, plat2Handler, null, this);
       game.physics.arcade.overlap(animation, lava, burnAnimation, null, this);
      

        walkAnimation();
       

        if(!gameOver)
        {
            if (upKey.isDown)
            {
               animation.y -= run;
               
            }

            if (leftKey.isDown)
            {
                if(regPosition)
                {
                    animation.scale.x = -1;
                    animation.x += 150;
                    regPosition = !regPosition;
                }
                animation.x -= run;
            
            }
            else if (rightKey.isDown)
            {
                if(!regPosition)
                {
                    animation.scale.x = 1;
                    animation.x -= 150;
                    regPosition = !regPosition;
                }
                animation.x += run; 
            } 

            if(spaceKey.isDown && jumpBool)
            {
                jumpBool = false;
                if(regPosition)
                {
                    animation.body.velocity.setTo(0,-300);
                }
                else
                {
                    animation.body.velocity.setTo(0,-300);
                }
            }
        }

        if(resetKey.isDown)
        {
            resetGame();
        }

    }

   
};
