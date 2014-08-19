sand.define('Layouts',['Layout','Geo/*'], function (r) {
	var Layout = r.Layout;
	return Seed.extend({

		'+init' : function (data) {
			this.data = jQuery.extend({},data);
			this.data.comments = this.data.comments || {};
			this.data.positions = this.data.positions || {};
			this.data.bulletPoints = this.data.bulletPoints || {};



			this.toLayout(this.data.type);
			this.title;

		},

		toLayout : function (type) {
			
			this.data.type = type;

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
					if(indice != 0 && this.data.slidesType[this.layout.typeIndex] === "comment") {
						this.layout.slides[indice].bloc.children[1].innerHTML = this.data.comments[indice]||null;
					}
				}


				/*SET BULLET POINTS*/
				if(this.data.slidesType[this.layout.typeIndex] === "bulletPoints") {
					for(var i = 1, n = this.layout.slides.length; i < n; i++){
						this.layout.slides[i].load(this.data.bulletPoints,i);
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
					if(this.data.bulletPoints[slideIndex] || this.data.bulletPoints[slideIndex] === {}){
						this.data.bulletPoints[slideIndex][index] = text;
					} else {
						this.data.bulletPoints[slideIndex] = {};
					}
					this.fire("layouts:layout:slide:changedBP");
				}.bind(this))

				/*UPDATE DATA ABOUT COMMENTS*/
				this.layout.on('layout:slide:changedComment', function (i , comment) {
					var ind = i >= 5 ? i-1 : i;
					this.data.comments[ind] = comment;
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
				this.layout.slides[0].el.addEventListener('mousemove', function (e) {
					this.cursorPosition = [e.clientX -this.layout.slides[0].el.offsetLeft,e.clientY - this.layout.slides[0].el.offsetTop].add([document.body.scrollLeft, document.body.scrollTop]);
					if(this.draggedDiv) {
						if( this.cursorPosition[0] > 0 && this.cursorPosition[0] < (parseInt(this.layout.slides[0].el.style.width) -15) && 0 < this.cursorPosition[1] && (parseInt(this.layout.slides[0].el.style.height) - 15) > this.cursorPosition[1]){
							this.draggedDiv.style.left = this.cursorPosition[0];
							this.draggedDiv.style.top = this.cursorPosition[1];
						} else {
							this.fire('layouts:draggableImageOut',this.draggedDiv.childNodes[0].src, this.dragIndex, this.cursorPosition[0], this.cursorPosition[1])
						}
					}
				}.bind(this))

				/*SHIFT+CLICK DETECTION -> D&D START*/
				this.layout.slides[0].el.addEventListener('mousedown', function (e) {
					if(e.shiftKey){
						for(var i = 0, n = this.caseRectArray.length ; i < n; i++){
							if( this.caseRectArray[i].contains(this.cursorPosition) ){
								this.draggedDiv =  this.layout.slides[0].cases[i].div.cloneNode(true);
								this.draggedDiv.style.left = this.cursorPosition[0];
								this.draggedDiv.style.top = this.cursorPosition[1];
								this.layout.slides[0].el.appendChild(this.draggedDiv);
								this.dragIndex = i;
							}
						}
					}
				}.bind(this))

				/*D&D END*/
				this.layout.slides[0].el.addEventListener('mouseup', function (e) {
					if(this.draggedDiv){
						var oldSrc = this.layout.slides[0].cases[this.dragIndex].img.src;
						var dropResult = this.handleDrop(this.cursorPosition,oldSrc);
						if (dropResult) {
							this.layout.slides[0].cases[this.dragIndex].img.src = dropResult[1];
							this.layout.slides[0].cases[this.dragIndex].loadCase();
							this.layout.fire('layout:dragSuccessful',dropResult[1], dropResult[0], oldSrc, this.dragIndex, this.cursorPosition[0], this.cursorPosition[1])	
						}
						this.layout.slides[0].el.removeChild(this.draggedDiv);
						this.draggedDiv = null;
						this.dragIndex = null;
					}
				}.bind(this))

				/*TRIGGER ON D&D SUCCESS*/
				this.layout.on('layout:dragSuccessful', function (newSrc,newIndex,oldSrc,oldIndex) { //& Mauvaise indexation, code à simplifier (travailler directement sur le imgSrc
					
					this.layout.fire('layouts:slidesExchanged',newSrc,newIndex,oldSrc,oldIndex , this.data.type);
					(newIndex < this.data.titleIndex[this.layout.typeIndex]) ? newIndex: newIndex--;
					(oldIndex < this.data.titleIndex[this.layout.typeIndex]) ? oldIndex : oldIndex--;
					this.data.imgSrcs[newIndex] = oldSrc;
					this.data.imgSrcs[oldIndex] = newSrc;
				}.bind(this))


				/*UPDATING SLIDES AFTER A D&D*/
				this.layout.on('layouts:slidesExchanged', function (newSrc,newIndex,oldSrc,oldIndex,type) {
					for( var iter = 0, n = this.data.id.length; iter < n; iter++) {
						var nIndex = newIndex;
						var oIndex = oldIndex;
						
						nIndex < this.data.titleIndex[iter] ? nIndex++ : nIndex;// index € [0,1,2,4,5]
						oIndex < this.data.titleIndex[iter] ? oIndex++ : oIndex;

						if(this.data.slidesType[iter] === "bulletPoints") {

						//now index € [1,2,3,4,5]
						var oldBuffer = jQuery.extend({},this.data.bulletPoints[oIndex]);
						var newBuffer = jQuery.extend({},this.data.bulletPoints[nIndex]);
						
						this.data.bulletPoints[oIndex] = newBuffer;
						this.data.bulletPoints[nIndex] = oldBuffer;

						if(this.data.slidesType[this.layout.typeIndex] === "bulletPoints"){
							this.layout.slides[nIndex].noBulletPoint();
							this.layout.slides[oIndex].noBulletPoint();

							this.layout.slides[nIndex].load(this.data.bulletPoints,nIndex);
							this.layout.slides[oIndex].load(this.data.bulletPoints,oIndex);
						}
					} else if (this.data.slidesType[iter] === "comment") {
						 //UPDATE MOODS COMMENTS

						 var oldBuffer = this.data.comments[oIndex];

						 this.data.comments[oIndex] = this.data.comments[nIndex];
						 this.data.comments[nIndex] = oldBuffer;

						 if(this.data.slidesType[this.layout.typeIndex] === "comment") { 
						 	this.layout.slides[nIndex].bloc.children[1].innerHTML = this.data.comments[nIndex] ? this.data.comments[nIndex] : "";
						 	this.layout.slides[oIndex].bloc.children[1].innerHTML = this.data.comments[oIndex] ? this.data.comments[oIndex] : "";
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
			}
		})
})