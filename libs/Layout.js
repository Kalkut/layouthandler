Function.prototype.curry = function () {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	return function () { return self.apply([],args.concat(Array.prototype.slice.call(arguments)));};
}

var Layout = Seed.extend({
	'+init' : function (options) {
		this.cases = options.cases;
		this.type = options.type;
		this.positions = options.positions || null;
		this.div = document.createElement("div");
		this.div.className = options.prefix + "-layout";
		this.div.style.position = "absolute";
		this.selectionIndex = null;
		this.banner = new Banner(options);
		this.div.appendChild(this.banner.div);

		for( var i = 0, n = this.cases.length; i < n; i++){
			this.cases[i].selected = false;
			this.cases[i].div.style.left =  this.positions[i][0];
			this.cases[i].div.style.top = this.positions[i][1];
			this.cases[i].div.addEventListener("mousedown", function (i) {
				this.fire('selection',i);
			}.bind(this).curry(i))
			this.div.appendChild(this.cases[i].div);
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