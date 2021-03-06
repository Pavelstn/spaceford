/**
 * Created by pavel on 01.02.17.
 */

var app = angular.module("app", []);


app.directive('ngDebounce', function ($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 99,
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input');

            var debounce;
            elm.bind('input', function () {
                $timeout.cancel(debounce);
                debounce = $timeout(function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                }, attr.ngDebounce || 1000);
            });
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }

    }
});



app.controller("app", function ($scope) {
    $scope.scene_params = {
        sphere: {
            radius: 10,
            position: {
                x: 10,
                y: 10,
                z: 10,
            },
            color: "#FFFE3C"
        },
        popover: {
            isshow: false,
            text: "Текст в окошке"
        }
    };

    $scope.init = function () {
        init();
        animate();
        $scope.update_values();
    };

    $scope.update_values = function () {

        window.scene_params = $scope.scene_params;
        redraw_scene();
    };

});
