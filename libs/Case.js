sand.define('Case',["Geo/*"], function (r) {
	
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
			this.cursorOver = false;
			this.imgRect;
			this.divRect;
			this.staticPoint;
			
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
				


				document.body.addEventListener('keydown', function (e) {

					this.keyPressed[e.keyCode] = [true,this.selected];					
				}.bind(this))

				document.body.addEventListener('keyup', function (e) {
					delete this.keyPressed[e.keyCode];
				}.bind(this))

				this.div.addEventListener('mousewheel', function (e) {
					if(this.keyPressed[16]){
						e.preventDefault();
						var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		var factor = delta > 0 ? 1.05 : 0.95;//1+5*delta;
		var potentialRect = this.imgRect.move({staticPoint : this.staticPoint, scale : factor});
		console.log((potentialRect.segX.c2 >= parseInt(this.div.style.width) && potentialRect.segX.c1 <= 0 && potentialRect.segY.c1 <= 0 && potentialRect.segY.c2 >= parseInt(this.div.style.height)))
		if (!this.fit && (potentialRect.segX.c2 >= parseInt(this.div.style.width) && potentialRect.segX.c1 <= 0 && potentialRect.segY.c1 <= 0 && potentialRect.segY.c2 >= parseInt(this.div.style.height))) {
			this.zoom(factor);
			this.staticPoint = new r.Geo.Point([e.clientX - this.div.offsetLeft,e.clientY - this.div.offsetTop]);
			this.staticPoint = this.staticPoint.inRef(this.imgRect.ref);
			this.fire('imgMoved',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
			this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
		} else if(this.fit){
			this.zoom(factor);
			this.staticPoint = new r.Geo.Point([e.clientX - this.div.offsetLeft,e.clientY - this.div.offsetTop]);
			this.staticPoint = this.staticPoint.inRef(this.imgRect.ref);
			this.fire('imgMoved',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
			this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
		}
	}
}.bind(this))


var imgMove = function (e) {
					//this.staticPoint = [e.clientX - this.div.offsetLeft + Math.abs(parseInt(this.img.style.left)), e.clientY - this.div.offsetTop + Math.abs(parseInt(this.img.style.top))];
					this.staticPoint = new r.Geo.Point([e.clientX - this.div.offsetLeft, e.clientY - this.div.offsetTop].add([document.body.scrollLeft, document.body.scrollTop]));
					this.staticPoint = this.staticPoint.inRef(this.imgRect.ref);
					var deltaX = e.clientX - this.img.width/2 - this.posClick[0];
					var deltaY = e.clientY- this.img.height/2 - this.posClick[1];
					var delta = [deltaX,deltaY];
					var potentialRect = this.imgRect.move({vector : delta});
					if(this.clicking) {
						if (!this.fit && (potentialRect.segX.c2 >= parseInt(this.div.style.width) && potentialRect.segX.c1 <= 0 && potentialRect.segY.c1 <= 0 && potentialRect.segY.c2 >= parseInt(this.div.style.height))) {
							this.img.style.left = parseInt(this.img.style.left) + deltaX;
							this.img.style.top = parseInt(this.img.style.top) + deltaY;
							this.imgRect = potentialRect;
						}else if(this.fit) {
							this.img.style.left = Math.max(Math.min(parseInt(this.div.style.width),parseInt(this.img.style.left) + deltaX),-Math.min(parseInt(this.div.style.width)));
							this.img.style.top = Math.max(Math.min(parseInt(this.div.style.height),parseInt(this.img.style.top) + deltaY),-Math.min(parseInt(this.div.style.height)));
						}
						this.fire('imgMoved',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
						this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
					}
					this.posClick[0] = e.clientX - this.img.width/2;
					this.posClick[1] = e.clientY- this.img.height/2;
					
				}.bind(this)

				this.loadCase(true);

				this.div.onmousemove = imgMove.bind(this);
			}	
		},

		zoom : function (factor) {
			this.imgRect = this.imgRect.move({staticPoint : this.staticPoint, scale : factor});
			this.img.style.left =  this.imgRect.segX.c1;
			this.img.style.top = this.imgRect.segY.c1;
			this.img.style.width = this.imgRect.segX.getLength();
			this.img.style.height = this.imgRect.segY.getLength();
		},

		loadCase : function (firstLoad) {
			var loading = function () {

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

					if (this.ratio > ratioDiv) {
						this.img.style.width = width;
						this.img.style.height = width*this.ratio;
					}
					else {
						this.img.style.height = height;
						this.img.style.width = height/this.ratio;
					}

				}

				this.img.style.left = 0;
				this.img.style.top = 0;

				var imgX = parseInt(this.img.style.left);
				var imgY = parseInt(this.img.style.top);

				var segX = new r.Geo.Seg(imgX, imgX + parseInt(this.img.style.width));
				var segY = new r.Geo.Seg(imgY, imgY + parseInt(this.img.style.height));

				var segDivX = new r.Geo.Seg(0, width);
				var segDivY = new r.Geo.Seg(0, height);

				this.imgRect = new r.Geo.Rect({ segX : segX, segY : segY, ref : new r.Geo.Ref({ origin : [imgX,imgY], factor : 1})});
				this.divRect = new r.Geo.Rect({ segX : segDivX, segY : segDivY});
				this.fire('update:position',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));

			}.bind(this);

			if(!firstLoad){
				loading();
			}
			else  onimagesload([this.img], loading) ;
		
		},

		disableImgMvt : function () {
			this.img.onmousemove = function ()  {
				//overwrite previous event function
				// CAUTION : IS NOT REVERSABLE
			}
		}



	})
})