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

sand.define('Case', function (r) {

	return Seed.extend({
		'+options' : {
			type : 'img',
			clicking : false
		},

		'+init' : function (options) {
			this.img = new Image();
			if(options.imgSrc) this.img.src = options.imgSrc;
			this.img.style.position = "absolute";
			this.img.style.left = 0;
			this.img.style.top = 0;
			this.type = options.type;
			this.fit = options.fit
			
			this.div = toDOM({
				tag : 'div.' + options.prefix + "-case-idle",
				style : {
					position : "absolute",
					overflow : "hidden",
					width : options.width,
					height : options.height,
					outline : "none",
				},
				events : {
					/*keyup : function(e) {
						e.preventDefault();
					},
					/*keydown : function (e){
						e.preventDefault();
					},*/
					/*keypress : function (e){
						e.preventDefault();
					},*/
				}

			})

			if(this.type === 'txt') {
				this.txtBloc = toDOM({
					tag : 'table.' + options.prefix + "-case",
					attr : {
						tabindex : "1",
					},
					children : [
					{
						tag : 'tr.' + options.prefix + "-case",
						children : [
						{
							tag : 'td.' + options.prefix + "-case",
							children : [
							{
								tag : 'div.' + options.prefix + "-case",
								events : {
									keyup : function () {
										console.log(this.txtBloc.children[0].children[0].children[0].innerHTML);
									//e.preventDefault();
									this.fire('titleChanged',this.txtBloc.children[0].children[0].children[0].innerHTML);
									
								}.bind(this),
								
							},
							attr : {
								contenteditable : true,
							}
						},
						]
					}
					]
				}],
			})

				this.div.appendChild(this.txtBloc);

			} else if (this.type === 'img') {
				this.div.appendChild(this.img);
				this.clicking;
				this.posClick = [this.img.width/2,this.img.height/2];
				this.selected = false;
				this.z = 0;

				this.div.onmousedown = function (e) {
					e.preventDefault();
					this.clicking = true;
				}.bind(this)
				this.div.onmouseup = function (e) {
					e.preventDefault();
					this.clicking = false
				}.bind(this)

				this.div.onmouseout = function (){
					this.clicking = false;
				}.bind(this);
				
				document.body.addEventListener('keydown',function(e){
					if(this.selected){
						var length = parseInt(this.img.style.width);
						if(e.keyCode === 107){
							length+=5;
							this.zoom(length);
						}else if(e.keyCode === 109){
							length-=5;
							if((length > parseInt(this.div.style.width) && length*this.img.ratio > parseInt(this.div.style.height)) || this.fit) this.zoom(length);
						}
					}
				}.bind(this));
				
				var imgMove = function (e) {
					var deltaX = e.clientX - this.img.width/2 - this.posClick[0];
					var deltaY = e.clientY- this.img.height/2 - this.posClick[1];
					if(this.clicking){
						if (!this.fit){
							this.img.style.left = Math.max((Math.min(parseInt(this.img.style.left) + deltaX,0)),-Math.abs(parseInt(this.img.style.width)-parseInt(this.div.style.width)));
							this.img.style.top = Math.max(Math.min(parseInt(this.img.style.top)+ deltaY,0),-Math.abs(parseInt(this.img.style.height)-parseInt(this.div.style.height)));
						}else{
							this.img.style.left = Math.max(Math.min(parseInt(this.div.style.width),parseInt(this.img.style.left) + deltaX),-Math.min(parseInt(this.div.style.width)));
							this.img.style.top = Math.max(Math.min(parseInt(this.div.style.height),parseInt(this.img.style.top) + deltaY),-Math.min(parseInt(this.div.style.height)));
						}
						this.fire('imgMoved',this.img.style.left,this.img.style.top,this.z);
						this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
					}
					this.posClick[0] = e.clientX - this.img.width/2;
					this.posClick[1] = e.clientY- this.img.height/2;
					
				}.bind(this)

				onimagesload([this.img],imgMove.bind(this))
				onimagesload([this.img], function() {

					this.img.style.height = this.img.naturalHeight;
					this.img.style.width = this.img.naturalWidth;
					this.img.ratio = parseInt(this.img.naturalHeight)/parseInt(this.img.naturalWidth);
					
					var height = parseInt(this.div.style.height);
					var width = parseInt(this.div.style.width);
					var ratioDiv = height/width;
					
					if (this.img.ratio > ratioDiv) this.zoom(width,false);
					else this.zoom(height,true);

				}.bind(this))
				
				this.div.onmousemove = imgMove.bind(this);
				
			}	
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
			this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
		}


	})
})