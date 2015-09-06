export default function($q, $compile) {
	return {
		replace : true,
		scope   : {
			parent   : '=',
			filtered : '='
		},
		template : '<view ng-repeat="obj in parent" obj="obj"></view>',
		link : function(scope, element){
			element.attr('filtered', scope.filtered);
			$compile(element)(scope);
		}
	};
};