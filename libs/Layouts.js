sand.define('Layouts',['Layout'], function (r) {
	var Layout = r.Layout;
	return Seed.extend({

		'+init' : function (options) {
			this.options = options;
			this.options.comments = {};
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
					this.layout.slides[i].bloc.children[1].innerHTML = this.options.comments[i]||null;
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
			this.options.type = type;
			var daddy = this.layout.elt.parentNode;
			daddy.removeChild(this.layout.elt);
			this.layout = this.create(Layout,this.options);
			daddy.appendChild(this.layout.elt);
		}else {
			this.layout = this.create(Layout,this.options);
		}

		for (var indice in this.options.comments) {
			if(indice != 0 && this.options.type === "moods") {
				this.layout.slides[indice].bloc.children[1].innerHTML = this.options.comments[indice]||null;
			}
		}
		this.layout.on('changeLayout', function (type) {
			this.fire('changedLayout',type)
		}.bind(this));

		this.layout.on('changeComment', function (i , comment) {
			this.options.comments[i] = comment;
		}.bind(this))

		this.layout.on('anImgMoved', function (x , y , z , i , k) {
			if(this.options[this.layout.type] || this.options[this.layout.type] === {}) {
				if(this.options[this.layout.type][k] || this.options[this.layout.type][k] === {}) {
					this.options[this.layout.type][k][i] = [x,y,z];
				}else {
					this.options[this.layout.type][k] = {};
				}
			}else {
				this.options[this.layout.type] = {};
			}
		}.bind(this))
	},
})
})