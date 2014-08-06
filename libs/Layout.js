Function.prototype.curry = function () {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	return function () {
		return self.apply([], args.concat(Array.prototype.slice.call(arguments)));
	};
}

var onimagesload = function (imgs,callback) {
	var l = imgs.length;
	var c = 0;
	for (var i = 0; i < l; i++){
		if(imgs[i].loaded) c++;
		else imgs[i].onload = function () {
			c++;
			if (c === l) callback();
		}
	}

	if (c === l) callback();
}	


var positions = {
	moods: [
	[120, 10, 225, 340],
	[356, 10, 230, 290],
	[598, 10, 230, 250],
	[840, 10, 230, 215],
	[120, 361, 224, 194],
	[356, 310, 230, 245],
	[598, 271, 230, 284],
	[840, 235, 230, 320],
	[120, 566, 118, 175],
	[250, 566, 137, 175],
	[399, 566, 135, 175],
	[546, 566, 150, 175],
	[708, 566, 362, 175]
	],

	stories: [
	[30, 120, 338, 295],
	[378, 120, 338, 295],
	[726, 120, 338, 295],
	[30, 425, 338, 295],
	[378, 425, 338, 295],
	[726, 425, 338, 295]
	],
}

sand.define('Layout',['Slide','Banner','Case','ressources/Selectbox'], function (r) {
	var Slide = r.Slide;
	var Banner = r.Banner;
	var Case = r.Case;
	var Selectbox = r.Selectbox;

	return Seed.extend({

		'+options': {
			imgSrcs: '',
			selectionIndex: null,
		},

		'+init': function (options) {
			this.cases = []
			this.type = options.type;
			this.positions = options.positions || null;
			this.slides = [];

			this.menu = new Selectbox({
				choices : [
				{ label : 'MOODS', id : 'moods' },
				{ label : 'STORIES', id : 'stories' }
				],
				change : function(choice) {
					this.fire('changeLayout',choice.id)
				}.bind(this),

			def : this.type // l'identifiant de la valeur par défaut
		})

			var icon = new Image();
			icon.src = "/damier.png";

			onimagesload([icon], function () {
				this.menu.trigger.appendChild(icon)
			}.bind(this));
			this.menu["select-box"].style.left = 10;
			this.menu["select-box"].style.zIndex = 1;
			this.menu.fake.className += " " + this.type;
			this.menu["trigger-picto"].parentNode.removeChild(this.menu["trigger-picto"]);
			this.menu["trigger-label"].parentNode.removeChild(this.menu["trigger-label"]);

			this.menu.up();
			this.menu.opened = false
			this.menu["select-box"].onclick = function(e) {
				e.preventDefault();
				if(!this.menu.opened) {
					this.menu.down();
					this.menu.opened = true;
				} else {
					this.menu.up();
					this.menu.opened = false;
				}
			}.bind(this);

			this.el = toDOM({
				tag: "div." + options.prefix + "-layout",
				style: {
					width: 1090,
					height: 760,
					position: "absolute"
				}
			})



			if (this.type === 'moods') {
				this.positions = positions.moods
				this.banner = new Banner({
					side: "left",
					prefix: options.prefix,
					logo : options.logo
				});
			} else if (this.type = 'stories') {
				this.positions = positions.stories;
				this.banner = new Banner({
					side: "up",
					prefix: options.prefix,
					logo : options.logo
				});
			}

			this.el.appendChild(this.banner.div);
			this.menu.el.style.left = -10;
			this.menu.el.style.top = 15;
			this.banner.band.appendChild(this.menu.el);
			this.slides.push(this);
			var imgIndex;
			var slidesIndex;


			for (var i = 0, n = this.positions.length; i < n; i++) {
				if (this.type === 'moods') {
					
					i < 5 ? slidesIndex = i+1 : slidesIndex = i;
					i < 5 ? imgIndex = i : imgIndex = i-1;
					var tempCase = new Case({
						width: this.positions[i][2],
						height: this.positions[i][3],
						type: i === 5 ? 'txt' : 'img',
						imgSrc: options.imgSrcs[imgIndex],
						prefix: options.prefix,
						pos : (options.positions && options.positions.moods && options.positions.moods[0]) ? options.positions.moods[0][i] : null
					})
					var tempSlide = new Slide({
						logo: options.logo,
						type: "moods",
						title: options.title || "",
						prefix: "berenger",
						width: 1100,
						height: 750,
						comment : options.comments[i]||"",
						box: {
							prefix: "berenger",
							width: 773,
							height: 591,
							imgSrc: options.imgSrcs[imgIndex],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions.moods && options.positions.moods[slidesIndex]) ? options.positions.moods[slidesIndex][0] : null
						}
					})
				} else if (this.type === 'stories') {
					i < 3 ? slidesIndex = i+1 : slidesIndex = i;
					i < 3 ? imgIndex = i : imgIndex = i-1;
					var tempCase = new Case({
						width: this.positions[i][2],
						height: this.positions[i][3],
						type: i === 3 ? 'txt' : 'img',
						imgSrc: options.imgSrcs[imgIndex],
						prefix: options.prefix,
						pos : (options.positions && options.positions.stories && options.positions.stories[0]) ? options.positions.stories[0][i] : null
					})
					var tempSlide = new Slide({
						logo: options.logo,
						type: "stories",
						title: options.title || "",
						prefix: "berenger",
						width: 1100,
						height: 750,
						bulletPoints : options.bulletPoints[i+1] || {},
						signatures : options.signatures[i+1],
						box: {
							prefix: "berenger",
							width: 637,
							height: 597,
							imgSrc: options.imgSrcs[imgIndex],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions.stories && options.positions.stories[slidesIndex]) ? options.positions.stories[slidesIndex][0] : null
						}
					})
				}

				tempSlide.hide();

				tempSlide.on('layout:changed', function (type) {
					this.fire('changeLayout',type);
				}.bind(this))


				for(var k = 0, l = tempSlide.cases.length; k < l; k++) {
					tempSlide.cases[k].on('imgMoved', function (k , i, x, y, width, height) {
						this.fire('anImgMoved', x, y, width, height, k, i);
					}.bind(this).curry(k,i+1))

					tempSlide.cases[k].on('case:over', function (k,i) {
						this.fire('layout:case:over',k,i);
					}.bind(this).curry(k,i+1))
				}

				var imgIndex;
				i >= 3 ? imgIndex = i : imgIndex = i
				
				tempSlide.on("bp:update", function (index,signature,bptext) {
					this.fire("bp:updated", index,signature,bptext);
				}.bind(this).curry(i+1))

				tempSlide.on('newLine' , function (index, signature , nbLines) {
					this.fire('lineAdded', index, signature, nbLines)
				}.bind(this).curry(i+1));
				//tempSlide.addLine({keyCode : 13});

				tempSlide.on("lineDestroyed" , function (index,signature) {
					this.fire('lineRemoved', index, signature)
				}.bind(this).curry(i+1));

				tempSlide.on('commentChanged', function (i,comment) {
					this.fire('changeComment',i,comment);
				}.bind(this).curry(i+1))

				tempSlide.on('changeSlidesTitle', function (title) {
					this.fire('changeTheTitleEverywhere', title);
					this.fire('getTitle', title);
				}.bind(this))

				if (tempCase.type = 'img') {
					this.slides.push(tempSlide);
				} 

				this.cases.push(tempCase);

				this.cases[i].selected = false;
				this.cases[i].div.style.left = this.positions[i][0];
				this.cases[i].div.style.top = this.positions[i][1];
				this.cases[i].div.addEventListener("mousedown", function (i) {
					this.fire('selection', i);
				}.bind(this).curry(i))
				this.cases[i].on('imgMoved', function (i, x, y, width, height) {
					this.fire('anImgMoved', x, y, width,height, i, 0);
				}.bind(this).curry(i))
				if ((this.type === "moods" && i === 5) || (this.type === "stories" && i === 3)) {
					tempCase.on('titleChanged', function (title) {
						this.fire('changeTheTitleEverywhere', title);
						this.fire('getTitle',title);
					}.bind(this))
				}
				this.el.appendChild(this.cases[i].div);
			}


			if(this.type === "moods"){
				this.slides.splice(5,1)
			} else if (this.type === "stories") {
				this.slides.splice(3,1)
			};

			this.curSlide = 0;

			document.body.addEventListener("keydown", function (e) { // EVENEMENT DU DEROULEMENT DES SLIDES
				if (e.keyCode === 37 && this.curSlide) {
					this.slides[this.curSlide].hide();
					this.curSlide--;
					this.slides[this.curSlide].show();
				} else if (e.keyCode === 39 && this.curSlide < this.slides.length - 1) {
					this.slides[this.curSlide].hide();
					this.curSlide++;
					this.slides[this.curSlide].show();
				}
			}.bind(this))

			this.on('changeTheTitleEverywhere', function (title) {
				if (this.type === 'moods') {
					this.slides[0].cases[5].txtBloc.children[0].children[0].children[0].innerHTML = title
				} else if (this.type === 'stories') {
					this.slides[0].cases[3].txtBloc.children[0].children[0].children[0].innerHTML = title
				}
				for (var i = 1, n = this.slides.length; i < n; i++) {
					this.slides[i].el.children[1].innerHTML = title;
				}
				this.title = title;
			}.bind(this))

			/*if (options.positions[this.type]) {
				for(var indiceSlides in options.positions[this.type]) {
					for (var indice in options.positions[this.type][indiceSlides]) {
						this.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.left = options.positions[this.type][indiceSlides][indice][0];
						this.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.top = options.positions[this.type][indiceSlides][indice][1];
						this.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.width = options.positions[this.type][indiceSlides][indice][2];
						this.slides[parseInt(indiceSlides)].cases[parseInt(indice)].img.style.height = options.positions[this.type][indiceSlides][indice][3];
					}
				}
			}*/

			this.on('selection', function (i) {
				if (this.selectionIndex || this.selectionIndex === 0) {
					this.cases[this.selectionIndex].div.className = options.prefix + "-case-idle";
					this.cases[this.selectionIndex].selected = false
				}

				this.cases[i].div.className = options.prefix + "-case-selected";
				this.cases[i].selected = true;
				this.selectionIndex = i;
			})

			this.elt = document.createElement('div');
			this.elt.appendChild(this.el)
			for(var i = 1, n = this.slides.length; i < n; i++) {
				this.elt.appendChild(this.slides[i].el);
			}

		}
	})
})