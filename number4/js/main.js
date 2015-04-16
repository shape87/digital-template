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
     
        game.load.image( 'bot', 'assets/bot.png', 32 , 32 );
        game.load.image( 'background', 'assets/background.png' );
        game.load.image('polar-bear', 'assets/polar-bear.png');
        game.load.image('eagle', 'assets/eagle.png');
        game.load.image('lion', 'assets/lion.png');
        game.load.image('attacker','assets/Untitled.png');
        game.load.audio('music', ['assets/Avoidance.mp3', 'assets/Avoidance.ogg']);
        
        
        
    }
    
    var bot;
    var background;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var regPosition;
    var run;
    var spaceKey;
    var duration = 0;
    var counterText;
    var counter = 0;
    var enemyCounter = 0;
    var hitCounter = 0;
    var chaosCounter = 0;
    var gameOver = false;
    var enemyList = [];
    var eagleBool = false;
    var polarBearBool = false;
    var lionBool = false;
    var style = { font: "25px arial", fill: "red", align: "center"};
    var text;
    var textDuration = 0;
    var text2;
    var text3;
    var attacker;
    
    function create() {
        run = 8;
       
       
        createPlayer();
        // music = game.add.audio('music');
        // music.play();
       
     
       
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
       
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        regPosition = true;
        duration = 5;

        //
        counterText = game.add.text(55,58, 'Time: 0', { font: "40px Arial", fill: "red", align: "center" });
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
       
     
       
        
       
       // counterText.anchor.setTo(0.5, 0.5);

    }

    function createPlayer()
    {

        background = game.add.sprite( '0', '0', 'background');
        bot = game.add.sprite( game.world.centerX, 600, 'bot' );
        attacker = game.add.sprite(game.world.centerX,100,'attacker');
        game.physics.enable(bot, Phaser.Physics.ARCADE);
        bot.body.allowGravity = false;
        bot.body.collideWorldBounds = true;
        bot.body.immovable = true;
        game.physics.enable(attacker, Phaser.Physics.ARCADE);
        attacker.body.gravity.y = 300;
        attacker.body.bounce.set(1);
        attacker.body.collideWorldBounds = true;
    }
    function updateCounter()
    {
        
        if(!gameOver)
        {
            if(textDuration == 1)
            {
                text.destroy();
            }
            textDuration--;
            counter++;
            enemyCounter++;
            counterText.setText('Time: ' + counter);
        }
        else
        {
            chaosCounter++;
        }
    }

    function shootEnemies()
    {
    
        
        if(enemyCounter == 0 && !eagleBool)
        {
            var eagle = game.add.sprite(game.rnd.integerInRange(0, 800), 0, 'eagle');
            game.physics.enable(eagle, Phaser.Physics.ARCADE);
            eagle.body.collideWorldBounds = true;
           // smallHeart.body.gravity.y = 1000
            eagle.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            eagle.body.bounce.setTo(1,1);
            enemyList.push(eagle);
            eagleBool = true;
            lionBool = false;
        }
        else if(enemyCounter == 2 && !polarBearBool)
        {
            var polarBear = game.add.sprite(1000, game.rnd.integerInRange(0, 400), 'polar-bear');
            game.physics.enable(polarBear, Phaser.Physics.ARCADE);
            polarBear.body.collideWorldBounds = true;
           // medHeart.body.gravity.y = 1000
            polarBear.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            polarBear.body.bounce.setTo(1,1);
            enemyList.push(polarBear);
            polarBearBool = true;
        }
        else if(enemyCounter == 4 && !lionBool)
        {
            var lion = game.add.sprite(0, game.rnd.integerInRange(0, 400), 'lion');
            game.physics.enable(lion, Phaser.Physics.ARCADE);
            lion.body.collideWorldBounds = true;
         //   bigHeart.body.gravity.y = 1000
            lion.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            lion.body.bounce.setTo(1,1);
            enemyList.push(lion);

            lionBool = true;
            eagleBool = false;
            polarBearBool = false;
            enemyCounter = -2;
        }

        if(gameOver && chaosCounter < 5)
        {
            var eagle = game.add.sprite(game.rnd.integerInRange(0, 800), 0, 'eagle');
            game.physics.enable(eagle, Phaser.Physics.ARCADE);
            eagle.body.collideWorldBounds = true;
            eagle.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            eagle.body.bounce.setTo(1,1);
            enemyList.push(eagle);

            var polarBear = game.add.sprite(1000, game.rnd.integerInRange(0, 400), 'polar-bear');
            game.physics.enable(polarBear, Phaser.Physics.ARCADE);
            polarBear.body.collideWorldBounds = true;
            polarBear.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            polarBear.body.bounce.setTo(1,1);
            enemyList.push(polarBear);

            var lion = game.add.sprite(0, game.rnd.integerInRange(0, 400), 'lion');
            game.physics.enable(lion, Phaser.Physics.ARCADE);
            lion.body.collideWorldBounds = true;
            lion.body.velocity.setTo(game.rnd.integerInRange(150, 400),game.rnd.integerInRange(150, 400));
            lion.body.bounce.setTo(1,1);
            enemyList.push(lion);
        }
        else if (gameOver)
        {
            destroyEnemies();
        }
    

    }
    

    function update() {
        shootEnemies();

       for(var i = 0; i < enemyList.length; i++)
       {
         game.physics.arcade.collide(bot, enemyList[i], collisionHandler, null, this);
         game.physics.arcade.collide(attacker, enemyList[i], attackHandler, null , this);
       }
         
        game.physics.arcade.collide(attacker,bot,defendHandler,null,this);

        customBounds(bot);
        // if(counter % 38 == 0)
        // {
        //     music.restart();
        // }

        if(spaceKey.isDown)
        {
            resetGame();
        }
        if (upKey.isDown)
        {
           bot.y -= run;
        }

        if(downKey.isDown)
        {
            bot.y += run;
        }

        if (leftKey.isDown)
        {
            if(regPosition)
            {
                bot.scale.x = -1;
                bot.x += 45;
                regPosition = !regPosition;
            }
            bot.x -= run;
        
        }
        else if (rightKey.isDown)
        {
            if(!regPosition)
            {
                bot.scale.x = 1;
                bot.x -= 45;
                regPosition = !regPosition;
            }
            bot.x += run; 
        }

        if (attacker.y >= 700)
        {
            attacker.body.velocity.setTo(50, 200);
        }
        
       
    }

    function resetGame()
    {
        destroyEnemies();
        bot.destroy();
        createPlayer();
        counter = 0;
        enemyCounter = 0;
        hitCounter = 0;
        chaosCounter = 0;
        if(gameOver)
        {
            text.destroy();
            text2.destroy();
            text3.destroy();
        }
        else
        {
            counterText.destroy();
        }
        counterText = game.add.text(55,58, 'Time: 0', { font: "40px Arial", fill: "red", align: "center" });
        gameOver = false;
       

    }
    function customBounds()
    {
        if(bot.y <= 300)
        {
            bot.y += run;
        }
       
       
    }

    function destroyEnemies ()
    {
        for( var j = 0; j < enemyList.length; j++)
        {
           enemyList[j].destroy();
        }
        lionBool = true;
        eagleBool = false;
        polarBearBool = false;
    }

    function collisionHandler (obj1, obj2) {

        hitCounter++;
        if(hitCounter == 1)
        {
            game.add.tween(bot.scale).to( { x: 5, y: 5 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            text = game.add.text( 500, game.world.centerY - 75, "Whut?!?!? Hit!!!  2 Lives Left", style );
            textDuration = 3;
            enemyCounter = -4;
            destroyEnemies();


        }
        else if(hitCounter == 2)
        {
            game.add.tween(bot.scale).to( { x: .8, y: .8 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            text = game.add.text( 500, game.world.centerY - 75, "Hit!!!  1 Life Left", style );
            textDuration = 3;
            enemyCounter = -4;
            destroyEnemies();
        }
        else
        {
            gameOver = true;
            counterText.destroy();
           
            game.add.tween(bot.scale).to( { x: .005, y: .005 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            bot.body.enable = false;
            
            text = game.add.text( 50, 200, "Game Over!!!", style );
            text2 = game.add.text( 50, 250, "You lasted " + counter + " seconds!", style );
            text3 = game.add.text( 50, 300, "Press the space bar to restart game!", style );
        }
    }

     function attackHandler (obj1, obj2) {

        obj2.destroy();

    }

    function defendHandler(obj1,obj2){

        


    }

};
