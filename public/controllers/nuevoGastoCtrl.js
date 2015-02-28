angular.module('Coffee-time')
  .controller('NuevoGastoCtrl', ['$scope', '$http','$rootScope', function($scope, $http, $rootScope) {

  	$http.get('/api/gastoHoy/' + $rootScope.currentUser.gastos[$rootScope.currentUser.gastos.length -1])
  		.success(function(data, status, headers, config){
  			if(data){
  				alert("asdad" + data.consumicion2);
  				$scope.Gasto = data;
  				alert(data.consumicion2)
  				if($scope.Gasto.consumicion2){
  					alert("Soy un desayuno completo y nutritivo");
  					alert($scope.combo)
  				}
  			}else{
				$scope.tipo="Bebida";
				$scope.tipo2="Comida";
				$scope.getConsu(1);
  			}
  		})
  		.error(function(data, status, headers, config){
  			alert(data);
  		})
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
}]);