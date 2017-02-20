// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";
  var Phaser, SpriteGUI, bg, create, cursors, droid, droidGui, game, init, jumpButton, jumpTimer, mixin, pack, packGui, player, playerGui, preload, render, rocks, shutdown, update;

  Phaser = this.Phaser, SpriteGUI = this.SpriteGUI;

  mixin = Phaser.Utils.mixin;

  bg = void 0;

  cursors = void 0;

  droid = void 0;

  droidGui = void 0;

  jumpButton = void 0;

  jumpTimer = 0;

  pack = void 0;

  packGui = void 0;

  player = void 0;

  playerGui = void 0;

  rocks = void 0;

  init = function() {
    game.forceSingleUpdate = false;
    game.time.desiredFps = 30;
    this.scale.setUserScale(2, 2);
  };

  preload = function() {
    this.load.baseURL = "example/assets/";
    this.load.spritesheet("droid", "droid.png", 32, 32);
    this.load.spritesheet("dude", "dude.png", 32, 48);
    this.load.image("firstaid");
    this.load.image("background", "background2.png");
    this.load.image("rock");
  };

  create = function() {
    var arcade, camera, i, keyboard, physics, r, text, world;
    camera = game.camera, physics = game.physics, world = game.world;
    arcade = physics.arcade;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas, true);
    world.setBounds(0, 0, 480, 600);
    arcade.checkCollision = {
      up: false,
      down: true,
      left: false,
      right: false
    };
    arcade.gravity.set(0, 500);
    bg = this.add.tileSprite(0, 0, 600, 600, "background");
    bg.alpha = 0.5;
    bg.tilePosition.x = game.rnd.between(0, 120);
    player = this.add.sprite(32, 32, "dude");
    player.name = "player";
    camera.follow(player);
    physics.enable(player);
    mixin({
      bounce: {
        x: 0.5,
        y: 0.25
      },
      collideWorldBounds: true,
      drag: {
        x: 250,
        y: 0
      },
      maxVelocity: {
        x: 250,
        y: 1000
      }
    }, player.body);
    player.body.setSize(8, 32, 12, 16);
    player.animations.add("left", [0, 1, 2, 3], 10, true);
    player.animations.add("turn", [4], 20, true);
    player.animations.add("right", [5, 6, 7, 8], 10, true);
    droid = this.add.sprite(world.randomX, world.height * 0.5, "droid");
    droid.name = "droid";
    physics.enable(droid);
    mixin({
      allowGravity: false,
      bounce: {
        x: 0.5,
        y: 0.5
      },
      mass: 10,
      maxVelocity: {
        x: 100,
        y: 100
      },
      velocity: {
        x: 50,
        y: 0
      }
    }, droid.body);
    droid.body.setSize(droid.width, droid.height / 2, 0, droid.height / 2);
    droid.animations.add("!", [0, 1, 2, 3], 5, true);
    droid.animations.play("!");
    rocks = this.add.group();
    r = void 0;
    i = 4;
    while (i-- > 0) {
      r = this.add.sprite(world.randomX, (1 - (i * 0.25)) * world.height, "rock");
      r.anchor.set(0.5);
      physics.enable(r);
      r.body.moves = false;
      r.body.immovable = true;
      rocks.add(r);
    }
    pack = this.add.sprite(world.randomX, world.randomY, "firstaid");
    pack.name = "pack";
    physics.enable(pack);
    mixin({
      bounce: {
        x: 0.25,
        y: 0.25
      },
      collideWorldBounds: true
    }, pack.body);
    pack.inputEnabled = true;
    pack.input.useHandCursor = true;
    pack.input.enableDrag();
    pack.events.onDragStart.add(function() {
      return pack.body.enable = false;
    });
    pack.events.onDragStop.add(function() {
      return pack.body.enable = true;
    });
    text = this.add.text(5, 5, "[R]estart / ±[S]tep / s(T)ep forward", {
      fill: "white",
      font: "bold 12px monospace"
    });
    player.bringToTop();
    droid.bringToTop();
    text.bringToTop();
    keyboard = game.input.keyboard;
    cursors = keyboard.createCursorKeys();
    jumpButton = keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keyboard.addKey(Phaser.KeyCode.R).onUp.add(game.state.restart, game.state);
    keyboard.addKey(Phaser.KeyCode.T).onUp.add(game.step, game);
    keyboard.addKey(Phaser.KeyCode.S).onUp.add((function() {
      if (game.stepping) {
        game.disableStep();
      } else {
        game.enableStep();
      }
    }), game);
    playerGui = new SpriteGUI(player, {
      width: 300
    });
    droidGui = new SpriteGUI(droid, {
      width: 300
    });
    packGui = new SpriteGUI(pack, {
      width: 300
    });
  };

  update = function() {
    var animations, maxVelocity, onFloor, physics, velocity, world;
    physics = game.physics, world = game.world;
    physics.arcade.collide([pack, player], [droid, rocks]);
    maxVelocity = player.body.maxVelocity;
    velocity = player.body.velocity;
    animations = player.animations;
    onFloor = player.body.blocked.down || player.body.touching.down;
    if (cursors.left.isDown) {
      velocity.x -= maxVelocity.x / 10;
    } else if (cursors.right.isDown) {
      velocity.x += maxVelocity.x / 10;
    }
    switch (true) {
      case velocity.x > 0:
        animations.play("right");
        break;
      case velocity.x < 0:
        animations.play("left");
        break;
      default:
        animations.stop(null, true);
    }
    if (jumpButton.isDown && onFloor && game.time.now > jumpTimer) {
      velocity.y = -maxVelocity.y / 2;
      jumpTimer = game.time.now + 500;
    }
    world.wrap(player, null, null, true, false);
    world.wrap(droid, droid.width);
  };

  render = function() {};

  shutdown = function() {
    playerGui.destroy();
    droidGui.destroy();
    packGui.destroy();
  };

  game = new Phaser.Game({
    width: 480,
    height: 480,
    renderer: Phaser.CANVAS,
    scaleMode: Phaser.ScaleManager.USER_SCALE,
    state: {
      init: init,
      preload: preload,
      create: create,
      update: update,
      render: render,
      shutdown: shutdown
    },
    antialias: false
  });

}).call(this);
