'use strict';

angular.module('flightSearch.flightSearchHome', ['mightyDatepicker'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/flightSearchHome', {
            templateUrl: 'flightSearchPanel/flightSearchHome.html',
            controller: 'FlightSearchCtrl'
        });
    }])
    .controller('FlightSearchCtrl', ['FlightSearchService', function(FlightSearchService) {
        var vm = this,
            init = function() {
                vm.searchedData = [];
                //vm.breadCrumArray = ["New Delhi", "Pune", "New Delhi"];
                vm.activeTab = 'roundTrip';
                vm.showDepartDateRange = false;
                vm.showReturnDateRange = false;
                vm.fromCity = '';
                vm.toCity = ''
                vm.showDeptDate = false;
                vm.showReturnDate = false;
                vm.passengersCount = 0;
                vm.dateStDept = moment();
                vm.optionsStDept = {
                    callback: vm.deptDateSelected
                };
                vm.dateStReturn = moment();
                vm.optionsStReturn = {
                    callback: vm.retDateSelected
                };
            };
        angular.extend(vm, {
            setActiveTab: function(tab) {
                vm.activeTab = tab;
                vm.searchedData = [];
                vm.searchExecuted = false;
            },
            fetchSearchData: function() {
                var params = {
                    'passengerNumber': vm.passengersCount,
                    'fromCity': vm.fromCity,
                    'toCity': vm.toCity,
                    'departDate': vm.dateStDeptValue,
                    'returnDate': (vm.activeTab === 'roundTrip') ? vm.dateStReturnValue : null
                };
                console.log(params);
                vm.searchExecuted = true;
                if (vm.activeTab === 'roundTrip') {
                    FlightSearchService.getRoundTripData(params, function(data, status) {
                        if (data) {
                            vm.searchedData = data.flightDetails;
                            vm.flightsType = data.flightType;
                            vm.priceSlider = {
                                min: data.minPrice,
                                max: data.maxPrice,
                                ceil: data.maxPrice,
                                floor: data.minPrice
                            };
                        }
                    }, function(errorCode, error) {
                        if (error) {
                            console.log(errorCode);
                        }
                    });
                } else {
                    FlightSearchService.getOneWayData(params, function(data, status) {
                        if (data) {
                            vm.searchedData = data.flightDetails;
                            vm.flightsType = data.flightType;
                            vm.priceSlider = {
                                min: data.minPrice,
                                max: data.maxPrice,
                                ceil: data.maxPrice,
                                floor: data.minPrice
                            };
                        }
                    }, function(errorCode, error) {
                        if (error) {
                            console.log(errorCode);
                        }
                    });
                }

            },

            setPassengerCount: function(count) {
                vm.passengersCount = count;
            },
            deptDateSelected: function(day) {
                vm.dateStDeptValue = FlightSearchService.createDate(day._d);
                vm.showDeptDate = true;
                vm.showDepartDateRange = false;
            },
            retDateSelected: function(day) {
                vm.dateStReturnValue = FlightSearchService.createDate(day._d);
                vm.showReturnDate = true;
                vm.showReturnDateRange = false;
            }
        });
        init();
    }])
    .service('FlightSearchService', ['$http', function($http) {
        var urls = {
            'getOneWay': 'flightSearchPanel/oneWayJson.json',
            'getRoundTrip': 'flightSearchPanel/roundTrip.json'
        };
        var fetchData = function(options, callback) {

            return $http({
                    method: options.method || 'POST',
                    url: options.url,
                    params: options.params || {},
                    data: options.data || {},
                    ignoreLoadingBar: false,
                    responseType: options.responseType || "json"
                })
                .success(function(response, status) {
                    if (response) {
                        callback(response, false);
                    } else {
                        callback(null, status);
                    }
                })
                .error(function(errorResponse, status) {
                    callback(status, errorResponse);
                });

        };

        this.getOneWayData = function(data, callback, errorCallback) {
            fetchData({
                method: "GET",
                params: data,
                url: urls.getOneWay
            }, function(data, errorCode, error) {
                if (data) {
                    callback(data);
                } else {
                    errorCallback(errorCode, error);
                }
            });
        };

        this.getRoundTripData = function(data, callback, errorCallback) {
            fetchData({
                method: "GET",
                params: data,
                url: urls.getRoundTrip
            }, function(data, errorCode, error) {
                if (data) {
                    callback(data);
                } else {
                    errorCallback(errorCode, error);
                }
            });
        };

        this.createDate = function(date, isDateObject) {
            var returnString = "";
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            returnString = date.getDate() + "-" + months[(date.getMonth() + 1)] + "-" + date.getFullYear();
            return returnString;
        };
    }]).filter('to_trusted', function($sce) {
        return function(text) {
            return text ? $sce.trustAsHtml(text.toString()) : "";
        }
    }).filter('showOnlyFilteredProducts', function() {
        return function(products, min, max) {
            var filtered = [];
            angular.forEach(products, function(product) {
                if (product.price >= min && product.price <= max)
                    filtered.push(product);
            });
            return filtered;
        }
    });
