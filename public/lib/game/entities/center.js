/* Eric Lang
 * The "center" basically does nothing except allow all objects to know where the center of the level is.
 * Could be stored elsewhere, but is in a separate object for readability.
 */

ig.module(
	'game.entities.center'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCenter = ig.Entity.extend({
	
	size: {x:48, y:48},
	name: "center",
	zIndex: -1,
	
	collides: ig.Entity.COLLIDES.NONE,
	
//	animSheet: new ig.AnimationSheet( 'media/player.png', 48, 48 ),
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
//		this.addAnim('idle', 1, [0]);
	},
	
	update: function() {
	},
	
	draw: function() {
		this.parent();
//		if(this.title != null) {
//			this.font.draw(this.title, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-6);
//		}
	}
	
});

});