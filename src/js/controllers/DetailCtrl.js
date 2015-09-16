var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');
var DetailPlugin = require('../classes/DetailPlugin');

class Cache {
	constructor(gameManager){
		var plugins = DetailPlugin.plugins;
		this.plugins = [];
		_.each(plugins, Plugin => this.plugins.push( new Plugin(gameManager) ));
	}
	update(obj, wrapObj){
		this.plugins.forEach(plugin => {
			if (plugin.show) plugin.update(obj, wrapObj)
		});
	}
	reset(obj, wrapObj){
		this.plugins.forEach(plugin => plugin.reset(obj, wrapObj));
	}
}

export default class DetailCtrl {
	constructor($scope, $timeout, gameManager, onUpdate, game){
		this.game  = game;
		this.world = game.world;
		this.gameManager = gameManager;
		$scope.cache = this.cache = new Cache(gameManager);
		$scope.$watch(function () {
			return gameManager.$inspectorTreeSelected;
		}, () => {
			this.realObj = gameManager.$inspectorTreeSelected || this.world;
			this.obj     = new DisplayObject(this.realObj);
			this.cache.reset(this.realObj, this.obj);
		});
		onUpdate.add(() => this.updateInfo());
	}

	get isWorld(){
		return this.world === this.realObj;
	}

	updateInfo(){
		var {realObj, obj, cache, game} = this;

		if (this.isWorld) cache.className = 'World';
		else cache.className = obj.type;

		cache.alive   = realObj.alive;
		cache.visible = realObj.visible;
		cache.kill    = realObj.kill;

		var children      = realObj.children;
		cache.noChildren    = children.length;
		cache.noAlive       = children.filter(child => child.alive).length;
		cache.noNested      = getChildrenOf(realObj);
		cache.noNestedAlive = getAliveChildrenOf(realObj);

		cache.update(realObj, obj);
	}

	deselect(){
		this.gameManager.$inspectorTreeSelected = null;
	}

	destroy() {
		this.realObj.destroy();
		this.deselect();
	}

	killRevive() {
		var realObj = this.realObj;
		return realObj.alive ? realObj.kill() : realObj.revive();
	}

	showHide() {
		return this.realObj.visible = !this.cache.visible;
	}

}

function getChildrenOf(obj){
    var count = 0;
    var children = obj.children;
    if (children) {
        count += children.length;
        for (var i = children.length - 1; i >= 0; i--) {
            count += getChildrenOf(children[i]);
        }
    }
    return count;
}

function getAliveChildrenOf(obj){
    var count = 0;
    if (obj.children) {
        var children = obj.children.filter(function(child){
            return child.alive;
        });
        count += children.length;
        for (var i = children.length - 1; i >= 0; i--) {
            count += getAliveChildrenOf(children[i]);
        }
    }
    return count;
}