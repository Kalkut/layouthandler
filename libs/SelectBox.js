sand.define('ressources/Selectbox', [
  'ressources/Toggle',
  'DOM/toDOM',
  'DOM/parents'
], function(r) {
  
  return r.Toggle.extend({
    
    '+options' : {
      choices : [],
      current : null,
      def : null,
      'class' : 'select-box',
      change : null,
      manual : false,
      onDown : null,
      onUp : null,
      buildTrigger : function() {

      }
    },
    
    down : function() {
      if (!this.manual) {
        this.expanded.style.display = 'block';
      }
      else {
        var expanded = r.toDOM(['.expanded', [
          { tag : '.picto' },
          { tag : '.fake ' + this.current.label, events : { click : this.onClick.bind(this) } },
          ['.items', this.choices.map(function(e) {
              return {
               tag : '.item' + (e.disabled ? '.disabled ' : ' ') + e.label,
               style : {
                display : this.current.id === e.id ? 'none' : 'block'
               },
               events : !e.disabled ? {
                 click : function() {
                   this.select(e.id);
                   this.onClick();
                 }.bind(this)
               } : {}
              }
            }.bind(this))
          ]
        ]]);

        this.toRemove = this.manual(expanded, this.el);
      }

      this._f = function(e) {
        if (
          (this.manual && !r.parents(this.toRemove, e.target))
          || (!this.manual && !r.parents(this.el, e.target))
        ) {
          this.onClick();
        }
      }.bind(this);

      $(this.el).addClass('down');

      $(document).bind('mousedown', this._f);
    },
    
    up : function() {
      if (!this.manual) {
        this.expanded.style.display = 'none';
      }
      else {
        this.toRemove.parentNode.removeChild(this.toRemove);
      }

      $(this.el).removeClass('down');

      $(document).unbind('mousedown', this._f);
    },
    
    select : function(id) {
      this.current = this.choices.where('id', id).last();

      if (!this.manual) {
        this.choices.each(function(c) {
          if (c.id !== this.current.id) this[c.id].style.display = 'block';
          else this[c.id].style.display = 'none';
        }.bind(this));
        this.fake.innerHTML = this.current.label;
      }

      this['trigger-label'].innerHTML = this.current.label;
      
      if (this.change) this.change(this.current);

      this.fire('change', this.current);
    },
    
    tpl : function() {
      if (this.def) this.current = this.choices.where('id', this.def).last();
      else this.current = this.choices[0];

      return {
        tag : '.' + this['class'].split(' ').join('.'), children : [
          { tag : '.trigger.main',
            children : [
              { tag : '.trigger-label ' + this.current.label },
              { tag : '.trigger-picto.picto' }
            ],
            events :
              this.choices.length > 1 ?
                { click : this.onClick.bind(this) }
              : null
          },
          !this.manual ? 
          ['.expanded', [
            '.picto',
              { tag : '.fake ' + this.current.label, events : { click : this.onClick.bind(this) } },
              ['.items', this.choices.map(function(e) {
                  return {
                   tag : '.item' + (e.disabled ? '.disabled ' : ' ') + e.label,
                   as : e.id,
                   style : {
                    display : this.current.id === e.id ? 'none' : 'block'
                   },
                   events : !e.disabled ? {
                     click : function() {
                       this.select(e.id);
                       this.onClick();
                     }.bind(this)
                   } : {}
                  }
                }.bind(this))
              ]
            ]
          ]
          : null
        ]
      }
    }
    
  });
  
});