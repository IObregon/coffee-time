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
			.when('/nuevoIngreso', {
				templateUrl: 'views/nuevoIngreso.html',
				controller: 'NuevoIngresoCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});




  }])
  .run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ($rootScope.currentUser == null) {
        // no logged user, redirect to /login
        if ( next.templateUrl === "views/home.html" || next.templateUrl === "views/signup.html") {
        } else {
          $location.path("/login");
        }
      }
    });
  });