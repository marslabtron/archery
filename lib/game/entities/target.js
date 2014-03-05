ig.module(
  'game.entities.target'
)

.requires(
  'impact.entity',
  'impact.sound'
)

.defines(function() {
    EntityTarget = ig.Entity.extend({
      animSheet: new ig.AnimationSheet( 'media/target.png', 15, 90 ),
      size: { x: 15, y: 90},
      flip: false,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,
      speed: 60,
      arrow: {},

      hit: function (other) {
        // Prevent further checks and collisions
        other.type = ig.Entity.TYPE.NONE;
        other.collides = ig.Entity.COLLIDES.NEVER;

        // Other will no longer respond to game physics
        other.update = (function(){}).bind(other);
        other.isTargetFlip = this.flip;

        // Maintain some kind of offset
        other.parentOffset = {
          x: other.pos.x - this.pos.x,
          y: other.pos.y - this.pos.y
        };

        other.isHit = true;

        // Add to our grabbed buttons
        this.arrow = other;
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
});