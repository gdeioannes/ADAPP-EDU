function mostrarTrofeos()
{
    mainContainer = $("#main-Container");
    // canvas=document.getElementById("canvasTrofeos");
	context=canvas.getContext("2d");
	width=mainContainer.width();
    height=mainContainer.height();
    canvas.width = width;
	canvas.height = height;
	particles=[];
	numparticles=500;
	velocidad=5;
	imagenSrc='img/trofeo.png';
	var img = new Image();
	img.src = imagenSrc;
	
	
	//Trofeos
	for(i=0;i<numparticles;i++)
	{
		//particles.push(context.drawImage(base_image, 100, 100));
		particles.push(particleTrofeo.create((Math.random()*width+60)-60,Math.random()*height*20*-1,velocidad,Math.floor(Math.random() * 101)+50));
	}

	
	update();

	function update()
	{
		
		context.clearRect(0,0,width,height);

		for (var i = 0; i < numparticles; i++) 
		{
			particles[i].update();
			context.beginPath();
			context.drawImage(img, particles[i].position.getX(), particles[i].position.getY(), particles[i].tamanio, particles[i].tamanio);
			//context.arc(particles[i].position.getX(),particles[i].position.getY(),20,0,2*Math.PI,false);
			context.fill();
		}

		requestAnimationFrame(update);
	}
}