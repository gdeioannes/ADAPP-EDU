particle=
{
	velocity :null,
    position : null,
    radius: null,


	create : function(x,y,speed,angle,radius)
	{
		console.log(x,y,speed,angle)
		var obj=Object.create(this);
		obj.velocity=vector.create(0,0);
		
		obj.velocity.setLength(speed);
		obj.velocity.setAngle(angle);
        obj.position=vector.create(x,y);
        obj.radius = radius;
	
		return obj;
	},

	update: function(){
		this.position.addTo(this.velocity);
    }, 
    
    

}