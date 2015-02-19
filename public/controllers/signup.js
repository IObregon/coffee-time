angular.module('Coffee-time')
  .controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        email: $scope.email,
        password: $scope.password,
        nombre: $scope.nombre
      });
    };
  }]);