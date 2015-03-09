angular.module('Coffee-time')
  .controller('NuevoIngresoCtrl', ['$scope', '$http','$location', function($scope, $http, $location) {
	  $scope.nuevoingreso = function(){
	  	$http.post('/api/ingreso', $scope.Ingreso)
	  	.success(function(data, status, headers, config){
	  		$scope.Ingreso = {};
			$location.path('/');
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	};
}]);	  	