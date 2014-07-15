var onimagesload = function (imgs,callback) {
    	var l = imgs.length;
    	var c = 0;
    	for (var i = 0; i < l; i++){
    		if(imgs[i].loaded) c++;
    		else imgs[i].onload = function () {
    			c++;
    			if (c === l) callback();
    		}
    	}

    	if (c === l) callback();
    }

var Case = Seed.extend({
	'+init' : function (options) {
		this.width = options.width;
		this.height = options.height;
		this.type = options.type || 'img'; //si txt div aura la propriété contenteditable.
		this.clicking = false;
		this.img = new Image();
		if(options.imgSrc) this.img.src = options.imgSrc;
		this.img.style.position = "absolute";
		this.img.style.left = 0;
		this.img.style.top = 0;
		this.div = document.createElement('div');
		//this.div.style.border = "1px solid #000000";
		this.div.style.width = this.width;
		this.div.style.height  = this.height;
		this.div.style.position = "absolute";
		this.div.style.overflow = "hidden";
		//this.div.style.cssFloat = "left"
		this.div.className = options.prefix + "-case-idle";
		//this.div.style.display = "inline-block";
		this.div.appendChild(this.img);
		this.clicking;
		this.posClick = [this.img.width/2,this.img.height/2];
		this.selected = true;

		this.div.onmousedown = function (e) {
			e.preventDefault();
			this.clicking = true;
			//this.posClick= [e.clientX - this.img.width/2, e.clientY- this.img.width/2];
		}.bind(this)
		this.div.onmouseup = function (e) {
			e.preventDefault();
			this.clicking = false
			//this.posClick = [e.clientX - this.img.width/2, e.clientY- this.img.width/2];
		}.bind(this)

		this.div.onmouseout = function (){
			this.clicking = false;
		}.bind(this);
		
		document.body.addEventListener('keydown',function(e){
			if(this.selected){
				var length = parseInt(this.img.style.width);
				//console.log(length)
				if(e.keyCode === 107){
					length+=5;
					this.zoom(length);
				}else if(e.keyCode === 109){
					length-=5;
					if(length > parseInt(this.div.style.width) && length*this.img.ratio > parseInt(this.div.style.height)) this.zoom(length);
				}
				console.log(parseInt(this.img.style.width),parseInt(this.img.style.height));
			}
		}.bind(this));
		
		var imgMove = function (e) {
			var deltaX = e.clientX - this.img.width/2 - this.posClick[0];
			var deltaY = e.clientY- this.img.height/2 - this.posClick[1];
			//console.log(deltaX,deltaY,this.clicking);
			if(this.clicking){
				this.img.style.left = Math.max((Math.min(parseInt(this.img.style.left) + deltaX,0)),-Math.abs(parseInt(this.img.style.width)-parseInt(this.div.style.width)));
				this.img.style.top = Math.max(Math.min(parseInt(this.img.style.top)+ deltaY,0),-Math.abs(parseInt(this.img.style.height)-parseInt(this.div.style.height)));
				//console.log(parseInt(this.img.style.left),parseInt(this.img.style.top));
		}
		this.posClick[0] = e.clientX - this.img.width/2;
		this.posClick[1] = e.clientY- this.img.height/2;
		}.bind(this)

		onimagesload([this.img],imgMove.bind(this))
		onimagesload([this.img], function(){

			this.img.style.height = this.img.naturalHeight;
			this.img.style.width = this.img.naturalWidth;
			this.img.ratio = this.img.naturalHeight/this.img.naturalWidth
			
			var height = parseInt(this.div.style.height);
			var width = parseInt(this.div.style.width);
			var ratioDiv = height/width;
			
			if (ratioDiv > 1) this.zoom(height,true);
			else this.zoom(width/ratioDiv);

			//this.img.style.left = Math.abs(parseInt(this.img.style.width) - width);
			//this.img.style.top = Math.abs(parseInt(this.img.style.height) - height);

		}.bind(this))
		
		this.div.onmousemove = imgMove.bind(this);
		
		
	},

	zoom : function (newLength,widthOrHeight){
		if(!widthOrHeight) {
			this.img.style.width = newLength;
			this.img.style.height = Math.floor(newLength*this.img.ratio);
		}
		else {
			this.img.style.height = newLength;
			this.img.style.width = Math.floor(newLength/this.img.ratio);
		}
	}


})