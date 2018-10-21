var age_count;

getValues();


function getValues()
{
  var age;
  var fame;
   var xhr_age_fame_values = new XMLHttpRequest;
     formdata = new FormData(document.forms.search_form);
          formdata.append("method", "getMaxValues");
            xhr_age_fame_values.open('POST', baseUrl + '/search', true);
            xhr_age_fame_values.send(formdata);
           xhr_age_fame_values.onloadend = function()
            {
              if (xhr_age_fame_values.readyState == 4)
                {
                  max_values = JSON.parse(xhr_age_fame_values.responseText);
                  age = parseInt(max_values[0]);
                  fame = parseInt(max_values[1]);
                  age_fun(age);
                  fame_rate(fame);
                }
                
            }
    }




function age_fun(age) {

     $( "#slider-range_age" ).slider({
     range: true,
     min: 18,
     max: age,
     values: [ 18, age],
     slide: function( event, ui ) {
     $( "#age_gap" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
     }
     });
     $( "#age_gap" ).val($( "#slider-range_age" ).slider( "values", 0 ) +
     " - " + $( "#slider-range_age" ).slider( "values", 1 ) );
}

function fame_rate(fame) {
   $( "#slider-range_fame" ).slider({
   range: true,
   min: 1,
   max: fame,
   values: [ 1, fame],
   slide: function( ewvent, ui ) {
   $( "#fame_gap" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
   }
   });
   $( "#fame_gap" ).val($( "#slider-range_fame" ).slider( "values", 0 ) +
   " - " + $( "#slider-range_fame" ).slider( "values", 1 ) );
}
//console.log(window.age_count);

/*$(function(){
 

 $( "#slider-range_age" ).slider({
 range: true,
 min: 18,
 max: window.age_count,
 values: [ 18, window.age_count],
 slide: function( event, ui ) {
 $( "#age_gap" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
 }
 });
 $( "#age_gap" ).val($( "#slider-range_age" ).slider( "values", 0 ) +
 " - " + $( "#slider-range_age" ).slider( "values", 1 ) );
 
});




$(function(){
 
 $( "#slider-range_fame" ).slider({
 range: true,
 min: 1,
 max: 1000,
 values: [ 1, 1000 ],
 slide: function( ewvent, ui ) {
 $( "#fame_gap" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
 }
 });
 $( "#fame_gap" ).val($( "#slider-range_fame" ).slider( "values", 0 ) +
 " - " + $( "#slider-range_fame" ).slider( "values", 1 ) );
 
});*/