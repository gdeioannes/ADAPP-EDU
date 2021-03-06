
$(document).ready(function(){
    //Put the URL with were the backend service in runing
    var URL="https://adappedu.lircaytech.com";
    
    var course=null;  
    var buttonFlag=true;
    var userID=null;
    var saveCourseClicked=null;
    var debug=false;
    var loadingTime = 3;
    var addapEdu={
        APPname:"ADAPP-EDU",
        userId:null,
        userName:null,
        version:"1.02"
    };
    var savedUserID=null;
    var questionaryArray=[];
    var noseMax=5;
    var noseCount=0;
    var actualDiff=1;
    //CONT BUENAS RANG BUENAS CONT MALAS RANG MALAS
    var rangosDiff=[[4,10,3,6],[3,5,2,5],[5,8,2,3]];
    var result="KEEP";
    var isUsingDesktop;
    
    
    
    
    
    if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
    {
        isUsingDesktop = true;
        resizeContainer();
    }

    else
    {

        //ESTILOS CELULAR
        /*
        $("element").css('padding-top', 'calc(100vh/38)');
        $("element").css('padding-bottom', 'calc(100vh/38)');
        $("element").css('font-size', '3vh');
        $("element").css('margin-top', 'calc(100vh/120)');
        $("element").css('margin-bottom', 'calc(100vh/120)');
        $(".answer").css('padding','1%');
        */

        isUsingDesktop = false;
        //$(".container").height(window.innerHeight);		
        //$(".loader").show();
        resizeContainer();
    }
   
   
    
    checkWebStorage();
    
    $("#back-course-menu-btn").click(function(){
        repetir = false;
        particles = [];
        $("#canvas").hide();
        putCourseList();
    });
    $("#back-course-menu-btn2").click(function(){
        repetir = false;
        particles = [];
        $("#canvas").hide();
        putCourseList();
    });
    $("#back-course-menu-btn3").click(function(){
        repetir = false;
        particles = [];
        $("#canvas").hide();
        putCourseList();
    });
    
    $("#home-selector-btn").click(function()
    {
        $("#create-user-container").toggle();
        $("#login-user-container").toggle();
        
       
        if(buttonFlag)
        {
            $("#home-selector-btn").html("<br>Login");
            buttonFlag=false;
        }
        
        else
        {
          $("#home-selector-btn").html("Crear<br>usuario");
            buttonFlag=true;
        }
    });
    
    $('#login-form').submit(function () {
        logUser();
        return false;
    });
    
      $("#create-user").click(function(){
            var appeduAPI=URL+"/api/v1/profile/create/{username}/{email}/{password}/{name}/{lastname}/{gender}/{birthdate}";
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
                  printDebug(data);
                  if(data.type=="success"){
                    $("#create-user-container").toggle();
                    $("#login-user-container").toggle();
                    $("#main-message").html("Usuario Creado Exitosamente");
                    $("#home-selector-btn").html("Crear<br>usuario");
                    buttonFlag=true;
                  }else{
                      
                    $("#main-message").html("Error, el nombre o mail existe");
                    
                  }
                
              },

            });
        });
    
    function logUser(){         
        var appeduAPI=URL+"/api/v1/profile/login/{username}/{password}";
        var name=$("#login-name").val();
        var password=$("#login-password").val();
        appeduAPI=appeduAPI.replace("{username}",name);
        appeduAPI=appeduAPI.replace("{password}",password);
        $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              success: function(data){
                    printDebug(data);
                   if(data.type=="success"){
                      addapEdu.userName=$("#login-name").val();
                      addapEdu.userId=data.id;
                      saveData();
                      appLogUser(data.id,$("#login-name").val());
                   }else{
                      $("#main-message").html(data.message); 
                   }
            },
            });
    }
   
    function putCourseList(){      
        if(!isUsingDesktop)
        {
            $(".container").height(window.innerHeight);
        }  
        
        $("#courses-container").show();
        $("#question-container").hide();
        $("#result-container").hide();
        $("#loader-container").hide();
        $("#particles-container").hide();
        var appeduAPI=URL+"/api/v1/courses/get";
        $(".content-container").html("");
        $.ajax({
          type: "GET",
          dataType: "json",
          url: appeduAPI,
          success: function(data){
              printDebug(data);
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
         var appeduAPI= URL+"/api/v1/courses/{courseid}/get/units";
        appeduAPI=appeduAPI.replace("{courseid}",courseID);
        $.ajax({
          type: "GET",
          dataType: "json",
          url: appeduAPI,
          success: function(data){
              printDebug(data);
              var htmlInsert=$('<ul></ul>');
              for(var i=0;i<data.length;i++){
                var unitElement=$('<li  class="unit" style="background:#AAA;" data-id='+data[i].id+'></li>').html("<h5>"+data[i].name+"</h5>");
                  $(unitElement).hide();
                $(htmlInsert).append($(unitElement));
                getTopicsFromUnitId(data[i].id,unitElement);
              } 
              $(htmlNode).append(htmlInsert);
          },
        });
    }
    
    function getTopicsFromUnitId(unitID,htmlNode){
         var appeduAPI= URL+"/api/v1/courses/unit/{unitid}/get/topics";
        appeduAPI=appeduAPI.replace("{unitid}",unitID);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){ 
                  printDebug(data);
                  var htmlInsert=$('<ul></ul>');
                  for(var i=0;i<data.length;i++){
                        var topicElement=$('<li  id="topic" style="background:#777;" data-id='+data[i].id+'></li>').html("<h5>"+data[i].name+"</h5>");
                        $(htmlInsert).append($(topicElement));
                        getQuestionnarieFromTopic(data[i].id,topicElement);
                  }
                  $(htmlNode).append(htmlInsert);
              },
            });
    }
    
    function getQuestionnarieFromTopic(topicID,htmlNode){
         var appeduAPI= URL+"/api/v1/courses/unit/topic/{topicid}/questionnarie/get/all";
        appeduAPI=appeduAPI.replace("{topicid}",topicID);
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data){  
                  printDebug("datos de funcion getQuestionnarieFromTopic");
                  var htmlInsert=$('<ul></ul>');
                  for(var i=0;i<data.length;i++){
                      if(data[i].ranges[0] !==undefined && data[i].is_active){
                          printDebug("QUESTIONARIO");
                          printDebug(data[i]);
                          var questionnarieElement=$('<li   id="questionnarie" style="background:#444;" data-id='+data[i].id+' data-range='+[data[i].ranges[0].id,data[i].ranges[1].id,data[i].ranges[2].id]+' ></li>').html("<h5>"+data[i].name+"</h5>");
                          $(htmlInsert).append($(questionnarieElement));
                          $(questionnarieElement).click(function(){
                              postEnrollQuestionnarie(this);
                          });
                      }
                  }
                  $(htmlNode).append(htmlInsert);
                  $(".unit").hide();

              },
            });
    }
    
    function postEnrollQuestionnarie(questionnarieObj){
        $("#courses-container").hide();
        var appeduAPI= URL+"/api/v1/questionnarie/enroll/{questionnarieid}/user/{userid}";
        appeduAPI=appeduAPI.replace("{userid}",$("#user-id").val());
        appeduAPI=appeduAPI.replace("{questionnarieid}",$(questionnarieObj).data("id"));
        $.ajax({
              type: "POST",
              dataType: "json",
              url: appeduAPI,
              	              success: function(data){ 
				  //esta es la funcion que pone las preguntas y respuestas
				  printDebug("datos de funcion postEnrollQuestionnarie"); 
                  printDebug(data);
                  getQuestions(questionnarieObj);
              },
              error:function(data){
                  getQuestions(questionnarieObj);
              }
            ,
            });
    }

    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }
    
    
    function getQuestions(questionaireObj){
                $("#loader-container").show();  
                var appeduAPI= URL+"/api/v1/get/exercise/{questionnaireid}/range/{rangeid}}/user/{userid}";
        appeduAPI=appeduAPI.replace("{userid}",$("#user-id").val());
        appeduAPI=appeduAPI.replace("{questionnaireid}",$(questionaireObj).data("id"));
        
         var rangesIDArray=$(questionaireObj).data("range").split(",");
        printDebug("ACTUAL DIFF:"+actualDiff);
        printDebug("RANGE ARRAY:"+rangesIDArray);
        printDebug("ID RANGE:"+rangesIDArray[actualDiff-1]);
        
        appeduAPI=appeduAPI.replace("{rangeid}",rangesIDArray[actualDiff-1]);
       
        $.ajax({
              type: "GET",
              dataType: "json",
              url: appeduAPI,
              success: function(data)
              {
                  wait(2000);
                  
                  $("#loader-container").hide(); 
                  $("#question-container").show();
                  
                  printDebug(data);
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
                      if(optionsNum==data.options.length-1 && noseCount!=noseMax){
                          var noseButton=$("<li>"+(noseMax-noseCount)+" NO SE</li>").click(function(){
                          respuestaNose(questionaireObj);
                            });
                          $("#answer-container-list").append(noseButton);
                      }
                  }
                  
              },
              error:function(data){
                  
              }
            ,
            });
    }
    
    //NO SE RESPONSE
    
    function respuestaNose(questionaireObj){
        noseCount++;
        $("#result-container").show();
        $("#question-container").hide();
        $("#result-message p").html("Te quedan "+(noseMax-noseCount)+"<br>NO SE");  
        $("#next-question").unbind();
                  $("#next-question").click(function(){
                      printDebug("NEXT QUESTION");
                      $("#result-container").hide();
                      getQuestions(questionaireObj);
        });
        trackDiff(2);
    }
    
    function postAnswer(answerObj,questionaireObj){
        $("#result-container").show();
        $("#question-container").hide();
        $("#result-message p").html("...");   
        var appeduAPI= URL+"/api/v1/answer/exercise/{exerciseid}/option/{optionid}/questionnaire/{questionnaireid}/user/{userid}/nk/{nk}";
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
                  //container = document.getElementById("main-Container");
                  //$("#main-Container").css("background","transparent");
                  printDebug(data);
                  if(data.is_correct)
                  {
                    
                    $("#result-message #head").attr('src', 'img/cabezaedu.png');
                    // $("#canvasTrofeos").show();
                    // mostrarTrofeos();
                    $("#canvas").show();
                    mostrarParticulas(60,3,true);
                    $("#result-message p").html("Respuesta Correcta! <br> :)");
                    trackDiff(1);
                  }else{
                    
                    $("#result-message #head").attr('src', 'img/cabeza_edu_triste.png');
                    
                    $("#result-message p").html("Respuesta Errada <br> :(");  
                    trackDiff(0);
                    
                  }
                  $("#next-question").unbind();
                  
                   if(result=="KEEP"){
                      $("#next-question").html("SIGUIENTE");
                      $("#next-question").click(function()
                      {
                          
                          repetir = false;
                          particles = [];
                          $("#canvas").hide();
                          $("#result-container").hide();
						  //getLoader(questionaireObj);
                          getQuestions(questionaireObj);
                      });
                   }
                   
                   else if(result=="WIN"){
                       
                        
                        $("#canvas").show();
                        mostrarParticulas(500,5,false);
                        $("#result-message #head").attr('src', 'img/cabezaedu.png'); 
                        $("#result-message p").html("Se acabó <br>¡Buen trabajo!");
                        $("#next-question").html("MENU");
                        $("#next-question").click(function()
                        { 
                            repetir = false;
                            particles = [];
                            $("#canvas").hide();
                            putCourseList();
                            resetValues();
                      });
                   }else if(result=="LOSE"){
                       
                       $("#result-message #head").attr('src', 'img/cabeza_edu_triste.png');
                       $("#result-message p").html("Estudia <br>e intenta de nuevo más tarde");  
                       $("#next-question").html("MENU");
                       $("#next-question").click(function()
                       { 
                           $("#canvas").hide();
                           putCourseList();
                           resetValues();
                      });
                   }     
              },
              error:function(data){
                  
              }
            ,
            });
    }
    
    function setNextButton (){
        
    }
    
    function trackDiff(data){
        
        printDebug("QUESTION ARRAY:"+questionaryArray);
        questionaryArray.unshift([data,actualDiff]);
        difficultieLogic();
        saveSessionData();
    }

    
    function difficultieLogic(){
        var countRight=0;
        var countWrong=0;
        
        //Cantidad de Dificultades
        var numDificuties=rangosDiff.length;

        if((actualDiff-1)>numDificuties){
           actualDiff=rangosDiff.length;
           result="KEEP";
        }
        
        for(var i=0;i<questionaryArray.length;i++){
            if(i>rangosDiff[actualDiff-1][1]){
                break
            }
            if(questionaryArray[i][1]==actualDiff){
                if(questionaryArray[i][0]==1){
                    countRight++;
                }
            }
        }
        
        for(var i=0;i<questionaryArray.length;i++){
            if(i>rangosDiff[actualDiff-1][3]){
                break
            }
            if(questionaryArray[i][1]==actualDiff){
                if(questionaryArray[i][0]==0){
                    countWrong++;
                }
            }
        }
        
        //COUNT RIGTH ANSWERS
        if(countRight>=rangosDiff[actualDiff-1][0]){
            if(actualDiff+1!=rangosDiff.length+1){
            controlDiff(1);
            }else{
                result="WIN"
            }
        }
        
        //COUNT WRONG ANWERS
            if(countWrong>=rangosDiff[actualDiff-1][2]){
                if(actualDiff-1!=0){
                    controlDiff(-1);
                }else{
                    result="LOSE"
                }
            }
        
        
    }
    
    function controlDiff(data){
        actualDiff=parseInt(actualDiff)+parseInt(data);
        //In change of difficultie delete history
        questionaryArray=[];
    }
    
    $("#back-home-btn").click(function(){
       var myConfirm = confirm("¿ Quieres Salir de ADAAP-EDU :( ?");
        if(myConfirm){
            
           
            showHome();
        }else{
            
        }
    }); 
    
    //resizeContainer(); 
    $(window).resize(function(){
        resizeContainer();
    });
    
    function resizeContainer()
    {
        widthWindow = $( window ).innerWidth();
        heightWindow = $( window ).innerHeight();	
        var relacionDeAspecto=widthWindow/heightWindow;
        $(".container").height(window.innerHeight);	
               
        //Sistema de particulas 
        mainContainer = $("#main-Container");
        canvas=document.getElementById("canvas");
        width=mainContainer.width();
        height=mainContainer.height();
        canvas.width = width;
        canvas.height = height;
        

        if(isUsingDesktop)
        {
            checkBrowserDimensions(widthWindow, heightWindow, 2.08 );
            
            //adaptAnswerContainer(widthWindow,heightWindow,relacionDeAspecto);
        }  
        
        else
        {
            //adaptAnswerContainer(widthWindow,heightWindow,relacionDeAspecto);
            checkBrowserDimensions(widthWindow, heightWindow, 16/9);   
            
            cssPhoneApply();
            if($("#login-container").is(':visible') )
            {
                $(".container").width('100%');
                $('.nuevos-usuarios-midle button').css('font-size','2.5vw');
                $('.nuevos-usuarios-midle button').css('margin-top','6%');
                $('input').css('font-size','2.5vw');
                $('button').css('font-size','2.5vw');
                $(".container").height(screen.height);	
            }  
        }
    }	

    function cssPhoneApply()
    {

        var stopMessage = $("#stop-message");
        var stopMessageP = $("#stop-message p");
        var stopMessagePSpan = $("#stop-message p span");
        stopMessage.css("margin-right", "12vw");
        stopMessage.css("margin-left", "12vw");
        stopMessageP.css("font-size","2.5vw");
        stopMessagePSpan.css("font-size","1.8vw");
      
        stopMessagePSpan.html("Cambia la orientación del celular a vertical");
    }
    
    function checkBrowserDimensions( widthWindow, heightWindow, limiteRelacionAspecto)
    {
        
        if(widthWindow/heightWindow > limiteRelacionAspecto)
        {
            $("#stop-Container").show();
            $("#main-Container").hide();
        }

        else
        {
            $("#stop-Container").hide();
            $("#main-Container").show();
        }
    }
    
    function showHome(){
        $("#login-container").show();
        $("#create-user-container").hide();
        $("#courses-container").hide();
        $("#question-container").hide();
        $("#result-container").hide();
        $("#loader-container").hide();
    }
    

    function appLogUser(id,name)
    {
        $("#welcome-name").html("Hola " + maxSizeText(10,name,"..."));
        $("#login-container").hide();
        $("#user-id").val(id);
        $(".nav-name-container").html("Visitante : "+name);
        getSessionData();
        putCourseList();
    }

    function checkWebStorage(){
        if(localStorage.getItem("ADAPPEDU")==null){
            localStorage.setItem("ADAPPEDU",JSON.stringify(addapEdu));
            showHome();
        }else{
            var jsonData=JSON.parse(localStorage.getItem("ADAPPEDU"));
            //CLEAR BROWSER CACHE
            
            if(addapEdu.version!=jsonData.version)
            {
                jsonData.version=addapEdu.version;
                addapEdu=jsonData;
                saveData();
                window.location.reload(true);
            }else{
                addapEdu=jsonData;
                saveData();
            }
            if(addapEdu.userId!=null){
                appLogUser(addapEdu.userId,addapEdu.userName);
            }
        }
     }
    
    function saveData(){
        printDebug(JSON.stringify(addapEdu));
        localStorage.setItem("ADAPPEDU",JSON.stringify(addapEdu));
    }
    
    printDebug('');
    $("#print-data-debug").html("");
    $("#debug-container").click(function(){
        $("#print-data-debug").slideToggle();
    });
    function printDebug(data){
        if(debug){
            $("#print-data-debug").append("<br><br>"+JSON.stringify(data));
        }else{
            $("#print-data-debug").hide();
            $("#debug-container").hide();
        }
    }
    
    $("#clear-debug").click(function(){
         $("#print-data-debug").html("");
    });
    
    function resetValues(){
         questionaryArray=[];
         noseCount=0;
         actualDiff=1;
         result="KEEP";
    }
    
    function saveSessionData(){
        window.localStorage.setItem("savedUserID",$("#user-id").val());
        window.localStorage.setItem("questionaryArray",JSON.stringify(questionaryArray));
        window.localStorage.setItem("noseCount",noseCount);
        window.localStorage.setItem("actualDiff",actualDiff);
        window.localStorage.setItem("result",result);
    }
    
    function getSessionData(){
        printDebug("GET SESSION DATA");
        
        //CHECK VALUE IS NOT NEW
        if(window.localStorage.getItem("savedUserID")==""){
            printDebug("Not Same");
            window.localStorage.setItem("savedUserID",$("#user-id").val());
        }
        
        if(window.localStorage.getItem("savedUserID")==$("#user-id").val()){
             printDebug("Same User");
             questionaryArray=JSON.parse(window.localStorage.getItem("questionaryArray"));
             noseCount=window.localStorage.getItem("noseCount");
             actualDiff=window.localStorage.getItem("actualDiff");
             if(actualDiff==null){
                 printDebug("SET DIFF AND ARRAY actualDiff WAS NULL");
                 actualDiff=1;
                 questionaryArray=[];
                 noseCount=0;
             }
             printDebug("ACTUALDIFF SESSION GET DATA:"+actualDiff);
             result=window.localStorage.getItem("result");
        }else{
            printDebug("RESET SESSION DATA");
             window.localStorage.setItem("savedUserID",$("#user-id").val());
            resetValues();
        }
    }
});
   