<?php

namespace App\Controllers\User;

use App\Controllers\Controller;
use App\Pusher\CreateConnection;

class LikesController extends Controller{
	public function like($request, $response) {

		$liked_id = $request->getParam('profile');
		$like_id = $_SESSION['user'];
		$conected = false;
		$pusher = new CreateConnection();
		//db table notification_type
		$type = 1;
		$chat_chanel_id = '';

		//if there is no like in db -> save like in db
		if(!$this->likes->findLike($liked_id, $like_id)) {
			//insert like to db
			$this->likes->insert_like($liked_id, $like_id);
			//if liked user liked user before -> user are connected
			//and they can use common chat
			if($this->likes->findLike($like_id, $liked_id)){
				$type = 3;
				//if chat already exist -> make it active
				if($this->chats->find_chat($liked_id, $like_id))
					$this->chats->enable($liked_id, $like_id);
				//else -> create new chat
				else
					$this->chats->create($liked_id, $like_id);
				//get chat chanel
				$chat_chanel_id = $this->chats->get_chanel($liked_id, $like_id)[0];
			}

			
		}
		//else delete like from db
		else {
			$type = 4;
			$this->likes->delete_like($liked_id, $like_id);
			if($this->chats->find_chat($liked_id, $like_id))
				$this->chats->disable($liked_id, $like_id);
		}

		$pusher->notification_message($liked_id, $chat_chanel_id);
		$this->notification->save($liked_id, $like_id, $type);
		
		return $response->withJson($chat_chanel_id);
	}
}

?>