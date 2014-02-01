/**
 * Created by Radimir on 13-12-30.
 */

ig.module(
    'game.entities.player'
  )

  .requires(
    'impact.entity',
    'impact.sound',
    'game.entities.arrow'
  )

  .defines(function() {
    EntityPlayer = ig.Entity.extend({
      animSheet: new ig.AnimationSheet( 'media/player.png', 69, 57 ),
      size: { x: 69, y: 57},

      init: function (x, y, settings) {
        this.parent( x, y, settings );

        this.addAnim('idle', 1, [0]);
      },
      update: function () {
       //shoot
        if( ig.input.pressed('shoot') ) {
          if (ig.game.getEntitiesByType('EntityArrow').length === 0) {
            ig.game.spawnEntity(EntityArrow, this.pos.x + 25, this.pos.y + 35);
          }
        }

        this.parent();
      }
    });
  });