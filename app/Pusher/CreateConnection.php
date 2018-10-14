<?php

namespace App\Pusher;
use Pusher\Pusher;

class CreateConnection {
    private $key = 'fd0440e60019404539bf';
    private $app_id = '616439';
    private $secret = '0ef7fcfa104bbb18391b';
    private $cluster = "eu";

    public function newConnection($chanel, $trigger, $data){
      $options = array(
				'cluster' => $this->cluster,
		  );
		  $pusher = new Pusher(
				$this->key,
				$this->secret,
				$this->app_id,
				$options
		  );

			$pusher->trigger($chanel, $trigger, $data);

    }
}

?>