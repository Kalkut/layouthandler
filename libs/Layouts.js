sand.define('Layouts',['Layout'], function (r) {
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

			this.on('newLayout', function () {	
				if (this.data.positions[this.layout.type]) {
					for(var indiceSlides in this.data.positions[this.layout.type]) {
						for (var indice in this.data.positions[this.layout.type][indiceSlides]) {
							this.layout.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.width = parseInt(this.data.positions[this.layout.type][indiceSlides][indice][2]);
							this.layout.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.height = parseInt(this.data.positions[this.layout.type][indiceSlides][indice][3]);
							this.layout.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.left = this.data.positions[this.layout.type][indiceSlides][indice][0];
							this.layout.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.top = this.data.positions[this.layout.type][indiceSlides][indice][1];
							console.log(indiceSlides,indice);
						}
					}
				}
			}.bind(this))

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
	},
})
})