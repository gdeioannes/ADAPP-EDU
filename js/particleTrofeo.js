particleTrofeo=
{
	velocity :null,
    position : null,
    tamanio: null,

	/// dummy constructor
	create : function(x,y,speed,tamanio)
	{
		
		var obj=Object.create(this);
		obj.velocity=vector.create(0,0);
		
		obj.velocity.setLength(speed);
        obj.position=vector.create(x,y);
        obj.tamanio = tamanio;
		return obj;
	},

	update: function(){
		this.position.addTo(this.velocity);
    }, 
    
    

}