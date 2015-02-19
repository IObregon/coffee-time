angular.module('Coffee-time')
  .controller('NuevaConsuCtrl', ['$scope', '$http', function($scope, $http) {
	  $scope.nuevaConsumicion = function(){
	  	alert("Por lo menos me llaman");
	  	$http.post('/api/consumicion', $scope.Consumicion)
	  	.success(function(data, status, headers, config){
	  		$scope.Consumicion = {};
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	}
}]);



/*
$scope.crearCliente = function(){		
		$http.post('/api/clientes', $scope.Cliente)
		.success(function(data, status, headers, config){
			$scope.message = data;	
			$scope.Cliente = {};
			$location.path('/');
		})
		.error(function(data, status, headers, config){
			altert(data);
		});
	}
}]);*/
