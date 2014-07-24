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

			this.logoBox =  new Case({ width : options.width*0.17 , height : options.height*0.108 , prefix : "berenger", imgSrc : options.logo, type : "img"})
			this.logoBox.div.style.cssFloat = "left";
			this.logoBox.div.id = "logo";
			this.logoBox.div.addEventListener("mousedown", function () {
					this.fire('selection', "logo");
				}.bind(this))

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
							fontSize : 30,
							position : "absolute",
							textAlign : "center"
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
						tag : 'div.' + options.prefix + "-list",
						style : {
							width : options.width*0.16,
							height : options.height*0.108,
							cssFloat : "right",
							//border : "1px solid #000000"
						}
					}	
					]
				}, scp)

if(this.type === 'moods'){
	this.desc = toDOM({

		tag : 'div.' + options.prefix + "-desc",

		style : {
			opacity : "0.7",
			backgroundColor : "#000000",
			width : 380,
			height : 80,
			fontSize : 18,
			position : "absolute",
			color : "#FFFFFF",
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
	})

	this.el.appendChild(this.desc)

	this.box.div.style.top = (parseInt(options.height) - parseInt(this.box.div.style.height))/2;
	this.box.div.style.left = (parseInt(options.width) - parseInt(this.box.div.style.width))/2;
			

	this.desc.style.left = parseInt(this.box.div.style.left) - parseInt(this.desc.style.width)*0.12;
	this.desc.style.top = parseInt(this.box.div.style.top) + parseInt(this.box.div.style.height) - parseInt(this.desc.style.height)*0.33;

	this.el.children[1].style.color = "#f17f37";
	this.el.appendChild(this.box.div)
}
else if (this.type === 'stories') {
	this.box.div.style.left = this.box.div.style.top = 100;
	this.el.children[1].style.color = "#8c8fc2";

	this.bulletPoint = toDOM({
		tag : 'div.' + options.prefix + "-list",
		style : {
			cssFloat : "right",
			width : 200,
			height : 600,
						//border : "1px solid #000000"
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