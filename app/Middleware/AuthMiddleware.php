<?php

namespace App\Middleware;

class AuthMiddleware extends Middleware {
	public function __invoke($request, $response, $next){
      	$this->container->view->getEnvironment()->addGlobal('auth', [
      		'check' => $this->container->auth->check(),
      		'user' => $this->container->auth->find()
      	]);
		
		$response = $next($request, $response);
		return $response;
	}
}

?>