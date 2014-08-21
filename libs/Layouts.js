sand.define('Layouts',['Layout','Geo/*', 'Seed', 'DOM/toDOM'], function (r) {
	var Layout = r.Layout;
	var Seed = r.Seed;
	var toDOM = r.toDOM;
	return Seed.extend({

		'+init' : function (data) {
			this.data = jQuery.extend({},data);
			this.data.comments = this.data.comments || {};
			this.data.positions = this.data.positions || {};
			this.data.bulletPoints = this.data.bulletPoints || {};

			this.toLayout(this.data.defaultLayout);
			this.title;

		},

		toLayout : function (type) {
			
			this.data.defaultLayout = type;

			if(this.layout){
				var daddy = this.layout.elt.parentNode;
				daddy.removeChild(this.layout.elt);
				this.layout = this.create(Layout,this.data);
				daddy.appendChild(this.layout.elt);
			} else {

				this.layout = this.create(Layout,this.data);
			}

			this.layout.on('layout:indexOfCurrentTypeFound', function (typeIndex) {
				this.typeIndex = typeIndex;
			})

				for (var indice in this.data.comments) {
					if(indice != 0 && this.data.layouts[this.layout.layoutIndex].slides === "comment") {
						this.layout.slides[indice].bloc.children[1].innerHTML = this.data.comments[indice]||null;
					}
				}


				/*SET BULLET POINTS*/
				if(this.data.layouts[this.layout.layoutIndex].slides === "bulletPoints") {
					for(var i = 1, n = this.layout.slides.length; i < n; i++){
						this.layout.slides[i].load(this.data.slides[i-1].bulletPoints);
					}
				}


				/*GET THE TITLE*/
				this.layout.on('layout:getTitle', function (title) {
					this.title = title
				}.bind(this))

				/*SET TITLE EVERYWHERE ON THE NEW LAYOUT*/
				this.on('layouts:layout:slide:changedLayout', function (type) {
					this.toLayout(type);
					this.layout.fire('layout:updateTitle',this.title || "");
					this.layout.fire('layouts:titleUpdated',this.title||"");
				}.bind(this))

				/*UPDATE DATA ABOUT BULLETPOINTS*/
				this.layout.on("layout:slide:changedBP", function (slideIndex,text,index) {
					if(this.data.slides[slideIndex-1].bulletPoints || this.data.slides[slideIndex-1].bulletPoints === {}){
						this.data.slides[slideIndex-1].bulletPoints[index] = text;
					} else {
						this.data.slides[slideIndex-1].bulletPoints = {};
					}
					this.fire("layouts:layout:slide:changedBP");
				}.bind(this))

				/*UPDATE DATA ABOUT COMMENTS*/
				this.layout.on('layout:slide:changedComment', function (i , comment) {
					var ind = i >= 5 ? i-2 : i-1;
					this.data.slides[ind].comment = comment;
					this.fire('layouts:layout:slide:changedComment', ind , comment);
				}.bind(this))

				/*UPDATE DATA ABOUT IMAGES ( POSITION AND SIZE ) */
				this.layout.on('layout:case:imageMovedPx', function (x , y , width, height , i , k) {

					if(this.data.positions[this.layout.type] || this.data.positions[this.layout.type] === {}) {
						if(this.data.positions[this.layout.type][k] || this.data.positions[this.layout.type][k] === {}) {
							this.data.positions[this.layout.type][k][i] = [x,y, width, height];
						}else {
							this.data.positions[this.layout.type][k] = {};
						}
					}else {
						this.data.positions[this.layout.type] = {};
					}
					this.fire('layouts:layout:case:imageMovedPx',[x,y,width,height],k,i);
				}.bind(this))

				/*TRIGGER ON LINE ADDITION*/
				this.layout.on("layout:slide:lineAdded", function () {
					this.fire("layouts:slide:lineAdded");
				}.bind(this))
				
				/*TRIGGER ON LINE DELETION*/
				this.layout.on("layout:slide:lineRemoved", function () {
					this.fire("layouts:layout:slide:lineRemoved");
				}.bind(this))

				/*TRIGGER ON LAYOUT CHANGE*/
				this.layout.on('layout:slide:changedLayout', function (type) {
					this.fire('layouts:layout:slide:changedLayout',type)
				}.bind(this));

				this.caseRectArray = []; //Array of the geometrical representations of the Cases on the cover

				/*Setting caseRectArray*/
				for(var i = 0, n = this.layout.slides[0].cases.length ; i < n; i++){
					var currentCase = this.layout.slides[0].cases[i]
					var currentCaseRect = new r.Geo.Rect({ 
						segX : new r.Geo.Seg( parseInt(currentCase.div.style.left), parseInt(currentCase.div.style.left) + parseInt(currentCase.div.style.width) ), 
						segY : new r.Geo.Seg(parseInt(currentCase.div.style.top), parseInt(currentCase.div.style.top) + parseInt(currentCase.div.style.height) ), 
					});
					this.caseRectArray.push(currentCaseRect);
				}

				this.draggedDiv; // D&Droppable thumbnail (clone of the html structure of a Case)

				/*D&D MOVEMENT*/
				document.body.addEventListener('mousemove', function (e) {
					this.cursorPosition = [e.pageX - $(this.layout.slides[0].el).offset().left, e.pageY - $(this.layout.slides[0].el).offset().top];
					if(this.draggedDiv) {
						this.draggedDiv.style.left = this.cursorPosition[0] + 'px';
						this.draggedDiv.style.top = this.cursorPosition[1] + 'px';
						if( !(this.cursorPosition[0] > 0 && this.cursorPosition[0] < (parseInt(this.layout.slides[0].el.style.width) -15) && 0 < this.cursorPosition[1] && (parseInt(this.layout.slides[0].el.style.height) - 15) > this.cursorPosition[1])){
							this.fire('layouts:draggableImageOut',this.draggedDiv.childNodes[0].src, this.dragIndex, this.cursorPosition[0], this.cursorPosition[1])
						}
					}
				}.bind(this))

				/*SHIFT+CLICK DETECTION -> D&D START*/
				this.layout.slides[0].el.addEventListener('mousedown', function (e) {
					if(e.shiftKey){
						for(var i = 0, n = this.caseRectArray.length ; i < n; i++){
							if( this.caseRectArray[i].contains(this.cursorPosition) ){
								this.layout.slides[0].cases[i].freeze();
								this.draggedDiv =  this.layout.slides[0].cases[i].div.cloneNode(true);
								this.draggedDiv.style.left = this.cursorPosition[0] + 'px';
								this.draggedDiv.style.top = this.cursorPosition[1] + 'px';
								this.layout.slides[0].el.appendChild(this.draggedDiv);
								this.dragIndex = i;
							}
						}
					}
				}.bind(this))

				/*D&D END*/
				document.body.addEventListener('mouseup', function (e) {
					if(this.draggedDiv){
						var oldSrc = this.layout.slides[0].cases[this.dragIndex].img.src;
						var dropResult = this.handleDrop(this.cursorPosition,oldSrc);
						if (dropResult) {
							this.layout.slides[0].cases[this.dragIndex].img.src = dropResult[1];
							this.layout.slides[0].cases[this.dragIndex].loadCase();
							this.layout.fire('layout:dragSuccessful',dropResult[1], dropResult[0], oldSrc, this.dragIndex, this.cursorPosition[0], this.cursorPosition[1])
						}
						this.layout.slides[0].el.removeChild(this.draggedDiv);
						this.layout.slides[0].cases[this.dragIndex].unfreeze();
						this.draggedDiv = null;
						this.dragIndex = null;
					}
				}.bind(this))

				/*TRIGGER ON D&D SUCCESS*/
				this.layout.on('layout:dragSuccessful', function (newSrc,newIndex,oldSrc,oldIndex) { //& Mauvaise indexation, code à simplifier (travailler directement sur le imgSrc
					
					this.layout.fire('layouts:slidesExchanged',newSrc,newIndex,oldSrc,oldIndex , this.data.defaultLayout);
					(newIndex < this.data.layouts[this.layout.layoutIndex].titleIndex) ? newIndex : newIndex--;
					(oldIndex < this.data.layouts[this.layout.layoutIndex].titleIndex) ? oldIndex : oldIndex--;
					this.data.slides[newIndex].img = oldSrc;
					this.data.slides[oldIndex].img = newSrc;
				}.bind(this))


				/*UPDATING SLIDES AFTER A D&D*/
				this.layout.on('layouts:slidesExchanged', function (newSrc,newIndex,oldSrc,oldIndex,type) {
					for( var iter = 0, n = this.data.layouts.length; iter < n; iter++) {
						var nIndex = newIndex;
						var oIndex = oldIndex;
						
						nIndex < this.data.layouts[iter].titleIndex ? nIndex++ : nIndex;// index € [0,1,2,4,5]
						oIndex < this.data.layouts[iter].titleIndex ? oIndex++ : oIndex;

						if(this.data.layouts[iter].slides === "bulletPoints") {

						//now index € [1,2,3,4,5]
						var oldBuffer = jQuery.extend({},this.data.slides[oIndex-1].bulletPoints);
						var newBuffer = jQuery.extend({},this.data.slides[nIndex-1].bulletPoints);
						
						this.data.slides[oIndex-1].bulletPoints = newBuffer;
						this.data.slides[nIndex-1].bulletPoints = oldBuffer;

						if(this.data.layouts[this.layout.layoutIndex].slides === "bulletPoints"){
							this.layout.slides[nIndex].noBulletPoint();
							this.layout.slides[oIndex].noBulletPoint();

							this.layout.slides[nIndex].load(this.data.slides[nIndex-1].bulletPoints);
							this.layout.slides[oIndex].load(this.data.slides[oIndex-1].bulletPoints);
						}
					} else if (this.data.layouts[iter].slides === "comment") {
						 //UPDATE MOODS COMMENTS

						 var oldBuffer = this.data.slides[oIndex-1].comment;

						 this.data.slides[oIndex-1].comment = this.data.slides[nIndex-1].comment;
						 this.data.slides[nIndex-1].comment = oldBuffer;

						 if(this.data.layouts[this.layout.layoutIndex].slides === "comment") { 
						 	this.layout.slides[nIndex].bloc.children[1].innerHTML = this.data.slides[nIndex-1].comment ? this.data.slides[nIndex-1].comment : "";
						 	this.layout.slides[oIndex].bloc.children[1].innerHTML = this.data.slides[oIndex-1].comment ? this.data.slides[oIndex-1].comment : "";
						 }
						}
					}
					

					this.layout.slides[nIndex].cases[0].img.src = oldSrc;
					this.layout.slides[oIndex].cases[0].img.src = newSrc;

					this.layout.slides[nIndex].cases[0].loadCase();
					this.layout.slides[oIndex].cases[0].loadCase();
				}.bind(this));

				this.el = this.layout.elt;
				this.fire('layouts:layoutCreated'); //create successful

				document.body.addEventListener("keydown", function (e) { // event to naviguate through slides
				if (e.keyCode === 37) {//LEFT ARROW
					this.previous();
				} else if (e.keyCode === 39) {//RIGHT ARROW
					this.next();
				}
			}.bind(this))


			},

			handleDrop : function (pos,src) {
				for(var i = 0, n = this.caseRectArray.length ; i < n; i++){
					if( this.caseRectArray[i].contains(pos) ){
						var oldSrc = this.layout.slides[0].cases[i].img.src;
						this.layout.slides[0].cases[i].img.src = src;
						this.layout.slides[0].cases[i].loadCase();
						return [i,oldSrc];
					}
				}
				return false;
			},

			setColor : function (color) {
				this.data.color = color;
				this.layout.banner.fire("banner:newColor",color);
				for(var i = 0, n = this.layout.slides.length; i < n; i++) {
					this.layout.slides[i].fire("slide:newColor",color);
				}
			},

			next : function () {
				this.layout.fire("layout:nextSlide");
			},

			previous : function () {
				this.layout.fire("layout:previousSlide")
			}
			
		})
});