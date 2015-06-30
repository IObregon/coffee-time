angular.module('Coffee-time')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {
      $rootScope.currentUser = $cookieStore.get('persona');
      $cookieStore.remove('persona');

      return {
        login: function(persona) {
          return $http.post('/api/login', persona)
            .success(function(data) {
              $rootScope.currentUser = data;
              $location.path('/');
            })
            .error(function() {
				alert('Usuario o Contraseña incorrectos.')
            });
        },
        signup: function(persona) {
          return $http.post('/api/signup', persona)
            .success(function() {
              $location.path('/login');

              })
            .error(function(response) {
              
            });
        },
        logout: function() {
          return $http.get('/api/logout').success(function() {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
            $location.path('/login');   
          });
        }
      };
    }]);