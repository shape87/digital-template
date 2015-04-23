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
        game.load.image('background', 'assets/jungle_back.png');
        game.load.image('spikes', 'assets/death_spikes.png');
        game.load.image('small_plat', 'assets/small_plat.png');
        game.load.image('large_plat', 'assets/large_plat.png');
        game.load.image('long_plat', 'assets/long_plat.png');
        game.load.audio('music', ['assets/Jungle Jingle.mp3', 'assets/Jungle Jingle.ogg']);
        game.load.spritesheet('bcMan', 'assets/BCJungleSpriteSheet.png',150,189);
        game.load.spritesheet('bCry', 'assets/BCCrySprite.png',80,80);
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
    var style = { font: "40px arial", fill: "white", align: "center"};
    var text;
    var textDuration = 0;
    var text2;
    var text3;
    var spikes;
    var spikes2;
    var spikes3;
    var turnBool = false;
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
    var largePlats;
    var smallPlats;
    var longPlats;
    var endPlat;
    
    function create() {
        music = game.add.audio('music');
        music.play("",0,1,true,true);
       
        background = game.add.sprite( '0', '0', 'background');
       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        createGame(true);
        game.world.setBounds(0, 0, 3000, 1200);
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        


    }

    function createGame(totalReset)
    {
        
        largePlats = game.add.group();
        smallPlats = game.add.group();
        longPlats  = game.add.group();
       

        makePlats();

        batGroup = game.add.group();
        spiralGroup = game.add.group();

        bats();
        spirals();

        spikes = game.add.sprite(0,1106,'spikes');
        spikes2 = game.add.sprite(-25,1118,'spikes');
        animation = game.add.sprite(0,0,'bcMan',5);

       
        spikes3 = game.add.sprite(-50,1130,'spikes');

        
       
        
        animation.anchor.setTo(0.5,0.5);
        game.camera.follow(animation);
        // lava3 = game.add.sprite(0, 1050, 'lava');
        // var lavaTween3 = game.add.tween(lava3);
        // lavaTween3.to({ y: 1070}, 1500, Phaser.Easing.Linear.None, true, 0, 2000, true);
        
       
        animation.animations.add('split',[18,19,20,21,22,23,24,25,26,27],15,false);
        animation.animations.add('walk',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],15,true);
    
        //enable physics
        game.physics.enable([animation,spikes], Phaser.Physics.ARCADE);
       

        //flag.allowGravity = true;
       //flag.body.gravity.y = 300;
        animation.body.allowGravity = true;
        animation.body.collideWorldBounds = true;
        animation.body.gravity.y = 1000;
        run = 4;

        spikes.body.immovable = true;
       
      //  endPlatform.body.immovable = true;
        
        deathText = game.add.text(400,450, '',style);

        
        regPosition = true;
        
        if(totalReset)
        {
             counterText = game.add.text(50,150, 'Time: ' + timer, { font: "40px Arial", fill: "black", align: "center" });
             counterText.fixedToCamera = true;
             //platSpeed = 1000;
             
        }
        // platforms();

       
    }

    function makePlats()
    {
         flag = game.add.sprite(2800,180,'flag');

        var lnPlatPos = [180, 465, 1470, 565, 2800, 465];
        for (var i = 0; i < 3; i++)
        {
            var lnPlat = longPlats.create(lnPlatPos[i*2],lnPlatPos[(i*2)+1],'long_plat',0);
            // game.physics.enable(lnPlat, Phaser.Physics.ARCADE);
            // lnPlat.body.immovable = true;
        }
        var lPlatPos = [0, 400, 2600, 400];
        
        var lPlat = largePlats.create(lPlatPos[0],lPlatPos[1],'large_plat',0);   
        game.physics.enable(lPlat, Phaser.Physics.ARCADE);
        lPlat.body.immovable = true;

        endPlat = game.add.sprite(lPlatPos[2],lPlatPos[3],'large_plat',0);
        game.physics.enable(endPlat, Phaser.Physics.ARCADE);
        endPlat.body.immovable = true;    

        

        var sPlatPos = [700, 400, 1400, 500, 2100, 400];
        for (var i = 0; i < 3; i++)
        {
            var sPlat = smallPlats.create(sPlatPos[i*2],sPlatPos[(i*2)+1],'small_plat',0);
            game.physics.enable(sPlat, Phaser.Physics.ARCADE);
            sPlat.body.immovable = true;
            if(i != 1)
            {
                if(i ==0)
                {
                     game.add.tween(sPlat).to( {x: sPlat.x + 300, y: sPlat.y + 100 }, 1500, Phaser.Easing.Linear.None, true, 0, 500, true);
                }
                else
                {
                    game.add.tween(sPlat).to( {x: sPlat.x - 300, y: sPlat.y + 100 }, 1500, Phaser.Easing.Linear.None, true, 0, 500, true);
                }
             
            }
        }



      
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
           
            if(deathBool)
            {
                if(lives == 2 )
                {
                    deathText.position.x = game.camera.position.x;
                    deathText.setText('You died!!!! ' + lives + ' lives left\nPress R to continue...');
                }
                else if(lives == 1)
                {
                    deathText.position.x = game.camera.position.x;
                    deathText.setText('You died!!!! ' + lives + ' life left\nPress R to continue...');
                }
                else
                {
                     endGame();
                }
                
            }
        }


    }


    platHandler()
    {
        animation.body.v.setTo(0,0);
        jumpBool = false;
    }

    function bats()
    {
        var pos = [500,450, 1700,250, 2100,500]
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
        animation.body.velocity.setTo(0,550);
    }

    function spirals()
    {
        var pos = [1025,550, 1700,800, 2300,550]
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
             animation.body.allowGravity = false;
             deathBool = true;
             lives--;
             counter = 0;
             if(lives < 1 && !win)
             {
                 endGame();
             }
         }
    }

    function spikeHandler()
    {
        if(!deathBool)
        {
            deathBool = true;
            animation.animations.play('split',15,false,false);
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

    // function burnAnimation()
    // {
    //     burn = true;
    //     if (!gameOver)
    //     {
    //          if(!deathBool)
    //          {
    //              animation.animations.play('burn',15,false,false);
    //              animation.body.velocity.setTo(0,0);
    //              deathBool = true;
    //              lives--;
    //              counter = 0;
    //              if(lives < 1 && !win)
    //              {
    //                  endGame();
    //              }
    //          }
    //     }

    // }
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

    function splitHandler()
    {
      
        if(!deathBool)
        {
            deathBool = true;
            animation.animations.play('split',20,false,false);
            animation.body.velocity.setTo(0,0);
            lives--;

        }
                 
    }

    function endHandler()
    {
        deathText.position.x = game.camera.position.x - 100;
        deathText.setText('You win congratulations!!!!!\nPress R to start a new game...');
        win = true;
    }

  
    function resetGame()
    {
        largePlats.destroy();
        longPlats.destroy();
        smallPlats.destroy();
        spikes.destroy();
        animation.destroy();
        flag.destroy();
        batGroup.destroy();
        spiralGroup.destroy();
       
        deathText.setText(' ');
        turnBool = false;
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

        game.physics.arcade.collide(largePlats,animation,platHandler, null,this);
        game.physics.arcade.collide(smallPlats,animation,platHandler, null,this);
        game.physics.arcade.overlap(spikes,animation,splitHandler, null,this);
        game.physics.arcade.overlap(animation, batGroup, batHandler, null, this);
        game.physics.arcade.overlap(animation, spiralGroup, spiralHandler, null, this);
        game.physics.arcade.overlap(animation, spikes, spikeHandler, null, this);
        game.physics.arcade.overlap(animation, endPlat, endHandler, null, this);
      

        if(!gameOver && !deathBool && !win)
        {
            walkAnimation();

            if (upKey.isDown)
            {
               animation.y -= run;
               
            }
            //  if (downKey.isDown)
            // {
            //    animation.y += run;
               
            // }

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
               
                if(regPosition)
                {
                    animation.body.velocity.setTo(150,-650);
                }
                else
                {
                    animation.body.velocity.setTo(-150,-650);
                }
                jumpBool = false;
            }

          
        }

        if(animation.y >= 500)
        {
            if(!turnBool)
            {
                turnBool = true;
                game.add.tween(animation).to( {angle:'+180' }, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
            }
        }
                 

        if((deathBool || win) && resetKey.isDown)
        {
            resetGame();
        }

    
    }

   
};
