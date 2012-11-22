/* Eric Lang
 * "Building" entity. This entity represents an assignment in a course.
 * The name "building" may be a misnomer depending on art assets, so just pretend it's called assignment.
 * Method doAssignment:
 *	Called in "triggeredBy" method, which is called by the trigger associated with the building.
 *	Sets assignment to in progress. (TEMPORARY) This will most likely be done at load-time.
 *	Gives associated power of assignment (identical to max XP) to associated hub. (TEMPORARY) This will most likely be done at load-time.
 *	Redirects if a redirect is set.
 *	TEMPORARY: Gives full XP to the player. This needs to be removed once communication is working, as the player will load his/her XP when the page is loaded.
 */

ig.module(
	'game.entities.building'
)
.requires(
	'impact.entity',
	'game.entities.trigger'
)
.defines(function(){

EntityBuilding = ig.Entity.extend({
	
	size: {x:71, y:36},
	
	wait: 0.25, 				//Used to display "press space" message when the player walks over the trigger.
	waitTimer: null,		//	Wait is the time to wait between checks, waitTimer is the actual timer.
	
	assignmentProgress: 0,	//Assignment progress: 0 is not started, 1 is turned in, 2 is graded. Should be set in the spawner (main.js).
	
	idleAnim: null,
	prevAnim: null,
	
	xp: 0,					//XP and power of the assignment. Set in the spawner (main.js).
	earnedXP: 0,			//XP earned by player for assignment.
	hub: null,				//The hub the building gives power to when its progress > 0. Set in the spawner (main.js).
	
	collides: ig.Entity.COLLIDES.FIXED,
	type: ig.Entity.TYPE.B,
	
	zIndex: 0,
	
	redirect: null,			//If redirect is not null, the assignment will redirect on start. Set in the spawner (main.js).
	
	animSheet: new ig.AnimationSheet( 'media/assignment.png', 144, 96 ),
	font: new ig.Font( 'media/04b03.font.png' ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle0', 1, [0] );		//"Door" closed, assignment not able to be started.
		this.addAnim( 'triggered0', .15, [0, 1, 2, 3] );//"Door" open, player is in collision box of trigger for assignment, presses space to begin.
		this.addAnim( 'idle1', 1, [4] );
		this.addAnim( 'triggered1', .15, [4, 5, 6, 7] );
		this.addAnim( 'idle2', 1, [8] );
		this.addAnim( 'triggered2', .15, [8, 9, 10, 11] );
		
		if(this.assignmentProgress == 0)
		{
			this.currentAnim = this.anims.idle0;
			this.idleAnim = this.anims.idle0;
		}
		else if(this.assignmentProgress == 1)
			this.currentAnim = this.anims.idle1;
		else
			this.currentAnim = this.anims.idle2;
		
		this.waitTimer = new ig.Timer();
		
		//The way ImpactJS does connections between entities is by setting a target array.
		//	This target array is sent to the trigger (to make the trigger trigger this).
		var temp = {target : [this.name]};
		if(!ig.global.wm) { //spawnEntity doesn't work in WM
			ig.game.spawnEntity(EntityTrigger, this.pos.x+27, this.pos.y+30, temp);
		}
		
		if(this.assignmentProgress != 0)
		{
//			this.idleAnim = this.anims.completed;
			ig.game.getEntityByName("player").giveXP(this.earnedXP);
			ig.game.getEntityByName(this.hub).givePower(this.xp);
		}
	},
	
	update: function() {
		if(this.waitTimer.delta() >= 0 && this.prevAnim != null && !this.assignmentProgress) {	//Player is not colliding with trigger, set to idle animation.
			this.currentAnim = this.idleAnim;
		}
		this.parent();
	},
	
	//Called by the trigger associated with this building.
	triggeredBy: function(entity, trigger) {
		if(this.assignmentProgress == 0) {		//Only react to trigger if assignment hasn't been started.
			this.waitTimer.set(this.wait);	
			if(this.currentAnim != this.anims.triggered0)
			{
				this.prevAnim = this.currentAnim;
				this.currentAnim = this.anims.triggered0;	//Set sprite to show "door" open graphic.
			}
			if(ig.input.state('space')) {	//If the player presses space, do the assignment.
				this.doAssignment(entity);
			}
		}
	},
	
	//See top for description of function. The "TEMPORARY" parts are such because all this should be done at load-time (i.e. when the player returns from completing the assignment).
	doAssignment: function(entity) {
		this.assignmentProgress = 1;	//Assignment in progress. (TEMPORARY)
		this.currentAnim = this.anims.idle1;	//Lock sprite to show the assignment has been done. (TEMPORARY)
		this.prevAnim = this.anims.idle1;
		entity.giveXP(this.xp);			//TEMPORARY: give full XP to player.
		
		ig.game.getEntityByName(this.hub).givePower(this.xp);	//Give full power to the associated hub. (TEMPORARY)
		this.earnedXP = this.xp;		//Give full credit for completing assignment. (TEMPORARY)
		//this.hub.givePower(this.xp);
		
		
		if(this.redirect != null) {	//Redirect to the assignment page.
			window.location = this.redirect;
		}
	},
	
	draw: function() {
		this.pos.x -= 36;
		this.pos.y -= 8;
		this.parent();
		this.pos.x += 36;
		this.pos.y += 8;
		//this.font.draw('XP: ' + this.earnedXP + '/' + this.xp, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-6);
		//if(this.waitTimer.delta() <= 0) {	//If waiting for player to trigger assignment
		//	this.font.draw('Press space to do assignment.', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y+10);
		//}
		//if(this.assignmentProgress == 1) {
		//	this.font.draw('Assignment in progress.', this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y);
		//}
		//if(this.title != null) {
		//	this.font.draw(this.title, this.pos.x-ig.game.screen.x, this.pos.y-ig.game.screen.y-12);
		//}
	}

});

});