<?php

namespace App\Controllers\User;

use App\Controllers\Controller;
use App\Pusher\CreateConnection;

class ChatsController extends Controller{
	public function index($request, $response) {
		$res = $this->chats->get_chats_list($_SESSION['user']);

    	return $this->view->render($response, 'chats/index.twig', ['chats' => $this->chats->get_chats_list($_SESSION['user'])]);
	}

	public function chat($request, $response, $args) {
		$chat_chanel = $args['chanel'];
		$chat = $this->chats->get_chat_by_chanel($chat_chanel);
		if(!$chat || !$chat[0]['active'])
			return $response->withRedirect($this->router->pathFor('chats'));
		$user_photo = $this->chats->get_user_photo($chat_chanel, $_SESSION['user']);
		$messages = $this->chat_messages->get_chat_messages($chat[0]['id']);

    	return $this->view->render($response, 'chats/chat.twig', 
    		[
    			'messages' => $messages,
    			'photo' => $user_photo
    		]);
	}

	public function get_chats($request, $response) {
		if($_SESSION['user']){
			$chats = $this->chats->find_all_chats($_SESSION['user']);

			if($chats){
				$chanels = array();
				foreach($chats as $chat){
					$chanel = $chat['chanel'];
					$chanels[] = $chanel;
				}

				return $response->withJson($chanels);
			}
		}

		exit();
	}

	public function send_message($request, $response) {
		$post_data = $request->getParsedBody();
		$message['message'] = $post_data['message'];
		$message['user'] = $_SESSION['user'];
		$chat_chanel = $post_data['chat_chanel'];
		$chat = $this->chats->get_chat_by_chanel($chat_chanel);
		if(!$chat || !$chat[0]['active'])
			return $response->withJson('not-active');

		$user_id = $this->chats->get_users_id_by_chanel($chat_chanel);
		if($user_id[0]['user_id'] == $_SESSION['user'])
			$user_id = $user_id[0]['user1_id'];
		else
			$user_id = $user_id[0]['user_id'];

		$pusher = new CreateConnection();

		$pusher->chat_message($chat_chanel, $message);
		$message['type'] = 'from-chat';
		$message['from-chanel'] = $chat_chanel;
		$pusher->notification_message($user_id, $message);

		$this->chat_messages->save($message['message'], $chat[0]['id'], $_SESSION['user']);

		$last_message_time = $this->chat_messages->get_last_mesasge_time($chat[0]['id']);

		$this->chats->change_last_message_time($chat[0]['id'], $last_message_time['time']);

		exit();
	}

	public function count($request, $response){
		return $response->withJson($this->chats->count($_SESSION['user']));
	}
}

?>