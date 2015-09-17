angular.module('Coffee-time')
  .controller('NuevoGastoCtrl', ['$scope', '$http','$rootScope', '$location', function($scope, $http, $rootScope, $location) {
  	$scope.modo = "Alta";
	$scope.contadorBucle = Math.round($scope.currentUser.balance);
	function abrirDialog(callback){
		var bol = 0;
		var r = Math.floor((Math.random() * 9) + 1);
		var vert = ['left top','right top', 'center top', 'left bottom','right bottom', 'center bottom','left center','right center', 'center center'];
		$scope.contadorBucle++;
		$dialog = $('#dialog');
		$dialog.html("¿Eres conciente de que tu balance es:" + $scope.currentUser.balance + ", y este mensaje aparece una vez por cada € ?'");
			$dialog.dialog({
				//autoOpen: false,
				resizable: false,
				position:{ my:vert[r] , at:vert[r]  },
				modal: true,
				height: 250,
				width: 400,
				close: function (){
						callback(bol)
				},
				buttons: {
					"Si": function () {
						bol = 1;
						$dialog.dialog('close');
					},
					"No": function () {
						$dialog.dialog('close');
					}
				}
			});
			//$dialog.dialog("open");
			
	}
	function crearGasto(){
		var Gasto = {};
				Gasto.Consumicion = $scope.Consumicion;
				Gasto.Consumicion2 = $scope.Consumicion2;
				$http.post('/api/gasto', Gasto)
				.success(function(data, status, headers, config){
					$scope.Gasto = {};
					$location.path('/');
				})
				.error(function(data, status, header, config){
					alert(data);
				});
	}
	dialogTocaPelotas=function (bol){
		$dialog = $('#dialog');
		$dialog.dialog("destroy");
		if(bol === 1 && $scope.contadorBucle === 0 ){
				crearGasto();
			}else{
				if(bol !== 1){
					$scope.contadorBucle--;
				}
				abrirDialog(dialogTocaPelotas);
			}
	}
  	function nuevogasto(){
		if($scope.contadorBucle > 0){
			crearGasto();
		}else{
			abrirDialog(dialogTocaPelotas);
		}
  		
	  	
  	}

  	function modificarGasto(){
	  	var Gasto = {};
	  	if(typeof $scope.Consumicion == 'string'){
	  		Gasto.Consumicion = $scope.gasto.consumicion;
	  	}else{
	  		Gasto.Consumicion = $scope.Consumicion;
	  	}
	  	if(typeof $scope.Consumicion2 == 'string'){
	  		Gasto.Consumicion2 = $scope.gasto.consumicion2;
	  	}else{
	  		Gasto.Consumicion2 = $scope.Consumicion2;
	  	}
	  	$http.put('/api/gasto/' + $scope.gasto._id, Gasto )
		.success(function(data, status, headers, config){
			$location.path('/');
		})
		.error(function(data, status, headers, config){
			alert(data);
		});
	}

	$scope.eliminarGasto = function(){
		$http.delete('/api/gasto/' + $scope.gasto._id + '|' + $scope.currentUser._id)
			.success(function(data){
				$location.path('/');
			})
			.error(function(data, status, headers, config){
				alert(data);
			});
	};

	$scope.send = function(){
		if($scope.modo === "Alta"){
			nuevogasto();
		}else{
			modificarGasto();
		}
	};

  	$scope.getConsu = function(num){
	  	if(num===1){
	  		$http.get('/api/consumicion/'+$scope.tipo)
	  		.success(function(data, status, header, config){
	  			$scope.dataConsu1 = data;	
	  		});

	  	}else if(num===2){
	  		$http.get('/api/consumicion/'+$scope.tipo2)
	  		.success(function(data, status, header, config){
	  			$scope.dataConsu2 = data;
	  	});
	  	}
  	};

  	function getGasto(cb){
	  	$http.get('/api/gastoHoy/' + $rootScope.currentUser._id)
  		.success(function(data, status, headers, config){
			$scope.tipo="Bebida";
			$scope.tipo2="Comida";
			$scope.getConsu(1);
			$scope.getConsu(2);
			if(data){
		  		$scope.gasto = data;
				$scope.modo = "Modificacion";
			cb(data);
			}
  		})
  		.error(function(data, status, headers, config){
  		});
  	}


	getGasto(function(data){
		if(data.consumicion.tipo === "Comida"){
			$scope.tipo="Comida";
			$scope.Consumicion = data.consumicion.nombre;
			$http.get('/api/consumicion/'+$scope.tipo2)
	  		.success(function(data, status, header, config){
	  			$scope.dataConsu1 = data;
	  	});
		}
		if(data.consumicion2){
			$scope.combo="Desayuno";
			$scope.Consumicion2 = data.consumicion2.nombre;
		}
		$scope.Consumicion = data.consumicion.nombre;
	});
}]);
