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
	  	};

	  $scope.getConsu = function(num){
	  	if(num===1){
	  		$http.get('/api/consumicion/'+$scope.tipo)
	  		.success(function(data, status, header, config){
	  			$scope.data = data;	
	  		});

	  	}else if(num===2){
	  		$http.get('/api/consumicion/'+$scope.tipo2)
	  		.success(function(data, status, header, config){
	  			$scope.data2 = data;
	  	});
	  	}
	  };
	  $scope.tipo="Bebida";
	  $scope.tipo2="Comida";
	 $scope.getConsu(1);
	 //$scope.getConsu(2);
}]);