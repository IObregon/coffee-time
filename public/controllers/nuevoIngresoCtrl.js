angular.module('Coffee-time')
  .controller('NuevoIngresoCtrl', ['$scope', '$http', function($scope, $http) {
	  $scope.nuevoingreso = function(){
	  	$http.post('/api/ingreso', $scope.Ingreso)
	  	.success(function(data, status, headers, config){
	  		$scope.Ingreso = {};
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	}
}]);	  	