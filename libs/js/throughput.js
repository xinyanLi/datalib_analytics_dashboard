var app = angular.module("throughputApp", ['highcharts-ng']);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

app.controller("throughputController", function($scope, limitToFilter, $http, $log) {
  
  $scope.curThroughput = {
    id: 0,
    type: '',
    sub_type:'',
    imei: '',
    app_version: '',
    sdk_version: '',
    date: '',
  };

  $scope.filters = {
    type: 'all',
  };

  $scope.pie_items = [
                      ['CONDUCTED', 2],
                      ['FAILED', 3],
                      ['RESTRICTED', 4]
                   ];
  /*
  $scope.$watch('filters.type', function(newVal){
       $scope.pie_items = function() {
        switch($scope.filters.type) {
          case('all'):
            return [
                      ['CONDUCTED', $scope.conductedTests.length],
                      ['FAILED', $scope.failedTests.length],
                      ['RESTRICTED', $scope.restrictedTests.length]
                   ];
          case('conducted'):
            return [
                      ['OK', countSubTypetNum($scope.conductedTests, 'OK')],
                      ['SENT', countSubTypetNum($scope.conductedTests, 'SENT')],
                      ['OTHERS', countSubTypetNum($scope.conductedTests, 'OTHERS')]
                   ];
          case('failed'):
            return [
                      ['TIMEOUT', countSubTypetNum($scope.failedTests, 'TIMEOUT')],
                      ['OTHERS', countSubTypetNum($scope.failedTests, 'OTHERS')],
                   ];
          case('restricted'):
            return [
                      ['DATALIMIT', countSubTypetNum($scope.restrictedTests, 'DATALIMIT')],
                      ['OTHERS', countSubTypetNum($scope.restrictedTests, 'OTHERS')],
                   ];
        }
      }();
  }, true);
*/


	$scope.initialize = function() {
		$scope.load();
	};
	
	$scope.load = function() {
		
    $http.get('http://datalib-analytics-api-dev.crowdx.co/api/throughputs/').then(function(response){       // promise service
			
      $scope.tests =  response.data;
      console.log(response);
      $scope.conductedTests = [];
      $scope.failedTests = [];
      $scope.restrictedTests = [];
      
      for (i=0; i<$scope.tests.length; i++) {
        var test = $scope.tests[i];
        switch(test.type) {
          case 'CONDUCTED':
            $scope.conductedTests.push(test);
            break;
          case 'FAILED':
            $scope.failedTests.push(test);
            break;
          case 'RESTRICTED':
            $scope.restrictedTests.push(test);
            break;
        }
      }
			console.log('load then', $scope.tests);
      console.log('CONDUCTED', $scope.conductedTests);
      console.log('FAILED', $scope.failedTests);
      console.log('RESTRICTED', $scope.restrictedTests);

     $scope.pie_items = function() {
        switch($scope.filters.type) {
          case('all'):
            return [
                      ['CONDUCTED', $scope.conductedTests.length],
                      ['FAILED', $scope.failedTests.length],
                      ['RESTRICTED', $scope.restrictedTests.length]
                   ];
          case('conducted'):
            return [
                      ['OK', countSubTypetNum($scope.conductedTests, 'OK')],
                      ['SENT', countSubTypetNum($scope.conductedTests, 'SENT')],
                      ['OTHERS', countSubTypetNum($scope.conductedTests, 'OTHERS')]
                   ];
          case('failed'):
            return [
                      ['TIMEOUT', countSubTypetNum($scope.failedTests, 'TIMEOUT')],
                      ['OTHERS', countSubTypetNum($scope.failedTests, 'OTHERS')],
                   ];
          case('restricted'):
            return [
                      ['DATALIMIT', countSubTypetNum($scope.restrictedTests, 'DATALIMIT')],
                      ['OTHERS', countSubTypetNum($scope.restrictedTests, 'OTHERS')],
                   ];
        }
      }();
      //$scope.selectedTypes = limitToFilter($scope.types, 3);
		});
	};

  
	$scope.save = function() {
		$http.post('http://datalib-analytics-api-dev.crowdx.co/api/throughputs/', $scope.curTest).then(function(response){      
			$scope.load();
			$scope.curTest = {};
			console.log('save then', response);
		});
	};

	$scope.delete = function(test) {
		console.log('test', test);
		$http.delete('http://datalib-analytics-api-dev.crowdx.co/api/throughputs/'+test.id).then(function(response){      
			$scope.load();
			console.log('delete then', response);
		});
			$scope.load();

	};	

	$scope.addPoints = function () {
        var seriesArray = $scope.highchartsNG.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.highchartsNG.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.highchartsNG.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.options = {
        type: 'line'
    }

    $scope.swapChartType = function () {
        if (this.highchartsNG.options.chart.type === 'line') {
            this.highchartsNG.options.chart.type = 'bar'
        } else {
            this.highchartsNG.options.chart.type = 'line'
        }
    }

    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'line'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Total Daily Tests'
        },
        loading: false
    };

  
});

//pie chart

app.directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    controller: function ($scope, $element, $attrs) {
     // console.log(2);

    },
    template: '<div id="container" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      console.log(attrs);
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Type / Subtype distribution'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'percentage',
          data: scope.items
        }]
      });
      scope.$watch("items", function (newValue) {
        //console.log('newValue', newValue);
        chart.series[0].setData(newValue, true);
      }, true);
      
    }
  }
});


var countSubTypetNum = function(typeArray, subType) {
      var num = 0;
      for (i=0; i<typeArray.length; i++) {
        if (typeArray[i].sub_type == subType) {
            num++;
        }
      }
      return num;
  };
