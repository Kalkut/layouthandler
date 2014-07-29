sand.define('Slide',['Case'], function (r) {

	var Case = r.Case
	return Seed.extend({


		/*Revoir la structure HTML */
		'+init' : function (options) {
			this.box = new Case(options.box);
			this.box.div.id = "pic";
			this.box.div.addEventListener("mousedown", function () {
				this.fire('selection', "pic");
			}.bind(this))

			this.type = options.type;
			var that = this;
			var scp = {};
			this.texte;


			this.logoBox =  new Case({ width : options.width*0.17 , height : options.height*0.108 , prefix : "berenger", imgSrc : options.logo, type : "img", fit : true})
			this.logoBox.div.style.cssFloat = "left";
			this.logoBox.div.id = "logo";
			this.logoBox.div.addEventListener("mousedown", function () {
				this.fire('selection', "logo");
			}.bind(this))

			this.cases = [this.box,this.logoBox];

			this.on('selection', function (logoOrPic){
				if(logoOrPic === 'logo'){
					this.box.selected = false;
					this.logoBox.selected = true;
				}else{
					this.logoBox.selected = false;
					this.box.selected = true;
				}
			})
			
			this.el = toDOM({
				tag : 'div.' + options.prefix + "-slide",
				style : {
					width : options.width,
					height : options.height,
					position : "absolute"
				},

				children : [

				/*{
					tag : 'img.' + options.prefix + "-logo",
					attr : {
						width : options.width*0.17,
						height : options.height*0.108,
						src : options.logo || null
					},
					style : {
						cssFloat : "left",
							//border : "1px solid #000000"
						}
					}*/

					this.logoBox.div
					,
					
					{
						tag : 'div.' + options.prefix + "-title",
						style : {
							width : options.width*0.66,
							height : options.height*0.108,
							left : options.width*0.17,
							position : "absolute",
							textAlign : "center",
							outline : "none"
						},
						attr : {
							contenteditable : true
						},
						events : {
							keyup : function () {
								this.fire('changeSlidesTitle',scp[options.prefix + "-title"].innerHTML);
								console.log(scp[options.prefix + "-title"].innerHTML);
							}.bind(this)
						},
						innerHTML : options.title || null,
					},

					{
						tag : 'div.' + options.prefix + "-menu",
						style : {
							width : options.width*0.16,
							height : options.height*0.108,
							position : "absolute",
							left : options.width*0.83
						}
					}	
					]
				}, scp)

if(this.type === 'moods'){
	var box = this.box.div;

	this.bloc = toDOM({
		tag : 'div.' + options.prefix +'-bloc',
		style : {
			width : box.style.width,
			height : box.style.width,
			position : "absolute"
		},

		children : [

		box,
		{
			tag : 'div.' + options.prefix + "-desc",

			style : {
				opacity : "0.7",
				backgroundColor : "#000000",
				width : 380,
				height : 50,
				position : "absolute",
				zIndex : 1
			},

			attr : {
				contenteditable : true
			},

			event : {
				keyup : function() {
					this.texte = this.desc.innerHTML
				}.bind(this)
			}
		}
		]
	})

	this.bloc.style.top = (parseInt(options.height) - parseInt(this.box.div.style.height))/2;
	this.bloc.style.left = (parseInt(options.width) - parseInt(this.box.div.style.width))/2;

	this.box.on('update:position',function (x,y,iWidth,iHeight) {
		this.bloc.children[1].style.left = Math.min(Math.max(x - 50,-50),parseInt(this.box.div.style.width));
		this.bloc.children[1].style.top =  Math.max(Math.min(y + iHeight - 50,parseInt(this.box.div.style.height)-50), - 50);
		console.log(this.bloc.children[1].style.left,this.bloc.children[1].style.top)
		console.log(x,y,iWidth,iHeight);
		//console.log(this.bloc.style.height);
	}.bind(this));

	this.el.children[1].style.color = "#f17f37";
	this.el.appendChild(this.bloc)
}
else if (this.type === 'stories') {
	this.box.div.style.left = this.box.div.style.top = 100;
	this.el.children[1].style.color = "#8c8fc2";
	var boxWidth = parseInt(this.box.div.style.width);

	this.bulletPoint = toDOM({
		tag : 'div.' + options.prefix + "-list",
		style : {
			position : "absolute",
			width : 200,
			height : 600,
			top : 100,
			left : 150 + boxWidth
		}
	})

	var nbLines = 0;
	var maxLines = 4;
	var index = 0;

	function addLine (e){
		if(e.keyCode === 13 && nbLines < maxLines){
			nbLines++;
			index++;
			var scope = {};
			var nextItem = toDOM({
				tag : 'div.' + options.prefix + "-list-element",
				style : {
					width : 199,
					height : 100,
				},

				children : [
				{
					tag : 'div.' + options.prefix + "-bulletPoint",
					style : {
									//backgroundImage : ,
									backgroundColor : "#8c8fc2",
									width : 15,
									height : 15,
									cssFloat : "left",
								}
							},
							
							{
								tag : 'div.' + options.prefix + "-text",
								style :{
									width : 180,
									height : 100,
									cssFloat : "left",
								},
								events : {
									keydown : function (e) {
										//console.log('yo');
										addLine(e)
										//console.log('yo2');
										//console.log(e.keyCode);
										if(e.keyCode === 8 && nbLines > 1 && scope[options.prefix + '-text'].innerHTML === ""){
											console.log('yo3')
											e.preventDefault();
											console.log('heyho')
											nbLines--;
											nextItem.parentNode.removeChild(nextItem);
										}
									},

									keyup : function(e) {
										e.preventDefault();
										this.texte
									}
								},
								attr : {
									contenteditable : true,
									index : index,
								}
							}
							]
						}, scope)
that.bulletPoint.appendChild(nextItem);
nextItem.focus();	
}
}



this.el.appendChild(this.box.div);
this.el.appendChild(this.bulletPoint);
addLine({keyCode : 13});
}






},



})

})