$(document).ready(function(){
    var course=null;  
    var buttonFlag=true;
    var userID=null;
    var saveCourseClicked;
    $("#create-user-container").hide();
    //$("#courses-container").hide();
    $("#home-selector-btn").click(function(){
        $("#create-user-container").toggle();
        $("#login-user-container").toggle();
        
       
        if(buttonFlag){
        $("#home-selector-btn").html("<br>Login");
            buttonFlag=false;
        }else{
              $("#home-selector-btn").html("Crear<br>usuario");
            buttonFlag=true;
        }
    });
    
      $("#create-user").click(function(){
            var appeduAPI="http://adappedu.lircaytech.com/api/v1/profile/create/{username}/{email}/{password}";
            var name=$("#create-user-name").val();
            var email=$("#create-user-email").val();
            var password=$("#create-user-password").val();
            appeduAPI=appeduAPI.replace("{username}",name)
            appeduAPI=appeduAPI.replace("{email}",email)
            appeduAPI=appeduAPI.replace("{password}",password)
             $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              success: function(data){
                  
                  if(data.type=="success"){
                    $("#create-user-container").toggle();
                    $("#login-user-container").toggle();
                    $("#main-message").html("Usuario Creado Exitosamente");
                  }else{
                      alert(data.type);
                    $("#main-message").html("Error, el nombre o mail existe");
                  }
                
              },

            });
        });
    
    $("#login-btn").click(function(){
        var userName=$("#login-name").val();
        var password=$("#login-password").val();
        getUserProfilesAndCompare(userName);
    });
    
    function getUserProfilesAndCompare(userName){
        var appeduAPI="http://adappedu.lircaytech.com/api/v1/profile/get/all";
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){
                  var userExistFlag=false;
                  for(var i=0;i<data.length;i++){
                      var userState=data[i];
                      if(userName==userState.username){
                          userID=userState.id;
                          userExistFlag=true;
                      }
                  }
                  if(!userExistFlag){
                      $("#main-message").html("El usuario no existe");
                  }else{
                      $("#login-create").hide();
                      putCourseList();
                  }
              },

            });
    }
   
    putCourseList();
    function putCourseList(){        
        var appeduAPI="http://adappedu.lircaytech.com/api/v1/courses/get";
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){
                  var htmlInsert="<ul>";
                  for(var i=0;i<data.length;i++){
                     if(i%2!=0){
                        htmlInsert+="<li style='background:#EEE'"    
                     }else{
                        htmlInsert+="<li style='background:#CCC'"    
                     }
                     htmlInsert+="class='course' id='course-li-"+data[i].id+"' data-courseid='"+data[i].id+"'>"    
                     htmlInsert+='<img class="icon" src="img/course_icon.png">';
                     htmlInsert+="<h2>"+data[i].name+"</h2>";
                     htmlInsert+="<h3>"+data[i].description+"</h3></li>";
                  }
                htmlInsert+="</ul>";  
                $(".course-list-container").html(htmlInsert);
                       $(".course").click(function(){
                           saveCourseClicked=this; getUnitFromCourseId($(this).data('courseid'),this);
                       });
              },
            });
        $("#courses-container").show();
       
    }
    

    
    function getUnitFromCourseId(courseID,courseObj){
         $("#specific-unit-list").remove();
         var appeduAPI= "http://adappedu.lircaytech.com/api/v1/courses/{courseid}/get/units";
        appeduAPI=appeduAPI.replace("{courseid}",courseID);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  var htmlInsert="<ul id='specific-unit-list'>";
                  for(var i=0;i<data.length;i++){
                    htmlInsert+="<li>"+data[i].name+"</li>"
                    getTopicsFromUnitId(data[i].id,this);
                  }
                   htmlInsert+="</ul>";
                  $(courseObj).append(htmlInsert);
                  $("#specific-unit-list").hide();
                  $("#specific-unit-list").slideDown();
                  
              },
            });
    }
    
        function getTopicsFromUnitId(unitID,courseObj){
         $("#specific-unit-list").remove();
         var appeduAPI= "http://adappedu.lircaytech.com/api/v1/courses/unit/{unitid}/get/topics";
        appeduAPI=appeduAPI.replace("{unitid}",unitID);
            alert(appeduAPI);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  alert("Hola");
                  var htmlInsert="<ul id='specific-topic-list'>";
                  for(var i=0;i<data.length;i++){
                    htmlInsert+="<li>"+data[i].name+"</li>"
                  }
                   htmlInsert+="</ul>";
                  $(courseObj).append(htmlInsert);

              },
            error:function(data){
                alert("data.message");
            }
            ,
            });
    }
    
});