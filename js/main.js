/*
=============================================================================
  FUNCTION DECLARATIONS
=============================================================================
*/

var pg = (function($) {

  /*
    Utility
    
    Various utility functions that load/unload/route data,
    call other functions, etc.
  */

  var utility = (function() {

    var init = function() { // Called on page load, calls all other functions that should occur on page load

      // On init function calls
      grid.setup();

      // User input calls
      $('.pixel-grid').on('mouseenter', '.pixel', function() {
        grid.trigger($(this),100); // Trigger grid with a 100% chance to execute.
      });
    };

    var onScroll = function() { // Called when the browser window is scrolled
      // Functions
    };

    var resize = function() { // Called when the browser window is resized
      // Functions
    };

    // var onInterval = setInterval(function(){ // items to run on an interval.

    // }, 300);

    return  {
      init: init,
      onScroll: onScroll,
      resize: resize
    };
  })();

  var grid = (function() {

    var settings = {
      rows: 40,
      columns: 40,
      spreadChance: 30 // Percent chance that a mouse event will spread
    };
    
    var setup = function() {
      console.log(settings);

      // Create initial markup
      createMarkup();
    };

    var createMarkup = function() {
      // Insert styles
      var width = 100 / settings.columns;
      var height = 100 / settings.rows;
      var styles = '<style type="text/css">.pixel { -webkit-box-flex: 1;';
          styles += '-webkit-flex: 1 1 ' + width + '%;';
          styles += '-moz-box-flex: 1;';
          styles += '-moz-flex: 1 1 ' + width + '%;';
          styles += '-ms-flex: 1 1 ' + width + '%;';
          styles += 'flex: 1 1 ' + width + '%;';
          styles += 'height: ' + height + '%; }</style>';
      $('body').prepend(styles);


      // Iterate over rows, make divs
      for (r=0;r<settings.rows;r++) {
        // For each row, iterate number of columns
        for (c=0;c<settings.columns;c++) {
          // Insert markup
          var markup = '<div class="pixel" data-row="' + r +  '" data-column="' + c + '"></div>';
          $('.pixel-grid').append(markup);
        }
      }
    };

    var animatePixel = function($pixel,origin) {
      if (origin === true) {
        $pixel.addClass('origin');  
      }
      $pixel.addClass('animating');
      setTimeout(function() {
        $pixel.removeClass('animating origin')
      }, 1000);
    };

    var trigger = function($pixel,chance) {
      // Determine if the function will progress w/ random number.
      var spreadRand = Math.random() * 100;
      
      // if (chance == 100) {
      //   console.log('______________');
      // }
      // console.log('r' + $pixel.attr('data-row') + ', c' + $pixel.attr('data-column'));
      // console.log(spreadRand);
      // console.log(spreadRand <= chance);

      if (spreadRand <= chance) {
        // Run the animation
        if (chance === 100) {
          animatePixel($pixel,true);  
        }
        else {
          animatePixel($pixel,false);
        }
        
        // Run the animation on neighbor pixels
        var currentPixel = {
          row: $pixel.attr('data-row'),
          column: $pixel.attr('data-column'),
        }
        // Get surrounding pixels
        var surroundingPixels = [
          { // Above
            row: parseInt(currentPixel.row) - 1,
            column: parseInt(currentPixel.column)
          },
          { // Top right
            row: parseInt(currentPixel.row) - 1,
            column: parseInt(currentPixel.column) + 1
          },
          { // Right
            row: parseInt(currentPixel.row),
            column: parseInt(currentPixel.column) + 1
          },
          { // Bottom right
            row: parseInt(currentPixel.row) + 1,
            column: parseInt(currentPixel.column) + 1
          },
          { // Bottom
            row: parseInt(currentPixel.row) + 1,
            column: parseInt(currentPixel.column)
          },
          { // Bottom left
            row: parseInt(currentPixel.row) + 1,
            column: parseInt(currentPixel.column) - 1
          },
          { // Left
            row: parseInt(currentPixel.row),
            column: parseInt(currentPixel.column) - 1
          },
          { // Top left
            row: parseInt(currentPixel.row) - 1,
            column: parseInt(currentPixel.column) - 1
          }
        ];
        for (i=0;i<surroundingPixels.length;i++) {
          var $target = $('.pixel[data-row="' + surroundingPixels[i].row + '"][data-column="' + surroundingPixels[i].column + '"]');
          trigger($target,settings.spreadChance);
        }
      }
    };

    // var triggerSurrounding = function($pixel,chance) {

    //   if (!$pixel.hasClass('animating')) {
    //     trigger($pixel,settings.spreadChance);
    //   }
    //   else {
    //     return;
    //   }
    // };

    return {
      setup: setup,
      trigger: trigger
    }
  })();

  // public
  return {
    grid: grid,
    utility: utility,
  };
})(jQuery); // var pg = (function() {

$(document).ready(function() {
   pg.utility.init();

   // $(window).resize(function(){ pg.utility.resize(); });
   // $(window).scroll(function(){ pg.utility.onScroll(); });
});
