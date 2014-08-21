sand.define('ressources/Toggle', ['Seed'], function(r) {
    
  var Seed = r.Seed;

  return Seed.extend({
    
    onClick : function() {
      if (this._down) {
        this.up();
        this._down = false;
      }
      else {
        this.down();
        this._down = true;
      }
    },
    
    down : function() { //override
      
    },
    
    up : function() { //override

    }
    
  });
  
});
