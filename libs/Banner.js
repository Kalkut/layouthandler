sand.define('Banner',function(){
	return Seed.extend({
		'+init' : function (options) {
			this.side = options.side;
			this.div = document.createElement('div');

		/*this.imgButton.onclick = function () {
			this.fire('changeLayout', )
		}.bind(this)*/

		if(this.side === 'left'){
			this.div.style.width = 85;
			this.div.style.height = 760;
			this.div.style.left = 20;
			this.div.style.backgroundColor = "#f17f36";
		}
		else if (this.side === 'up'){
			this.div.style.width = 1080;
			this.div.style.height = 85;
			this.div.style.top = 20;
			this.div.style.backgroundColor = "8c8fc2";
		}
		this.div.className = options.prefix + "-banner";
		
		this.div.style.position = "absolute";
	}
})
})