var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');

/** Return true if childObj has name/type match the search term */
function match(childObj, term){
	if (!term) return false;
	var {name, type} = childObj;
	return (name && name.toLowerCase().match(term)) || (type && type.toLowerCase().match(term));
}

var min = Math.min,
	max = Math.max;

export default class GameManager {
	constructor($timeout, game, onUpdate){
		this.$timeout = $timeout;
		this.game     = game;
		this.onUpdate = onUpdate;

		this.filteredWorld = { children: [] };
		this.filterTimer   = null;

		this.$render = true;

		var self = this;
		Object.defineProperty(window, '$inspectorTreeSelected', {
			get: function(){
				return self.$inspectorTreeSelected;
			},
			configurable: true
		})

		this.$inspectorTreeSelected = null;
	}
	nextFrame(){
		this.game.paused = false;
		this.onUpdate.addOnce(() => this.game.paused = true)
	}
	screenInspect(){
		var game = this.game;
		if (this.screenInspecting) {
			return this.stopScreenInspect();
		}
		var image = game.add.image(0, 0);
			image.inputEnabled = true;
			image.width  = game.width;
			image.height = game.height;
			image.name = 'Inspect Layer';
		image.events.onInputDown.add(this.onScreenInspect, this);
		this.onScreenInspectImage = image;
		this.screenInspecting = true;
	}
	stopScreenInspect(){
		this.onScreenInspectImage && this.onScreenInspectImage.destroy();
		this.onScreenInspectImage = null;
		this.screenInspecting = false;
	}
	onScreenInspect(){
		var game    = this.game;
		var world   = game.world;
		var pointer = game.input.activePointer;
		var obj = this.searchSpriteUnderPointer(world, pointer);
		this.collapseAll();
		obj && ( new DisplayObject(obj, this).expand() );
	}
	getObjectBounds(obj){
		var bounds = obj.getBounds();
		if (obj.children.length) {
			var groupBounds = Phaser.Group.prototype.getBounds.call(obj);
			bounds.x = min(bounds.x, groupBounds.x);
			bounds.y = min(bounds.y, groupBounds.y);
			bounds.width = max(bounds.width, groupBounds.width);
			bounds.height = max(bounds.height, groupBounds.height);
		}
		return bounds;
	}
	searchSpriteUnderPointer(parent, pointer){
		var children = parent.children;
		for (var i = children.length - 1; i >= 0; i--) {
			var child = children[i];
			if (child.alive && child.visible && child !== this.onScreenInspectImage) {
				var bounds = this.getObjectBounds(child);
				if ( bounds.contains(pointer.worldX, pointer.worldY) ){
					if (!child.children.length) return child;
					else  {
						var obj = this.searchSpriteUnderPointer(child, pointer);
						return obj || child;
					}
				}
			}
		}
	}
	collapseAll(){
		this.$inspectorTreeSelected = null;
		this.collapse(this.game.world);
	}
	collapse(parent){
		parent.children
		.map(child => {
			child.$inspectorTreeExpanded = false;
			this.collapse(child);
		});
	}
	filter(term){
		term && (term = term.toLowerCase());
		/** Populate this.filteredWorld with filtered version of the world. Dah! */
		var {game, filteredWorld, filterTimer, $timeout} = this;
		/** Reset */
		filteredWorld.$inspectorFilteredChildren = [];
		/** Start filtering. Use timer to make sure the DOM is clean */
		filterTimer && $timeout.cancel(filterTimer);
		this.filterTimer = $timeout(() => {
			this.collect(game.world, filteredWorld.$inspectorFilteredChildren, term)
		});
	}
	collect(parent, list, term){
		/** Recursive mechanism of filter */
		var children = parent.children;
		_.each(children, child => {
			var children = child.$inspectorFilteredChildren = [];
			var childObj = new DisplayObject(child, this);
			/** Remain expansion while searching */
			childObj.expanded = (!term && this.$inspectorTreeSelected === child);
			/** Recursive */
			this.collect(child, children, term);
			/** Populate if match */
			if (children.length || match(childObj, term)) {
				child.$inspectorTreeExpanded = true;
				list.push(child)
			};
		})
	}
}