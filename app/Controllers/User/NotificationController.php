<?php

namespace App\Controllers\User;

use App\Controllers\Controller;

class NotificationController extends Controller{
	public function notifications($request, $response) {
		return $this->view->render($response, 'user/notofications.twig', ['notifications' => $this->notification->getNotifications($_SESSION['user'])->fetchAll()]);
	}

	public function viewed($request, $response){
		$param = $request->getParsedBody();
		$id = $param['id'];

		$this->notification->viewed($id);
		
		return $response->withJson($id);
	}

	public function delete($request, $response){
		$param = $request->getParsedBody();
		$id = $param['id'];

		if($id !== 'all')
			$this->notification->delete($id);
		else
			$this->notification->delete_all();
		return $response->withJson($id);
	}

	public function count($request, $response){
		return $response->withJson($this->notification->count($_SESSION['user']));
	}
}

?>