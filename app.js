'use strict';

// Declare app level module which depends on views, and components
angular.module('flightSearch', [
  'ngRoute',
  'flightSearch.flightSearchHome',
  'mightyDatepicker',
  'rzModule'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/flightSearchHome'});
}]);
