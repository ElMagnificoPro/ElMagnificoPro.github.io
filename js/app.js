var app = angular.module('myApp', ['ngAnimate']);

app.controller('mainController', ['$scope', '$timeout', '$http', '$q',
  function ($scope, $timeout, $http, $q) {
    $scope.isLoading = true;
    $scope.isSuccessful = false;
    $scope.hover = false;
    $scope.mouseInView = true;
    $scope.logoClass = '';

    var initialDate = new Date().getTime();

    var images = [
      "img/Bridged.png",
      "img/console.png",
      "img/Icons.png",
      "img/laMaison.png",
      "img/logoIntro.png",
      "img/Logos.png",
      "img/Masks.png",
      "img/Pixeld.png",
      "img/Squared.png"
    ];


    var promises = [];
    images.forEach(function (img) {
      promises.push($http.get(img));
    });

    $q.all(promises)
      .then(
        function (results) {
          $scope.isSuccessful = true;

          $timeout(function () {
            $scope.isLoading = false;
            $scope.finishedLoading();
          }, 1000);

          // $scope.isLoading = false;
          // $timeout(function () {
          //   $scope.showMenu = true;
          //   $scope.showMenuCallback();
          // }, 1000);

          results.forEach(function (data, status, headers, config) {
            //console.log(data, status, headers, config);
          });
        });

    $scope.finishedLoading = function () {
      $timeout(function () {
        $scope.showLogo = true;
        console.log("showLogo");
      }, 1000);

      $timeout(function () {
       // $scope.showLogo = false;
       $scope.logoClass = "titleIcon";

        console.log("showMsg1");
        $timeout(function () {
          $scope.showMsg1 = true;
        }, 500);

      }, 3000);
      $timeout(function () {
        $scope.showMsg1 = false;
        $timeout(function () {
          $scope.showMsg2 = true;
        }, 500);

        console.log("showMsg2");
      }, 5000);
      $timeout(function () {
        $scope.showMsg2 = false;
        $timeout(function () {
          $scope.showMsg3 = true;
        }, 500);
        console.log("showMsg3");
      }, 7000);
      $timeout(function () {
        $scope.showMsg3 = false;
        $timeout(function () {
          $scope.showMenu = true;
          $scope.showMenuCallback();
        }, 500);
        console.log("showMenu");
      }, 9000);
    };

    $scope.showMenuCallback = function () {
      $timeout(function () {
        $scope.showMenu1 = true;
        console.log("showMenu");
      }, 200);
      $timeout(function () {
        $scope.showMenu2 = true;
        console.log("showMenu");
      }, 300);
      $timeout(function () {
        $scope.showMenu3 = true;
        console.log("showMenu");
      }, 400);
    };


    $scope.expandedPartial = 0;
    $scope.expanded = false;
    $scope.showPartialContent = false;
    $scope.selectedPartial = [false,false,false];
    $scope.partialClass = ['col-1-3','col-1-3','col-1-3'];
    $scope.selectedTab = 0;

    $scope.expandPartial = function (partial) {
      if(!$scope.expanded){
        $scope.hover = false;
        $scope.selectedPartial[partial] =  !$scope.selectedPartial[partial] ;
        $scope.expanded = !$scope.expanded;
        $timeout(()=>{
          for (let i = 0; i < $scope.partialClass.length; i++) {
           $scope.partialClass[i]+= ($scope.expanded) ? ' hidden':'';
          }          
          $scope.partialClass[partial] = 'col-1-1';
        },600);
        $timeout(()=>{
          $scope.showPartialContent = true;
        },1200);
      }

    }; 

    $scope.reducePartial = function(partial){
      $scope.showPartialContent = false;
      $scope.partialClass = ['col-1-3','col-1-3','col-1-3'];
      $timeout(()=>{
        $scope.selectedPartial[partial] =  !$scope.selectedPartial[partial] ;
        $scope.expanded = !$scope.expanded;
      },600);
      $scope.selectedTab = 0;
    };

    $scope.selectTab = function(tab){
      $scope.selectedTab = tab;
      
    };
    ////////////////////////////////
    // XXX: mouse trail
    ////////////////////////////////
    
    var lineCanvas = document.getElementById("myCanvas");
    var cursorObj = document.getElementById("cursor");
    var lineCanvasContext = lineCanvas.getContext('2d');
    var pointLifetime = 70;
    var points = [];
    start();

    /**
     * Attaches event listeners and starts the effect.
     */
    function start() {
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      tick();
    }

    /**
     * Records the user's cursor position.
     *
     * @param {!MouseEvent} event
     */

    function onMouseMove(event) {
      cursorObj.style.left = event.clientX -10 +'px';
      cursorObj.style.top = event.clientY -10 +'px';
      points.push({
        time: Date.now(),
        x: event.clientX,
        y: event.clientY
      });
    }

    /**
     * Resize canvas to fill the window.
     */
    function resizeCanvas() {
      lineCanvas.width = window.innerWidth;
      lineCanvas.height = window.innerHeight;
    }

    /**
     * The main loop, called at ~60hz.
     */

    function tick() {
      // Remove old points
      points = points.filter(function (point) {
        var age = Date.now() - point.time;
        return age < pointLifetime;
      });
      //console.log(points.length);
      drawLineCanvas();
      requestAnimationFrame(tick);
    }

    /**
     * Draws a line using the recorded cursor positions.
     *
     * This line is used to mask the original image.
     */
    function drawLineCanvas() {

      var maximumSpeed = 50;
    
      lineCanvasContext.globalAlpha=0.5;
      lineCanvasContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
      lineCanvasContext.lineCap = 'round';
      lineCanvasContext.shadowBlur = 10;
      lineCanvasContext.shadowColor = 'rgb(224, 224, 224)';

      for (var i = 1; i < points.length; i++) {
        var point = points[i];
        var previousPoint = points[i - 1];

        lineCanvasContext.lineWidth = 20;

        // Fade points as they age
        var age = Date.now() - point.time;
        var opacity = (pointLifetime - age) / pointLifetime * 0.7;
        lineCanvasContext.strokeStyle = 'rgba(255, 255, 255, ' + opacity + ')';

    
    lineCanvasContext.beginPath();
    lineCanvasContext.moveTo(previousPoint.x, previousPoint.y);
    lineCanvasContext.lineTo(point.x, point.y);
    lineCanvasContext.stroke();
  }
}
/**
 * @param {{x: number, y: number}} a
 * @param {{x: number, y: number}} b
 * @return {number} The distance between points a and b
 */
function getDistanceBetween(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

  }
]);