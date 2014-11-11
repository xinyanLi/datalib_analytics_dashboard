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
        if (key=='from_date' || key=="to_date") {
          var date = $scope.filters[key].split('-');
          if(date.length == 3){
            var new_date = date[0]+'/'+date[1]+'/'+date[2];
            url = url.concat(key, '=', new Date(new_date).getTime(), '&');
          }
        } else {
        url = url.concat(key, '=', $scope.filters[key], '&');
      }
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
            return getSubTypePairArray($scope.conductedThroughputs);
                  
          case('failed'):
            return getSubTypePairArray($scope.failedThroughputs);
                   
          case('restricted'):
            return getSubTypePairArray($scope.restrictedThroughputs);
          default:
        }
      }();
  }


  $scope.swapChartType = function () {
        if (this.highchartsNG.options.chart.type === 'line') {
            this.highchartsNG.options.chart.type = 'bar'
        } else {
            this.highchartsNG.options.chart.type = 'line'
        }
  }

  /*
   * When finish loading, update Pie Chart
   */
  $scope.$watch('loadedLists', function(newVal){

      if($scope.loadedLists==3) {
        $scope.throughputs = $scope.conductedThroughputs.concat($scope.failedThroughputs, $scope.restrictedThroughputs);
        console.log('ALL THROUGHPUTS -->', $scope.throughputs);
        $scope.update_pie_items();
       // $scope.highchartsNG.series = [{data:getDailyArray($scope.conductedThroughputs), name: 'CONDUCTED'} , {data:getDailyArray($scope.failedThroughputs), name: 'FAILED'}, {data:getDailyArray($scope.restrictedThroughputs), name: 'RESTRICTED'}, {data:getDailyArray($scope.conductedThroughputs), name: 'TOTAL'}];
      }
  }, true);

  $scope.$watch('pie_type', function(newVal){
    
    if($scope.loadedLists==3) {
       $scope.update_pie_items();
    };
  }, true);

    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'line'
            }
        },
        title: {
            text: 'Daily Throuput tests',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            type: 'datetime',
            //tickInterval: 1,
            title: {
                text: 'November'
            },
            //categories: ['11-Nov', '12-Nov', '13-Nov', '14-Nov', '15-Nov', '16-Nov',
              //  '17-Nov']
        },
        yAxis: {
            title: {
                text: 'Number of Tests'
            },
            min: 0,
        },
        legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
        },
        
        series: [{
            name: 'CONDUCTED',
            data: [
                [Date.UTC(2014, 10, 4), 3],
                [Date.UTC(2014, 10, 5), 5],
                [Date.UTC(2014, 10, 6), 7],
                [Date.UTC(2014, 10, 7), 26],
                [Date.UTC(2014, 10, 8), 5],
                [Date.UTC(2014, 10, 9), 9],
                [Date.UTC(2014, 10, 10), 8],
                [Date.UTC(2014, 10, 11), 6],
                [Date.UTC(2014, 10, 12), 4],
                [Date.UTC(2014, 10, 13), 9],
                [Date.UTC(2014, 10, 14), 5],
                [Date.UTC(2014, 10, 15), 8]
            ]
            //[0,2,3,4,5,6,7],
            //pointStart: 1
        }, {
            name: 'FAILED',
            data: [
                [Date.UTC(2014, 10, 4), 3],
                [Date.UTC(2014, 10, 5), 5],
                [Date.UTC(2014, 10, 6), 7],
                [Date.UTC(2014, 10, 7), 26],
                [Date.UTC(2014, 10, 8), 5],
                [Date.UTC(2014, 10, 9), 9],
                [Date.UTC(2014, 10, 10), 8],
                [Date.UTC(2014, 10, 11), 6],
                [Date.UTC(2014, 10, 12), 4],
                [Date.UTC(2014, 10, 13), 9],
                [Date.UTC(2014, 10, 14), 5],
                [Date.UTC(2014, 10, 15), 8]
            ],
           // pointStart: 1
        }, {
            name: 'RESTRICTED',
            data: [
                [Date.UTC(2014, 10, 4), 4],
                [Date.UTC(2014, 10, 5), 6],
                [Date.UTC(2014, 10, 6), 1],
                [Date.UTC(2014, 10, 7), 0],
                [Date.UTC(2014, 10, 8), 3],
                [Date.UTC(2014, 10, 9), 6],
                [Date.UTC(2014, 10, 10), 2],
                [Date.UTC(2014, 10, 11), 9],
                [Date.UTC(2014, 10, 12), 9],
                [Date.UTC(2014, 10, 13), 3],
                [Date.UTC(2014, 10, 14), 9],
                [Date.UTC(2014, 10, 15), 1]
            ],
            //pointStart: 1
        }, {
            name: 'TOTAL',
            data: [
                [Date.UTC(2014, 10, 4), 9],
                [Date.UTC(2014, 10, 5), 1],
                [Date.UTC(2014, 10, 6), 0],
                [Date.UTC(2014, 10, 7), 6],
                [Date.UTC(2014, 10, 8), 2],
                [Date.UTC(2014, 10, 9), 3],
                [Date.UTC(2014, 10, 10), 5],
                [Date.UTC(2014, 10, 11), 1],
                [Date.UTC(2014, 10, 12), 9],
                [Date.UTC(2014, 10, 13), 0],
                [Date.UTC(2014, 10, 14), 0],
                [Date.UTC(2014, 10, 15), 5]
            ],
            //pointStart: 1
        }],
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
              connectorColor: '#00000',
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

var getSubTypePairArray = function(throughputsList) {
    var subTypeList = [];
    var numberList = [];
    var pairList =[];
    for (i=0; i<throughputsList.length; i++) {
        if (subTypeList.indexOf(throughputsList[i].sub_type) == -1) {  // a new sub type
            subTypeList.push(throughputsList[i].sub_type);
            numberList.push(1);
        } else {
          numberList[subTypeList.indexOf(throughputsList[i].sub_type)]++;
        }
      }
    for (j=0; j<subTypeList.length; j++) {
      if (subTypeList[j]=='') 
        subTypeList[j] = 'unspecified';
      pairList[j] = [subTypeList[j], numberList[j]];
    }
    console.log('subtype - numebr list', pairList);
    return pairList;
}

var getDailyArray = function(throughputsList) {

}
