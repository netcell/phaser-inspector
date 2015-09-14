window.$           = require('jquery');

var GameManager            = require('./js/services/GameManager');
var ViewCtrl               = require('./js/controllers/ViewCtrl');
var DetailCtrl             = require('./js/controllers/DetailCtrl');
var TreeCtrl               = require('./js/controllers/TreeCtrl');
var interaction            = require('./js/directives/interaction');
var phaserInspectorTree    = require('./js/directives/phaserInspectorTree');
var phaserInspectorDetails = require('./js/directives/phaserInspectorDetails');
var view                   = require('./js/directives/view');
var viewCollection         = require('./js/directives/viewCollection');

var appTpl      = require('./tpl/app.html');
var main        = require('./css/main.css');
var fontAwesome = require('./css/font-awesome.css');
// var tooltip     = require('../node_modules/pg-ng-tooltip/dest/css/pg-ng-tooltip.min.css')

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
		require('../node_modules/pg-ng-tooltip/dest/js/pg-ng-tooltip.js');
		require('angular-bindonce');
		require('ngstorage');
		/** Bootstrap app */
		$('html').attr('data-ng-app', 'app');
		$('body').append(appTpl);
		/** Angular app definition */
		require('./js/app')
		.factory('game', () => this.game)
		.factory('onUpdate', () => this.onUpdate)
		.controller('TreeCtrl', TreeCtrl)
		.controller('ViewCtrl', ViewCtrl)
		.controller('DetailCtrl', DetailCtrl)
		.factory('gameManager', ($timeout) => new GameManager($timeout, this.game, this.onUpdate))
		.directive('phaserInspectorPanel', interaction)
		.directive('phaserInspectorTree', phaserInspectorTree)
		.directive('phaserInspectorDetails', phaserInspectorDetails)
		.directive('view', view)
		.directive('viewCollection', viewCollection);
	}
	render() {
		this.onUpdate && this.onUpdate.dispatch();
	}
}