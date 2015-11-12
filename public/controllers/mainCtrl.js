angular.module('Coffee-time')
  .controller('MainCtrl', ['$scope','$http', '$route', '$timeout', function($scope, $http, $route, $timeout) {
		getLastPago(function(err, data){
			$scope.PagadoYa = data;
		});
  		$http.get('/api/personas')
  		.success(function(data,status, header, config){
        var bajas = 100;
        var i = 0;
        var paga = 0;
  			$scope.personas = data;
  			$scope.personasBajan = [];
  			data.forEach(function(persona){
					Goes(persona);
  			});
			$scope.personasBajan.forEach(function(persona){
				var porcentaje = persona.NPagado / persona.nBajadas;
				if(porcentaje < bajas){
					bajas = porcentaje;
					paga = i;
				}
			i++;
			});
			getLista();
			$scope.index = paga ;
  			getTotal();
        getBote();
		
  		})
  		.error(function(data, status, header, config){
  			alert(data);
  		});
		
		// Put all the "Persona" who has today a "Gasto" in "personasBajan" array 
  		function Goes(persona){
  			var today = new Date();
  			if(persona.gastos){
  				persona.gastos.forEach(function(gasto){
  					if(gasto){
  						var gastoDate  = new Date(gasto.fecha);
  						if(+today.getDate() === +gastoDate.getDate()){
  							if(+today.getMonth() === +gastoDate.getMonth()){
  								if(+today.getFullYear() === +gastoDate.getFullYear()){
  									$scope.personasBajan.push(persona);
  								}
  							}
  						}	
  					}		
  				});
  			}	
  		}
		function getLastPago(cb){
			$http.get('/api/pago')
				.success(function(data, status, header, config){
					cb(null, data);
				})
				.error(function(data, status, header, config){
					cb(data, null);
				});
		}
		
      function getBote(){
        $http.get('/api/bote')
          .success(function(data,status, header, config){
            $scope.Bote = data;
          })
          .error(function(data, status, header, config){
            alert(data);
          });
      }
		// Returns the total for today
  		function getTotal(){
  			$scope.total = 0;
  			$scope.personasBajan.forEach(function(persona){
				gasto = persona.gastos[persona.gastos.length - 1];
  					if(gasto.consumicion2){
  						$scope.total = $scope.total + (gasto.consumicion.precio + gasto.consumicion2.precio);
  					}else{
  						$scope.total = $scope.total + (gasto.consumicion.precio );
  					}
  				});
  		}
		
		function getLista(){
			var bajan = $scope.personasBajan;
			var lista = {};
			bajan.forEach(function(persona){
				var gasto = persona.gastos[persona.gastos.length -1];
				if (gasto.consumicion != null){
					if(gasto.consumicion.nombre in lista){
						lista[gasto.consumicion.nombre]++;
					}else{
						lista[gasto.consumicion.nombre] = 1;
					}
				}
				if (gasto.consumicion2 != null){
					if(gasto.consumicion2.nombre in lista){
						lista[gasto.consumicion2.nombre]++;
					}else{
						lista[gasto.consumicion2.nombre] = 1;
					}
				}
			});
			$scope.listaHoy = lista;
		};
		$scope.Invitar = function() {
			if(confirm("¿Estas seguro/a de que has invitado a todo el mundo?, se borraran todas las consumiciones de hoy")){
				$scope.personasBajan.forEach(function(persona){
					$http.delete('/api/gasto/' + persona.gastos[persona.gastos.length -1]._id + '|' + persona._id);
					$timeout(function() {
							$route.reload();
						}, 250);
				});
			}
		};


      $scope.sendPago = function(cantidad){
		  if(confirm("¿Estas seguro/a de que el camarero te ha cobrado " + cantidad +"€?")){
			var cant = {
			  cantidad : cantidad
			};
			$http.post('/api/pago', cant)
			.success(function(data, status, headers, config){
			  $scope.cantidad = 0;
			  $route.reload();
			})
			.error(function(data, status, header, config){
			  alert(data);
			});
		  }
      };
  }]); 
