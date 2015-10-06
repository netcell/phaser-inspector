export default angular.module('phaser-inspector', ['ngStorage', 'pasvaz.bindonce', 'pg-ng-tooltip'])
.directive('bindHtmlUnsafe', function( $parse, $compile ) {
    return function( $scope, $element, $attrs ) {
        var compile = function( newHTML ) {
            newHTML = $compile(newHTML)($scope);
            $element.html('').append(newHTML);
        };

        var htmlName = $attrs.bindHtmlUnsafe;

        $scope.$watch(htmlName, function( newHTML ) {
            if(!newHTML) return;
            compile(newHTML);
        });

    };
}).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        console.log(element)
        element.bind('keydown keypress', function (event) {
            console.log(event.which)
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter || attrs.ngClick, {$event:event});
                });
                event.preventDefault();
            }
        });
    };
});;
