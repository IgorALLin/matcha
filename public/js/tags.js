var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

$(document).ready(function() {
    $.ajax({
	  	url: baseUrl + '/public/user/get_tags',
	  	type: 'POST',
	  	success: function(result){
	  		result = JSON.parse(result);
	  		$(result).each(function(){
                $("#show_tags ul").append('<li>' + '#' + this.tag + '</li>');
            })
    		//console.log(result);
  		}
	});
});



/*$("#addTag").click(function(){
 	var tag = $("#tag").val();
 	$("#tag").val('');

	if(tag){
		var exist = false;
		$("#show_tags ul li").each(function(){
			if($(this).text() == '#' + tag) {
				$(this).css('color', 'red');
				exist = true;
			}
		});

		if (!exist){
  			$("#show_tags ul").append('<li>' + '#' + tag + '</li>');
			$.ajax({
			  	url: baseUrl + '/public/user/save_tag',
			  	type: 'POST',
			  	data: {
			  		tag: tag,
			  	},
			  	success: function(result){
		    		//console.log(result);
		  		}
			});
		}
  	}	
});*/

window.onload = function()
{
	showTags();
}

var add_tag = document.getElementById('addTag');
if(addTag)
{
	addTag.onclick = function(e)
	{
	e.preventDefault();
	var tag_value = document.getElementById('tag').value;
	 var xhrAdd_tag = new XMLHttpRequest;
          var formdata = new FormData();
          formdata.append("method", "addTag");
          formdata.append("tags", tag_value);
          xhrAdd_tag.open('POST', baseUrl + '/user/profile', true);
          xhrAdd_tag.send(formdata);
          xhrAdd_tag.onreadystatechange = function()
          {   
            if (xhrAdd_tag.readyState == 4)
            {
            	 document.getElementById('show_tags').innerHTML = xhrAdd_tag.responseText;
              console.log(tag_value);
              document.getElementById('tags_box').innerHTML = "";
              showTags();
            }
          }
      }    
}
var tags_box = document.getElementById('tags_box');
if(tags_box)
{
	function showTags()
	{
		 var xhrShow_tag = new XMLHttpRequest;
	          var formdata = new FormData();
	          formdata.append("method", "showTag");
	          xhrShow_tag.open('POST', baseUrl + '/user/profile', true);
	          xhrShow_tag.send(formdata);
	          xhrShow_tag.onloadend = function()
	          {   
	            if (xhrShow_tag.readyState == 4)
	            {
	            	var tags = JSON.parse(xhrShow_tag.responseText);
	            	 var len = Object.keys(tags).length;
	            	console.log(tags);
	            	// document.getElementById('tags_box').innerHTML = xhrShow_tag.responseText;
	            	 for (var i = 0; i < len; i++)
	                 {
	                 	var tags_container = document.getElementById('tags_box');
	                    var each_tag = document.createElement('p');
	                    var each_tag_button = document.createElement('button');
	                   	each_tag.setAttribute("class", "tag profile_tag");
	                    each_tag_button.setAttribute("class", "tag_button delete is-small");
	                    each_tag_button.setAttribute("name", tags[i]);
	                    each_tag_button.setAttribute("onclick", "deleteTag()");
	                    each_tag.innerHTML = tags[i];
	                    tags_container.append(each_tag);
	                     tags_container.append(each_tag_button);
	                    

	            	}
	          	}
	      }
	}
}

$(document).on('click', '.tag_button', function (event)
{
    event.preventDefault();
});

function deleteTag()
{

	var target = event.target;
	 var xhrdel_tag = new XMLHttpRequest;
          var formdata = new FormData();
          var name = document
          formdata.append("method", "delTag");
          formdata.append("name", target.name);
          xhrdel_tag.open('POST', baseUrl + '/user/profile', true);
          xhrdel_tag.send(formdata);
          xhrdel_tag.onloadend = function()
          {   
            if (xhrdel_tag.readyState == 4)
            {

            	document.getElementById('tags_box').innerHTML = xhrdel_tag.responseText;
            	document.getElementById('tags_box').innerHTML = "";
              	showTags();
          	}
      }
}






















