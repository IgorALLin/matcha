<?php

use Slim\Http\Request;
use Slim\Http\Response;

use App\Middleware\AuthControlMiddleware;
use App\Middleware\GuestControlMiddleware;
use App\Middleware\ActivityMiddleware;
use App\Middleware\VisitNotificationMiddleware;

$app->get('/test', 'TestController:index')->setName('test');

$app->get('/', 'HomeController:index')->setName('home');

$app->group('', function() {
	$this->get('/auth/signup', 'AuthController:getSignUp')->setName('auth.signup');
	$this->post('/auth/signup', 'AuthController:postSignUp');

	$this->get('/auth/signin', 'AuthController:getSignIn')->setName('auth.signin');
	$this->post('/auth/signin', 'AuthController:postSignIn');

	$this->get('/auth/email/confirm', 'ConfirmEmailController:getConfirm')->setName('auth.email.confirm');
})->add(new GuestControlMiddleware($container));

$app->group('', function() use ($container) {
	$this->get('/auth/signout', 'AuthController:getSignOut')->setName('auth.signout');

	$this->get('/auth/password/change', 'PasswordController:getChangePassword')->setName('auth.password.change');
	$this->post('/auth/password/change', 'PasswordController:postChangePassword');

	$this->get('/user/profile', 'UserProfileController:getUserProfile')->setName('user.profile');
	$this->post('/user/profile', 'UserProfileController:postUserProfile');

	$this->get('/search', 'SearchController:search')->setName('search');
	$this->post('/search', 'SearchController:filters');

	$this->get('/show', 'ShowProfileController:show')->setName('showProfile');

	//$this->post('/getCountry', 'GeoController::getCountry')->setName('getCountry');
	$this->post('/getCountry', 'GeoController:getCountry')->setName('getCountry');

	$this->get('/user/notifications', 'NotificationController:notifications')->setName('user.notifications');
	$this->post('/user/notifications/viewed', 'NotificationController:viewed');
	$this->post('/user/notifications/delete', 'NotificationController:delete');
	$this->post('/user/notifications/count', 'NotificationController:count');

	//$this->post('/user/notifications', 'NotificationController:post');

	$this->get('/user/browsing_history', 'BrowsingHistoryController:index')->setName('user.browsing_history');
	$this->get('/user/browsing_history/clear_history', 'BrowsingHistoryController:delete')->setName('user.browsing_history.delete');

	$this->get('/chats', 'ChatsController:index')->setName('chats');

	$this->post('/user/like', 'LikesController:like')->setName('user.like');

	$this->post('/user/save_tag', 'TagsController:save_tag');
	$this->post('/user/get_tags', 'TagsController:get_tags');
})->add(new AuthControlMiddleware($container))
  ->add(new ActivityMiddleware($container));
