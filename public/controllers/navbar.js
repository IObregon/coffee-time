angular.module('Coffee-time')
  .controller('NavbarCtrl', ['$scope', 'Auth', '$location', '$http', function($scope, Auth, $location, $http) {
    $scope.logout = function() {
      Auth.logout();
    };
	
	$scope.puedeApuntar = function() {
		$http.get('/api/getHora')
		.success(function(data, status, header, config){
			if(data > 37800 && data < 41400){
				alert('Solo puedes apuntarte o modificar antes de las 10:30 o despues de las 11.30');
			}else{
				$location.path('/nuevoGasto');
			}
		});
	}
  }]);