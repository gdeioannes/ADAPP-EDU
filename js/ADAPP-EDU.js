$(document).ready(function(){
    $(".cover").css("width",window.innerWidth);
    $(".cover").css("height",window.innerHeight);
    
    $("#create-acount").hide();
    
    $("#btn-create-acount").click(function(){
         $("#create-acount").fadeIn();
    });
    
    ("#create-acount .cover").click(function(){
         $("#create-acount").hide();
    });
    
    
    
});