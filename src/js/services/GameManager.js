var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');

/** Return true if childObj has name/type match the search term */
function match(childObj, term){
	if (!term) return false;
	var {name, type} = childObj;
	return (name && name.toLowerCase().match(term)) || (type && type.toLowerCase().match(term));
}

export default class GameManager {
	constructor($timeout, game){
		this.$timeout = $timeout;
		this.game     = game;

		this.filteredWorld = { children: [] };
		this.filterTimer   = null;

		this.$render = true;

		var self = this;
		Object.defineProperty(window, '$inspectorTreeSelected', {
			get: function(){
				return self.$inspectorTreeSelected;
			}
		})

		this.$inspectorTreeSelected = null;
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