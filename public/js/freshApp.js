var freshApp = angular.module('freshApp', ['ngRoute']);

freshApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
   when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    }).
    when('/design', {
      templateUrl: 'views/design.html',
      controller: 'DesignController'
    }).otherwise({
      redirectTo: '/home'
    });
}]);