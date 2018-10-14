<?php

namespace App\Controllers\User;

use App\Controllers\Controller;
use App\Pusher\CreateConnection;

class ChatsController extends Controller{
	public function index($request, $response) {
    return $this->view->render($response, 'chats/index.twig'/*, ['chats' => $this->container->chats->get_chats($_SESSION['user'])]*/);
	}
}

?>