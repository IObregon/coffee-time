/*angular.module('Coffee-time')
  .factory('Consu', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {
      $rootScope.currentUser = $cookieStore.get('persona');
	  
	  return {
        nuevo: function(consumicion) {
          return $http.post('/api/consumicion', consumicion)
            .success(function(data) {
				$scope.consumicion={};
				$location.path('/');
            })
            .error(function() {
            });
        }
}
}]);
*/

/*
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
            });
        },
        */