var viewTpl = require('../../tpl/tree/view.html');

export default function($compile) {
	return {
		replace : true,
		scope   : {
			obj      : '=',
			filtered : '='
		},
		controller   : 'ViewCtrl',
		controllerAs : 'viewCtrl',
		template     : viewTpl,
		link : function(scope, element){
			scope.parent = scope.filtered ? scope.obj.$inspectorFilteredChildren : scope.obj.children;
			var collection = $('<view-collection parent="parent" ng-if="viewCtrl.expanded"  filtered="' + scope.filtered + '"></view-collection>');
			element.append(collection);
			$compile(collection)(scope);
		}
	};
};