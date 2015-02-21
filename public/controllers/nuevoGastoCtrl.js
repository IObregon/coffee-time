angular.module('Coffee-time')
  .controller('NuevoGastoCtrl', ['$scope', '$http', function($scope, $http) {
	  $scope.nuevagasto = function(){
	  	alert("Por lo menos me llaman");
	  	$http.post('/api/gasto', $scope.Gasto)
	  	.success(function(data, status, headers, config){
	  		$scope.Consumicion = {};
	  	})
	  	.error(function(data, status, header, config){
	  		alert(data);
	  	});
	  	}
}]);