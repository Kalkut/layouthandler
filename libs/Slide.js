sand.define('Slide',['Case','ressources/Selectbox'], function (r) {
	var Selectbox = r.Selectbox;
	var Case = r.Case;
	
	return Seed.extend({

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

			this.on('selection', function (logoOrPic) {
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
						}.bind(this)
					},
					innerHTML : options.title || null,
				},
				]
			}, scp)

			if(this.type === 'moods'){

				this.menu = new Selectbox({
					choices : [
					{ label : 'MOODS', id : 'moods' },
					{ label : 'STORIES', id : 'stories' }
					],
					change : function(choice) {
						this.fire('layout:changed',choice.id)
					}.bind(this),

			def : 'moods' // l'identifiant de la valeur par défaut
		})
				this.menu.fake.className += " moods";
				this.menu.trigger.className += " moods";
				this.menu.up();
				this.menu.opened = false
				this.menu.trigger.onclick = function(e) {
					e.preventDefault();
					if(!this.menu.opened){
						this.menu.down();
						this.menu.opened = true;
					}else{
						this.menu.up();
						this.menu.opened = false;
					}
				}.bind(this);

				this.el.appendChild(this.menu.el)

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
						events : {
							keyup : function() {
								this.texte = this.bloc.children[1].innerHTML;
								this.fire("commentChanged",this.texte);
							}.bind(this)
						},
						innerHTML : options.comment||"",
					}
					]
				})

				this.bloc.style.top = (parseInt(options.height) - parseInt(this.box.div.style.height))/2;
				this.bloc.style.left = (parseInt(options.width) - parseInt(this.box.div.style.width))/2;

				this.box.on('update:position',function (x,y,iWidth,iHeight) {
					this.bloc.children[1].style.left = Math.min(Math.max(x - 50,-50),parseInt(this.box.div.style.width));
					this.bloc.children[1].style.top =  Math.max(Math.min(y + iHeight - 50,parseInt(this.box.div.style.height)-50), - 50);
				}.bind(this));

				this.el.children[1].style.color = "#f17f37";
				this.el.appendChild(this.bloc)
			}
			else if (this.type === 'stories') {

				this.menu = new Selectbox({
					choices : [
					{ label : 'STORIES', id : 'stories' },
					{ label : 'MOODS', id : 'moods' },
					],
					change : function(choice) {
						this.fire('layout:changed',choice.id);
					}.bind(this),

			def : 'stories' // l'identifiant de la valeur par défaut
		})

				this.menu.fake.className += " stories";
				this.menu.trigger.className += " stories";
				this.menu.up();
				this.el.appendChild(this.menu.el);

				this.menu.opened = false
				this.menu.trigger.onclick = function(e) {
					e.preventDefault();
					if(!this.menu.opened){
						this.menu.down();
						this.menu.opened = true;
					}else{
						this.menu.up();
						this.menu.opened = false;
					}
				}.bind(this);

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
										addLine(e)
										if(e.keyCode === 8 && nbLines > 1 && scope[options.prefix + '-text'].innerHTML === ""){
											e.preventDefault();
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