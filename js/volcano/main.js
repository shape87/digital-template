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
        game.load.image('background', 'assets/background2.png');
        game.load.image('lava', 'assets/lava.png');
        game.load.image('lava2', 'assets/lava2.png');
        game.load.image('lava3', 'assets/lava3.png');
        game.load.image('platform', 'assets/platform.png');
        game.load.audio('music', ['assets/What Beats Lava-.mp3', 'assets/What Beats Lava-.ogg']);
       // game.load.audio('music', ['assets/Craved In.mp3', 'assets/Craved In.ogg']);
        game.load.spritesheet('bcMan', 'assets/BCSpriteSheet2.png',150,189);
        game.load.spritesheet('bCry', 'assets/BCCrySprite.png',80,80);
        game.load.spritesheet('finalPlatform', 'assets/finalplatform.png');
        game.load.spritesheet('flag', 'assets/flag.png');
        game.load.spritesheet('bat', 'assets/batsheet.png',200,85);
        game.load.spritesheet('spiral', 'assets/spiral.png');
        
    }
    
    var music;
    var background;
    var gameoverBackground;
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
    var lava2;
    var lava3;
    var platform1;
    var platform2;
    var platform3;
    var platform4;
    var platform5;
    var endPlatform;
    var flag;
    var animation;
    var deathAnimation;
    var burn = false;
    var plat1Tween;
    var plat2Tween;
    var plat3Tween;
    var plat4Tween;
    var plat5Tween;
    var platSpeed = 0;
    var timer = 0;
    var platBool = false;
    var jumpBool = true;
    var lives = 3;
    var deathBool = false;
    var win = false;
    var batGroup;
    var spiralGroup;
    
    function create() {
        music = game.add.audio('music');
        music.play("",0,1,true,true);
       
        background = game.add.sprite( '0', '0', 'background');
       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        createGame(true);
        game.world.setBounds(0, 0, 3900, 1200);
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        


    }

    function createGame(totalReset)
    {
        
        //assets
        lava = game.add.sprite(0, 1030, 'lava3');
        var lavaTween = game.add.tween(lava);
        lavaTween.to({ y: 1070}, 2000, Phaser.Easing.Linear.None, true, 0, 2000, true);
        lava2 = game.add.sprite(0, 1040, 'lava2');
        var lavaTween2 = game.add.tween(lava2);
        lavaTween2.to({ y: 1070}, 1750, Phaser.Easing.Linear.None, true, 0, 2000, true);
        platform1 = game.add.sprite(0, 1000, 'platform');
        platform2 = game.add.sprite(900,1000, 'platform');
        platform3 = game.add.sprite(1400, 1000, 'platform');
        platform4 = game.add.sprite(2100,950, 'platform');
        platform5 = game.add.sprite(2800, 825, 'platform');
        flag = game.add.sprite(3800,890,'flag');
        endPlatform = game.add.sprite(3700,1030,'finalPlatform');

        batGroup = game.add.group();
        spiralGroup = game.add.group();

        bats();
       
       
        animation = game.add.sprite(0,900,'bcMan',5);
       
        
        animation.anchor.setTo(0.5,0.5);
        game.camera.follow(animation);
        lava3 = game.add.sprite(0, 1050, 'lava');
        var lavaTween3 = game.add.tween(lava3);
        lavaTween3.to({ y: 1070}, 1500, Phaser.Easing.Linear.None, true, 0, 2000, true);
        
       
        animation.animations.add('burn',[18,19,20,21,22,23,24,25,26,27,28,29,30,31],15,false);
        animation.animations.add('walk',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],15,true);
    
        //enable physics
        game.physics.enable([animation,platform1,platform2,platform3,platform4,platform5,
            endPlatform,lava,flag], Phaser.Physics.ARCADE);

        //flag.allowGravity = true;
       //flag.body.gravity.y = 300;
        animation.body.allowGravity = true;
        animation.body.collideWorldBounds = true;
        animation.body.gravity.y = 1000;
        run = 4;

        platform1.body.immovable = true;
        platform2.body.immovable = true;
        platform3.body.immovable = true;
        platform4.body.immovable = true;
        platform5.body.immovable = true;
      //  endPlatform.body.immovable = true;
        
        deathText = game.add.text(400,450, '',{ font: "40px Arial", fill: "black", align: "center" });

         spirals();
      
        regPosition = true;
        
        if(totalReset)
        {
             counterText = game.add.text(50,150, 'Time: ' + timer, { font: "40px Arial", fill: "black", align: "center" });
             counterText.fixedToCamera = true;
             platSpeed = 1000;
             
        }
        platforms();

       
    }

    function updateCounter()
    {
        if(!deathBool && !win && !gameOver)
        {
            timer++;
            counterText.setText('Time: ' + timer);
        }
        if(lives < 1 && !gameOver)
        {
            endGame();
        }
        if(!gameOver && !win)
        {
            counter++;
           
            if(deathBool && counter < 5)
            {
                if(lives == 2 )
                {
                    deathText.position.x = game.camera.position.x;
                    deathText.setText('You died!!!! ' + lives + ' lives left\nPress R to continue...');
                }
                else
                {
                    deathText.position.x = game.camera.position.x;
                    deathText.setText('You died!!!! ' + lives + ' life left\nPress R to continue...');
                }
                
            }
        }


    }

    function platforms()
    {
        
          //  plat1Tween = game.add.tween(platform1);
            plat2Tween = game.add.tween(platform2);
            plat3Tween = game.add.tween(platform3);
            plat4Tween = game.add.tween(platform4);
            plat5Tween = game.add.tween(platform5);

           // plat1Tween.to({ x: 250 }, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
            plat2Tween.to({ x: 550}, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
            plat3Tween.to({ y: 800 }, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
            plat4Tween.to({ y: 750 }, platSpeed + 100, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
            plat5Tween.to({ y: 625 }, platSpeed, Phaser.Easing.Linear.None, true, 0, platSpeed, true);
        
    }

    function bats()
    {
        var pos = [500,700, 1850,800, 2500,800]
        for (var i = 0;i < 3; i++)
        {
            var c = batGroup.create(pos[i*2],pos[(i*2)+1],'bat',0);
            game.physics.enable(c);
            c.animations.add('fly',[0,1,2,3,4,5],15,true);
            c.animations.play('fly');
            game.add.tween(c).to( {y: c.y - 250 }, 1500, Phaser.Easing.Linear.None, true, 0, 500, true);
        }
    }

    function batHandler()
    {
        animation.body.velocity.setTo(0,+550);
    }

    function spirals()
    {
        var pos = [3350,800, 1400,1000, 3150,750]
        for (var i = 0;i < 3; i++)
        {
            var sp = spiralGroup.create(pos[i*2],pos[(i*2)+1],'spiral');
            game.physics.enable(sp);
            sp.anchor.setTo(.5,.5);
           // game.physics.enable(sp);
            game.add.tween(sp.scale).to( { x: .9, y: .9 }, 500, Phaser.Easing.Linear.None, true, 0, 500, true);
            game.add.tween(sp).to( {angle:'+360' }, 1500, Phaser.Easing.Linear.None, true, 0, 500, false);
        }
    }

    function spiralHandler(obj1, obj2)
    {
        if(!deathBool)
        {
             
             animation.body.velocity.setTo(0,0);
             game.add.tween(animation).to( { x: obj2.x, y: obj2.y }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
             game.add.tween(animation.scale).to( { x: .005, y: .005 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
             game.add.tween(animation).to( {angle:'+360' }, 1500, Phaser.Easing.Linear.None, true, 0, 500, false);
             deathBool = true;
             lives--;
             counter = 0;
             if(lives < 1 && !win)
             {
                 endGame();
             }
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
             if(!deathBool)
             {
                 animation.animations.play('burn',15,false,false);
                 animation.body.velocity.setTo(0,0);
                 deathBool = true;
                 lives--;
                 counter = 0;
                 if(lives < 1 && !win)
                 {
                     endGame();
                 }
             }
        }

    }
    function endGame()
    {
                    gameOver = true;
                     counterText.destroy();

                        text = game.add.text( 50, 600, "Game Over!!!", style );
                       // text2 = game.add.text( 50, 250, "Your score was: " + score, style );
                        text3 = game.add.text( 50, 650, "Press R to restart game!", style );
                        text.position.x = game.camera.position.x - 400;
                       // text2.position.x = animation.position.x - 400;
                        text3.position.x = game.camera.position.x - 400;
                        deathAnimation = game.add.sprite(game.camera.position.x + 200,600,'bCry',50);
                        deathAnimation.scale.x = 3;
                        deathAnimation.scale.y = 3;
                        deathAnimation.animations.add('cry',[0,1,2,3,4,5,6,7,8],15,true);
                        deathAnimation.animations.play('cry');
    }

    function platHandler()
    {
        jumpBool = true;
        animation.body.velocity.setTo(0,0);
    }

    function endHandler()
    {
        deathText.position.x = game.camera.position.x - 100;
        deathText.setText('You win congratulations!!!!!\nPress R to start a new game...');
        win = true;
    }

  
    function resetGame()
    {
        //deathText.setText(' ')
        platSpeed = 1000;
        platBool = false;
      
        animation.destroy();
        platform1.destroy();
        platform2.destroy();
        platform3.destroy();
        platform4.destroy();
        platform5.destroy();
        endPlatform.destroy();
        flag.destroy();
        batGroup.destroy();
        spiralGroup.destroy();
       
        plat3Tween = null;
        plat4Tween = null;
        plat5Tween = null;
       
        deathText.setText(' ')
        burn = false;
        deathBool = false;
        timer = 30;
        if(gameOver || win)
        {
            gameOver = false;
            if(!win)
            {
            text.destroy();
            text3.destroy();
            
            deathAnimation.destroy();
            }
            else
            {
                win = false;
                counterText.destroy();
            }
            lives = 3;
            counter = 0;
            
            createGame(true);
        }
        else
        {
            createGame(false);
        }
        
    }

    function update() {
     
       game.physics.arcade.collide(animation, platform1, platHandler, null, this);
       game.physics.arcade.collide(animation, platform2, platHandler, null, this);
       game.physics.arcade.collide(animation, platform3, platHandler, null, this);
       game.physics.arcade.collide(animation, platform4, platHandler, null, this);
       game.physics.arcade.collide(animation, platform5, platHandler, null, this);
       game.physics.arcade.collide(animation, endPlatform, endHandler, null, this);
      
       game.physics.arcade.overlap(animation, lava, burnAnimation, null, this);
       game.physics.arcade.overlap(animation, batGroup, batHandler, null, this);
       game.physics.arcade.overlap(animation, spiralGroup, spiralHandler, null, this);
      

        if(!gameOver && !deathBool && !win)
        {
            walkAnimation();

            if (upKey.isDown)
            {
               animation.y -= run;
               
            }

            if (leftKey.isDown)
            {
                if(regPosition)
                {
                    animation.scale.x = -1;
                    regPosition = !regPosition;
                }
                animation.x -= run;
            
            }
            else if (rightKey.isDown)
            {
                if(!regPosition)
                {
                    animation.scale.x = 1;
                    regPosition = !regPosition;
                }
                animation.x += run; 
            }

            if(spaceKey.isDown && jumpBool)
            {
                jumpBool = false;
                if(regPosition)
                {
                    animation.body.velocity.setTo(150,-650);
                }
                else
                {
                    animation.body.velocity.setTo(-150,-650);
                }
            }
        }

        if((deathBool || win) && resetKey.isDown)
        {
            resetGame();
        }

    
    }

   
};
