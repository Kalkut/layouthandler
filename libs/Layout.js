Function.prototype.curry = function () {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	return function () { return self.apply([],args.concat(Array.prototype.slice.call(arguments)));};
}


var positions = {
	moods : [
			[120,10,225,340],[356,10,230,290],[598,10,230,250],
			[840,10,230,215],[120,361,224,194],[356,310,230,245],
			[598,271,230,284],[840,235,230,320],[120,566,118,175],
			[250,566,137,175],[399,566,135,175],[546,566,150,175],
			[708,566,362,175]
			],
	
	stories :[[30,120,338,295],[378,120,338,295],[726,120,338,295],[30,425,338,295],[378,425,338,295],[726,425,338,295]],
}


var Layout = Seed.extend({
	/*tpl : function() {
	return {
		tag : '.' + options.prefix + '-layout'
		style : 'position:absolute;width:1080;'
	}
},*/

	'+options' : {
		imgSrcs : '',
		selectionIndex : null,
		menu : toDOM({
			tag : 'select',
			children : [
			{
				tag : 'option',
				attr : {
					value : "moods",
				},
				innerHTML : "Moods"
			},
			{
				tag : 'option',
				attr : {
					value :"stories"
				},
				innerHTML : "Stories"
			}
			]
		})
	},

	'+init' : function (options) {
		this.cases = []
		this.type = options.type;
		this.positions = options.positions || null;
		
		this.div = toDOM({
			tag : "div." + options.prefix + "-layout",
			style : {
				width : 1090,
				height : 760,
				position : "absolute"
			}
		})
		
		
		if(this.type === 'moods') {
			this.positions = positions.moods
			this.banner = new Banner({side : "left", prefix : options.prefix, imgButton : '/white.png'});
		}
		else if (this.type = 'stories') {
			this.positions = positions.stories;
			this.banner = new Banner({side : "up", prefix : options.prefix, imgButton : '/white.png'});
		}
		
		this.div.appendChild(this.banner.div);
		this.banner.div.appendChild(this.menu)

		

		for( var i = 0, n = this.positions.length; i < n; i++){
			var tempCase = new Case({ width : this.positions[i][2], height : this.positions[i][3], type : 'img', imgSrc : options.imgSrcs[i], prefix : options.prefix})
			this.cases.push(tempCase);
			this.cases[i].selected = false;
			this.cases[i].div.style.left =  this.positions[i][0];
			this.cases[i].div.style.top = this.positions[i][1];
			this.cases[i].div.addEventListener("mousedown", function (i) {
				this.fire('selection',i);
			}.bind(this).curry(i))
			this.cases[i].on('imgMoved', function (i,x,y,z) {
				this.fire('anImgMoved',x,y,z,i);
			}.bind(this).curry(i))
			this.div.appendChild(this.cases[i].div);
		}

		if(options[this.type]){
			for(var indice in options[this.type]){
				console.log(parseInt(indice));
				this.cases[parseInt(indice)].img.style.left = options[this.type][indice][0];
				this.cases[parseInt(indice)].img.style.top = options[this.type][indice][1]
			}
		}

		this.on('selection', function (i) {
			if(this.selectionIndex || this.selectionIndex === 0) {
				this.cases[this.selectionIndex].div.className = options.prefix + "-case-idle";
				this.cases[this.selectionIndex].selected = false
			}

			this.cases[i].div.className = options.prefix + "-case-selected";
			this.cases[i].selected = true;
			this.selectionIndex = i;
		})


	}
})