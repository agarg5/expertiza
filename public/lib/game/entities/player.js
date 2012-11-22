/* Eric Lang
 * Obviously, this entity represents the player.
 * The player controls his own XP and Level.
 */

ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.ACTIVE,
	type: ig.Entity.TYPE.A,
	zIndex: 1, //Puts the player on top of all entities in the world.
	
	animSheet: new ig.AnimationSheet( 'media/Character_Walk.png', 48, 96 ),
	uiSheet: new ig.Image( 'media/UI.png' ),
	//levelAnim: new ig.AnimationSheet( 'media/level.png', 
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	xp: null,	//Level is updated when XP is updated, if necessary.
	level: null,
	
	name: 'player',	//Player is always named 'player' so other objects can find it.
	
	isPortal: false,	//Whether or not the player is currently portalling between two gates.
	
	portalTime: 1,		//The time, in seconds, it takes the player to complete a portal movement
	portalCount: null,
	
	portalLoc: {x:0,y:0},	//The location to portal to
	startPos: {x:0,y:0},	//The starting location of the player before portalling.
	
	//Player movement physics
	friction: .5,
	staticFriction: 100,
	speed: 2000,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.setXPAndLevel();
		this.addAnim( 'idleN', 1, [7] );
		this.addAnim( 'idleS', 1, [3] );
		this.addAnim( 'idleE', 1, [15]);
		this.addAnim( 'idleW', 1, [11]);
		this.addAnim( 'walkN', .15, [4,5,6,7] );
		this.addAnim( 'walkS', .15, [0,1,2,3] );
		this.addAnim( 'walkE', .15, [12,13,14,15]);
		this.addAnim( 'walkW', .15, [8,9,10,11]);
		this.addAnim( 'portal', .1, [17,18,19,19,19,19,18,17,16], [true]);
		this.portalCount = new ig.Timer();
	},
	
	update: function() {
		if(!this.isPortal) {	//Only accept input if not portalling
			this.handleInput();
		} else {				//If portalling, keep portalling.
			this.moveToPortal();
		}
		//Use friction.
		this.vel.x *= this.friction;
		this.vel.y *= this.friction;
		
		//If the player is moving slower than the static friction limit, stop him.
		if(Math.abs(this.vel.x) < this.staticFriction && Math.abs(this.vel.y) < this.staticFriction) {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
		this.parent();
		
		//Center the camera on the player.
		ig.game.screen.x = this.pos.x - ig.system.width/2;
		ig.game.screen.y = this.pos.y - ig.system.height/2;
		
	},
	
	moveToPortal: function() {
		//Portal from startPos to portalLoc in portalTime seconds.
		this.pos.x += (this.portalLoc.x-this.startPos.x)/this.portalTime*ig.system.tick;
		this.pos.y += (this.portalLoc.y-this.startPos.y)/this.portalTime*ig.system.tick;
		
		if(this.portalCount.delta() > 0) { //Done with portal.
			this.isPortal = false;
			this.collides = ig.Entity.COLLIDES.ACTIVE;
		}
	},
	
	//Handles input.
	handleInput: function() {
		if( ig.input.state('up') ) {
			this.vel.y += -this.speed;
			this.currentAnim = this.anims.walkN;
		}
		if( ig.input.state('down') ) {
			this.vel.y += this.speed;
			this.currentAnim = this.anims.walkS;
		}
		if( ig.input.state('left') ) {
			this.vel.x += -this.speed;
			this.currentAnim = this.anims.walkW;
		}
		if( ig.input.state('right') ) {
			this.vel.x += this.speed;
			this.currentAnim = this.anims.walkE;
		}
		if( !ig.input.state('up') 
		&& !ig.input.state('down') 
		&& !ig.input.state('left') 
		&& !ig.input.state('right') ) {
			if(this.currentAnim == this.anims.walkN) {
				this.currentAnim = this.anims.idleN;
			} else if(this.currentAnim == this.anims.walkS) {
				this.currentAnim = this.anims.idleS;
			} else if(this.currentAnim == this.anims.walkE) {
				this.currentAnim = this.anims.idleE;
			} else if(this.currentAnim == this.anims.walkW) {
				this.currentAnim = this.anims.idleW;
			} else if(this.currentAnim == this.anims.portal) {
				this.currentAnim = this.anims.idleS;
			}
		}
	},
	
	//This function gives XP to the player and is called every time the player gains xp.
	giveXP: function(xp) {
		this.xp += xp;
		while(this.xp >= this.getTotalXPForNextLevel()) {//450 + this.level*50) {
			this.xp -= this.getTotalXPForNextLevel();//450 + this.level*50;
			this.level++;
		}
	},
	
	//This function sets the player's XP and level at the beginning to 0 and 1 (respectively).
	setXPAndLevel: function() {
		this.xp = 0;
		this.level = 1;
	},
	
	//Gets the level of the player.
	getLevel: function() {
		return this.level;
	},
	
	//Gets the XP of the player within his level.
	getXP: function() {
		return this.xp;
	},
	
	//Draw the basic UI (xp and level).
	draw: function() {
		this.uiSheet.draw(0,0);
		this.font.draw(this.getLevel(), 100, 7);
		this.font.draw(this.xp + '/' + this.getTotalXPForNextLevel(), 50, 32);
		//this.font.draw('XP: ' + this.xp + '/' + (450+this.level*50) + '\nLEVEL: ' + this.getLevel(), 0, 0);
		this.pos.y -= 48;
		this.parent();
		this.pos.y += 48;
	},
	
	//Start portalling to a portal location of (x, y)
	portal: function(x, y) {
		this.portalLoc.x = x;
		this.portalLoc.y = y;
		this.portalCount.set(this.portalTime);
		this.isPortal = true;
		this.startPos.x = this.pos.x;
		this.startPos.y = this.pos.y;
		this.collides = ig.Entity.COLLIDES.NEVER; //Remove collision while portalling
		this.currentAnim = this.anims.portal;
		this.currentAnim.gotoFrame(0);
	},
	
	getTotalXPForNextLevel: function() {
		return this.level*50+450;
	}
	
});

});