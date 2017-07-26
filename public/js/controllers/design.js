'use strict'
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Code By: Harsh Jain 23-07-2017///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


freshApp.controller('DesignController',
  ['$scope','$http', function($scope,$http) {
 
       $scope.tColor = "#ffff00"; //T-shirt Color 
       $scope.designName = ""; // Design Name to be entered by User
      $scope.selectedName = {}; // Contains the design Object
      
// Do some initializing stuff
        fabric.Object.prototype.set({
            transparentCorners: false,
            cornerColor: 'rgba(102,153,255,0.5)',
            cornerSize: 12,
            padding: 5
        });

// initialize fabric canvas and assign to global windows object for debug
      
        let canvas =  window._canvas = new fabric.Canvas('freshCanvas');
      
        let state = [];
        let mods = 0;

        canvas.on(
            'object:modified', function () {
            updateModifications(true);
        },
            'object:added', function () {
            updateModifications(true);
        });
      
       
//Function to change Color of the T-shirt Image      
      $scope.changeTColor = function(){
           $("#design").css("background-color", $scope.tColor);
      }
      
//Method to clear current selected object
      $scope.deleteObject = function(){
           canvas.getActiveObject().remove();
      }

//Function to add Rectangle Shape    
      
      $scope.addRect = function(){
            let rectColor = document.getElementById('rectColor').value;
            let rect = new fabric.Rect({
                  left: 100,
                  top: 100,
                  width: 100,
                  height: 50,
                  fill: rectColor
                });
                canvas.add(rect);
           updateModifications(true);
      }
     
//Function to add Circle Shape    
      
      $scope.addCircle = function(){
            let circleColor = document.getElementById('circleColor').value;
            let circle = new fabric.Circle({
                  left: 100,
                  top: 100,
                  radius: 50,
                  fill: circleColor
                });
                canvas.add(circle);
           updateModifications(true);
         }
//Function to add Triangle Shape    
      
      $scope.addTriangle = function(){
            let triangleColor = document.getElementById('triangleColor').value;
            let triangle = new fabric.Triangle({
                  left: 100,
                  top: 100,
                  width: 70,
                  height: 70,
                  fill: triangleColor
                });
                canvas.add(triangle); 
           updateModifications(true);
        }
      
//Function to add Ellipse Shape    
      
      $scope.addEllipse = function(){
            let ellipseColor = document.getElementById('ellipseColor').value;
            let ellipse = new fabric.Ellipse({
                  rx: 45,
                  ry: 80,
                  fill: ellipseColor,
                  strokeWidth: 3,
                  angle: 30,
                  left: 100,
                  top: 100
                });
                canvas.add(ellipse); 
           updateModifications(true);
        }
      
//Function to add Image on Canvas
      document.getElementById('imgLoader').onchange = function handleImage(e) {
              let reader = new FileReader();
            reader.onload = function (event) { console.log('uploaded');
                let imgObj = new Image();
                imgObj.src = event.target.result;
                 imgObj.onload = function () {
                    // start fabricJS stuff

                    let image = new fabric.Image(imgObj);
                    image.set({
                        left: 50,
                        top: 50,
                        angle: 20,
                        padding: 10,
                        cornersize: 10,
                        height:20,
                        width:40
                    });
                    
                    canvas.add(image);
                  
                 
                    // end fabricJS stuff
                }

            }
            reader.readAsDataURL(e.target.files[0]);
             updateModifications(true);
        }
  
//Function to add Text on Canvas  
        $scope.addText = function(){
              let content = document.getElementById('customText').value;   
              let customText = new fabric.Text(content, {
                  fontFamily: 'Comic Sans',
                  fontSize: 20,
                  left: 50,
                  top: 50
                  
                });
            canvas.add(customText);
            updateModifications(true);
        }      
     
/// Canvas History Method
        
        function updateModifications(savehistory) {
            if (savehistory === true) {
                let currentHistory = JSON.stringify(canvas.toJSON());
                state.push(currentHistory);
            }
        }
//Undo Method
        $scope.undo = function (){
            if (mods < state.length) {
                canvas.clear().renderAll();
                canvas.loadFromJSON(state[state.length - 1 - mods - 1]);
                canvas.renderAll();
                mods += 1;
              }
        }
//Redo Method
        $scope.redo = function() {
            if (mods > 0) {
                canvas.clear().renderAll();
                canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
                canvas.renderAll();
                mods -= 1;                
            }
        }


//Reset the Canvas        
      $scope.clearDesign = function(){
           canvas.clear();
      }
      
//Saving Canvas data: POST Call      
      $scope.insertData = function(){
          if($scope.designName !== ""){
              $scope.saveCanvas =  JSON.stringify(canvas.toJSON());
              console.log(canvas.toJSON());
               let data = {title:$scope.designName, body: $scope.saveCanvas};      
            $http.post("http://localhost:8080/addpost1", data).success(function(data, status) {
                $scope.fetchData();
            }, function myError(response) {
                    console.log(response);
                 });
          }else{
              alert("Please enter the Design Name");
          }
          
      };//POST CALL
      
      
//Fetching all Canvas data: GET Call      
        $scope.fetchData = function(){$http.get("http://localhost:8080/getposts").success(function(response) {
            $scope.status = "Fetched";
            $scope.designArray = [];
             angular.forEach(response, function(value, key){             
                 $scope.designArray.push({title: value.title, id:value.id});
                 $scope.selectedName = ($scope.designArray[0]);                  
                   });
        }, function myError(response) {
                console.log(response);
             });
        };// GET CALL  
           
//Fetching unique Canvas data: GET Call       
      $scope.getDesign = function(){
          console.log($scope.selectedName);
         if(Object.keys($scope.selectedName).length >0  ){
            $http.get("http://localhost:8080/getpost/"+$scope.selectedName.title).success(function(response) {
                canvas.clear();
                canvas.loadFromJSON(response[0].body, canvas.renderAll.bind(canvas));
            }  , function myError(response) {
               
                }); 
            }else{
               alert("Please select a Design.");                                                                           
            }
          
        };// GET CALL  
                  
}]); // Controller
