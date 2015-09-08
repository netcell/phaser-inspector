var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');

/** Return true if childObj has name/type match the search term */
function match(childObj, term){
	if (!term) return false;
	var {name, type} = childObj;
	if (_.isFunction(name.match) && name.match(term)) return true;
	if (_.isFunction(type.match) && type.match(term)) return true;
	return false;
}

export default class GameManager {
	constructor($timeout, game){
		this.$timeout = $timeout;
		this.game     = game;

		this.filteredWorld = { children: [] };
		this.filterTimer   = null;

		this.$inspectorTreeSelected = null;
	}
	filter(term){
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