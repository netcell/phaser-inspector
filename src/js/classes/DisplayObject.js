var _ = require('lodash');
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
		console.log(parent)
		if (parent) {
			var keys = Object.keys(parent);
			var foundKey = null;
			for (var i = keys.length - 1; i >= 0; i--) {
				var key = keys[i];
				if (parent[key] === obj) {
					if (key === 'cursor') foundKey = key;
					else return key;
				}
			}
			return foundKey || this.find(parent.parent, obj);
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
		var obj = this.obj;
		if (_.isString(obj.text)) return obj.text;
		if (this._name) return this._name;
		var state = this.gameManager.game.state;
		/** Search in current state */
		var name = this.find(state.states[state.current], obj);
		if (name) this._name = name;
		else {
			/** Recursively search in parent and parent of parent */
			name = this.find(obj.parent, obj);
			if (name) this._name = name;
			else if (_.isString(obj.name)) this._name = obj.name;
			else this._name = '';
		}
		return this._name;
	}
	/** THE CLASS OF THE OBJECT */
	/** Get the class type of the current object */
	get type() {
		if (this._type) return this._type;
		var node = this.obj;
		/** Either the constructor name */
		if (node.constructor.name) return this._type = node.constructor.name;
		/** Or guessing if it's not a Phaser class */
		if (node.type === undefined) {
			if (node instanceof PIXI.Stage) return this._type = 'PIXI Stage';
			else if (node instanceof PIXI.Sprite) return this._type = 'PIXI Sprite';
			else if (node instanceof PIXI.DisplayObjectContainer) return this._type = 'PIXI DisplayObjectContainer';
			else if (node instanceof PIXI.DisplayObject) return this._type = 'PIXI DisplayObject';
			else return this._type = 'Unknown';
		/** Or checking with Phaser classes table */
		} else {
			switch(node.type) {
				case Phaser.SPRITE        : return this._type = 'Sprite';
				case Phaser.BUTTON        : return this._type = 'Button';
				case Phaser.IMAGE         : return this._type = 'Image';
				case Phaser.GRAPHICS      : return this._type = 'Graphics';
				case Phaser.TEXT          : return this._type = 'Text';
				case Phaser.TILESPRITE    : return this._type = 'Tile Sprite';
				case Phaser.BITMAPTEXT    : return this._type = 'Bitmap Text';
				case Phaser.GROUP         : return this._type = 'Group';
				case Phaser.RENDERTEXTURE : return this._type = 'Render Texture';
				case Phaser.TILEMAP       : return this._type = 'Tilemap';
				case Phaser.TILEMAPLAYER  : return this._type = 'Tilemap Layer';
				case Phaser.EMITTER       : return this._type = 'Emitter';
				case Phaser.POLYGON       : return this._type = 'Polygon';
				case Phaser.BITMAPDATA    : return this._type = 'Bitmap Data';
				case Phaser.CANVAS_FILTER : return this._type = 'Canvas Filter';
				case Phaser.WEBGL_FILTER  : return this._type = 'WebGL Filter';
				case Phaser.ELLIPSE       : return this._type = 'Ellipse';
				case Phaser.SPRITEBATCH   : return this._type = 'Sprite Batch';
				case Phaser.RETROFONT     : return this._type = 'Retro Font';
				case Phaser.POINTER       : return this._type = 'Pointer';
				case Phaser.ROPE          : return this._type = 'Rope';
				default                   : return this._type = 'Unknown';
			}
		}
	}
	get img(){
		var img = {};
		var texture = this.obj.texture;
		if ( texture && texture.baseTexture  && texture.baseTexture.source) {
			var source = texture.baseTexture.source;
			if (source.src) img.url = source.src;
			else if (source.toDataURL) {
				try {
					img.url = source.toDataURL();
				} catch(err) {}
			}
			if (img.url) {
				var frame  = texture.frame;
				img.width  = frame.width;
				img.height = frame.height;
				img.x      = frame.x;
				img.y      = frame.y;
				img.scale  = 1;
				var detailPanelWidth = $('.frame-img').parent().innerWidth();
				if (frame.width > detailPanelWidth) {
					img.scale = detailPanelWidth/frame.width;
				}
			}
		}
		return img;
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