(function(global){
  global.parallaxEngine = function(settings) {

    var sprites = settings.sprites || [];

    for (var i = 0, max = sprites.length; i < max; i++) {
      sprites[i].$el = $(sprites[i].selector);
      sprites[i].x   = sprites[i].$el.position().left;
      sprites[i].y   = sprites[i].$el.position().top;
    }
    
    var engine = {
      scrollBy : function(dx, dy) {
        for(var i = 0, max = sprites.length; i < max; i++) {
          sprites[i].x += (dx * sprites[i].speed);
          sprites[i].y += (dy * sprites[i].speed);
          sprites[i].$el.animate({
            left:sprites[i].x + "px",
            top:sprites[i].y + "px",
            useTranslate3d:true
          }, 1000);
          //sprites[i].$el.attr("style", "-webkit-transform:translate3d("+sprites[i].x+"px,"+sprites[i].y+"px,0); -webkit-transition:-webkit-transform 1s ease-in-out");
        }
      }
    }

    return engine;
  }
})(typeof window === 'undefined' ? this : window);

var engine;

$(function(){
  engine = parallaxEngine({
    sprites : [
      {
        selector: "#background",
        speed: 1
      },
      {
        selector: "#middle-ground",
        speed: 1.5        
      }
    ]
  });
});