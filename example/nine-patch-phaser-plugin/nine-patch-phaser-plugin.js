(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NinePatchCache = (function () {
	/**
  * * @param {Phaser.Game} game - A reference to the currently running game.
  * @param {String} imageKey - The reference to the Cache entry of the texture to cut from.
  * @param {String|Number} imageFrame - If the texture to cut from is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
  * @param  {Number} left - position of left most point of the center patch
  * @param  {Number} right - position of right most point of the center patch
  * @param  {Number} top - position of top most point of the center patch
  * @param  {Number} bottom - position of bottom most point of the center patch
  */

	function NinePatchCache(game, imageKey, imageFrame, left, right, top, bottom) {
		_classCallCheck(this, NinePatchCache);

		this.game = game;
		this.imageKey = imageKey;
		this.imageFrame = imageFrame;
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		/** @type {Array} The 3x3 Texture Array that would be generated for the 9 patches */
		this.textures = [[], [], []];
		/** Image Cache - Support for earlier version of Phaser */
		var _images = game.cache._images || game.cache._cache.image;
		var imageCache = _images[imageKey];
		/** @type {PIXI.BaseTexture} Get the Base Texture to process */
		this.baseTexture = PIXI.BaseTextureCache[imageKey] ? PIXI.BaseTextureCache[imageKey] : imageCache.base;
		/** @type {Number} Positions and measures of the texture on the base texture */
		if (imageFrame) {
			var frameData = imageCache.frameData;
			var frame = frameData._frames[frameData._frameNames[imageFrame]];
			this.x = frame.x;
			this.y = frame.y;
			this.width = frame.width;
			this.height = frame.height;
		} else {
			/** The texture would cover the entire base texture if it isn't a part of a sprite sheet or texture atlas */
			this.x = 0;
			this.y = 0;
			this.width = this.baseTexture.width;
			this.height = this.baseTexture.height;
		}
		/** Process the data */
		this.CreateFrameData();
	}

	/** Generate the textures */

	_createClass(NinePatchCache, [{
		key: "CreateFrameData",
		value: function CreateFrameData() {
			var imageKey = this.imageKey;
			var baseTexture = this.baseTexture;
			var textures = this.textures;

			/** Calculate the position of each patch relative to the texture */
			var dimensions = this.CreateDimensionMap();
			/** Offset by the position of the frame */
			if (this.imageFrame !== undefined) {
				for (var i = 2; i >= 0; i--) {
					for (var j = 2; j >= 0; j--) {
						var item = dimensions[i][j];
						item.x += this.x;
						item.y += this.y;
					};
				};
			}
			/** Generate the textures by cutting from the base texture */
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					this.textures[i][j] = new PIXI.Texture(baseTexture, dimensions[i][j]);
				}
			}
		}

		/**
   * Get the position of each patch based on the measures specified
   * @param {Number} width = this.width
   * @param {Number} height = this.height
   * @return {Array} The positions array mapped with the patches
   */
	}, {
		key: "CreateDimensionMap",
		value: function CreateDimensionMap() {
			var width = arguments.length <= 0 || arguments[0] === undefined ? this.width : arguments[0];
			var height = arguments.length <= 1 || arguments[1] === undefined ? this.height : arguments[1];
			var left = this.left;
			var right = this.right;
			var top = this.top;
			var bottom = this.bottom;

			/** position of the patches in the middle (horizontally and vertically) */
			var midH = width - left - right;
			var midV = height - top - bottom;
			/**
    * @type {Array} The positions array mapped with the patches
    * Would be returned at the end of this function
    */
			var dimensions = [[], [], []];
			/** Set positions for each patch and record in the dimensions*/
			for (var i = 2; i >= 0; i--) {
				for (var j = 2; j >= 0; j--) {
					var item = dimensions[i][j] = {};
					switch (i) {
						case 0:
							item.height = top;
							item.y = 0;
							break;
						case 1:
							item.height = midV;
							item.y = top;
							break;
						case 2:
							item.height = bottom;
							item.y = top + midV;
							break;
					}
					switch (j) {
						case 0:
							item.width = left;
							item.x = 0;
							break;
						case 1:
							item.width = midH;
							item.x = left;
							break;
						case 2:
							item.width = right;
							item.x = left + midH;
							break;
					}
				};
			};

			return dimensions;
		}

		/**  */
		/**
   * Generate patch images
   * @param {DisplayObject}[Optional] Either a Phaser.Group or a Phaser.Image/Sprite/... that would contain these images
   * @return {Array} 3x3 Array of Phaser.Image for the patches
   */
	}, {
		key: "CreateImages",
		value: function CreateImages(parent) {
			var textures = this.textures;
			/** @type {Array} The returned array */
			var images = [[], [], []];
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					/** @type {Phaser.Image} The generated image */
					var image = images[i][j] = this.game.add.image(0, 0, textures[i][j]);
					/** Add the image to parent */
					if (parent) {
						/** TODO: Write an isFunction check */
						if (parent.add) parent.add(image);else if (parent.addChild) parent.addChild(image);
					}
				}
			}
			return images;
		}
	}]);

	return NinePatchCache;
})();

exports["default"] = NinePatchCache;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
/**
 * Return true if value is a String
 * TODO: Use a better method to prevent error
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isString(value) {
	return typeof value === 'string';
}

var NinePatchImage = (function (_Phaser$Image) {
	_inherits(NinePatchImage, _Phaser$Image);

	/**
  * @param {Phaser.Game} game - REF Phaser.Image params
  * @param {Number} x = 0 - REF Phaser.Image params
  * @param {Number} y = 0 - REF Phaser.Image params
  * @param  {String || NinePatchCache} key - The NinePatchCache used by the NinePatchImage. It can be a string which is a reference to the Cache entry, or an instance of a NinePatchCache.
  * @param {NinePatchCache} ninePatchImages - To be deprecated.
  */

	function NinePatchImage(game, x, y, key, ninePatchImages) {
		if (x === undefined) x = 0;
		if (y === undefined) y = 0;

		_classCallCheck(this, NinePatchImage);

		_get(Object.getPrototypeOf(NinePatchImage.prototype), 'constructor', this).call(this, game, x, y);
		game.add.existing(this);
		/** Get the NinePatchCache instance */
		if (!ninePatchImages) {
			if (typeof key == 'string') {
				ninePatchImages = game.cache.getNinePatch(key);
			} else if (true /** Check if key is an instance of NinePatchCache */) {
					ninePatchImages = key;
				} else throw new Error('NinePatchImage key must be a String or an instance of NinePatchCache');
		}
		this.ninePatchImages = ninePatchImages;
		/** @type {Array} Generate 9 instances of Phaser.Image as the children of this */
		this.images = ninePatchImages.CreateImages(this);
		/** Setting measures for this */
		this.currentWidth = ninePatchImages.width;
		this.currentHeight = ninePatchImages.height;
		/** Update images' positions */
		this.UpdateImageSizes();
	}

	/** Get/Set for measures to update images' positions on chagnges */

	_createClass(NinePatchImage, [{
		key: 'UpdateImageSizes',

		/** Update images' positions to match the new measures */
		value: function UpdateImageSizes() {
			var ninePatchImages = this.ninePatchImages;
			var currentWidth = this.currentWidth;
			var currentHeight = this.currentHeight;
			var images = this.images;
			var anchor = this.anchor;

			/** Get the positions for the new measures */
			var dimensions = ninePatchImages.CreateDimensionMap(currentWidth, currentHeight);
			/** Calculate the padding to match the anchor */
			var paddingX = anchor.x * currentWidth;
			var paddingY = anchor.y * currentHeight;
			/** Loop through all images and update the positions */
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					var image = images[i][j];
					var dimension = dimensions[i][j];
					image.x = dimension.x - paddingX;
					image.y = dimension.y - paddingY;
					image.width = dimension.width;
					image.height = dimension.height;
				}
			}
		}
	}, {
		key: 'targetWidth',
		get: function get() {
			return this.currentWidth;
		},
		set: function set(value) {
			this.currentWidth = value;
			this.UpdateImageSizes();
		}
	}, {
		key: 'targetHeight',
		get: function get() {
			return this.currentHeight;
		},
		set: function set(value) {
			this.currentHeight = value;
			this.UpdateImageSizes();
		}
	}]);

	return NinePatchImage;
})(Phaser.Image);

exports['default'] = NinePatchImage;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
var NinePatchCache = require('./NinePatchCache');
/**
 * This function should be called when the image/spritesheet/texture has been loaded
 * @param {String} name - the key to refer to the created NinePatchCache
 * @param {String} imageKey   - REF NinePatchCache
 * @param {String} imageFrame - REF NinePatchCache
 * @param {Number} left       - REF NinePatchCache
 * @param {Number} right      - REF NinePatchCache
 * @param {Number} top        - REF NinePatchCache
 * @param {Number} bottom     - REF NinePatchCache
 */
Phaser.Cache.prototype.addNinePatch = function addNinePatch(name, imageKey, imageFrame, left, right, top, bottom){
	var _ninePatches = this._ninePatches = this._ninePatches || {};
	_ninePatches[name] = new NinePatchCache(this.game, imageKey, imageFrame, left, right, top, bottom);
	console.log(_ninePatches)
}
/** Return an instance of NinePatchCache match with the name */
Phaser.Cache.prototype.getNinePatch = function getNinePatch(name) {
	var _ninePatches = this._ninePatches = this._ninePatches || {};
	return _ninePatches[name];
}
Phaser.NinePatchImage = require('./NinePatchImage');
},{"./NinePatchCache":1,"./NinePatchImage":2}]},{},[3]);
