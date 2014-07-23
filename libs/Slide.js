var Slide = Seed.extend({


/*Revoir la structure HTML */
	'+init' : function (options) {
		this.box = new Case(options.box);
		this.type = options.type;

		this.el = toDOM({
					tag : 'div.' + options.prefix + "-slide",
					style : {
						width : options.width,
						height : options.height,
						position : "absolute"
					},

					children : [

					{
						tag : 'img.' + options.prefix + "-logo",
						attr : {
							width : options.width*0.17,
							height : options.height*0.108,
							src : options.logo || null
						},
						style : {
							cssFloat : "left",
							border : "1px solid #000000"
						}
					},
					
					{
						tag : 'div.' + options.prefix + "-title",
						style : {
							width : options.width*0.66,
							height : options.height*0.108,
							cssFloat : "left",
							fontSize : 30,
							//color : "#f17f37",
							textAlign : "center"
						},
						attr : {
							//contenteditable : true
						},
						innerHTML : options.title || null,
					},

					{
						tag : 'div.' + options.prefix + "-list",
						style : {
							width : options.width*0.16,
							height : options.height*0.108,
							cssFloat : "left",
							border : "1px solid #000000"
						}
					}	
					]
		})

		if(this.type === 'stories'){
			this.desc = toDOM({
						
						tag : 'div.' + options.prefix + "-desc",
						
						style : {
							opacity : "0.7",
							backgroundColor : "#000000",
							width : 200,
							height : 80,
							fontSize : 18,
							position : "absolute",
							color : "#FFFFFF",
							zIndex : 1
						},
						
						attr : {
							contenteditable : true
						}
					})
		
		this.el.appendChild(this.desc)
		
		this.box.div.style.top = (parseInt(options.height) - parseInt(this.box.div.style.height))/2;
		this.box.div.style.left = (parseInt(options.width) - parseInt(this.box.div.style.width))/2;

		this.desc.style.left = parseInt(this.box.div.style.left) - parseInt(this.desc.style.width)/4;
		this.desc.style.top = parseInt(this.box.div.style.top) + parseInt(this.box.div.style.height) - parseInt(this.desc.style.height)/4;
		
		this.el.children[1].style.color = "#f17f37";
		this.el.appendChild(this.box.div)
		}
		else if (this.type === 'moods') {
			this.box.div.style.left = this.box.div.style.top = 100;
			this.el.children[1].style.color = "#8c8fc2";
			var that = this;
			

			
			this.bulletPoint = toDOM({
					tag : 'div.' + options.prefix + "-list",
					style : {
						cssFloat : "right",
						width : 200,
						height : 600,
						border : "1px solid #000000"
					}
			})
			
			var nbLines = 0;

			function addLine (e){
				if(e.keyCode === 13 && nbLines < 4){
					nbLines++;
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
									keydown : addLine,
								},
								attr : {
									contenteditable : true,
								}
							}
						]
					})
					that.bulletPoint.appendChild(nextItem);
				}
			}

			

			this.el.appendChild(this.box.div);
			this.el.appendChild(this.bulletPoint);
			addLine({keyCode : 13});
		}

		
		

		
		
	},


	
})