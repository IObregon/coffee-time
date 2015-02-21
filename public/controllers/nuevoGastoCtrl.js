angular.module('Coffee-time')
  .controller('NuevoGastoCtrl', ['$scope', '$http', function($scope, $http) {
	  $scope.nuevogasto = function(){
	  	$http.post('/api/gasto', $scope.Gasto)
	  	.success(function(data, status, headers, config){
	  		$scope.Gasto = {};
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	}

	  $scope.getConsu = function(){
	  	$http.get('/api/consumicion/'+$scope.tipo)
	  	.success(function(data, status, header, config){
	  		$scope.data = data;
	  	})
	  }
	  $scope.tipo="Bebida";
	 $scope.getConsu();	  
}]);