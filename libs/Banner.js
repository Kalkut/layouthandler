var Banner = Seed.extend({
	'+init' : function (options) {
		this.side = options.side|| 'left';
		this.div = document.createElement('div');
		//this.logoCase = new Case();
		this.div.className = options.prefix + "-banner";
		this.div.style.left = 20;
		this.div.style.position = "absolute";
	}
})