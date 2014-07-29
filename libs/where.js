(sand.define("ressources/where", function() {
  
  Array.prototype.where = function(f, value) {
    var res = [];
    if (typeof(f) === 'function') {
      for (var i = -1, n = this.length; ++i < n; ) {
        if (f(this[i], i)) res.push(this[i]);
      }
    }
    else {
      if (typeof(value) === 'undefined') value = true;
      for (var i = -1, n = this.length; ++i < n; ) {
        if (this[i][f] === value) res.push(this[i]);
      }
    }
    return res;
  }
  
}));
