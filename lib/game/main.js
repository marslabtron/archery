ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
  'game.levels.playground',
  'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/nes.font.png' ),
	angle: 0.00,
  wind: 0,

	init: function() {
		// Initialize your game here; bind keys etc.
    ig.input.bind( ig.KEY.UP_ARROW, 'up' );
    ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.X, 'shoot');

    this.loadLevel( LevelPlayground );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

    var lastArrow = this.getEntitiesByType('EntityArrow')[0];

    if (ig.input.state('shoot') && lastArrow !== undefined) {
      // random number for the wind (should be init on start of each turn)
      this.wind = Math.random() * (10 - 1);

      // increase shoot angle on key down
      if (lastArrow.angle <= lastArrow.maxAngle) {
        this.angle = lastArrow.angle += 0.16;
      }
    }
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			  y = ig.system.height/2;

		this.font.draw( 'SCORE', x/2 - 63, y/2 - 105);
    this.font.draw( 'WORLD RECORD', x + 23, y/2 - 106, ig.Font.ALIGN.LEFT );
    this.font.draw( 'ANGLE ' + this.angle.toFixed(2), x - 65, y - 60, ig.Font.ALIGN.CENTER );
    this.font.draw( 'WIND ' + this.wind.floor(), x - 74, y + 210, ig.Font.ALIGN.CENTER );
    this.font.draw( 'SCORE', x + 105, y + 192, ig.Font.ALIGN.LEFT );
    this.font.draw( '3500', x + 105, y + 212, ig.Font.ALIGN.LEFT );
//    this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});

StartScreen = ig.Game.extend({
  instructText: new ig.Font( 'media/04b03.font.png' ),
//  background: new ig.Image('media/screen-bg.png'),
//  mainCharacter: new ig.Image('media/screen-main-character.png'),
//  title: new ig.Image('media/game-title.png'),
  init: function() {
    ig.input.bind( ig.KEY.SPACE, 'start');
  },
  update: function() {
    if(ig.input.pressed ('start')){
      ig.system.setGame(MyGame)
    }
    this.parent();
  },
  draw: function() {
    this.parent();
    var x = ig.system.width/2, y = ig.system.height - 10;
    this.instructText.draw( 'Press Spacebar To Start', x, y/2,
      ig.Font.ALIGN.CENTER );
  }
});


// Start the Game with 60fps, a resolution of 630x480, scaled
// up by a factor of 1
ig.main( '#canvas', MyGame, 60, 630, 510, 2 );

});
