var Layouts = Seed.extend({

	'+init' : function (options) {
		this.options = options;
		this.toLayout();
		this.title;
		//this.position = {};
		//this.position[this.layout.type] = [];

		this.on('changedLayout', function (type) {
			this.title = this.layout.title
			console.log(this.title)
			this.toLayout(type);
			if(type === "stories"){
				this.layout.cases[3].div.innerHTML = this.title;
			} else if (type === "moods"){
				this.layout.cases[5].div.innerHTML = this.title;
			}
			this.layout.fire('changeTheTitleEverywhere',this.title);
		}.bind(this))

		
		
		this.layout.menu.onchange = function () {
			this.fire('changedLayout',this.layout.menu.value);
		}.bind(this);
	},

	toLayout : function (type) {
		if(this.layout){
			this.options.type = type;
			var daddy = this.layout.elt.parentNode;
			daddy.removeChild(this.layout.elt);
			this.layout = this.create(Layout,this.options);
			daddy.appendChild(this.layout.elt);
		}else{
			this.layout = new Layout(this.options);
		}

		this.layout.on('anImgMoved', function (x,y,z,i) {
			var indice = i.toString();
			if(this.options[this.layout.type] || this.options[this.layout.type] === {}){
				this.options[this.layout.type][i] = [x,y,z];
			}else{
				this.options[this.layout.type] = {};
			}
		}.bind(this))
	},

	saveImgPositions : function () {
		for(var i = 0, n = this.layout.cases.length ; i < n; i++){
			this.position[this.layout.type].push([this.layout.cases[i].img.style.left , this.layout.cases[i].img.style.top])
		}
	},

	loadImgPositions : function () {
		if(this.position[this.layout.type] || this.position[this.layout.type] === []){
			for(var i = 0, n = this.layout.cases.length; i < n; i++){			
				this.layout.cases[i].img.style.left = this.position[this.layout.type][i][0]
				this.layout.cases[i].img.style.top = this.position[this.layout.type][i][1]
			}
		}else{
			this.position[this.layout.type] = [];
		}
	}


})