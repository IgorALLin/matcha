$(document).ready(function() {
	$user_id = $('.navbar .dropdown button').attr('data-id');
	console.log($user_id); 

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
	});

	//notification page
	$('#guests').show();
	$('#notification ul li').on('click', function(){
		$this = $(this);

		$this.siblings().find('a').removeClass('active');
		$this.find('a').addClass('active');

		$('#notification .table').hide();
		$('#' + $this.attr('data-id')).show();
	});
});
