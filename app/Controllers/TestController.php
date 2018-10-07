<?php

namespace App\Controllers;
use Pusher\Pusher;

class TestController extends Controller{
	public function index($request, $response){
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
    $pusher->trigger('my-channel', 'my-event', $data);
          
    return $this->view->render($response, 'test.twig');
  }
}