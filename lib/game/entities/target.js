ig.module(
  'game.entities.target'
)

.requires(
  'impact.entity',
  'impact.sound',
  'impact.entity-pool'
)

.defines(function() {
    EntityTarget = ig.Entity.extend({
      animSheet: new ig.AnimationSheet( 'media/target.png', 15, 90 ),
      size: { x: 15, y: 80},
      offset: {x: 0, y: 5},
      flip: false,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,
      speed: 60,
      arrow: {},
      hitMark: {},

      hit: function (other) {
        // Prevent further checks and collisions
        other.type = ig.Entity.TYPE.NONE;
        other.collides = ig.Entity.COLLIDES.NEVER;

        other.isHit = true;
        // Other will no longer respond to game physics
        other.update = (function(){}).bind(other);
        other.isTargetFlip = this.flip;

        // Maintain some kind of offset
        other.parentOffset = {
          x: other.pos.x - this.pos.x,
          y: other.pos.y - this.pos.y
        };
        other.animSheet.width = 18;

        this.arrow = other;
        var angleOffset = this.arrow.angle * 9;

        // check the exact hit point
        console.log(this.pos.y);
        console.log('angle: ' + this.arrow.angle);
        if (this.pos.y > 300 && this.pos.y < 315 && this.arrow.angle >= 4.76 && this.arrow.angle <= 5.20) {
          console.log('bull\'s eye - orange zone');
          this.hitMark = ig.game.spawnEntity(EntityHitMark, this.pos.x - 105, this.pos.y - 75 - angleOffset);
        } else if (((this.pos.y > 315 && this.pos.y < 330) ||
          (this.pos.y > 285 && this.pos.y < 300)) && this.arrow.angle >= 4.30 && this.arrow.angle <= 5.80) {
          console.log('red zone');
          this.hitMark = ig.game.spawnEntity(EntityHitMark, this.pos.x - 105, this.pos.y - 75 - angleOffset);
        } else if (((this.pos.y > 330 && this.pos.y < 340) ||
          (this.pos.y > 275 && this.pos.y < 285)) && this.arrow.angle >= 3.96 && this.arrow.angle <= 6.40) {
          console.log('white zone');
          this.hitMark = ig.game.spawnEntity(EntityHitMark, this.pos.x - 105, this.pos.y - 75 - angleOffset);
        } else if (((this.pos.y > 340 && this.pos.y < 350) ||
          (this.pos.y > 265 && this.pos.y < 275)) && this.arrow.angle >= 3.20 && this.arrow.angle <= 7.50) {
          console.log('blue zone');
          this.hitMark = ig.game.spawnEntity(EntityHitMark, this.pos.x - 105, this.pos.y - 75 - angleOffset);
        } else if (((this.pos.y > 350 && this.pos.y < 360) ||
          (this.pos.y > 255 && this.pos.y < 265)) && this.arrow.angle >= 0.50 && this.arrow.angle <= 10.00) {
          console.log('out of target');
          this.hitMark = ig.game.spawnEntity(EntityHitMark, this.pos.x - 105, this.pos.y - 75 - angleOffset);
        }
      },

      init: function( x, y, settings ) {
        this.parent( x, y, settings );

        // Not in WM
        if (!ig.global.wm) {
          ig.game.spawnEntity(EntityTargetBoard, this.pos.x - 145, this.pos.y - 15);
        }
        this.addAnim('idle', 1, [0]);
      },

      update: function() {
        var yDir = this.flip ? -1 : 1;
        var ar = this.arrow;

        if (ar.pos !== undefined) {
          ar.pos.x = this.pos.x + ar.parentOffset.x;
          ar.pos.y = this.pos.y + ar.parentOffset.y;

          if (ar.isTargetFlip !== this.flip ) {
            ar.kill();
            if (this.hitMark.id) {
              this.hitMark.kill();
              this.hitMark = {};
            }
          }
        }

        this.vel.y = this.speed * yDir;
        this.currentAnim.flip.y = this.flip;

        this.parent();
      },

      handleMovementTrace: function( res ) {
        if (res.collision.y) {
          this.flip = !this.flip;
        }

        // Continue resolving the collision as normal
        this.parent(res);
      },

      check: function(other) {
        this.hit(other);
      }
    });

    EntityTargetBoard = ig.Entity.extend({
      animSheet: new ig.AnimationSheet( 'media/target-board.png', 90, 90 ),
      size: { x: 90, y: 90},

      init: function( x, y, settings ) {
        this.parent( x, y, settings );

        this.addAnim('idle', 1, [0]);
      },

      update: function() {
        this.parent();
      }
    });

    EntityHitMark = ig.Entity.extend({
      animSheet: new ig.AnimationSheet( 'media/hit.png', 10, 10 ),
      size: {x: 10, y: 10},

      init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.addAnim( 'idle', 0.1, [0,1,2,1,0] );
      },

      reset: function( x, y, settings ) {
        // This function is called when an instance of this class is
        // resurrected from the entity pool.
        // The parent implementation of reset() will reset the .pos to
        // the given x, y and will reset the .vel, .accel, .health and
        // some other properties.
        this.parent( x, y, settings );
      }
    });

    // Enable Pooling!
    ig.EntityPool.enableFor( EntityHitMark );
});