/* Eric Lang
 * Main is responsible for loading the level and all the entities in the level.
 * The level itself doesn't really exist, I create it all here.
 * This is the class that should handle the input from the server at load time (see levelDefinition).
 * I use load time generation to generate the level every time the game starts based on the information from the server.
 */
ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.center',
	'game.entities.player',
	'game.entities.trigger',
	'game.entities.building',
	'game.entities.gate',
	'game.entities.hub',
	'game.entities.pointer'
	//,
	
	//'game.levels.level'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	player: null, //Reference to the player, can be useful.
	
	levelDefinition: {}, //The definition of the level, in json. Should be taken from the server somehow.
	
	map: [], //The collision and drawing map of the level, built at run time.
	
	drawMap: [],
	
	init: function() {
	
	
		//TEMPORARY (example) level definition.
		//This level contains 8 rooms, 1 building per room (except the first room which has 2 buildings).
		//Every room has one gate, and all gates lead to and from the center.
		//If assignments are in progress or finished, assign "assignmentProgress" to 1 for in progress and 2 for finished.
		//Set "earnedXP" to the amount of XP earned by the player and "xp" to the total XP possible. XP will also be the power of the assignment, used for opening gates.
		//"title" may be set to provide a title above the assignment, gate, center, or hub.
		/*levelDefinition = {"rooms": [

//room 1
{"buildings": [
	{"xp":100, "name":"a1", "hub":"h1", "assignmentProgress":1, "earnedXP":93, "title":"Your first assignment", "redirect":"http://www.google.com/"}
],
"hub": {"openPower":100, "name":"h1", "gates": ["g2", "cG2"], "title":"The first room"},
"gates": [
	{"name":"g1","targetName":"center","title":"To Center","isOpen":true}
]},

//room 2
{"buildings": [
	{"xp":100, "name":"a2", "hub":"h2", "assignmentProgress":0, "earnedXP":0, "title":"Your second assignment", "redirect":"http://www.google.com/"}
],
"hub": {"openPower":100, "name":"h2", "gates": [], "title":"The last room"},
"gates": [
	{"name":"g2","targetName":"center","title":"To Center","isOpen":false}
]},

],
"center": {"title":"Center","gates": [
	{"targetName":"h1","name":"cG1","title":"To the first room","isOpen":true},
	{"targetName":"h2","name":"cG2","title":"To the last room","isOpen":false}
]}}; /*
		
		/*{"rooms": [
			{"buildings": [
				{"xp":432,"name":"building1","hub":"hub1","assignmentProgress":0,"earnedXP":0,"title":"First Assignment"},
				{"xp":753,"name":"building2","hub":"hub1","assignmentProgress":0,"earnedXP":0,"title":"Second Assignment"},
			],
			"hub": {"openPower":1000,"name":"hub1","gates": ["gate1", "centerGate1", "gate2", "centerGate2"], "title":"Hub 1"},
			"gates": [
				{"name":"gate1","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":523,"name":"building3","hub":"hub2"}
			],
			"hub": {"openPower":500,"name":"hub2","gates": ["gate3", "centerGate3"]},
			"gates": [
				{"name":"gate2","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":2000,"name":"building4","hub":"hub3"}
			],
			"hub": {"openPower":1800,"name":"hub3","gates": ["gate4", "centerGate4", "gate5", "centerGate5", "gate6", "centerGate6", "gate7", "centerGate7", "gate8", "centerGate8"]},
			"gates": [
				{"name":"gate3","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":10000,"name":"building5","hub":"hub4","redirect":"http://www.google.com/"}
			],
			"hub": {"openPower":5000,"name":"hub4","gates": []},
			"gates": [
				{"name":"gate4","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":10000,"name":"building6","hub":"hub5","redirect":"http://www.google.com/"}
			],
			"hub": {"openPower":5000,"name":"hub5","gates": []},
			"gates": [
				{"name":"gate5","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":10000,"name":"building7","hub":"hub6","redirect":"http://www.google.com/"}
			],
			"hub": {"openPower":5000,"name":"hub6","gates": []},
			"gates": [
				{"name":"gate6","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":10000,"name":"building8","hub":"hub7","redirect":"http://www.google.com/"}
			],
			"hub": {"openPower":5000,"name":"hub7","gates": []},
			"gates": [
				{"name":"gate7","targetName":"center","title":"To Center"}
			]},
			
			{"buildings": [
				{"xp":10000,"name":"building9","hub":"hub8","redirect":"http://www.google.com/"}
			],
			"hub": {"openPower":5000,"name":"hub8","gates": []},
			"gates": [
				{"name":"gate8","targetName":"center","title":"To Center"}
			]}
		],
		"center": {"title":"Center", "gates" : [
			{"targetName":"hub1","name":"centerGate1","title":"To Hub 1"},
			{"targetName":"hub2","name":"centerGate2","title":"To Hub 2"},
			{"targetName":"hub3","name":"centerGate3","title":"To Hub 3"},
			{"targetName":"hub4","name":"centerGate4","title":"To Google Redirect Hub 1"},
			{"targetName":"hub5","name":"centerGate5","title":"To Google Redirect Hub 2"},
			{"targetName":"hub6","name":"centerGate6","title":"To Google Redirect Hub 3"},
			{"targetName":"hub7","name":"centerGate7","title":"To Google Redirect Hub 4"},
			{"targetName":"hub8","name":"centerGate8","title":"To Google Redirect Hub 5"}
		]}};*/
	
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		
		ig.input.bind( ig.KEY.SPACE, 'space' );


        //GET LEVEL FROM SERVER AND LOAD INTO LEVELDEFINITION HERE.
        var http_request = new XMLHttpRequest();
        http_request.open("GET", "http://127.0.0.1:3000/game_data" , true);
        http_request.onreadystatechange = function () {
            var done = 4, ok = 200;
            if (http_request.readyState == done && http_request.status == ok) {
                levelDefinition = JSON.parse(http_request.responseText);
            }
        };
        http_request.send(null);

		this.levelSetup();
	},
		
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	},
	
	levelSetup: function() {
		var offsetX;
		var offsetY;
		
		this.spawnEntity(EntityPlayer, 100, 150, this.levelDefinition.player);
		this.spawnEntity(EntityPointer, 0, 0);
		
		//SPAWN ROOMS:
		for(var i = 0; i < levelDefinition.rooms.length; i++) {
		
			offsetX = (i%2)*48*32+48*8;
			offsetY = Math.floor(i/2)*48*32+48*8;
		
			//SPAWN HUB (hub spawns before buildings because buildings access hub in init)
			this.spawnEntity(EntityHub,
								offsetX,
								offsetY,
								levelDefinition.rooms[i].hub);
		
			//SPAWN BUILDINGS
			for(var j = 0; j < levelDefinition.rooms[i].buildings.length; j++) {
				this.spawnEntity(EntityBuilding, 
									-200+offsetX,
									j*100-200+offsetY,
									levelDefinition.rooms[i].buildings[j]);
			}
								
			//SPAWN GATES
			for(var j = 0; j < levelDefinition.rooms[i].gates.length; j++) {
				this.spawnEntity(EntityGate,
									100+offsetX,
									j*100+offsetY,
									levelDefinition.rooms[i].gates[j]);
			}
								
		}
		
		//Set offsets for center.
		offsetY = Math.floor((levelDefinition.rooms.length-1)/4+1)*32*48-8*48;
		if(offsetY < 0) {
			offsetY = 1056;
		}
		offsetX = 1104;
		
		//SPAWN CENTER:
		this.spawnEntity(EntityCenter, offsetX, offsetY, levelDefinition.center);
		
		//SPAWN CENTER GATES:
		for(var i = 0; i < levelDefinition.center.gates.length; i++) {
			this.spawnEntity(EntityGate,
								-192+(i%2)*48*9+offsetX,
								-192+Math.floor(i/2)*96+offsetY,
								levelDefinition.center.gates[i]);
		}
			
		this.sortEntitiesDeferred();
		
		this.map = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];/*
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		];*/
		
		
		//Create the drawing (and collision) map. It's a 2-d array.
		for(var i = 0; i < levelDefinition.rooms.length/2; i++) {
			for(var j = 0; j < 16; j++) {
				this.map[this.map.length] = this.getRoomRow(j);
			}
			for(var j = 0; j < 2; j++) {
				this.map[this.map.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			}
			if(i == Math.abs(Math.floor((levelDefinition.rooms.length-1)/4))) {
				for(var j = 0; j < 12; j++) {
					this.map[this.map.length] = this.getCenterRow(j);
				}
			} else {
				for(var j = 0; j < 12; j++) {
					this.map[this.map.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				}
			}
			for(var j = 0; j < 2; j++) {
				this.map[this.map.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			}
		}
		
		this.drawMap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		//Create the drawing (and collision) map. It's a 2-d array.
		for(var i = 0; i < levelDefinition.rooms.length/2; i++) {
			for(var j = 0; j < 16; j++) {
				this.drawMap[this.drawMap.length] = this.getRoomDrawRow(j);
			}
			for(var j = 0; j < 2; j++) {
				this.drawMap[this.drawMap.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			}
			if(i == Math.abs(Math.floor((levelDefinition.rooms.length-1)/4))) {
				for(var j = 0; j < 12; j++) {
					this.drawMap[this.drawMap.length] = this.getCenterDrawRow(j);
				}
			} else {
				for(var j = 0; j < 12; j++) {
					this.drawMap[this.drawMap.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				}
			}
			for(var j = 0; j < 2; j++) {
				this.drawMap[this.drawMap.length] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			}
		}
		
		//Set collision map.
		this.collisionMap = new ig.CollisionMap( 48, this.map );
		
		//Make background a repeated tile.
		var bg = new ig.BackgroundMap(36, [[4]], 'media/tileset.png');
		bg.repeat = true;
		bg.distance = 2;
		this.backgroundMaps.push(bg);
		
		//Set foreground map.
		this.backgroundMaps.push( new ig.BackgroundMap(48, this.drawMap, 'media/Environment_GlassDark_Blue.png' ) );
//		this.backgroundMaps.push( new ig.BackgroundMap(96, this.map, 'media/Environment_Wall_Sheet2.png' ) );
//		this.backgroundMaps.push( new ig.BackgroundMap(48, this.map, 'media/Environment_GlassDark_Blue.png' ) );
	},
	
	//Function that gets a row of a room to add to the map.
	getRoomRow: function(j) {
		var row = [];
		if(j == 0 || j == 15) {
			row = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		} else {
			row = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
		}
		return row;
	},
	
	//Function that gets a row of the center to add to the map.
	getCenterRow: function(j) {
		var row = [];
		if(j == 0 || j == 11) {
			row = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		} else {
			row = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		}
		return row;
	},
	
	getRoomDrawRow: function(j) {
		var row = [];
		if(j != 0 && j != 15) {
			row = [7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7];
		} else if (j == 0) {
			row = [5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4];
		} else {
			row = [9,3,3,3,3,3,3,3,3,3,3,3,3,3,3,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,3,3,3,3,3,3,3,3,3,3,3,3,3,3,10];
		}
		return row;
	},
	
	getCenterDrawRow: function(j) {
		var row = [];
		if(j != 0 && j != 11) {
			row = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,6,6,6,6,6,6,6,6,6,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		} else if (j == 0) {
			row = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,3,3,3,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		} else {
			row = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,3,3,3,3,3,3,3,3,3,3,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		}
		return row;
	}
});


// Start the Game with 60fps, a resolution of 800x600
ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
