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
        // Load an image and call it 'logo'.
        game.load.image( 'nic', 'assets/200nic.png', 32 , 32 );
        game.load.image( 'dog', 'assets/dog.png');
        game.load.image( 'background', 'assets/park2.jpg' );
    }
    
    var nic;
    var dog;
    var background;
    var cursors;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var regPosition;
    var run;
    
    function create() {
        run = 5;
        //game.physics.startSystem(Phaser.Physics.P2JS);
       // game.physics.p2.defaultRestitution = 0.8;
        // Create a sprite at the center of the screen using the 'logo' image.
        background = game.add.sprite( '0', '0', 'background');
        nic = game.add.sprite( game.world.centerX, 600, 'nic' );
        dog = game.add.sprite( 0, 0, 'dog' );
        //nic.body.setZeroDamping();
        //nic.body.fixedRotation = true;
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        nic.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
       
        // Make it bounce off of the world bounds.
        
        game.physics.enable(nic, Phaser.Physics.ARCADE);
        game.physics.enable(dog, Phaser.Physics.ARCADE);
        nic.body.collideWorldBounds = true;
        dog.body.collideWorldBounds = true;
        //dog.body.immovable = true;
        dog.body.velocity.setTo(200, 200);
        dog.body.bounce.setTo(1, 1);
       
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        
       

        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        regPosition = true;

    }
    

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
       //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 );
        if (upKey.isDown)
        {
            nic.y -= run;
        }
        else if (downKey.isDown)
        {
            nic.y += run;
        }

        if (leftKey.isDown)
        {
            nic.x -= run;
        }
        else if (rightKey.isDown)
        {
            nic.x += run;
        }
        // if (cursors.left.isDown)
        // {
        //     nic.body.moveLeft(400);
        // }
        // else if (cursors.right.isDown)
        // {
        //     nic.body.moveRight(400);
        // }

        // if (cursors.up.isDown)
        // {
        //     nic.body.moveUp(400);
        // }
        // else if (cursors.down.isDown)
        // {
        //     nic.body.moveDown(400);
        // }

        game.physics.arcade.collide(nic, dog, collisionHandler, null, this);
        
        

        if(regPosition == true)
        {
             if(dog.x > 500)
             {
                run += 3;
                dog.body.acceleration.x -= 600;
                dog.body.acceleration.y -= run;
                //game.add.tween(dog.scale).to( { x: -1, y: 1 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                regPosition = !regPosition;
             }
        }
        else
        {
             if(dog.x < 300)
             {
                run += 3;
                dog.body.acceleration.x += 600;
                dog.body.acceleration.y += run;
                //game.add.tween(dog.scale).to( { x: -1, y: 1 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                regPosition = !regPosition;
                
             }
        }
       
    }

    
    function collisionHandler (obj1, obj2) {

        game.add.tween(nic.scale).to( { x: .005, y: .005 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        //nic.body.enable = false;
        var style = { font: "50px arial", fill: "red", align: "center"};
        var text = game.add.text( game.world.centerX, game.world.centerY - 100, "You Lose!!!", style );
        var text2 = game.add.text( game.world.centerX, game.world.centerY, "Press refresh page to try again...", style );
        
        text.anchor.setTo( 0.5, 0.0 );
        text2.anchor.setTo( 0.5, 0.0 );
        

    }

    function render() {

        game.debug.bodyInfo(dog, 32, 32);

        game.debug.body(dog);
       

    }




};
