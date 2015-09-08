var _             = require('lodash');
var DisplayObject = require('../classes/DisplayObject');
export default class ViewCtrl extends DisplayObject {
	constructor($scope, $timeout, gameManager){
		super($scope.obj, gameManager);
		var update = _.throttle(() => {
			$timeout(() => {
				var width = Math.max.apply(Math, $('#tree .middle').map(function(){
					return $(this).width();
				}).get());
				$('#tree .row').width(Math.max(width + this.childLevel * 20, $('#tree').width()));
			})
		}, 500);
		$('.row').click(update)

		var lastTime = Date.now();
		var delta = 1000;
		$(window).resize(function(){
			lastTime = Date.now();
			setTimeout(function(){
				if (Date.now() - lastTime > delta) update();
			}, delta)
		});
	}
}