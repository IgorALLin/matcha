$(document).ready(function() {
	$user_id = $('.navbar .dropdown button').attr('data-id');
	var page = window.location.pathname.split('/').pop();

	$('#search_form').on('submit', function(event){
		var form_data = $(this).serialize();
		$.ajax({
			url: $('head base').attr('href') + 'search',
			method: "POST",
			data: form_data,
			success: function(data) 
			{
				$('#tags-select option:selected').each(function(){
					$(this).prop('selected', false);
				});
				$('#tags-select').multiselect('refresh');
			}
		});
	});

	//Get count of unreaded messages and insert to the header
	count_unread();

	//Push notification message
	Pusher.logToConsole = true;
	var pusher = new Pusher('fd0440e60019404539bf', {
		cluster: 'eu',
		forceTLS: true
	});

	var channel = pusher.subscribe('notification-message-' + $user_id);
	channel.bind('notification', function(data) {
		var audio = new Audio('public/sounds/notification.mp3');
		audio.play();

		//if user watching notification page - add new notification message to page
		if(page === 'notifications') {
			setTimeout(function(){ location.reload(); }, 800);
		}
	});

	//Chats
	//var chats = get_avaliable_chats($user_id);

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
			url: 'public/user/notifications/viewed',
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
		var data = {
			'id': $(this).parent().attr('data-id')
		};

		if($(this).parent().find('span').eq(0).hasClass('not_viewed'))
			$("#notifications_count").text($("#notifications_count").text() - 1);

		$.ajax({
			url: 'public/user/notifications/delete',
			method: "POST", 
			data: data,
			success: function(data) 
			{
				$("[data-id=" + data + "]").toggle('slow');
			}
		});
	})

	//delete all notifications
	$('#delete_all_notifications').on('click', function(){
		var data = {
			'id': 'all'
		};

		$.ajax({
			url: 'public/user/notifications/delete',
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
			url: 'public/user/browsing_history/clear_history',
			method: "GET", 
			success: function(data) 
			{
				$("#visits").children().toggle('slow');
			}
		});
	})
});


/********* Functions ***********/

function count_unread() {
	data = {
		'user_id': $user_id
	}
	$.ajax({
		url: 'public/user/notifications/count',
		method: "POST",
		data: data,
		success: function(data) 
		{
			$("#notifications_count").text(Number(data));
		}
	});
}
