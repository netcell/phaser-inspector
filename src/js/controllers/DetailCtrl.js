var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');
var Vector        = require('../classes/Vector');

class Cache {
	constructor(){
		this.position = new Vector('x','y');
		this.world = new Vector('tx', 'ty');
		this.size = new Vector('width', 'height');
		this.targetSize = new Vector('targetWidth', 'targetHeight');
		this.bounds = new Vector('width', 'height');
		this.scale = new Vector('x', 'y');
	}
	update(obj){
		this.position.update(obj.position);
		this.world.update(obj.worldTransform);
		this.size.update(obj);
		obj.targetWidth && this.targetSize.update(obj);
		var bounds = obj.getBounds();
		this.bounds.update(bounds);
		this.scale.update(obj.scale);
	}
	reset(){
		this.position.reset();
		this.world.reset();
		this.size.reset();
		this.scale.reset();
	}
}

export default class DetailCtrl {
	constructor($scope, $timeout, gameManager, onUpdate, game){
		this.game  = game;
		this.world = game.world;
		this.gameManager = gameManager;
		$scope.cache = this.cache = new Cache();
		$scope.$watch(function () {
			return gameManager.$inspectorTreeSelected;
		}, () => {
			this.realObj = gameManager.$inspectorTreeSelected || this.world;
			this.obj     = new DisplayObject(this.realObj);
			this.cache.reset();
		});
		onUpdate.add(() => this.updateInfo());
	}

	get isWorld(){
		return this.world === this.realObj;
	}

	updateInfo(){
		var {realObj, obj, cache} = this;
		if (this.isWorld) cache.className = 'World';
		else cache.className = obj.type;
		cache.alive    = realObj.alive;
		cache.visible  = realObj.visible;
		cache.kill     = realObj.kill;
		cache.hasTargetSize = !_.isUndefined(realObj.targetWidth);

		var imageCache = game.cache._images || game.cache._cache.image;
		var img = cache.img = {};
		var key = realObj.key;
		if ( _.isString(key) ) {
			img.url    = imageCache[key].url;
			var frame  = realObj.frame;
			img.width  = frame.width;
			img.height = frame.height;
			img.x      = frame.x;
			img.y      = frame.y;
		} else if (key && key.baseTexture) {
			img.url    = key.baseTexture.source.src;
			var frame  = key.frame;
			img.width  = frame.width;
			img.height = frame.height;
			img.x      = frame.x;
			img.y      = frame.y;
		}

		var children      = realObj.children;
		cache.noChildren    = children.length;
		cache.noAlive       = children.filter(child => child.alive).length;
		cache.noNested      = getChildrenOf(realObj);
		cache.noNestedAlive = getAliveChildrenOf(realObj);

		cache.update(realObj);
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