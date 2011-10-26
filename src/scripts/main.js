require(["jquery-1.6.4.min", "parallax-engine"], function() {
	

	$(function() {
		console.log("go");
		require("parallax-engine").parallaxEngine({
		    touchTarget: "body",

		    sprites : [
		      {
		        selector: "#background",
		        speed: 1
		      },
		      {
		        selector: "#drone",
		        speed: 1.5
		      },
		      {
		        selector: "#globemaster",
		        speed: 3
		      },
		      {
		        selector: "#middle-ground",
		        speed: 2     
		      }
		    ]
		});
	});
	
});




/*
var engine;

$(function(){
  engine = parallaxEngine({
    touchTarget: "body",

    sprites : [
      {
        selector: "#background",
        speed: 1
      },
      {
        selector: "#drone",
        speed: 1.5
      },
      {
        selector: "#globemaster",
        speed: 3
      },
      {
        selector: "#middle-ground",
        speed: 2     
      }
    ]
  });
});*/