$(document).ready(function(){
    var debug=false;
    var course=null;  
    var buttonFlag=true;
    var userID=null;
    var saveCourseClicked=null;
    
    //$("#login-container").hide();
    $("#create-user-container").hide();
    $("#courses-container").hide();
    $("#question-container").hide();
    $("#result-container").hide();
    
    $(".nav-circle").click(function(){
        putCourseList();
    });
    
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
    
    $('#login-form').submit(function () {
        getUserProfilesAndCompare();
        return false;
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
    
    
    function setDebug(data,data2){
         if(data=="debug" && data2=="debug"){
            debug=true;
            $("#main-message").html("Debug");
        }
    }
    
    function printDebug(data){
        var msg="";
        if(debug){
            msg="<br>"+data;    
        }    
        return msg;
    }
    
    function getUserProfilesAndCompare(){         
        var appeduAPI="http://adappedu.lircaytech.com/api/v1/profile/login/{username}/{password}";
        var name=$("#login-name").val();
        var password=$("#login-password").val();
        appeduAPI=appeduAPI.replace("{username}",name);
        appeduAPI=appeduAPI.replace("{password}",password);
        setDebug(name,password);
        $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              success: function(data){
                      $("#login-container").hide();
                      $("#user-id").val(data.id);
                      putCourseList();
                      alert(data.id);
              },
              error:function(data){
                      $("#main-message").html("Fallo"+printDebug(appeduAPI));
                        
              }
      
            });
    }
   
    function putCourseList(){        
        $("#courses-container").show();
        $("#question-container").hide();
        $("#result-container").hide();
        var appeduAPI="http://adappedu.lircaytech.com/api/v1/courses/get";
        $(".content-container").html("");
        $.ajax({
          type: "GET",
          dataType: "json",
          url: appeduAPI,
          success: function(data){
              var htmlInsert=$('<ul></ul>');
              for(var i=0;i<data.length;i++){
                 var courseElement=$('<li  id="course" style="background:#CCC;" data-id='+data[i].id+'></li>').append($('<img class="icon" src="img/course_icon.png"><h2>'+data[i].name+'</h2><h3>'+data[i].description+'</h3>'));
                 $(htmlInsert).append($(courseElement));
                 
                 getUnitFromCourseId(data[i].id,courseElement);
                  
                 $(courseElement).click(function(evt){
                      $(this).children().children().slideToggle();
                  });
              }
              $(".content-container").append(htmlInsert);
          },
        });
    }
    
    
    function getUnitFromCourseId(courseID,htmlNode){
        
        
         var appeduAPI= "http://adappedu.lircaytech.com/api/v1/courses/{courseid}/get/units";
        appeduAPI=appeduAPI.replace("{courseid}",courseID);
        $.ajax({
          type: "GET",
          dataType: "json",
          url: appeduAPI,
          success: function(data){  
              var htmlInsert=$('<ul></ul>');
              for(var i=0;i<data.length;i++){
                var unitElement=$('<li  class="unit" style="background:#AAA;" data-id='+data[i].id+'></li>').html(data[i].name);
                  $(unitElement).hide();
                $(htmlInsert).append($(unitElement));
                getTopicsFromUnitId(data[i].id,unitElement);
              } 
              $(htmlNode).append(htmlInsert);
          },
        });
    }
    
    function getTopicsFromUnitId(unitID,htmlNode){
         var appeduAPI= "http://adappedu.lircaytech.com/api/v1/courses/unit/{unitid}/get/topics";
        appeduAPI=appeduAPI.replace("{unitid}",unitID);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){ 
                  var htmlInsert=$('<ul></ul>');
                  for(var i=0;i<data.length;i++){
                        var topicElement=$('<li  id="topic" style="background:#777;" data-id='+data[i].id+'></li>').html(data[i].name);
                        $(htmlInsert).append($(topicElement));
                        getQuestionnarieFromTopic(data[i].id,topicElement);
                  }
                  $(htmlNode).append(htmlInsert);
              },
            });
    }
    
    function getQuestionnarieFromTopic(topicID,htmlNode){
         var appeduAPI= "http://adappedu.lircaytech.com/api/v1/courses/unit/topic/{topicid}/questionnarie/get/all";
        appeduAPI=appeduAPI.replace("{topicid}",topicID);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  var htmlInsert=$('<ul></ul>');
                  for(var i=0;i<data.length;i++){
                      var questionnarieElement=$('<li   id="questionnarie" style="background:#444;" data-id='+data[i].id+' data-range='+data[i].ranges[0].id+' ></li>').html(data[i].name);
                      $(htmlInsert).append($(questionnarieElement));
                      $(questionnarieElement).click(function(){
                          postEnrollQuestionnarie(this);
                      });
                  }
                  $(htmlNode).append(htmlInsert);
                  $(".unit").hide();

              },
            });
    }
    
    function postEnrollQuestionnarie(questionnarieObj){
        $("#courses-container").hide();
        var appeduAPI= "http://adappedu.lircaytech.com/api/v1/questionnarie/enroll/{questionnarieid}/user/{userid}";
        appeduAPI=appeduAPI.replace("{userid}",$("#user-id").val());
        appeduAPI=appeduAPI.replace("{questionnarieid}",$(questionnarieObj).data("id"));
        $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  getQuestions(questionnarieObj);
              },
              error:function(data){
                  getQuestions(questionnarieObj);
              }
            ,
            });
    }
    
    function getQuestions(questionaireObj){
                $("#question-container").show();
                $("#result-container").hide();
                var appeduAPI= "http://adappedu.lircaytech.com/api/v1/get/exercise/{questionnaireid}/range/{rangeid}/user/{userid}";
        appeduAPI=appeduAPI.replace("{userid}",$("#user-id").val());
        appeduAPI=appeduAPI.replace("{questionnaireid}",$(questionaireObj).data("id"));
        appeduAPI=appeduAPI.replace("{rangeid}",$(questionaireObj).data("range"));
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  $("#question-description").html(data.description);
                  $("#answer-container-list").html("");
                  for(var optionsNum=0;optionsNum<data.options.length;optionsNum++){
                      var exerciseid=" data-exerciseid='"+data.id+"' ";
                      var optionid=" data-optionid='"+data.options[optionsNum].id+"' ";
                      var questionnaireid=" data-questionnaireid='"+$(questionaireObj).data("id")+"' ";
                      var userid=" data-userid='"+$("#user-id").val()+"' ";
                      var nk=" data-nk='0' ";
                      
                      var answerElement=$("<li"+exerciseid+optionid+questionnaireid+userid+nk+">"+data.options[optionsNum].option+"</li>");
                      $(answerElement).click(function(){
                          postAnswer(this,questionaireObj);
                      });
                      $("#answer-container-list").append(answerElement);
                      if(optionsNum==data.options.length){
                          $("#answer-container-list").append($("<li>NO SE</li>"));
                      }
                  }
                  
              },
              error:function(data){
                  alert("Error "+data.id);
              }
            ,
            });
    }
    
    function postAnswer(answerObj,questionaireObj){
        $("#result-container").show();
        $("#question-container").hide();
        $("#result-message p").html("...");   
        var appeduAPI= "http://adappedu.lircaytech.com/api/v1/answer/exercise/{exerciseid}/option/{optionid}/questionnaire/{questionnaireid}/user/{userid}/nk/{nk}";
        appeduAPI=appeduAPI.replace("{exerciseid}",$(answerObj).data("exerciseid"));
        appeduAPI=appeduAPI.replace("{optionid}",$(answerObj).data("optionid"));
        appeduAPI=appeduAPI.replace("{questionnaireid}",$(answerObj).data("questionnaireid"));
        appeduAPI=appeduAPI.replace("{userid}",$(answerObj).data("userid"));
        appeduAPI=appeduAPI.replace("{nk}",$(answerObj).data("nk"));
        $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  debug(JSON.stringify(data));
                  if(data.is_correct){
                    $("#result-message p").html("Respuesta Correcta!");    
                  }else{
                    $("#result-message p").html("Respuesta Errada");   
                  }
                  $("#next-question").unbind();
                  $("#next-question").click(function(){
                      getQuestions(questionaireObj);
                  });
              },
              error:function(data){
                  
              }
            ,
            });
    }
     
    function debug(data){
        console.log(data);
    }
    
    
});
   