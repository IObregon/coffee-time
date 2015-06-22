angular.module('Coffee-time')
  .controller('BeneficiosCtrl', ['$scope','$http', function($scope, $http) {
		
		$scope.calcular = function(){
			$http.post('/api/getGastosFechas', $scope.Beneficio)
			.success(function(data,status, header, config){
				var lista = {};
				var gastoTotal =0;
				data.forEach(function(gasto){
					gastoTotal += gasto.total;
					if(gasto._creador.nombre in lista){
						lista[gasto._creador.nombre] += gasto.total;
					}else{
						lista[gasto._creador.nombre] = gasto.total;
					}
				});

				for (var key in lista){
					var objeto = {};
					objeto["Gastado"] = lista[key];
					objeto["Porcen"] = (lista[key] * 100) / gastoTotal;
					objeto["Devolver"] = (lista[key] / gastoTotal) * $scope.Beneficio.Cantidad;	
					lista[key] = objeto;								
				}
				$scope.lista = lista;
			});
		}
	}]); 