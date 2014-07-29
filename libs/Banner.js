sand.define('Banner',['Case'], function (r) {
	var Case = r.Case;
	return Seed.extend({
		'+init' : function (options) {
			this.side = options.side;
			this.div = document.createElement('div');

			if(this.side === 'left') {
				this.div.style.width = 85;
				this.div.style.height = 760;
				this.div.style.left = 20;

				this.box = new Case({ width : 85 , height : 85 , prefix : "berenger", imgSrc : options.logo, type : "img"})
				this.band = document.createElement('div');
				this.band.style.height = 665;
				this.band.style.backgroundColor = "#f17f36";

				this.txt = document.createElement('div');
				this.txt.className = options.prefix + '-banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 60;
				this.txt.innerHTML = "M</br>O</br>O</br>D</br>S";
				this.txt.style.top = 250;
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
				this.band.style.width = 880;
				this.band.style.height = 85;
				this.band.style.backgroundColor = "8c8fc2";

				this.txt = document.createElement('div');
				this.txt.className = options.prefix + '-banner-txt'
				this.txt.style.color = "#FFFFFF";
				this.txt.style.fontFamily = "cbi";
				this.txt.style.fontSize = 60;
				this.txt.innerHTML = "STORIES";
				this.txt.style.cssFloat = "right";

				this.box = new Case({ width : 183 , height : 87 , prefix : "berenger", imgSrc : options.logo, type : "img"})
				this.box.div.style.left = 880;
				this.box.div.style.top = -8;
				this.div.appendChild(this.band);
				this.div.appendChild(this.box.div);
				this.band.appendChild(this.txt);

			}
			this.div.className = options.prefix + "-banner";

			this.div.style.position = "absolute";
		}
	})
})