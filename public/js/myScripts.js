//Connect to Pusher
Pusher.logToConsole = true;
var pusher = new Pusher('fd0440e60019404539bf', {
	cluster: 'eu',
	forceTLS: true
});
var $user_id = $('.navbar .button.is-info span').eq(0).attr('data-id');
var page = window.location.pathname.split('/').pop();
var profile = getUrlParameter('profile');

$(document).ready(function() {
	$.ajax({
		url: 'is_auth',
		method: "GET",
		success: function(data) 
		{
			if(data){
				//Get count of unreaded notifications and unreand chats messages and insert to the header
				count_unread();

				//connect to all avaliabel chats
				connect_to_notifications_chanel();
				connect_to_chats_chanels();
			}
		}
	});

	/********* Navbar ***********/

	//switch navbar items
	if(page === 'notifications')
		$('#collapsingNavbar3 ul li').eq(1).addClass('active');
	else if(page === 'browsing_history')
		$('#collapsingNavbar3 ul li').eq(2).addClass('active');
	else if(page === 'search')
		$('#collapsingNavbar3 ul li').eq(0).addClass('active');
	else if(page === 'chats')
		$('#collapsingNavbar3 ul li').eq(3).addClass('active');


	
	/********* Notification page ***********/

	//mark notification as viewed
	$('.not_viewed').on('click', function(){
		var data = {
			'id': $(this).parent().attr('data-id')
		};
		
		$.ajax({
			url: 'user/notifications/viewed',
			method: "POST", 
			data: data,
			success: function(data) 
			{
				$("[data-id=" + data + "]").find('span').eq(0).removeClass('not_viewed').addClass('viewed');
				$("#notifications_count").text($("#notifications_count").text() - 1);
			}
		});
	})

	//delete notification
	$('.delete_notification').on('click', function(){
		let data = {
			'id': $(this).parent().attr('data-id')
		};

		if($(this).parent().find('span').eq(0).hasClass('not_viewed'))
			$("#notifications_count").text($("#notifications_count").text() - 1);
		$.ajax({
			url: 'user/notifications/delete',
			method: "POST", 
			data: data,
			success: function(data) 
			{
				id(data)
					$("[data-id=" + data + "]").toggle('slow');
			}
		});
	})

	//delete all notifications
	$('#delete_all_notifications').on('click', function(){
		let data = {
			'id': 'all'
		};

		$.ajax({
			url: 'user/notifications/delete',
			method: "POST", 
			data: data,
			success: function(data) 
			{
				$("#notifications_count").text(0);
				$("#notification").children().toggle('slow');
			}
		});
	})



	/********* Browsing history page ***********/

	//delete all notifications
	$('#delete_all_visits').on('click', function(){
		$.ajax({
			url: 'user/browsing_history/clear_history',
			method: "GET", 
			success: function(data) 
			{
				$("#visits").children().toggle('slow');
			}
		});
	})


	/***********  show_profile page **************/

	//likes on click
	$('#like').on("click",function(){
	    if ($(this).attr('data-type') == 'like'){
	        $(this).text('dislike');
	        $(this).attr('data-type', 'dislike');
	    }
	        
	    else{
	        $(this).text('like');
	        $(this).attr('data-type', 'like');
	    }
	    
	    let data = {
	        'profile': profile
	    }
	    $.ajax({
	        url: 'user/like',
	        method: "POST",
	        data: data,
	        success: function(data) 
	        {
	        	if(data.chanel)
	        		connect_to_chat_chanel(data.chanel);
	        }
	    });
	});


	/********* Chat page ***********/


	/********* Chat page ***********/
	$('#send_message').on('click', function(){
		let $message = $('#message').val().trim();

		if($message){
			send_chat_message($message);
			$('#message').val('');
			//save_chat_message($message);
		}
	})
});

/********* Functions ***********/

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function connect_to_notifications_chanel(){
	let channel = pusher.subscribe('notification-message-' + $user_id);

	channel.bind('notification', function(data) {
		let audio = new Audio('public/sounds/notification.mp3');
		audio.play();
		console.log(data)
		if(data.type && data.type === 'from-chat'){
			if(data.from-chanel !== page) {
				$("#chats_notifications_count").text(Number($("#notifications_count").text()) + 1);
			}
		}
		else
			$("#notifications_count").text(Number($("#notifications_count").text()) + 1);

		if(data.chanel){
			connect_to_chat_chanel(data.chanel);
		}
			
		//if user watching notification page - add new notification message to page
		if(page === 'notifications')
			setTimeout(function(){ location.reload(); }, 800);
	});
}

function connect_to_chats_chanels(){
	$.ajax({
		url: 'chats/get_chats',
		method: "GET",
		success: function(data) 
		{
			if(data){
				data.forEach(function(chat_id){
					connect_to_chat_chanel(chat_id);
				})
			}
		}
	});
}

function connect_to_chat_chanel(chat_id){
	let channel = pusher.subscribe('chat-' + chat_id);

	channel.bind('message', function(data) {
		$('#messages').append('<p>' + data.message + '</p>');
		/*if(data.user === $user_id)
			$('#messages').children().last().css('float', 'right')*/
	});
}

function count_unread() {
	$.ajax({
		url: 'user/notifications/count',
		method: "POST",
		success: function(data) 
		{
			$("#notifications_count").text(Number(data));
		}
	});

	$.ajax({
		url: 'chats/count',
		method: "POST",
		success: function(data) 
		{
			console.log(data)
			$("#chats_notifications_count").text(Number(data));
		}
	});
}

function send_chat_message($message) {
	let data = {
		'message': $message,
		'chat_chanel': page
	}

	$.ajax({
		url: 'chats/send_message',
		method: "POST",
		data: data,
		success: function(data) 
		{
			if(data === 'not-active')
				location.reload();
		}
	});
}