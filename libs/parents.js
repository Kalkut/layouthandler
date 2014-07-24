sand.define('DOM/parents', function() {
  return function(el, e) {
    while (e) {
      if (e.parentNode === el) return true;
      e = e.parentNode;
    }
    return false;
  };
});