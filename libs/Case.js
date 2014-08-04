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
			this.pos = options.pos;
			this.keyPressed = {};
			this.cursorOver = false
			
			this.div = toDOM({
				tag : 'div.' + options.prefix + "-case-idle",
				style : {
					position : "absolute",
					overflow : "hidden",
					width : options.width,
					height : options.height,
					outline : "none",
				}
			})

			if(this.type === 'txt') {
				this.txtBloc = toDOM({
					tag : 'table.' + options.prefix + "-case",
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
				this.cursorOver;
				this.posClick = [this.img.width/2,this.img.height/2];
				this.selected = false;
				this.z = 0;

				this.div.onmousedown = function (e) {
					e.preventDefault();
					this.clicking = true;
				}.bind(this)
				this.div.onmouseup = function (e) {
					e.preventDefault();
					this.clicking = false;
				}.bind(this)

				this.div.onmouseout = function () {
					this.clicking = false;
					this.cursorOver = false;
				}.bind(this);

				this.div.onmouseover = function () {
					this.cursorOver = true;
				}.bind(this)
				
				/*document.body.addEventListener('keydown',function (e) {
					if(this.selected) {
						var length = parseInt(this.img.style.width);
						if(e.keyCode === 107) {
							length+=5;
							this.zoom(length);
						} else if(e.keyCode === 109) {
							length-=5;
							if((length > parseInt(this.div.style.width) && length*this.ratio > parseInt(this.div.style.height)) || this.fit) {
								this.zoom(length);
							}
						}
					}
				}.bind(this));*/


				/*this.div.onkeydown = function (e) {
					this.shiftPressed = e.keyCode === 18;
					console.log(this.shiftPressed);
				}.bind(this)*/

				document.body.addEventListener('keydown', function (e) {
					
					this.keyPressed[e.keyCode] = [true,this.selected];
					console.log(this.keyPressed[e.keyCode])
					
				}.bind(this))

				document.body.addEventListener('keyup', function (e) {
					delete this.keyPressed[e.keyCode];
				}.bind(this))

				this.div.addEventListener('mousewheel', function (e) {
					//console.log(this.keyPressed[16]);
					//console.log(this.cursorOver)
					//console.log(this.keyPressed[16] && this.cursorOver)
					if(this.keyPressed[16]){
						e.preventDefault();
						var length = parseInt(this.img.style.width);
						var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
						length+= delta*5;
						this.zoom(length);
					}
				}.bind(this))



				this.img.onclick = function (e) {
					//console.log(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
				}
				
				var imgMove = function (e) {
					var deltaX = e.clientX - this.img.width/2 - this.posClick[0];
					var deltaY = e.clientY- this.img.height/2 - this.posClick[1];
					if(this.clicking) {
						if (!this.fit) {
							this.img.style.left = Math.max((Math.min(parseInt(this.img.style.left) + deltaX,0)),-Math.abs(parseInt(this.img.style.width)-parseInt(this.div.style.width)));
							this.img.style.top = Math.max(Math.min(parseInt(this.img.style.top)+ deltaY,0),-Math.abs(parseInt(this.img.style.height)-parseInt(this.div.style.height)));
						}else {
							this.img.style.left = Math.max(Math.min(parseInt(this.div.style.width),parseInt(this.img.style.left) + deltaX),-Math.min(parseInt(this.div.style.width)));
							this.img.style.top = Math.max(Math.min(parseInt(this.div.style.height),parseInt(this.img.style.top) + deltaY),-Math.min(parseInt(this.div.style.height)));
						}
						this.fire('imgMoved',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
						this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
					}
					this.posClick[0] = e.clientX - this.img.width/2;
					this.posClick[1] = e.clientY- this.img.height/2;
					
				}.bind(this)

				onimagesload([this.img], function() {
					if(this.pos){
						this.ratio = parseInt(this.img.naturalHeight)/parseInt(this.img.naturalWidth);
						this.img.style.width = this.pos[2];
						this.img.style.height = this.pos[3];
						this.img.style.left = this.pos[0];
						this.img.style.top = this.pos[1];
					} else {
						this.img.style.height = this.img.naturalHeight;
						this.img.style.width = this.img.naturalWidth;
						this.ratio = parseInt(this.img.naturalHeight)/parseInt(this.img.naturalWidth);

						var height = parseInt(this.div.style.height);
						var width = parseInt(this.div.style.width);
						var ratioDiv = height/width;

						if (this.ratio > ratioDiv) this.zoom(width,false,true);
						else this.zoom(height,true,true);
					}

				}.bind(this))
				
				this.div.onmousemove = imgMove.bind(this);
			}	
		},

		zoom : function (newLength,widthOrHeight,init) {
			if(!widthOrHeight) {
				this.img.style.width = newLength;
				this.img.style.height = newLength*this.ratio;
			}
			else {
				this.img.style.height = newLength;
				this.img.style.width = newLength/this.ratio;
			}
			if(!init){
				this.fire('imgMoved',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
				this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
			}
		}


	})
})