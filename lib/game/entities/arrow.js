/**
 * Created by Radimir on 14-1-28.
 */
ig.module(
    'game.entities.arrow'
  )

  .requires(
    'impact.entity',
    'impact.sound'
  )

  .defines(function() {
    EntityArrow = ig.Entity.extend({
      animSheet: new ig.AnimationSheet('media/arrow.png', 26, 12),
      offset: {x: -10, y: 0},
      size: {x: 26, y: 12},
      maxVel: {x: 400, y: 0},
      wind: 100,
      angle: 0.00,
      maxAngle: 10.00,
      isHit: false,
      type: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,

      init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.vel.x = this.accel.x = this.maxVel.x;
        this.addAnim( 'idle', 1, [0] );
      },

      handleMovementTrace: function( res ) {
        if (res.pos.x > 630) {
          this.kill();
        }
        this.parent( res );
      },

      update: function () {
        this.parent();
      }

//      check: function(other) {
//        this.kill();
//      }
    });
  });