define(["require", "exports"], function(require, exports){
  /**
   * Creates a new parallax engine.
   *
   * @param {Object} settings
   *  Settings for the parallax engine. Valid settings properties are
   *  - sprites {Array} An array of sprite objects for the engine to manage.
   *    Each sprite is an object literal of the form 
   *    {selector: "#mydiv", speed 1.5}
   *
   */
  exports.parallaxEngine = function(settings) {
    
    /**
     * Initialise the array of sprites. Either use the array specified in the
     * settings array, or define a new, empty array.
     */
    var sprites = settings.sprites || [];
 
    for (var i = 0, max = sprites.length; i < max; i++) {
      sprites[i].$el = $(sprites[i].selector);
      sprites[i].x   = sprites[i].$el.position().left;
      sprites[i].y   = sprites[i].$el.position().top;
    }
    
    // Init the touchTarget, if there is one...
    if (settings.touchTarget && $(settings.touchTarget).length) {

      var sx; // tracks current x pos for touch events
      var dx; // diff between current and previous touch events
      var st; // tracks time of last touch event
      var dt; // tracks time between previous two touch events
      var cancelTimeout = true;
      var mouseDown     = false;


      var $touchTarget = $(settings.touchTarget);

      $touchTarget.mousedown(function(e) {
        console.log(e);
        cancelTimeout = true;
        mouseDown     = true;

        sx = e.pageX;
        st = new Date().getTime();

        e.preventDefault();
      });

      $touchTarget.mouseup(function(e) {
        
        cancelTimeout = false;
        mouseDown     = false;

        var ddx = 1;    // instantaneous deceleration
        var r   = 0.95; // rate of change of deceleration

        var step = function() {
          if (!cancelTimeout) {
            dx *= ddx;
            ddx *= r;

            if (Math.abs(dx) > 0.5) {
              scrollBy(dx, 0, 0);
              setTimeout(step, 30);
            } else {
              dx = 0;
            }
          }
        }

        step();

        e.preventDefault();
      });

      $touchTarget.mousemove(function(e) {

        if (mouseDown) {
          dx = e.pageX - sx;
          dt = new Date().getTime() - st;
/*
          for(var i = 0, max = sprites.length; i < max; i++) {            
            sprites[i].x += (dx*sprites[i].speed);
            //sprites[i].$el.attr("style", "-webkit-transform:translate3d("+sprites[i].x+"px, 0, 0)");
            sprites[i].$el.animate()
          }*/

          scrollBy(dx, 0, 0);

          sx += dx;
          st += dt;

          e.preventDefault();
        }
      });

      $touchTarget.each(function(){
        this.ontouchstart = function(e) {
          cancelTimeout = true;

          if (e.touches.length == 1) {
            var t = e.touches[0];

            sx = t.pageX;
            st = new Date().getTime();
          }
        };

        this.ontouchend = function(e) {
          cancelTimeout = false;

          var ddx = 1;    // instantaneous deceleration
          var r   = 0.95; // rate of change of deceleration

          var step = function() {
            if (!cancelTimeout) {
              dx *= ddx;
              ddx *= r;

              if (Math.abs(dx) > 0.5) {
                scrollBy(dx, 0, 0);
                setTimeout(step, 30);
              } else {
                dx = 0;
              }
            }
          }

          step();

        };

        this.ontouchmove = function(e) {
          if (e.touches.length == 1) {
            var t = e.touches[0];

            dx = t.pageX - sx;
            dt = new Date().getTime() - st;
/*
            for(var i = 0, max = sprites.length; i < max; i++) {            
              sprites[i].x += (dx*sprites[i].speed);
              //sprites[i].$el.attr("style", "-webkit-transform:translate3d("+sprites[i].x+"px, 0, 0)");
              sprites[i].$el.animate()
            }*/

            scrollBy(dx, 0, 0);

            sx += dx;
            st += dt;
          }
          e.preventDefault();
        };
      });
    } 

    function scrollBy(dx, dy, duration) {
      for(var i = 0, max = sprites.length; i < max; i++) {
        sprites[i].x += (dx * sprites[i].speed);
        sprites[i].y += (dy * sprites[i].speed);

        if (duration) {
          sprites[i].$el.animate({
            left:sprites[i].x + "px",
            top:sprites[i].y + "px",
            useTranslate3d:true
          }, duration);
        } else {
          // TODO: Need to determine whether the current browser supports 3d accelleration. If not
          // use regular "top" and "left" css properties
          sprites[i].$el.attr("style", "transform:translate3d("+sprites[i].x+"px, 0, 0);-o-transform:translate3d("+sprites[i].x+"px, 0, 0);-ms-transform:translate3d("+sprites[i].x+"px, 0, 0);-moz-transform:translate3d("+sprites[i].x+"px, 0, 0);-webkit-transform:translate3d("+sprites[i].x+"px, 0, 0);");
        }
      }
    }

    var engine = {
      scrollBy : scrollBy
    }

    return engine;
  }
});