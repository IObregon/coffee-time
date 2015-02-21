angular.module('Coffee-time')
  .controller('NuevaConsuCtrl', ['$scope', '$http', function($scope, $http) {
	  $scope.nuevaConsumicion = function(){
	  	if(!$scope.Consumicion.tipo) $scope.Consumicion.tipo = "Bebida";
	  	$http.post('/api/consumicion', $scope.Consumicion)
	  	.success(function(data, status, headers, config){
	  		$scope.Consumicion = {};
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	}
}]);

