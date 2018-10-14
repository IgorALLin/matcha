<?php

namespace App\Models;

class Chats {
	private $container;

	public function __construct($container){
		$this->container = $container;
	}

	/*public function get_chats($id) {
        $sql = "SELECT ";
    }*/
    
    public function find_chat($uid1, $uid2) {
        $sql = "SELECT count(*)
                FROM `chats`
                WHERE (`user_id` = :uid1 AND `user_id` = :uid2)
                    OR (`user_id` = :uid2 AND `user_id` = :uid1)";
        $stmt = $this->container->db->prepare($sql);
        $stmt->bindParam(':uid1', $uid1);
        $stmt->bindParam(':uid2', $uid2);
        $stmt->execute();

        return  $stmt->fetchColumn();  
    }

}

?>