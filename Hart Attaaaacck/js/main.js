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
     
        game.load.image( 'person', 'assets/person.png', 32 , 32 );
        game.load.image( 'background', 'assets/background2.png' );
        game.load.image('small_heart', 'assets/small_heart.png');
        game.load.image('medium_heart', 'assets/medium_heart.png');
        game.load.image('big_heart', 'assets/big_heart.png');
        game.load.image('counter_back', 'assets/counter_back.png');
        game.load.audio('music', ['assets/Avoidance.mp3', 'assets/Avoidance.ogg']);
        
        
        
    }
    
    var person;
    var background;
    var counter_back;
    var cursors;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var regPosition;
    var run;
    var duration = 0;
    var jumpButton;
    var jumpTimer = 0;
    var counterText;
    var counter = 0;
    var heartCounter = 0;
    var gameOver = false;
    var line;
    var heartList = [];
    var smallHeartBool = false;
    var medHeartBool = false;
    var bigHeartBool = false;
    var music;
    var jump;
    
    function create() {
        run = 5;
       
        background = game.add.sprite( '0', '0', 'background');
        counter_back = game.add.sprite( 50, 50, 'counter_back');
        person = game.add.sprite( game.world.centerX, 600, 'person' );

        music = game.add.audio('music');
        music.play();
       
        game.physics.enable(person, Phaser.Physics.ARCADE);
        person.body.collideWorldBounds = true;
       
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        person.col
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        regPosition = true;
        duration = 5;

        //
        counterText = game.add.text(55,58, 'Counter: 0', { font: "40px Arial", fill: "red", align: "center" });
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
       
        person.body.allowGravity = false;
       
        
       
       // counterText.anchor.setTo(0.5, 0.5);

    }

    function updateCounter()
    {
        if(!gameOver)
        {
            counter++;
            heartCounter++;
            counterText.setText('Counter: ' + counter);
        }
    }

    function shootHearts()
    {
    
        
        if(heartCounter == 0 && !smallHeartBool)
        {
            var smallHeart = game.add.sprite(game.rnd.integerInRange(0, 800), 0, 'small_heart');
            game.physics.enable(smallHeart, Phaser.Physics.ARCADE);
            smallHeart.body.collideWorldBounds = true;
            smallHeart.body.gravity.y = 1000
            smallHeart.body.velocity.setTo(game.rnd.integerInRange(100, 200),game.rnd.integerInRange(100, 200));
            smallHeart.body.bounce.setTo(1,1);
            heartList.push(smallHeart);
            smallHeartBool = true;
            bigHeartBool = false;
        }
        else if(heartCounter == 7 && !medHeartBool)
        {
            var medHeart = game.add.sprite(game.rnd.integerInRange(0, 800), 0, 'medium_heart');
            game.physics.enable(medHeart, Phaser.Physics.ARCADE);
            medHeart.body.collideWorldBounds = true;
            medHeart.body.gravity.y = 1000
            medHeart.body.velocity.setTo(game.rnd.integerInRange(100, 200),game.rnd.integerInRange(100, 200));
            medHeart.body.bounce.setTo(1,1);
            heartList.push(medHeart);
            medHeartBool = true;
        }
        else if(heartCounter == 15 && !bigHeartBool)
        {
            var bigHeart = game.add.sprite(game.rnd.integerInRange(0, 800), 0, 'big_heart');
            game.physics.enable(bigHeart, Phaser.Physics.ARCADE);
            bigHeart.body.collideWorldBounds = true;
            bigHeart.body.gravity.y = 1000
            bigHeart.body.velocity.setTo(game.rnd.integerInRange(100, 200),game.rnd.integerInRange(100, 200));
            bigHeart.body.bounce.setTo(1,1);
            heartList.push(bigHeart);

            bigHeartBool = true;
            smallHeartBool = false;
            medHeartBool = false;
            heartCounter = -1;
        }
        

    }
    

    function update() {
       shootHearts();

       for( var i = 0; i < heartList.length; i++)
       {
         game.physics.arcade.collide(person, heartList[i], collisionHandler, null, this);
       }
         
        customBounds(person);
        if(counter % 38 == 0)
        {
            music.restart();
        }

       
        if (upKey.isDown)
        {
           person.y -= run;
        }

        if (leftKey.isDown)
        {
            if(regPosition)
            {
                person.scale.x = -1;
                person.x += 45;
                regPosition = !regPosition;
            }
            person.x -= run;
        
            
            person.y += run;
            
        }
        else if (rightKey.isDown)
        {
            if(!regPosition)
            {
                person.scale.x = 1;
                person.x -= 45;
                regPosition = !regPosition;
            }
            person.x += run;
            
            person.y += run;
            
        }

      
        
       
    }

    function customBounds()
    {
        if((person.x >= 0 && person.x <= 50) && person.y >= 350)
        {
           if(person.y > 350)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
        }
        else if ((person.x >= 51 && person.x <= 100))
        {
            
            if(person.y > 375)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 101 && person.x <= 150))
        {
            if(person.y > 400)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 151 && person.x <= 200))
        {
            if(person.y > 425)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 201 && person.x <= 250))
        {
           if(person.y > 425)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 251 && person.x <= 300))
        {
           if(person.y > 440)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 301 && person.x <= 350))
        {
           if(person.y > 440)
            {
               if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 351 && person.x <= 400))
        {
           if(person.y > 430)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        if((person.x >= 401 && person.x <= 450) && person.y >= 350)
        {
          if(person.y > 420)
            {
               if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
        }
        else if ((person.x >= 451 && person.x <= 500))
        {
            if(person.y > 400)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 501 && person.x <= 550))
        {
            if(person.y > 390)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 551 && person.x <= 600))
        {
            if(person.y > 375)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 601 && person.x <= 650))
        {
            if(person.y > 345)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 651 && person.x <= 700))
        {
            if(person.y > 330)
            {
               if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 701 && person.x <= 750))
        {
            if(person.y > 310)
            {
                if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
        else if ((person.x >= 751 && person.x <= 800))
        {
            if(person.y > 290)
            {
               if(jump)
                {
                    person.body.allowGravity = false;
                }
                jump = false;
              
                person.y -= 10;
            }
            
        }
       
    }

    function timeHandler ()
    {

    }
    function collisionHandler (obj1, obj2) {

        gameOver = true;
        counterText.destroy();
        counter_back.destroy();
        game.add.tween(person.scale).to( { x: .005, y: .005 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        person.body.enable = false;
        var style = { font: "25px arial", fill: "red", align: "center"};
        var text = game.add.text( 50, game.world.centerY - 75, "Game Over!!!", style );
        var text2 = game.add.text( 50, game.world.centerY - 25, "You lasted " + counter + " seconds!", style );
        var text3 = game.add.text( 50, game.world.centerY + 25, "Press refresh page to try again...", style );
        
        // text.anchor.setTo( 0.5, 0.0 );
        // text2.anchor.setTo( 0.5, 0.0 );
        

    }

    function render() {

        // game.debug.bodyInfo(dog, 32, 32);

        // game.debug.body(dog);
       

    }




};
