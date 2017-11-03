function mostrarEstrellas()
{
	mainContainer = $("#main-Container");
    canvas=document.getElementById("canvasEstrellas");
	context=canvas.getContext("2d");
	width=mainContainer.width();
	height=mainContainer.height();
	canvas.width = width;
	canvas.height = height;
    console.log("Width: "+ width);
    console.log("height: "+ height);
	particles=[];
	numparticles=60;
	velocidad= 3;
	imagenSrc='img/estrella.png';
	var img = new Image();
	img.src = imagenSrc;
	variacionWidth = width/7.5;
	
	//Explosion superior
	for(i=0;i<numparticles/3;i++)
	{
		particles.push(particle.create(width/2 - variacionWidth,height/4,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
	}

	// Explosion izquierda inferior
	for(i=0;i<numparticles/3;i++)
	{
		particles.push(particle.create(width/4 - variacionWidth,height/1.5,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
	}

	// Explosion derecha inferior
	for(i=0;i<numparticles/3;i++)
	{
		particles.push(particle.create(width - (variacionWidth*3),height/1.5,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
		
	}

	
	update();

	function update()
	{
		context.clearRect(0,0,width,height);

		for (var i = 0; i < numparticles; i++) 
		{
			particles[i].update();
			context.beginPath();
			context.drawImage(img, particles[i].position.getX(), particles[i].position.getY(), particles[i].radius, particles[i].radius);
			//context.arc(particles[i].position.getX(),particles[i].position.getY(),particles[i].radius,0,2*Math.PI,false);
			context.fill();
		}

		requestAnimationFrame(update);
	}
}