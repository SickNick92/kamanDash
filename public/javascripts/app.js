var app = angular.module('IoTApp', ['chart.js']);
app.factory('WatsonIoT',function(){
  return IBMIoTF.IotfApplication;
})

app.controller('lineChart', function($rootScope, $scope) {

    $scope.labels = $rootScope.labels;
    $rootScope.series = ['Sine'];
    $scope.data = $rootScope.data;

    $rootScope.onClick = function (points, evt) {
	console.log(points, evt);
    };
    $rootScope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $rootScope.options = {
	scales: {
	    yAxes: [
		{
		    id: 'y-axis-1',
		    type: 'linear',
		    display: true,
		    position: 'left'
		}
	    ]
	},
	legend: { display: true }
    };
});

app.controller('main',['$rootScope','$scope','WatsonIoT',function($rootScope,$scope,WIoT){
    
    $scope.main ={}
    $scope.main.APIKey =""
    $scope.main.AuthToken =""
    $scope.main.OrgId =""
    $scope.main.EventLog =""
    $rootScope.labels = [];
    $rootScope.data = [];
    $rootScope.dataArray =[];
    
    var appClient  = null;

    $scope.main.connect = function(){
	$scope.main.EventLog =""
	appClient  = new WIoT( {
	    "org" : $scope.main.OrgId,
	    "id" :Date.now()+"",
	    "domain": "internetofthings.ibmcloud.com",
	    "auth-key" : $scope.main.APIKey,
	    "auth-token" : $scope.main.AuthToken
	})
	appClient.connect();
	appClient.on("connect", function () {
            appClient.subscribeToDeviceEvents();
	    console.log("Connected");
	});
	window.onbeforeunload = function () {
	    appClient.disconnect();
	    // handle the exit event
	};

	appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
	    $rootScope.labels.push(Date.now());
	    var obj = JSON.parse(payload);
	    var data = obj['d'];
	    var val = data['sine'];
	    $rootScope.dataArray.push(parseInt(val));
	    console.log("Label: "+ Date.now()+ " Value: " + val  + ' Array: ' + $rootScope.dataArray);
	    $rootScope.data[0] = $rootScope.dataArray;
	    console.log("Data: " + $rootScope.data[0] + " Label: " + $rootScope.labels);
	    
//	    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
//	    $scope.options = {
//		scales: {
//		    yAxes: [
//			{
//			    id: 'y-axis-1',
//			    type: 'linear',
//			    display: true,
//			    position: 'left'
//			}
//		    ]
//		},
//		legend: { display: true }
//	    };

	    
	    $scope.main.EventLog =("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload)+'\n' +$scope.main.EventLog ;
	    $scope.$digest();
	    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
	});
    }
}]);
