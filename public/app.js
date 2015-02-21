angular.module('Coffee-time', ['ngRoute','ngResource','ngCookies'])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    	$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				//controller: 'MainCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/signup', {
				templateUrl: 'views/signup.html',
				controller: 'SignupCtrl'
			})
			.when('/nuevaConsumicion', {
				templateUrl: 'views/nuevaConsumicion.html',
				controller: 'NuevaConsuCtrl'
			})
			.when('/nuevoGasto', {
				templateUrl: 'views/nuevoGasto.html',
				controller: 'NuevoGastoCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});




  }]);