//Setup canvas
var particles=[];
var canvas=document.getElementById("canvas");
var mainContainer = $("#main-Container");
var context=canvas.getContext("2d");
var width=mainContainer.width();
var height=mainContainer.height();
canvas.width = width;
canvas.height = height;

//Opcion: parámetro que da la información para hacer display de las particulas
//de los trofeos o de las estrellas, true para las estrellas, false para los trofeos
function mostrarParticulas(numeroParticulas, velocidadParticulas, opcion)
{

	let numparticles=numeroParticulas;
	let velocidad= velocidadParticulas;
	var imagenSrc;


	if(opcion)
	{

		imagenSrc='img/estrella.png';
	}

	else
	{
		imagenSrc='img/trofeo.png';
	}

	
	let img = new Image();
	img.src = imagenSrc;
	let variacionWidth = width/7.5;
	
	if(opcion)
	{
		//Explosion superior
		for(i=0;i<numparticles/3;i++)
		{
			particles.push(particleEstrella.create(width/2 - variacionWidth,height/4,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
		}

		// Explosion izquierda inferior
		for(i=20;i<(2*numparticles)/3;i++)
		{
			particles.push(particleEstrella.create(width/4 - variacionWidth,height/1.5,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
		}

		// Explosion derecha inferior
		for(i=40;i<numparticles;i++)
		{
			particles.push(particleEstrella.create(width - (variacionWidth*3),height/1.5,velocidad,Math.random()*Math.PI*2,Math.floor(Math.random() * 101)+50));
			
		}

		updateEstrellas();
	}

	else
	{
		for(i=0;i<numparticles;i++)
		{
			particles.push(particleTrofeo.create((Math.random()*width+60)-60,Math.random()*height*20*-1,velocidad,Math.floor(Math.random() * 101)+50));
		}

		updateTrofeos();
	}
	
	function updateEstrellas()
	{
		context.clearRect(0,0,width,height);
		
		for (var i = 0; i < numparticles; i++) 
		{
			particles[i].update();
			context.beginPath();
			context.drawImage(img, particles[i].position.getX(), particles[i].position.getY(), particles[i].radius, particles[i].radius);
			context.fill();
		}

		requestAnimationFrame(updateEstrellas);
	}

	function updateTrofeos()
	{
		
		context.clearRect(0,0,width,height);
		
		for (var i = 0; i < numparticles; i++) 
		{
			particles[i].update();
			context.beginPath();
			context.drawImage(img, particles[i].position.getX(), particles[i].position.getY(), particles[i].tamanio, particles[i].tamanio);
			context.fill();
		}

		requestAnimationFrame(updateTrofeos);
	}
	
}