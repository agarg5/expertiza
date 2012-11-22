/* Eric Lang
 * "gate" is another misnomer; they're portals now.
 * All gates lead from the center to a room or from a room to the center.
 * Gates start off locked by default and they can only be entered if powered up.
 */

ig.module(
	'game.entities.gate'
)
.requires(
	'impact.entity',
	'game.entities.trigger'
)
.defines(function(){

EntityGate = ig.Entity.extend({
	
	size: {x:48,y:12},
	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.B,
	
	isOpen: false,		//Start closed by default.
	
	target: null,		//Target entity
	targetName: null,	//Target entity's name
	
	animSheet: new ig.AnimationSheet( 'media/portal.png', 144, 96 ),
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'open', .5, [5,6,7,6] );
		
		this.idleAnim = this.anims.idle;
		
		//Spawn trigger where necessary to make the gate portal correctly; link trigger back to this gate's name.
		// This is significantly smaller than the gate itself, as the trigger is always on.
		// The only thing that stops the player from pre-emptively using the gate is the gate's collision (which is removed when the gate is opened).
		var temp = {target : [this.name], size : {x : this.size.x-46, y : this.size.y+12}, wait : 0};
		if(!ig.global.wm) { //spawnEntity doesn't work in WM
			ig.game.spawnEntity(EntityTrigger, this.pos.x+23, this.pos.y+12, temp);
		}
		
		if(this.isOpen) {
			this.open();
		}
	},
	
	update: function() {
		this.parent();
	},
	
	draw: function() {
		this.pos.x -= 48;
		this.pos.y -= 24;
		this.parent();
		this.pos.x += 48;
		this.pos.y += 24;
//		if(this.title != null && this.isOpen) {
//			this.font.draw(this.title, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-6);
//		}
	},
	
	//Ran when player walks into gate (after gate is open) by the associated trigger.
	triggeredBy: function(entity, trigger) {
		if(!this.isOpen) {
			return;
		}
		if(entity.isPortal) {
			return;
		}
		this.target = ig.game.getEntityByName(this.targetName);
		
		//Portal the entity to the target location.
		entity.portal(this.target.pos.x, this.target.pos.y);
	},
	
	//Open the gate, called by the hub.
	open: function() {
		this.isOpen = true;
		//this.collides = ig.Entity.COLLIDES.NEVER; //Turn off collision to allow player to walk into the trigger.
		this.currentAnim = this.anims.open;
	}

});

});