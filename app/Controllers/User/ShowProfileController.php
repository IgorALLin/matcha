<?php

namespace App\Controllers\User;

use App\Controllers\Controller;
use App\Pusher\CreateConnection;

class ShowProfileController extends Controller{
	public function show($request, $response){
		$param = $request->getQueryParams();
		$visited_id = $param['profile'];
		$user_id = $_SESSION['user'];
		$profile = $this->container->userProfile->getUserProfileById($visited_id);
		$chanel = 'notification-message-'.$visited_id;
		$trigger = 'notification';
		$like = 'like';

		//save notification to db (third param is notification type)
		$this->container->notification->save($visited_id, $user_id, 2);

		//send live notification to visited user
		$pusher = new CreateConnection();
		$pusher->newConnection($chanel, $trigger, $this->notification->getLastInsert($this->db->lastInsertId())->fetchAll());

		$photos = $this->photos->toArray($profile[0]);
		if($this->likes->findLike($visited_id, $user_id))
			$like = 'dislike';
		if(isset($param['profile'])) {
			if($profile){
				$this->container->visits->save($param['profile']);
				$this->container->fame_rating->update($param['profile']);

				return $this->view->render($response, 'show.twig', [
					'photos' => $photos,
					'profile' => $profile[0],
					'fame_rating' => $this->fame_rating->getRating($param['profile']),
					'like' => $like
				]);
			}
		}

		return $response->withRedirect($this->router->pathFor('search'));
	}
}

?>