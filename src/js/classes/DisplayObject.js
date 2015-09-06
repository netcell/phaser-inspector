/** Wrapping Phaser Object for external functionalities  */
export default class DisplayObject {
	constructor(obj, gameManager){
		this.obj         = obj;
		this.gameManager = gameManager;
	}
	/** CHILDREN */
	get numberOfChildren() {
		return this.obj.children.length;
	}
	get hasChildren() {
		return !!this.numberOfChildren;
	}
	/** Number of parents above */
	get childLevel(){
		/** Exclude game.world and game.world.parent (Stage) */
		var count = -2;
		var parent = this.obj.parent;
		while (parent) {
			count++;
			parent = parent.parent;
		}
		return count;
	}
	/** NAME OF THE OBJECT */
	/**
	 * Utility for get game()
	 * Accessing parent to find
	 * prop key name the obj attached to
	 */
	find(parent, obj){
		if (parent) {
			var keys = Object.keys(parent);
			for (var i = keys.length - 1; i >= 0; i--) {
				var key = keys[i];
				if (parent[key] === obj) return key;
			}
			return this.find(parent.parent, obj);
		} else return false;
	}
	/**
	 * Get the game of the current object
	 * By finding the key name in the parent
	 * Or the current state (if it is at top level)
	 * Or the current text (if it's the Text object)
	 * Or the specified name (if any, probably not, sadly)
	 */
	get name(){
		var obj   = this.obj;
		var state = this.gameManager.game.state;
		/** Search in current state */
		var name = find(state.states[state.current], obj);
		if (name) return name;
		else {
			/** Recursively search in parent and parent of parent */
			name = this.find(obj.parent, obj);
			if (name) return name;
			else if (obj.text) return obj.text;
			else if (obj.name) return obj.name;
			else return '';
		}
	}
	/** THE CLASS OF THE OBJECT */
	/** Get the class type of the current object */
	get type() {
		var node = this.obj;
		/** Either the constructor name */
		if (node.constructor.name) return node.constructor.name;
		/** Or guessing if it's not a Phaser class */
		if (node.type === undefined) {
			if (node instanceof PIXI.Stage) return 'PIXI Stage';
			else if (node instanceof PIXI.Sprite) return 'PIXI Sprite';
			else if (node instanceof PIXI.DisplayObjectContainer) return 'PIXI DisplayObjectContainer';
			else if (node instanceof PIXI.DisplayObject) return 'PIXI DisplayObject';
			else return 'Unknown';
		/** Or checking with Phaser classes table */
		} else {
			switch(node.type) {
				case Phaser.SPRITE        : return 'Sprite';
				case Phaser.BUTTON        : return 'Button';
				case Phaser.IMAGE         : return 'Image';
				case Phaser.GRAPHICS      : return 'Graphics';
				case Phaser.TEXT          : return 'Text';
				case Phaser.TILESPRITE    : return 'Tile Sprite';
				case Phaser.BITMAPTEXT    : return 'Bitmap Text';
				case Phaser.GROUP         : return 'Group';
				case Phaser.RENDERTEXTURE : return 'Render Texture';
				case Phaser.TILEMAP       : return 'Tilemap';
				case Phaser.TILEMAPLAYER  : return 'Tilemap Layer';
				case Phaser.EMITTER       : return 'Emitter';
				case Phaser.POLYGON       : return 'Polygon';
				case Phaser.BITMAPDATA    : return 'Bitmap Data';
				case Phaser.CANVAS_FILTER : return 'Canvas Filter';
				case Phaser.WEBGL_FILTER  : return 'WebGL Filter';
				case Phaser.ELLIPSE       : return 'Ellipse';
				case Phaser.SPRITEBATCH   : return 'Sprite Batch';
				case Phaser.RETROFONT     : return 'Retro Font';
				case Phaser.POINTER       : return 'Pointer';
				case Phaser.ROPE          : return 'Rope';
				default                   : return 'Unknown';
			}
		}
	}
	/** SELECTION AND EXPANSION FOR VIEW */
	get expanded(){
		return this.obj.$inspectorTreeExpanded;
	}
	set expanded(value){
		var obj = this.obj;
		obj.$inspectorTreeExpanded = value;
		/**
		 * If an object is on expansion,
		 * the parent should also be too
		 */
		if (value) {
			var parent = obj.parent;
			while (parent) {
				parent.$inspectorTreeExpanded = true;
				parent = parent.parent;
			}
		}
	}
	get selected(){
		return this.gameManager.$inspectorTreeSelected === this.obj;
	}
	get parentSelected(){
		return this.gameManager.$inspectorTreeSelected === this.obj.parent;
	}
	select(){
		/**
		 * If an object is selected,
		 * it should also toggle the expansion
		 */
		this.expanded = !this.expanded;
		this.gameManager.$inspectorTreeSelected = this.obj;
	}
}