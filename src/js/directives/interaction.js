var interact    = require('interact.js');
var draggabilly = require('draggabilly');

function fit({top, left}, width){
	top = Math.max(top, 0);
	top = Math.min(top, document.documentElement.clientHeight - 50);
	left = Math.max(left, - width + 50);
	left = Math.min(left, document.documentElement.clientWidth - 50);
	return {top, left};
}

export default function($localStorage, $timeout) {
	return {
		restrict : 'C',
		link     : function(scope, element){
			var el = $(element);
			var element = element[0];

			var { elX, elY, elW, elH } = $localStorage;
			elW && el.css({ width  : `${elW}px` });
			elH && el.css({ height : `${elH}px` });

			/** Enable drag */
			var draggie = new draggabilly(element, {
				handle: '.grabber'
			}).on('dragEnd', function(event, pointer) {
				var { left, top } = fit(el.position(), el.width());
				el.css({
					top  : `${top}px`,
					left : `${left}px`
				});
				$localStorage.elX = left;
				$localStorage.elY = top;
			});
			/**
			 * Since draggabilly set position to relative
			 * this reset the css properties
			 */
			$timeout(function(){
				el.css({
					position : 'fixed',
					top      : `${elY || 0}px`,
					left     : `${elX || 0}px`
				});
			});
			scope.$watch(function(){
				return scope.display.hide;
			}, function(){
				interact(element).resizable({ enabled : !scope.display.hide });
			})
			/** Enable resize */
			interact(element).resizable({
				edges: { left: true, right: true, bottom: true }
			}).on('resizemove', function (event) {
				/** This function is copied from interact.js example */
				var target = event.target,
				x = (parseFloat(target.getAttribute('data-x')) || 0),
				y = (parseFloat(target.getAttribute('data-y')) || 0);
				// update the element's style
				target.style.width  = event.rect.width + 'px';
				target.style.height = event.rect.height + 'px';

				// translate when resizing from top or left edges
				x += event.deltaRect.left;
				y += event.deltaRect.top;

				target.style.webkitTransform =
				target.style.transform =
				'translate(' + x + 'px,' + y + 'px)';

				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
			}).on('resizeend', function(event){
				var { left, top } = fit(el.position());
				el.css({
					top  : `${top}px`,
					left : `${left}px`
				});
				$localStorage.elW = el.width();
				$localStorage.elH = el.height();
				$localStorage.elX = left;
				$localStorage.elY = top;
				var target = event.target;
				target.style.webkitTransform =
				target.style.transform =
				'translate(0px, 0px)';
				target.setAttribute('data-x', 0);
				target.setAttribute('data-y', 0);
			});
		}
	};
}