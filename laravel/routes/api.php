<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\GameController;
use App\Http\Controllers\api\BoardController;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\StatisticsController;
use App\Models\User;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::put('/auth/updateProfile', [AuthController::class, 'updateProfile']);
    Route::delete('/auth/deleteAccount', [AuthController::class, 'deleteAccount']);

    Route::get('/users/me', [UserController::class, 'showMe']);

    Route::get('/scoreboard/personal', [GameController::class, 'personalScoreboard']);
    Route::get('/game/gamehistory', [GameController::class, 'gamehistory']);

    Route::get('/users/me/coins', [TransactionController::class, 'getCoins']);
    Route::post('/users/me/coins/purchase', [TransactionController::class, 'purchaseCoins']);

    //Route::get('/statistics/admin', [StatisticsController::class, 'viewAdmin'])->can('viewAdmin', User::class);
    Route::get('/statistics/admin', [StatisticsController::class, 'viewAdmin']);
    Route::get('/statistics/admin/coins-per-month', [StatisticsController::class, 'viewCoinsPurchasedPerMonth']);
    Route::get('/statistics/admin/viewPopularPurchaseMethod', [StatisticsController::class, 'viewPopularPurchaseMethod']);
    
    Route::get('/users/me/coins', [TransactionController::class, 'getCoins']);
    Route::post('/users/me/coins/purchase', [TransactionController::class, 'purchaseCoins']);
    Route::post('/users/me/coins/spend', [TransactionController::class, 'spendCoins']);

    Route::get('/users/allUsers', [UserController::class, 'getAllUsers']);
    
    Route::put('/users/blockUser', [UserController::class, 'block']);
    Route::put('/users/unblockUser', [UserController::class, 'unblock']);

    Route::post('/game', [GameController::class, 'store']);

    // multiplayer
    Route::post('/multiplayer/gameCreate', [GameController::class, 'multiplayerGameCreated']);
    Route::post('/multiplayer/gameStart', [GameController::class, 'multiplayerGameStarted']);
});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/boards', [BoardController::class, 'index']);
Route::post('/board', [BoardController::class, 'board']);

Route::get('/scoreboard/global3por4', [GameController::class, 'globalScoreboard_3por4']);
Route::get('/scoreboard/global4por4', [GameController::class, 'globalScoreboard_4por4']);
Route::get('/scoreboard/global6por6', [GameController::class, 'globalScoreboard_6por6']);

Route::get('/statistics/general', [StatisticsController::class, 'viewGeneral']);
Route::get('/statistics/games-per-board', [StatisticsController::class, 'viewGamesPerBoard']);
Route::get('/statistics/viewGamesPerMonth', [StatisticsController::class, 'viewGamesPerMonth']);
