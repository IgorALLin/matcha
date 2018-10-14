<?php

namespace App\Controllers\User;

use App\Controllers\Controller;
use App\Pusher\CreateConnection;

class LikesController extends Controller{
	public function like($request, $response) {
		$liked_id = $request->getParam('profile');
		$like_id = $_SESSION['user'];
		$like_type = $request->getParam('type');
		$conected = false;
		$pusher = new CreateConnection();
		$chanel = 'notification-message-'.$liked_id;
		$trigger = 'notification';
		$type = 1;

		if(!$this->likes->findLike($liked_id, $like_id)) {
			if($this->likes->findLike($like_id, $liked_id)){
				$type = 3;
				/*if($this->chats->findChat($liked_id, $like_id))
					$new_chat = true;*/
			}

			$this->likes->insert_like($liked_id, $like_id);
		}
		else {
			$type = 4;
			$this->likes->delete_like($liked_id, $like_id);
		}
		$pusher->newConnection($chanel, $trigger, $type);
		$this->notification->save($liked_id, $like_id, $type);
		exit();
	}
}

?>