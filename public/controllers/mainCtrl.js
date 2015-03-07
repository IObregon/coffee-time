angular.module('Coffee-time')
  .controller('MainCtrl', ['$scope','$http', '$route', function($scope, $http, $route) {
  		$http.get('/api/personas')
  		.success(function(data,status, header, config){
        var bajas = 100;
        var i = 0;
        var paga = 0;
  			$scope.personas = data;
  			$scope.personasBajan = [];
  			data.forEach(function(persona){
					Goes(persona);
          var porcentaje = persona.NPagado / persona.NBajada
          if(porcentaje < bajas){
            bajas = porcentaje
            paga = i;
          } 
  			});
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
				gasto = persona.gastos[0];
  					if(gasto.consumicion2){
  						$scope.total = $scope.total + (gasto.consumicion.precio + gasto.consumicion2.precio);
  					}else{
  						$scope.total = $scope.total + (gasto.consumicion.precio );
  					}
  				});
  		}

      $scope.sendPago = function(cantidad){
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
      };
  }]); 