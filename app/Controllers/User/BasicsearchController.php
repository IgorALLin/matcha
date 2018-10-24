<?php

namespace App\Controllers\User;

use App\Controllers\Controller;

class BasicsearchController extends Controller
{

	public function basic_search($request, $response)
	{
		$age_max = $this->container->search->get_age_max();
		$fame_max = $this->container->search->get_fame_max();
		$age_max = (int)$age_max;
		$fame_max = (int)$fame_max;

		return $this->view->render($response, 'search_basic.twig');	
	}


	public function basic_filters($request, $response) 
	{
		if(isset($_POST['method']) && $_POST['method'] == "showGallery")
		{
				
			return $this->getIntrestingProfiles();
		}
		
		return $response->withRedirect($this->router->pathFor('searchbasic'));
	}

	public function getIntrestingProfiles()
	 {
	
		$id = $_SESSION['user'];


		$filtered = $this->container->BasicSearch->getFiltered($id);
		return $filtered;

	}

}
?>