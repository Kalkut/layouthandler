sand.define('Banner',['Case', 'Seed', 'DOM/toDOM'], function (r) {
	var Seed = r.Seed;
	var Case = r.Case;
	var toDOM = r.toDOM;
	
	return Seed.extend({
		'+init' : function (options) {
			this.side = options.side;
			this.div = document.createElement('div');
			this.prefix = options.prefix || "";
			
			if(this.side === 'left') {
				this.div.style.width = 85 + 'px';
				this.div.style.height = 760 + 'px';
				this.div.style.left = 20 + 'px';

				this.box = new Case({ width : 85 , height : 85 , prefix : this.prefix, imgSrc : options.logo, type : "img"})
				this.band = document.createElement('div');
				this.band.style.height = 665 + 'px';
				this.band.style.backgroundColor = options.color || "#f17f36";

				this.txt = document.createElement('div');
				this.txt.className = (options.prefix ? (options.prefix + "-") : "") +'banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 50 + 'px';
				//this.txt.innerHTML = "M</br>O</br>O</br>D</br>S";
				this.txt.innerHTML = "";
				for(var i = 0, n = options.label.length; i < n; i++){
					this.txt.innerHTML += (options.label[i] + "</br>");
				}
				this.txt.style.top = 320 + 'px';
				this.txt.style.left = 8 + 'px';
				this.txt.style.position = "absolute"

				this.box.div.style.left = -6 + 'px';
				this.box.div.style.top = 660 + 'px';

				this.div.appendChild(this.band);
				this.div.appendChild(this.box.div);
				this.band.appendChild(this.txt);
			}
			else if (this.side === 'up') {
				this.div.style.width = 1080 + 'px';
				this.div.style.height = 85 + 'px';
				this.div.style.top = 20 + 'px';

				this.band = document.createElement('div');
				this.band.style.width = 1034 + 'px';
				this.band.style.height = 85 + 'px';
				this.band.style.backgroundColor = options.color || "8c8fc2";

				this.txt = document.createElement('div');
				this.txt.className = (options.prefix ? (options.prefix + "-") : "") +'banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 60 + 'px';
				this.txt.innerHTML = options.label;
				this.txt.style.position = "absolute";
				this.txt.style.left = 713 + 'px';
				this.txt.style.top = -3 + 'px';
				this.box = new Case({ width : 42 , height : 72 , prefix : this.prefix, imgSrc : options.logo, type : "img"})
				this.box.div.style.left = 1034 + 'px';
				this.box.div.style.top = -8 + 'px';
				this.div.appendChild(this.band);
				this.div.appendChild(this.box.div);
				this.band.appendChild(this.txt);

			}

			this.div.className = (options.prefix ? (options.prefix + "-") : "") + "banner";

			this.div.style.position = "absolute";

			this.on("banner:newColor", function (color) {
				this.setColor(color);
			})
		},

		setColor : function (color) {
			this.band.style.backgroundColor = color;
		}
	})
});