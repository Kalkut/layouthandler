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
					this.fire('layout:slide:changedLayout',choice.id) // Raccourci : Le signal changedLayout viens de la couverture et non d'une slide
				}.bind(this),

			def : this.type // l'identifiant de la valeur par défaut
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
				tag: "div." + options.prefix + "-layout",
				style: {
					width: 1090, //Taille en dur, pour respecter les proportions naturelles du layout
					height: 760,
					position: "absolute"
				}
			})

			/*choix de la bannière*/
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

			/*Initialisation des cases et des slides : VERY FAT LOOP*/
			for (var i = 0, n = this.positions.length; i < n; i++) {
				if (this.type === 'moods') {
					
					i < 5 ? slidesIndex = i+1 : slidesIndex = i; // slideIndex € [1,12]
					i < 5 ? imgIndex = i : imgIndex = i-1;// imgInex € [0,11]
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
					i < 3 ? slidesIndex = i+1 : slidesIndex = i; // slideIndex € [1,5]
					i < 3 ? imgIndex = i : imgIndex = i-1; // imgIndex € [0,4]
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

				tempSlide.hide(); //Cachée mais ajoutée au DOM

				/*Transferts de tout les abonnements des objets instanciés dans layout*/

				/*Transfert du changement de layout depuis une slide*/
				tempSlide.on('slide:changedLayout', function (type) {
					this.fire('layout:slide:changedLayout',type);
				}.bind(this))

				/*Transfert de la position CSS de l'image d'une case et du passage du curseur au dessus d'une case*/
				for(var k = 0, l = tempSlide.cases.length; k < l; k++) {//CASE to SLIDE
					tempSlide.cases[k].on('case:imageMovedPx', function (k , i, x, y, width, height) {
						this.fire('layout:case:imageMovedPx', x, y, width, height, k, i);
					}.bind(this).curry(k,i+1))

					tempSlide.cases[k].on('case:over', function (k,i) {
						this.fire('layout:case:over',k,i);
					}.bind(this).curry(k,i+1))
				}

				/*Transferts des informations relatives à un Bullet Point (slides de type stories)*/				
				tempSlide.on("slide:changedBP", function (index,signature,bptext) {
					this.fire("layout:slide:changedBP", index,signature,bptext);
				}.bind(this).curry(i+1))

				/*Nouveau Bullet Point (slides de type stories) */
				tempSlide.on('slide:lineAdded' , function (index, signature , nbLines) {
					this.fire('layout:slide:lineAdded', index, signature, nbLines)
				}.bind(this).curry(i+1));

				/*Destruction d'un Bullet Point (slides de type stories)*/
				tempSlide.on("slide:lineRemoved" , function (index,signature) {
					this.fire('layout:slide:lineRemoved', index, signature)
				}.bind(this).curry(i+1));

				/*Edition d'un commentaire (slides de type moods)*/
				tempSlide.on('slide:changedComment', function (i,comment) {
					this.fire('layout:slide:changedComment',i,comment);
				}.bind(this).curry(i+1))

				/*Edition d'un titre depuis une Slide*/
				tempSlide.on('slide:titleChanged', function (title) {
					this.fire('layout:updateTitle', title);
					this.fire('layout:getTitle', title);
				}.bind(this))

				if (tempCase.type = 'img') {// IMPORTANT : Si la slide crée ne correspond pas à une Case de type 'img' elle n'est pas ajoutée --> Décalage d'indice à partir de 5 ou 3 selon le type de slide
					this.slides.push(tempSlide);
				} 

				this.cases.push(tempCase);

				this.cases[i].selected = false;
				
				this.cases[i].div.style.left = this.positions[i][0];// positionement des CASES du layout
				this.cases[i].div.style.top = this.positions[i][1];
				
				this.cases[i].on('case:imageMovedPx', function (i, x, y, width, height) {//Update du mouvement des cases de la couverture
					this.fire('layout:case:imageMovedPx', x, y, width,height, i, 0);
				}.bind(this).curry(i))
				
				if ((this.type === "moods" && i === 5) || (this.type === "stories" && i === 3)) {// Update des titres depuis la Case de type titre
					tempCase.on('case:titleChanged', function (title) {
						this.fire('layout:updateTitle', title);
						this.fire('layout:getTitle',title);
					}.bind(this))
				}
				
				this.el.appendChild(this.cases[i].div);
			}


			if(this.type === "moods"){//Elimination de la slide image en trop (à revoir, indispensable mais ne devrait pas être nécessaire )
				this.slides.splice(5,1)
			} else if (this.type === "stories") {
				this.slides.splice(3,1)
			};

			this.curSlide = 0; //Slide en cours (initialisation sur la couverture aka slide 0)

			document.body.addEventListener("keydown", function (e) { // EVENEMENT DU DEROULEMENT DES SLIDES
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

			/*Mise a jour du titre dans la couv et dans les slides*/
			this.on('layout:updateTitle', function (title) {
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

			/*On rassemble le tout dans un bon gros div*/
			this.elt = document.createElement('div');
			this.elt.appendChild(this.el)
			for(var i = 1, n = this.slides.length; i < n; i++) {
				this.elt.appendChild(this.slides[i].el);
			}

		}
	})
})