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

			/*SET COMMENTS (Could have been done in Slide Class*/
				for (var indice in this.data.comments) {
					if(indice != 0 && this.data.type === "moods") {
						this.layout.slides[indice].bloc.children[1].innerHTML = this.data.comments[indice]||null;
					}
				}

				/*SET BULLET POINTS*/
				if(this.layout.type === "stories") {
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
					if(this.layout.type === "moods") var key = k >= 5 ? k-1 : k;
					else if(this.layout.type === "stories") var key = k >= 3 ? k-1 : k;

					if(this.data.positions[this.layout.type] || this.data.positions[this.layout.type] === {}) {
						if(this.data.positions[this.layout.type][key] || this.data.positions[this.layout.type][key] === {}) {
							this.data.positions[this.layout.type][key][i] = [x,y, width, height];
						}else {
							this.data.positions[this.layout.type][key] = {};
						}
					}else {
						this.data.positions[this.layout.type] = {};
					}
					this.fire('layouts:layout:case:imageMovedPx',[x,y,width,height],key,i);
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
				this.layout.on('layout:dragSuccessful', function (newSrc,newIndex,oldSrc,oldIndex) { // Mauvaise indexation, code à simplifier (travailler directement sur le imgSrc
					this.layout.fire('layouts:slidesExchanged',newSrc,newIndex,oldSrc,oldIndex , this.data.type);
					if(this.data.type === "moods"){
						(newIndex < 5) ? newIndex: newIndex--;
						(oldIndex < 5) ? oldIndex : oldIndex--;
					} else if(this.data.type === "stories"){
						(newIndex < 3) ? newIndex : newIndex--;
						(oldIndex < 3) ? oldIndex : oldIndex--;
					}
					this.data.imgSrcs[newIndex] = oldSrc;
					this.data.imgSrcs[oldIndex] = newSrc;
				}.bind(this))

				/*UPDATING SLIDES AFTER A D&D*/
				this.layout.on('layouts:slidesExchanged', function (newSrc,newIndex,oldSrc,oldIndex,type) {
					if(type === "moods") {

						/*UPDATE STORIES BULLETPOINTS*/
						var newStoriesIndex = newIndex;
						var oldStoriesIndex = oldIndex;

						newStoriesIndex < 3 ? newStoriesIndex++ : newStoriesIndex;// index € [0,1,2,4,5]
						oldStoriesIndex < 3 ? oldStoriesIndex++ : oldStoriesIndex;
						//now index € [1,2,3,4,5]
						
						var oldStoriesBuffer = jQuery.extend({},this.data.bulletPoints[oldStoriesIndex]);
						var newStoriesBuffer = jQuery.extend({},this.data.bulletPoints[newStoriesIndex]);
						
						this.data.bulletPoints[oldStoriesIndex] = newStoriesBuffer;
						this.data.bulletPoints[newStoriesIndex] = oldStoriesBuffer;

						/* UPDATE MOODS COMMENTS*/
						newIndex < 5 ? newIndex++ : newIndex;
						oldIndex < 5 ? oldIndex++ : oldIndex;

						var oldBuffer = this.data.comments[oldIndex];
						this.data.comments[oldIndex] = this.data.comments[newIndex];
						this.data.comments[newIndex] = oldBuffer;
						
						this.layout.slides[oldIndex].bloc.children[1].innerHTML = this.data.comments[oldIndex] ? this.data.comments[oldIndex] : "";
						this.layout.slides[newIndex].bloc.children[1].innerHTML = this.data.comments[newIndex] ? this.data.comments[newIndex] : "";

					}
					else if(type === "stories") {

						/* UPDATE MOODS COMMENTS*/
						var newMoodsIndex = newIndex;
						var oldMoodsIndex = oldIndex;

						newMoodsIndex < 5 ? newMoodsIndex++ : newMoodsIndex;
						oldMoodsIndex < 5 ? oldMoodsIndex++ : oldMoodsIndex;

						var oldMoodsBuffer = this.data.comments[oldMoodsIndex];
						this.data.comments[oldMoodsIndex] = this.data.comments[newMoodsIndex];
						this.data.comments[newMoodsIndex] = oldMoodsBuffer; 

						/*UPDATE STRORIES BULLETPOINTS*/
						newIndex < 3 ? newIndex++ : newIndex;// index € [0,1,2,4,5]
						oldIndex < 3 ? oldIndex++ : oldIndex;
						//now index € [1,2,3,4,5]
						
						var oldBuffer = jQuery.extend({},this.data.bulletPoints[oldIndex]);
						var newBuffer = jQuery.extend({},this.data.bulletPoints[newIndex]);
						
						this.data.bulletPoints[oldIndex] = newBuffer;
						this.data.bulletPoints[newIndex] = oldBuffer;

						this.layout.slides[oldIndex].noBulletPoint();
						this.layout.slides[newIndex].noBulletPoint();

						this.layout.slides[oldIndex].load(this.data.bulletPoints,oldIndex);
						this.layout.slides[newIndex].load(this.data.bulletPoints,newIndex);
					}

					/*UPDATING IMAGES*/
					this.layout.slides[newIndex].cases[0].img.src = oldSrc;
					this.layout.slides[oldIndex].cases[0].img.src = newSrc;

					this.layout.slides[newIndex].cases[0].loadCase();
					this.layout.slides[oldIndex].cases[0].loadCase();

				}.bind(this))

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