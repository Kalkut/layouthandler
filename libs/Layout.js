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

	return Seed.extend({

		'+options': {
			imgSrcs: '',
			selectionIndex: null,
		},

		'+init': function (options) {
			this.cases = []
			this.type = options.defaultLayout;
			this.choices = [];

			for (var iter = 0, len = options.layouts.length; iter < len ; iter++) {
				this.choices.push({label : options.layouts[iter].label, id : options.layouts[iter].id})
				if (options.layouts[iter].id === this.type) {
					this.layoutIndex = iter;
					this.fire('layout:indexOfCurrentTypeFound', this.layoutIndex)
				} 
			}

			this.casesType = options.casesTypes;
			this.positions = options.positions || null;
			this.casesPositions = options.configs[this.type].positions;
			this.slides = [];
			this.titleIndex = options.layouts[this.layoutIndex].titleIndex;
			this.slidesType = options.layouts[this.layoutIndex].slides

			
			
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

			this.menu["select-box"].style.left = 10 + 'px';
			this.menu["select-box"].style.zIndex = 1 + 'px';
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
					width: 1090 + 'px', //Taille en dur, pour respecter les proportions naturelles du layout
					height: 760 + 'px',
					position: "absolute"
				}
			})

			if (options.layouts[this.layoutIndex].banner === 'left') {
				this.banner = new Banner({
					side: "left",
					prefix: (options.prefix || ""),
					logo : options.logo,
					label : options.layouts[this.layoutIndex].label,
					color : options.color || null,
				});
			}else if (options.layouts[this.layoutIndex].banner === 'up') {
				this.banner = new Banner({
					side: "up",
					prefix: (options.prefix || ""),
					logo : options.logo,
					label : options.layouts[this.layoutIndex].label,
					color : options.color || null,
				});
			}
			
			this.el.appendChild(this.banner.div);
			this.menu.el.style.left = -10 + 'px';
			this.menu.el.style.top = 15 + 'px';
			this.banner.band.appendChild(this.menu.el);
			this.slides.push(this);
			var imgIndex;
			var slidesIndex;



			var imgIndex = 0;

			/*Initialisation des cases et des slides : VERY FAT LOOP*/
			for (var i = 0, n = this.casesPositions.length; i < n; i++) {

				var box;
				if (options.layouts[this.layoutIndex].cases[i] === "txt"){
					imgIndex--;
				}

				var posObject = (options.positions && options.positions[this.type] && options.positions[this.type][imgIndex + 1]) ? options.positions[this.type][imgIndex + 1][0] : null
				if(options.layouts[this.layoutIndex].slides === "comment"){
					box = {
						prefix: options.prefix || "",
						width: 773,
						height: 591,
						imgSrc: options.slides[imgIndex].img,
						type: 'img',
						fit : true,
						pos : posObject,
					}
				}else if (options.layouts[this.layoutIndex].slides === "bulletPoints") {
					box = {
						prefix: options.prefix || "",
						width: 637,
						height: 597,
						imgSrc: options.slides[imgIndex].img,
						type: 'img',
						fit : true,
						pos : posObject,
					}
				}

				var tempCase = new Case({	
					width: this.casesPositions[i][2],
					height: this.casesPositions[i][3],
					type: options.layouts[this.layoutIndex].cases[i],
					imgSrc: options.slides[imgIndex].img,
					prefix: (options.prefix || ""),
					color : options.color || null,
					pos : (options.positions && options.positions[this.type] && options.positions[this.type][0]) ? options.positions[this.type][0][i] : null //position des cases de la couverture
				})
				var tempSlide = new Slide({
					logo: options.logo,
					type: options.layouts[this.layoutIndex].slides,
					title: options.title || "",
					prefix: options.prefix || "",
					width: 1100,
					height: 750,
					comment : options.slides[imgIndex].comment ||"",
					bulletPoints : options.bulletPoints[i+1] || {},
					choices : this.choices,
					layoutType : this.type,
					color : options.color || null,
					box: box
				})

				tempSlide.hide();

				if (tempCase.type = 'img') {// No picture, no slide
					this.slides.push(tempSlide);
				} 

				this.cases.push(tempCase);

				//TRANSFERT DATA ABOUT BULLET POINTS				
				tempSlide.on("slide:changedBP", function (imgIndex,text,index) {
					this.fire("layout:slide:changedBP", imgIndex, text, index);
				}.bind(this).curry(imgIndex+1))

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

				this.cases[i].div.style.left = this.casesPositions[i][0] + 'px';// positionement des CASES du layout
				this.cases[i].div.style.top = this.casesPositions[i][1] + 'px';
				
				/* TTFALT : AN IMAGE OF THE COVER MOVED OR WAS ZOOMED*/
				this.cases[i].on('case:imageMovedPx', function (i, x, y, width, height) {
					this.fire('layout:case:imageMovedPx', x, y, width,height, i, 0);
				}.bind(this).curry(i))
				
				/*TTFALT : A TITLE CASE WAS EDITED */
				if (i === this.titleIndex) {
					tempCase.on('case:titleChanged', function (title) {
						this.fire('layout:updateTitle', title);
						this.fire('layout:getTitle',title);
					}.bind(this))
				}
				imgIndex++;
				this.el.appendChild(this.cases[i].div);
			}


			if(this.type === "moods"){ 
				this.slides.splice(5,1)
			}else if (this.type === "stories") {
				this.slides.splice(3,1)
			};//gets rid of the unneeded slide (works fine but not that much elegant) 

			this.curSlide = 0; //index of the current slide displayed



			/*UPDATE TITLE ON BOTH COVER AND SLIDES*/
			this.on('layout:updateTitle', function (title) {
				this.slides[0].cases[this.titleIndex].txtBloc.children[0].children[0].children[0].innerHTML = title
				for (var i = 1, n = this.slides.length; i < n; i++) {
					this.slides[i].el.children[1].innerHTML = title;
				}
				this.title = title;
			}.bind(this))

			/*MIX IT, SHAKE IT, MAKE A DIV*/
			this.elt = document.createElement('div');
			this.elt.className = "layout-app";
			this.elt.appendChild(this.el)
			for(var i = 1, n = this.slides.length; i < n; i++) {
				this.elt.appendChild(this.slides[i].el);
			}

			this.on("layout:nextSlide", function () {
				this.next();
			}.bind(this))

			this.on("layout:previousSlide", function () {
				this.previous();
			}.bind(this))

		},

		next : function () {
			if(this.curSlide < this.slides.length - 1) {
				this.slides[this.curSlide].hide();
				this.curSlide++;
				this.slides[this.curSlide].show();
			}
		},

		previous : function () {
			if(this.curSlide){
				this.slides[this.curSlide].hide();
				this.curSlide--;
				this.slides[this.curSlide].show();
			}
		}

	})
})