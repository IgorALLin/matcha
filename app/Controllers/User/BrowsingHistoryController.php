<?php

namespace App\Controllers\User;
use App\Controllers\Controller;

Class BrowsingHistoryController extends Controller{
    public function index($request, $response) {
        return $this->view->render($response, 'user/visit.twig', ['visits' => $this->visits->getByVisitorId($_SESSION['user'], 0, 10)->fetchAll()]);
    }

    public function delete($request, $response) {
		$this->visits->clear_history();

		exit();
    }
}

?>