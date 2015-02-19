angular.module('Coffee-time')
  .factory('Consu', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {
      $rootScope.currentUser = $cookieStore.get('persona');
	  
}]);