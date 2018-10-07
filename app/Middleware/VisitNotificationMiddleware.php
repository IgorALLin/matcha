<?php

namespace App\Middleware;
use Pusher\Pusher;

class VisitNotificationMiddleware extends Middleware {
	public function __invoke($request, $response, $next){
		$get_params = $request->getQueryParams();
		$id = $get_params['profile'];

		$options = array(
			'cluster' => 'eu',
		  );
		  $pusher = new Pusher(
			'fd0440e60019404539bf',
			'0ef7fcfa104bbb18391b',
			'616439',
			$options
		  );
		$data['message'] = 'hello world';
		$pusher->trigger('notification-message-1002', 'notification', $this->container->userProfile->getUserProfileById($id));
		$response = $next($request, $response);
		return $response;
	}
}

?>