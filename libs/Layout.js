sand.define('Layout',['Slide','Banner','Case','ressources/Selectbox'], function (r) {
	
	var Slide = r.Slide;
	var Banner = r.Banner;
	var Case = r.Case;
	var Selectbox = r.Selectbox;

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


	/*var positions = {
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
	}*/

	return Seed.extend({

		'+options': {
			imgSrcs: '',
			selectionIndex: null,
		},

		'+init': function (options) {
			this.cases = []
			this.type = options.type;
			this.typeIndex;
			this.casesType = options.casesTypes;
			this.positions = options.positions || null;
			this.casesPositions = options.casesPositions;
			this.slides = [];
			this.choices = [];
			this.titleIndex = options.titleIndex;
			this.slidesType = options.slidesType

			for (var iter = 0, len = options.labels.length; iter < len ; iter++){
				this.choices.push({label : options.labels[iter], id : options.id[iter]})
				if (options.id[iter] === this.type) this.typeIndex = iter;
			}
			
			this.menu = new Selectbox({
				choices : this.choices,
				change : function(choice) {
					this.fire('layout:slide:changedLayout',choice.id) // Raccourci : Le signal changedLayout viens de la couverture et non d'une "vraie" slide
				}.bind(this),

				def : this.type 
			})

			/*Bouton du menu de la cover*/
			var icon = document.createElement('div');
			icon.className +=" picto-"+options.type;
			this.menu.trigger.appendChild(icon);
			this.menu.trigger.className += " picto-" + this.type

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
				tag: "div." + (options.prefix ? (options.prefix + "-") : "") + "layout",
				style: {
					width: 1090, //Taille en dur, pour respecter les proportions naturelles du layout
					height: 760,
					position: "absolute"
				}
			})

			if (options.banners[this.typeIndex] === 'left') {
				this.banner = new Banner({
					side: "left",
					prefix: (options.prefix || ""),
					logo : options.logo,
					label : options.labels[this.typeIndex]
				});
			} else if (options.banners[this.typeIndex] === 'right') {
				this.banner = new Banner({
					side: "up",
					prefix: (options.prefix || ""),
					logo : options.logo,
					label : options.labels[this.typeIndex]
				});
			}
				this.el.appendChild(this.banner.div);
				this.menu.el.style.left = -10;
				this.menu.el.style.top = 15;
				this.banner.band.appendChild(this.menu.el);
				this.slides.push(this);
				var imgIndex;
				var slidesIndex;

				/*choix de la bannière*/
			/*if (this.type === 'moods') {
				this.positions = positions.moods
				this.banner = new Banner({
					side: "left",
					prefix: (options.prefix || ""),
					logo : options.logo
				});
			} else if (this.type = 'stories') {
				this.positions = positions.stories;
				this.banner = new Banner({
					side: "up",
					prefix: (options.prefix || ""),
					logo : options.logo
				});}*/
				
				/*Initialisation des cases et des slides : VERY FAT LOOP*/
				for (var i = 0, n = this.casesPositions[this.typeIndex].length; i < n; i++) {

					/*if (this.type === 'moods') {

					i < 5 ? slidesIndex = i+1 : slidesIndex = i; // slideIndex € [1,12]
					i < 5 ? imgIndex = i : imgIndex = i-1;// imgInex € [0,11]
					var tempCase = new Case({
						width: this.positions[i][2],
						height: this.positions[i][3],
						type: i === 5 ? 'txt' : 'img',
						imgSrc: options.imgSrcs[imgIndex],
						prefix: (options.prefix || ""),
						pos : (options.positions && options.positions.moods && options.positions.moods[0]) ? options.positions.moods[0][i] : null
					})
					var tempSlide = new Slide({
						logo: options.logo,
						type: "moods",
						title: options.title || "",
						prefix: options.prefix || "",
						width: 1100,
						height: 750,
						comment : options.comments[i]||"",
						box: {
							prefix: options.prefix || "",
							width: 773,
							height: 591,
							imgSrc: options.imgSrcs[imgIndex],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions.moods && options.positions.moods[slidesIndex]) ? options.positions.moods[slidesIndex][0] : null
						}
					})
				} else if (this.type === 'stories') {
					i < 3 ? slidesIndex = i+1 : slidesIndex = i; // slideIndex € [1,5]
					i < 3 ? imgIndex = i : imgIndex = i-1; // imgIndex € [0,4]
					var tempCase = new Case({
						width: this.positions[i][2],
						height: this.positions[i][3],
						type: i === 3 ? 'txt' : 'img',
						imgSrc: options.imgSrcs[imgIndex],
						prefix: (options.prefix || ""),
						pos : (options.positions && options.positions.stories && options.positions.stories[0]) ? options.positions.stories[0][i] : null
					})
					var tempSlide = new Slide({
						logo: options.logo,
						type: "stories",
						title: options.title || "",
						prefix: options.prefix || "",
						width: 1100,
						height: 750,
						bulletPoints : options.bulletPoints[i+1] || {},
						box: {
							prefix: options.prefix || "",
							width: 637,
							height: 597,
							imgSrc: options.imgSrcs[imgIndex],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions.stories && options.positions.stories[slidesIndex]) ? options.positions.stories[slidesIndex][0] : null
						}
					})

					//TRANSFERT DATA ABOUT BULLET POINTS				
					tempSlide.on("slide:changedBP", function (slideIndex,text,index) {
						this.fire("layout:slide:changedBP", slideIndex, text, index);
					}.bind(this).curry(slidesIndex))}*/
					options.casesTypes[i] === "txt" ? slidesIndex = i+1 : slidesIndex = i; // slideIndex € [1,12]
					options.casesTypes[i] === "txt" ? imgIndex = i : imgIndex = i-1;// imgInex € [0,11]
					var box;

					if(this.slidesType[this.typeIndex] === "comment"){
						box = {
							prefix: options.prefix || "",
							width: 773,
							height: 591,
							imgSrc: options.imgSrcs[i],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions[this.type] && options.positions[this.type][slidesIndex]) ? options.positions[this.type][slidesIndex][0] : null,
						}
					} else if (this.slidesType[this.typeIndex] === "bulletPoint") {
						box = {
							prefix: options.prefix || "",
							width: 637,
							height: 597,
							imgSrc: options.imgSrcs[i],
							type: 'img',
							fit : true,
							pos : (options.positions && options.positions.stories && options.positions.stories[slidesIndex]) ? options.positions.stories[slidesIndex][0] : null
						}
					}

					var tempCase = new Case({	
						width: this.casesPositions[this.typeIndex][i][2],
						height: this.casesPositions[this.typeIndex][i][3],
						type: options.casesTypes[this.typeIndex][i],
						imgSrc: options.imgSrcs[i],
						prefix: (options.prefix || ""),
						pos : (options.positions && options.positions[this.type] && options.positions[this.type][0]) ? options.positions[this.type][0][i] : null //position des cases de la couverture
					})
					var tempSlide = new Slide({
						logo: options.logo,
						type: this.slidesType[this.typeIndex],
						title: options.title || "",
						prefix: options.prefix || "",
						width: 1100,
						height: 750,
						comment : options.comments[i]||"",
						bulletPoints : options.bulletPoints[i+1] || {},
						choices : this.choices,
						layoutType : options.id[this.typeIndex],
						box: box
					})

					tempSlide.hide();

					if (tempCase.type = 'img') {// No picture, no slide
						this.slides.push(tempSlide);
					} 

					this.cases.push(tempCase);

					/*CASE to LAYOUT : IMAGE DATA, CURSOR OVERLAPPING A CASE */
					for(var k = 0, l = tempSlide.cases.length; k < l; k++) {
						tempSlide.cases[k].on('case:imageMovedPx', function (k , i, x, y, width, height) {
							this.fire('layout:case:imageMovedPx', x, y, width, height, k, i);
						}.bind(this).curry(k,i+1))

						tempSlide.cases[k].on('case:over', function (k,i) {
							this.fire('layout:case:over',k,i);
						}.bind(this).curry(k,i+1))
					}

					/*TTFALT = TRIGGER THAT FIRES A LAYOUT TRIGGER*/

					/*TTFALT : LAYOUT TYPE CHANGED*/
					tempSlide.on('slide:changedLayout', function (type) {
						this.fire('layout:slide:changedLayout',type);
					}.bind(this))

					/*TTFALT : A NEW BULLET POINT IS ADDED*/
					tempSlide.on('slide:lineAdded' , function () {
						this.fire('layout:slide:lineAdded')
					}.bind(this));

					/*TTFALT : A NEW BULLET POINT WAS REMOVED*/
					tempSlide.on("slide:lineRemoved" , function () {
						this.fire('layout:slide:lineRemoved')
					}.bind(this));

					/*TTFALT : A COMMENT WAS EDITED*/
					tempSlide.on('slide:changedComment', function (i,comment) {
						this.fire('layout:slide:changedComment',i,comment);
					}.bind(this).curry(i+1))

					/*TTFALT : A SLIDE EDITED THE TITLE*/
					tempSlide.on('slide:titleChanged', function (title) {
						this.fire('layout:updateTitle', title);
						this.fire('layout:getTitle', title);
					}.bind(this))

				this.cases[i].div.style.left = this.casesPositions[this.typeIndex][i][0];// positionement des CASES du layout
				this.cases[i].div.style.top = this.casesPositions[this.typeIndex][i][1];
				
				/* TTFALT : AN IMAGE OF THE COVER MOVED OR WAS ZOOMED*/
				this.cases[i].on('case:imageMovedPx', function (i, x, y, width, height) {
					this.fire('layout:case:imageMovedPx', x, y, width,height, i, 0);
				}.bind(this).curry(i))
				
				/*TTFALT : A TITLE CASE WAS EDITED */
				if (options.casesTypes[i] === "txt") {
					tempCase.on('case:titleChanged', function (title) {
						this.fire('layout:updateTitle', title);
						this.fire('layout:getTitle',title);
					}.bind(this))
				}
				this.el.appendChild(this.cases[i].div);
			}


			if(this.type === "moods"){ 
				this.slides.splice(5,1)
			} else if (this.type === "stories") {
				this.slides.splice(3,1)
			};//gets rid of the unneeded slide (works fine but not that much elegant) 

			this.curSlide = 0; //index of the current slide displayed

			document.body.addEventListener("keydown", function (e) { // event to naviguate through slides
				if (e.keyCode === 37 && this.curSlide) {//LEFT ARROW
					this.slides[this.curSlide].hide();
					this.curSlide--;
					this.slides[this.curSlide].show();
				} else if (e.keyCode === 39 && this.curSlide < this.slides.length - 1) {//RIGHT ARROW
					this.slides[this.curSlide].hide();
					this.curSlide++;
					this.slides[this.curSlide].show();
				}
			}.bind(this))

			/*UPDATE TITLE ON BOTH COVER AND SLIDES*/
			this.on('layout:updateTitle', function (title) {
				/*if (this.type === 'moods') {
					this.slides[0].cases[5].txtBloc.children[0].children[0].children[0].innerHTML = title
				} else if (this.type === 'stories') {
					this.slides[0].cases[3].txtBloc.children[0].children[0].children[0].innerHTML = title
				}*/

				this.slides[0].cases[this.titleIndex].txtBloc.children[0].children[0].children[0].innerHTML = title
				for (var i = 1, n = this.slides.length; i < n; i++) {
					this.slides[i].el.children[1].innerHTML = title;
				}
				this.title = title;
			}.bind(this))

			/*MIX IT, SHAKE IT, MAKE A DIV*/
			this.elt = document.createElement('div');
			this.elt.appendChild(this.el)
			for(var i = 1, n = this.slides.length; i < n; i++) {
				this.elt.appendChild(this.slides[i].el);
			}

	},
})
})