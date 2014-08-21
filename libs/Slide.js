sand.define('Slide',['Case','ressources/Selectbox'], function (r) {
	var Selectbox = r.Selectbox;
	var Case = r.Case;

	function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
	
	return Seed.extend({

		'+init' : function (options) {
			this.box = new Case(options.box);
			this.box.div.id = "pic";
			this.type = options.type;
			var scp = {};
			this.prefix = (this.prefix || "");
			this.bulletPoints = options.bulletPoints;
			this.signatures = options.signatures || {};

			/*Case du Logo, indice 1 dans this.cases*/
			this.logoBox =  new Case({ width : 87 , height : 47 , prefix : this.prefix, imgSrc : options.logo, type : "img", fit : true,})
			this.logoBox.div.id = "logo";
			this.logoBox.div.style.left = 70 + 'px';
			this.logoBox.div.style.top = 8 + 'px';


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
				tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "slide",
				style : {
					width : options.width,
					height : options.height,
					position : "absolute"
				},

				children : [

				this.logoBox.div
				,

				{
					tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "title",

					attr : {
						contenteditable : true
					},
					events : {
						keyup : function () {
							this.fire('slide:titleChanged',scp[(this.prefix ? (this.prefix + "-") : "") + "title"].innerHTML);
						}.bind(this)
					},
					innerHTML : options.title || null,
				},
				]
			}, scp)


				this.menu = new Selectbox({
					choices : options.choices,
					change : function(choice) {
						this.fire('slide:changedLayout',choice.id);
					}.bind(this),

			def : options.layoutType // l'identifiant de la valeur par défaut
		})

				this.menu.fake.className += " " + options.layoutType;
				this.menu.trigger.className += " " + options.layoutType;
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

				this.menu.fake.className += " " + options.layoutType;
				this.menu.trigger.className += " " +options.layoutType;

			if(this.type === 'comment') {

				this.el.appendChild(this.menu.el)

				var box = this.box.div;

				this.bloc = toDOM({
					tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") +'bloc',
					style : {
						width : box.style.width,
						height : box.style.width,
						position : "absolute"
					},

					children : [

					box,
					{
						tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "comment",

						attr : {
							contenteditable : true
						},
						events : {
							keyup : function() {
								this.texte = this.bloc.children[1].innerHTML;
								this.fire("slide:changedComment",this.texte);
							}.bind(this)
						},
						innerHTML : options.comment||"",
					}
					]
				})

				this.bloc.style.top = 87 + 'px';
				this.bloc.style.left = 160 + 'px';
				this.menu.el.style.top = 18 + 'px';
				this.menu.el.style.left = 960 + 'px';
				this.el.children[1].style.left = 240 + 'px';



				this.box.on('case:imageMovedInt',function (x,y,iWidth,iHeight) {
					this.bloc.children[1].style.left = Math.min(Math.max(x - 50,-50),parseInt(this.box.div.style.width)) + 'px';
					this.bloc.children[1].style.top =  Math.max(Math.min(y + iHeight - 50,parseInt(this.box.div.style.height)-50), - 50) + 'px';
				}.bind(this));

				this.el.children[1].style.color = options.color || "#f17f37";
				this.el.appendChild(this.bloc)
			}
			else if (this.type === 'bulletPoints') {

				this.menu.el.style.top = 10 + 'px';
				this.menu.el.style.left = 881 + 'px';
				this.box.div.style.left  = 63 + 'px';
				this.box.div.style.top = 110 + 'px';
				this.el.children[1].style.color = options.color || "#8c8fc2";
				var boxWidth = parseInt(this.box.div.style.width);

				this.bulletPoint = toDOM({
					tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "list",
					style : {
						position : "absolute",
						width : 321 + 'px',
						height : 600 + 'px',
						top : 130 + 'px',
						left : 743 + 'px',
					}
				})

				this.nbLines = 0;
				this.maxLines = 4;
				this.index = 0;

				this.el.appendChild(this.box.div);
				this.el.appendChild(this.bulletPoint);
			}


			this.on("slide:newColor", function (color) {
				this.setColor(color);
			}.bind(this))
		},

		addLine : function (e,textBP){
			if(e.keyCode === 13){
				this.nbLines++;
				this.index = Date.now();
				var scope = {};
				this.nextItem = toDOM({
					tag : 'div.' + (this.prefix + "-" || "") + "list-element",
					style : {
						width : 250 + 'px',
					},

					children : [
					{
						tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "bulletPoint",
						style : {
							backgroundColor : "#8c8fc2",
							width : 15 + 'px',
							height : 15 + 'px',
							cssFloat : "left",
						}
					},

					{
						tag : 'div.' + (this.prefix ? (this.prefix + "-") : "") + "text",
						style :{
							width : 210 + 'px',
							cssFloat : "left",
						},
						innerHTML : textBP || "",
						attr : {
							contenteditable : true,
							signature : this.signatures[this.nbLines-1] || this.index,
						},
						events : {
							keydown : function (e) {

								if(e.keyCode === 8 && this.nbLines > 1 && scope[(this.prefix ? (this.prefix + "-") : "") + "text"].innerHTML === ""){
									e.preventDefault();
									this.nbLines--;
									var daddy = scope[(this.prefix + "-" || "") + "list-element"].parentNode;
									daddy.removeChild(scope[(this.prefix + "-" || "") + "list-element"]);
									daddy.childNodes[daddy.childNodes.length-1].children[1].focus();
									placeCaretAtEnd(daddy.childNodes[daddy.childNodes.length-1].children[1])
									this.fire("slide:lineRemoved", scope[(this.prefix ? (this.prefix + "-") : "") + "text"].attributes.signature.value,this.nbLines)
								}else if (e.keyCode === 13) {
									e.preventDefault()
								}
							}.bind(this),

							keyup : function(e) {
								this.addLine(e);
								for(var i = 0, n = this.bulletPoint.childNodes.length; i < n ; i++) {
									this.fire('slide:changedBP',this.bulletPoint.childNodes[i].childNodes[1].innerHTML,i)
								}
							}.bind(this)
						},
					}]
				}, scope );
				this.bulletPoint.appendChild(this.nextItem);
				this.nextItem.children[1].focus();
				this.fire('slide:lineAdded',this.nextItem.children[1].attributes.signature.value,this.nbLines);
			}
		},

		load : function (bulletPoints) {
			if(!jQuery.isEmptyObject(bulletPoints)){
				for(var k in bulletPoints)	{
					this.addLine({keyCode : 13},bulletPoints[k])		
				}
			} else {
					this.addLine({keyCode : 13})
			}


		},

		noBulletPoint : function () {
			for( var i = 0, n = this.bulletPoint.childNodes.length; i < n; i++ ){
					this.bulletPoint.removeChild(this.bulletPoint.childNodes[0]);
				}
		},

		setColor : function (color) {
			this.el.children[1].style.color = color;
		},

	})
})