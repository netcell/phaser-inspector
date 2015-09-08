window.$           = require('jquery');

var GameManager    = require('./js/services/GameManager');
var ViewCtrl       = require('./js/controllers/ViewCtrl');
var TreeCtrl       = require('./js/controllers/TreeCtrl');
var interaction    = require('./js/directives/interaction');
var view           = require('./js/directives/view');
var viewCollection = require('./js/directives/viewCollection');

var appTpl      = require('./tpl/app.html');
var main        = require('./css/main.css');
var fontAwesome = require('./css/font-awesome.css');

Phaser.Plugin.Inspector = class Inspector extends Phaser.Plugin {
	constructor() {
		super(...arguments);
		/** Avoid multiple creation */
		if ($('.phaser-inspector-panel').length) return;
		/** @type {Phaser.Signal} Dispatched on game update */
		this.onUpdate = new Phaser.Signal();
		/**
		 * Load Angular framework
		 * Import angular pior to this behave badly
		 * TODO: Figure out why
		 */
		window.angular = require('angular');
		var ngstorage  = require('ngstorage');
		/** Bootstrap app */
		$('html').attr('data-ng-app', 'app');
		$('body').append(appTpl);
		/** Angular app definition */
		require('./js/app')
		.factory('game', () => this.game)
		.factory('onUpdate', () => this.onUpdate)
		.controller('TreeCtrl', TreeCtrl)
		.controller('ViewCtrl', ViewCtrl)
		.factory('gameManager', ($timeout) => new GameManager($timeout, this.game))
		.directive('phaserInspectorPanel', interaction)
		.directive('view', view)
		.directive('viewCollection', viewCollection);
	}
	render() {
		this.onUpdate && this.onUpdate.dispatch();
	}
}