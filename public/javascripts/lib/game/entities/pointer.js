ig.module(
	'game.entities.pointer'
)
.requires(
	'impact.entity',
	'game.entities.player'
)
.defines(function(){

EntityPointer = ig.Entity.extend({
	size: {x: 2, y: 2},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	cursor: {x: 0, y: 0},
	
	target: null,
	
	font: new ig.Font( 'media/04b03.font.png' ),
	
	animSheet: new ig.AnimationSheet( 'media/UI_Text_Callouts.png', 420, 96 ),
	
	init: function( x, y, settings ) {
		ig.input.initMouse();
		this.addAnim('grey', 1, [0]);
		this.idleAnim = this.anims.grey;
	},
	
	check: function( other ) {
		this.target = other;
	},
	
	update: function() {
		this.pos.x = ig.input.mouse.x+ig.game.screen.x;
		this.pos.y = ig.input.mouse.y+ig.game.screen.y;
		this.cursor.x = this.pos.x + 105 - ig.game.screen.x;
		this.cursor.y = this.pos.y - 90 - ig.game.screen.y;
	},
	
	draw: function() {
		//Draw tooltip at correct position.
		//If !(typeof target.title === 'undefined') then draw target.title
		//If !(typeof target.xp === 'undefined') then draw target.xp and target.earnedXP(if defined)
		//If !(typeof target.openPower === 'undefined') then do above but for openPower/power
		//
		if(this.target != null)
		{
			this.pos.y -= 96;
			this.parent();
			this.pos.y += 96;
			if(this.target.name == 'player')
			{
				this.font.draw("This is you!", this.cursor.x, this.cursor.y);
				this.cursor.y += 20;
				this.font.draw("Level: "+this.target.level, this.cursor.x, this.cursor.y);
				this.cursor.y += 20;
			}
			else
			{
				if(!(typeof this.target.title === 'undefined'))
				{
					this.font.draw(this.target.title, this.cursor.x, this.cursor.y);
					this.cursor.y += 20;
				}
				if(!(typeof this.target.xp === 'undefined'))
				{
					if(typeof this.target.earnedXP === 'undefined')
						this.font.draw("XP: 0/"+this.target.xp, this.cursor.x, this.cursor.y);
					else
						this.font.draw("XP: "+this.target.earnedXP+"/"+this.target.xp, this.cursor.x, this.cursor.y);
					this.cursor.y += 20;
				}
				if(!(typeof this.target.openPower === 'undefined'))
				{
					if(typeof this.target.power === 'undefined')
						this.font.draw("Power: 0/"+this.target.openPower, this.cursor.x, this.cursor.y);
					else
						this.font.draw("Power: "+this.target.power+"/"+this.target.openPower, this.cursor.x, this.cursor.y);
					this.cursor.y += 20;
				}
			}
		}
		this.target = null;
	}
	
});

});