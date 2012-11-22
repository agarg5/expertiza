/* Eric Lang
 * Hubs represent rooms, mostly; the hub is the thing you give power to when you complete assignments (buildings) in a room.
 * When a hub is fully powered, it opens its associated gates.
 */

ig.module(
	'game.entities.hub'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityHub = ig.Entity.extend({
	
	size: {x:48, y:48},
	
	power: 0,		//The current power of the gate.
	openPower: 0,	//The power it takes to open the gate. Set in spawner (main.js).
	
	zIndex: 0,
	
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.B,
	
	//animSheet: new ig.AnimationSheet( 'media/player.png', 48, 48 ),
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	gates: null,	//The gates this hub opens when it hits its "openPower".
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	//	this.addAnim('idle', 1, [3]);
	//	this.addAnim('powered', 1, [2]);
	},
	
	update: function() {
		if(this.power >= this.openPower) {	//If hub is fully powered, open all associated gates and change sprite. (TEMPORARY)
			for(var i = 0; i < this.gates.length; i++) {
				ig.game.getEntityByName(this.gates[i]).open();
			}
	//		this.currentAnim = this.anims.powered;
		}
		this.parent();
	},
	
	//Called from assignments (buildings) to give power to the hub upon assignment start. (TEMPORARY)
	givePower: function( power ) {
		this.power += power;
	},
	
	draw: function() {
		this.parent();
//		if(this.power < this.openPower) {
//			this.font.draw('Power: ' + this.power + '/' + this.openPower, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-6);
//		}
//		else {
//			this.font.draw('Power: On', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-6);
//		}
//		if(this.title != null) {
//			this.font.draw(this.title, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-12);
//		}
	}

});

});