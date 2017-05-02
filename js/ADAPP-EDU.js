$(document).ready(function(){
      
    var buttonFlag=true;
    var userID=null;
    $("#create-user-container").hide();
    $("#courses-container").hide();
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
            //alert(appeduAPI);
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
                          userExistFlag=true
                      }
                  }
                  if(!userExistFlag){
                      $("#main-message").html("El usuario no existe");
                  }else{
                      //$("#main-message").html("Bienvenido " + userID);
                      $("#login-create").hide();
                      putCourseList();
                  }
              },

            });
    }

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
                        htmlInsert+="<li style='background:#EEE'>"    
                     }else{
                        htmlInsert+="<li style='background:#DDD'>"    
                     }
                     htmlInsert+='<img id="icon" src="img/course_icon.png">';
                     htmlInsert+="<h2>"+data[i].name+"</h2>";
                     htmlInsert+="<h3>"+data[i].description+"</h3>";
                     htmlInsert+="</li>"    
                  }
                  htmlInsert+="</ul>";
                $(".course-list-container").html(htmlInsert);
              },

            });
        $("#courses-container").show();
    }
    
});