sand.define('Layouts',['Layout','Geo/*'], function (r) {
	var Layout = r.Layout;
	return Seed.extend({

		'+init' : function (data) {
			this.data = jQuery.extend({},data);
			this.data.comments = this.data.comments || {};
			this.data.positions = this.data.positions || {};
			this.data.bulletPoints = this.data.bulletPoints || {};
			this.data.signatures = this.data.signatures || {1: ["","","",""], 2:["","","",""], 4:["","","",""], 5:["","","",""], 6:["","","",""]};

			this.toLayout();
			this.title;

			this.on('changedLayout', function (type) {
				this.title = this.layout.title
				this.toLayout(type);
				if(type === "stories") {
					this.layout.cases[3].txtBloc.children[0].children[0].children[0].innerHTML = this.title;
				} else if (type === "moods") {
					this.layout.cases[5].txtBloc.children[0].children[0].children[0].innerHTML = this.title;
					for(var i = 1, n = this.layout.slides.length; i < n; i++) {
						this.layout.slides[i].bloc.children[1].innerHTML = this.data.comments[i]||null;
					}
				}
				this.layout.fire('changeTheTitleEverywhere',this.title||"");
			}.bind(this))


			this.layout.menu.onchange = function () {
				this.fire('changedLayout',this.layout.menu.value);
			}.bind(this);

		},

		toLayout : function (type) {
			if(this.layout){
				this.data.type = type;
				var daddy = this.layout.elt.parentNode;
				daddy.removeChild(this.layout.elt);
				this.layout = this.create(Layout,this.data);
				daddy.appendChild(this.layout.elt);
			}else {
				this.layout = this.create(Layout,this.data);
			}

			for (var indice in this.data.comments) {
				if(indice != 0 && this.data.type === "moods") {
					this.layout.slides[indice].bloc.children[1].innerHTML = this.data.comments[indice]||null;
				}
			}
		//this.data.bulletPoints[index][signature] = bptext
		this.layout.on("bp:updated", function (index,signature,bptext) {
			this.fire("BulletPoint", index,signature,bptext);
			if(this.data.bulletPoints[index] || this.data.bulletPoints[index] === {}){
				if(this.data.bulletPoints[index][signature] || this.data.bulletPoints[index][signature] === "") {
					this.data.bulletPoints[index][signature] = bptext
				} else {
					this.data.bulletPoints[index][signature] = "";
				}
			} else {
				this.data.bulletPoints[index] = {};
			}
		}.bind(this))

		this.layout.on("lineAdded", function (index, signature,nbLignes) {
			this.data.signatures[index][nbLignes-1] = signature;
		}.bind(this))

		if(this.layout.type === "stories") {
			for(var i = 1, n = this.layout.slides.length; i < n; i++){
				var ind = i >= 3 ? i+1 : i;
				this.layout.slides[i].addLine({keyCode : 13})
				for(var k = 1, m = this.data.signatures[ind].length; k < m; k++){
					if(this.data.signatures[ind][k]) this.layout.slides[i].addLine({keyCode : 13});
				}
			}
		}

		this.layout.on("lineRemoved", function (index, signature) {
			var deleteIndex = this.data.signatures[index].indexOf(signature);
			if (deleteIndex > -1){
				this.data.signatures[index].splice(deleteIndex,1);
				this.data.signatures[index].push("");
				delete this.data.bulletPoints[index][signature];
			}
		}.bind(this))

		this.layout.on('changeLayout', function (type) {
			this.fire('changedLayout',type)
		}.bind(this));

		this.layout.on('changeComment', function (i , comment) {
			var ind = i >= 5 ? i-1 : i;
			this.data.comments[ind] = comment;
			this.fire('comment:change', ind , comment);
		}.bind(this))

		this.layout.on('getTitle', function (title) {
			this.fire("newTitle",title);
		}.bind(this))

		this.layout.on('anImgMoved', function (x , y , width, height , i , k) {
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
			this.fire('image:moved',[x,y,width,height],key,i);
		}.bind(this))

		this.fire('newLayout');

		this.caseRectArray = [];
		this.draggedDiv;

		for(var i = 0, n = this.layout.slides[0].cases.length ; i < n; i++){
			var currentCase = this.layout.slides[0].cases[i]
			var currentCaseRect = new r.Geo.Rect({ 
				segX : new r.Geo.Seg( parseInt(currentCase.div.style.left), parseInt(currentCase.div.style.left) + parseInt(currentCase.div.style.width) ), 
				segY : new r.Geo.Seg(parseInt(currentCase.div.style.top), parseInt(currentCase.div.style.top) + parseInt(currentCase.div.style.height) ), 
			});
			this.caseRectArray.push(currentCaseRect);
		}

		this.layout.slides[0].el.addEventListener('mousemove', function (e) {
			this.cursorPosition = [e.clientX -this.layout.slides[0].el.offsetLeft,e.clientY - this.layout.slides[0].el.offsetTop].add([document.body.scrollLeft, document.body.scrollTop]);
			if(this.draggedDiv) {
				if( this.cursorPosition[0] > 0 && this.cursorPosition[0] < (parseInt(this.layout.slides[0].el.style.width) -15) && 0 < this.cursorPosition[1] && (parseInt(this.layout.slides[0].el.style.height) - 15) > this.cursorPosition[1]){
					this.draggedDiv.style.left = this.cursorPosition[0];
					this.draggedDiv.style.top = this.cursorPosition[1];
				} else {
					this.fire('layouts:draggableImageOut',this.draggedDiv.childNodes[0].src, this.dragIndex, this.cursorPosition[0], this.cursorPosition[1])
					this.layout.slides[0].el.removeChild(this.draggedDiv);
					this.draggedDiv = null;
					this.dragIndex = null;
				}
			}
		}.bind(this))

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

		this.layout.slides[0].el.addEventListener('mouseup', function (e) {
			if(this.draggedDiv){
				var oldSrc = this.layout.slides[0].cases[this.dragIndex].img.src;
				var dropResult = this.handleDrop(this.cursorPosition,oldSrc);
				if (dropResult) {
					this.layout.slides[0].cases[this.dragIndex].img.src = dropResult[1];
					this.layout.slides[0].cases[this.dragIndex].loadCase();	
				}
				this.layout.slides[0].el.removeChild(this.draggedDiv);
				this.draggedDiv = null;
				this.dragIndex = null;
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
	}
})
})