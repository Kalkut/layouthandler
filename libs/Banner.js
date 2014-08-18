sand.define('Banner',['Case'], function (r) {
	var Case = r.Case;
	return Seed.extend({
		'+init' : function (options) {
			this.side = options.side;
			this.div = document.createElement('div');
			this.prefix = options.prefix || "";
			
			if(this.side === 'left') {
				this.div.style.width = 85;
				this.div.style.height = 760;
				this.div.style.left = 20;

				this.box = new Case({ width : 85 , height : 85 , prefix : this.prefix, imgSrc : options.logo, type : "img"})
				this.band = document.createElement('div');
				this.band.style.height = 665;
				this.band.style.backgroundColor = "#f17f36";

				this.txt = document.createElement('div');
				this.txt.className = (options.prefix ? (options.prefix + "-") : "") +'banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 50;
				//this.txt.innerHTML = "M</br>O</br>O</br>D</br>S";
				this.txt.innerHTML = "";
				for(var i = 0, n = options.label.length; i < n; i++){
					this.txt.innerHTML += (options.label[i] + "</br>");
				}
				this.txt.style.top = 320;
				this.txt.style.left = 8;
				this.txt.style.position = "absolute"

				this.box.div.style.left = -6;
				this.box.div.style.top = 660

				this.div.appendChild(this.band);
				this.div.appendChild(this.box.div);
				this.band.appendChild(this.txt);
			}
			else if (this.side === 'up') {
				this.div.style.width = 1080;
				this.div.style.height = 85;
				this.div.style.top = 20;

				this.band = document.createElement('div');
				this.band.style.width = 1034;
				this.band.style.height = 85;
				this.band.style.backgroundColor = "8c8fc2";

				this.txt = document.createElement('div');
				this.txt.className = (options.prefix ? (options.prefix + "-") : "") +'banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 60;
				this.txt.innerHTML = options.label;
				this.txt.style.position = "absolute";
				this.txt.style.left = 713;
				this.txt.style.top = -3;
				this.box = new Case({ width : 42 , height : 72 , prefix : this.prefix, imgSrc : options.logo, type : "img"})
				this.box.div.style.left = 1034;
				this.box.div.style.top = -8;
				this.div.appendChild(this.band);
				this.div.appendChild(this.box.div);
				this.band.appendChild(this.txt);

			}
			this.div.className = (options.prefix ? (options.prefix + "-") : "") + "banner";

			this.div.style.position = "absolute";

			console.log('banner')
		}
	})
})