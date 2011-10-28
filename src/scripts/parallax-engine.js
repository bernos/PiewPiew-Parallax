define(["require", "exports"], function(require, exports){

  /**
   * Creates a new parallax engine.
   *
   * @param {Object} settings
   *  Settings for the parallax engine. Valid settings properties are
   *  - sprites {Array} An array of sprite objects for the engine to manage.
   *    Each sprite is an object literal of the form 
   *    {selector: "#mydiv", speed 1.5}
   * @return {Object}
   *  A parallax engine object
   */
  exports.parallaxEngine = function(settings) {
    
    /**
     * Storage for sprites
     */
    var sprites = [];

    var sx; // tracks current x pos for touch events
    var dx; // diff between current and previous touch events
    var st; // tracks time of last touch event
    var dt; // tracks time between previous two touch events
    var r = 0.95;  // rate of deceleration on drag end
    var cancelTimeout = true;
    var mouseDown     = false;

    function initMouseDragEvents($target) {
      $target.each(function(){
        $(this).mousedown(onMouseDragStart);
        $(this).mousemove(onMouseDragMove);
        $(this).mouseup(onMouseDragEnd);  
      });  
    }

    function onMouseDragStart(e) {
      cancelTimeout = true;
      mouseDown     = true;

      sx = e.pageX;
      st = new Date().getTime();

      e.preventDefault();
    }

    function onMouseDragEnd(e) {
      cancelTimeout = false;
      mouseDown     = false;

      var ddx = 1;    // instantaneous deceleration
  
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
    }

    function onMouseDragMove(e) {
      if (mouseDown) {
        dx = e.pageX - sx;
        dt = new Date().getTime() - st;

        scrollBy(dx, 0, 0);

        sx += dx;
        st += dt;

        e.preventDefault();
      }
    }

    function onTouchDragStart(e) {
      cancelTimeout = true;

      if (e.touches.length == 1) {
        var t = e.touches[0];

        sx = t.pageX;
        st = new Date().getTime();
      }
    }

    function onTouchDragEnd(e) {
      cancelTimeout = false;

      var ddx = 1;    // instantaneous deceleration

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

    }

    function onTouchDragMove(e) {
      if (e.touches.length == 1) {
        var t = e.touches[0];

        dx = t.pageX - sx;
        dt = new Date().getTime() - st;

        scrollBy(dx, 0, 0);

        sx += dx;
        st += dt;
      }
      e.preventDefault();
    }
    
    function initTouchDragEvents($target) {
      $target.each(function(){
        this.ontouchstart = onTouchDragStart;
        this.ontouchmove = onTouchDragMove;
        this.ontouchend = onTouchDragEnd;
      });
    }
    
    function initWithSettings(settings) {
      if (settings.sprites) {
        addSprites(settings.sprites);
      }
   
      // Init the touchTarget, if there is one...
      if (settings.touchTarget && $(settings.touchTarget).length) {

        var $touchTarget = $(settings.touchTarget);
        
        initMouseDragEvents($touchTarget);
        initTouchDragEvents($touchTarget);
      } 
    }

    function addSprites(newSprites) {
      for (var i = 0, m = newSprites.length; i < m; i++) {
        newSprites[i].$el = $(newSprites[i].selector);
        newSprites[i].x   = newSprites[i].$el.position().left;
        newSprites[i].y   = newSprites[i].$el.position().top;

        sprites.push(newSprites[i]);  
      }      
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
      initWithSettings : initWithSettings,
      scrollBy : scrollBy,
      addSprites : addSprites
    }

    engine.initWithSettings(settings);

    return engine;
  }
});