var app = angular.module("throughputApp", ['highcharts-ng']);
/*
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken`';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);
*/
app.controller("throughputController", function($scope, limitToFilter, $http, $log) {

	$scope.initialize = function() {

    $scope.baseURL = 'http://localhost:8888/datalib_analytics_dashboard/libs/proxy.php';

    $scope.filters = {
      from_date: '',
      to_date: '',
      imei: '',
      sdk_version: '',
      app_version: ''
    };
    $scope.pie_type = 'all';
    $scope.pie_items = [     
                        ['CONDUCTED', 0],
                        ['FAILED', 0],
                        ['RESTRICTED', 0]
                     ];
    $scope.loadedLists = 0;
		$scope.load();
	};

  $scope.change = function() {
    $scope.loadedLists = 0;
    $scope.load();    
  }
	
  /*
  * construct 3 lists [Conducted, Failed, Restricted] under filters 
  */
	$scope.load = function() {   
    
    var url = $scope.baseURL;
    url+='?';
    for (var key in $scope.filters) {
      if($scope.filters[key] !== '')
        url = url.concat(key, '=', $scope.filters[key], '&');
    }
    
    console.log('base URL with filters  -->', url);
    var url_1 = url+'type=CONDUCTED';
    var url_2 = url+'type=FAILED';
    var url_3 = url+'type=RESTRICTED';

    $http.get(url_1).then(function(response){       // promise service			
        $scope.conductedThroughputs = response.data;
        console.log('conductedThroughputs --> ',$scope.conductedThroughputs);
        $scope.loadedLists++;
    });

    $http.get(url_2).then(function(response){       // promise service      
        $scope.failedThroughputs = response.data;
        console.log('failedThroughputs --> ',$scope.failedThroughputs);
        $scope.loadedLists++;

      });

    $http.get(url_3).then(function(response){       // promise service      
        $scope.restrictedThroughputs = response.data;
        console.log('restrictedThroughputs --> ',$scope.restrictedThroughputs);
        $scope.loadedLists++;

      }); 
	};
  
  $scope.update_pie_items = function() {
    
    $scope.pie_items = function() {
        switch($scope.pie_type) {
          case('all'):
            return [
                      ['CONDUCTED', $scope.conductedThroughputs.length],
                      ['FAILED', $scope.failedThroughputs.length],
                      ['RESTRICTED', $scope.restrictedThroughputs.length]
                   ];
          case('conducted'):
            return [
                      ['OK', countSubTypetNum($scope.conductedThroughputs, 'OK')],
                      ['SENT', countSubTypetNum($scope.conductedThroughputs, 'SENT')],
                      ['OTHERS', countSubTypetNum($scope.conductedThroughputs, 'OTHERS')]
                   ];
          case('failed'):
            return [
                      ['TIMEOUT', countSubTypetNum($scope.failedThroughputs, 'TIMEOUT')],
                      ['OTHERS', countSubTypetNum($scope.failedThroughputs, 'OTHERS')],
                   ];
          case('restricted'):
            return [
                      ['DATALIMIT', countSubTypetNum($scope.restrictedThroughputs, 'DATALIMIT')],
                      ['OTHERS', countSubTypetNum($scope.restrictedThroughputs, 'OTHERS')],
                   ];
        }
      }();
}

  /*
   * When finish loading, update Pie Chart
   */
  $scope.$watch('loadedLists', function(newVal){

      if($scope.loadedLists==3) {
        $scope.throughputs = $scope.conductedThroughputs.concat($scope.failedThroughputs, $scope.restrictedThroughputs);
        $scope.update_pie_items();
      }
  }, true);

  $scope.$watch('pie_type', function(newVal){
    
    if($scope.loadedLists==3) {
       $scope.update_pie_items();
    };
  }, true);



	$scope.addPoints = function () {
        var seriesArray = $scope.highchartsNG.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.changeSeries = function () {
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
/*
    $scope.options = {
        type: 'line'
    }
*/
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
            data: [10, 15, 12, 8, 7]        // 
        }],
        title: {
            text: 'Daily Throuput tests'
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
      //console.log(attrs);
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
