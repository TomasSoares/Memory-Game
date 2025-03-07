<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Game;
use App\Models\Transaction;

class StatisticsController extends Controller
{
    public function viewGeneral()
    {
        $gamesByBoard = \DB::table('games')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->selectRaw('CONCAT(boards.board_cols, "x", boards.board_rows) as board_size, COUNT(games.id) as total_games')
            ->groupBy('board_size')
            ->get();

        return response()->json([
            'total_users' => User::count(),
            'total_games_played' => Game::count(),
            'games_last_week' => Game::where('created_at', '>=', now()->subWeek())->count(),
            'games_last_month' => Game::where('created_at', '>=', now()->subMonth())->count(),

        ]);
    }

    public function viewGamesPerBoard()
    {
        $gamesByBoard = \DB::table('games')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->selectRaw('CONCAT(boards.board_cols, "x", boards.board_rows) as board_size, COUNT(games.id) as total_games')
            ->groupBy('board_size')
            ->get();

        return response()->json([
            'games_by_board' => $gamesByBoard,
        ]);
    }


    public function viewAdmin()
    {
        $total_purchases = Transaction::where('type', 'P')->sum('brain_coins');
        $purchases_last_week = Transaction::where('type', 'P')->where('transaction_datetime', '>=', now()->subWeek())->sum('brain_coins');
        // numero de jogadores ativos (não bloqueados) na ultima semana 
        // para ver isso ve se o jogador participou de algum jogo na ultima semana created_user_id na tabela game tambem 
        // ou se participou de algum jogo na ultima semana user_id na tabela multiplayer_games_played
        // ou se fez alguma compra na ultima semana created_user_id na tabela transactions
        $total_active_players_last_week = User::where('blocked', 0)->where('type', 'P')
            ->where(function ($query) {
                $query->whereHas('gamesCreated', function ($query) {
                    $query->where('created_at', '>=', now()->subWeek());
                })->orWhereHas('multiplayerGamesPlayed', function ($query) {
                    $query->where('user_id', '>=', now()->subWeek());
                })->orWhereHas('transactions', function ($query) {
                    $query->where('created_at', '>=', now()->subWeek());
                });
            })->count();
        $total_register_players = User::where('type', 'P')->where('blocked', 0)->count();


        return response()->json([
            'total_purchases' => $total_purchases,
            'purchases_last_week' => $purchases_last_week,
            'total_active_players_last_week' => $total_active_players_last_week,
            'total_register_players' => $total_register_players,
        ]);
    }

    public function viewCoinsPurchasedPerMonth()
    {
        $coinsPerMonth = \DB::table('transactions')
            ->selectRaw('MONTHNAME(transaction_datetime) as month, SUM(brain_coins) as total_coins')
            ->where('type', 'P')
            ->where('transaction_datetime', '>=', now()->subMonths(12))
            ->groupByRaw('MONTH(transaction_datetime), MONTHNAME(transaction_datetime)')
            ->orderByRaw('MONTH(transaction_datetime) ASC')
            ->get();

        return response()->json([
            'coins_per_month' => $coinsPerMonth,
        ]);
    }



    /**
     * funcão returna o nome do mes em portugues de acordo com o numero do mes apenas dos ultimos 12 meses
     * com o numero de jogos jogados em cada mes
     * dividido por mes e por se e single ou multiplayer
     * para ver se o jogo esta a ser mais jogado em single ou multiplayer e atraves do campo type do jogo S ou M
     * todo numa unica query para ser mais eficiente
     * o return é um json com o nome do mes, o tipo de jogo e o numero de jogos jogados
     * exemplo: 
     * {
     * "games_by_month": [
     * {
     * "month": "January",
     * "singleplayer": 10,
     * "multiplayer": 5
     * },
     * {
     * "month": "February",
     * "singleplayer": 15,
     * "multiplayer": 7
     */
    public function viewGamesPerMonth()
    {
        $gamesByMonth = \DB::table('games')
            ->selectRaw('MONTHNAME(created_at) as month, type, COUNT(id) as total_games')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month', 'type')
            ->get();

        $formattedData = [];
        foreach ($gamesByMonth as $entry) {
            $month = $entry->month;
            if (!isset($formattedData[$month])) {
                $formattedData[$month] = [
                    'month' => $month,
                    'singleplayer' => 0,
                    'multiplayer' => 0
                ];
            }
            if ($entry->type == 'S') {
                $formattedData[$month]['singleplayer'] = $entry->total_games;
            } else if ($entry->type == 'M') {
                $formattedData[$month]['multiplayer'] = $entry->total_games;
            }
        }

        return response()->json([
            'games_by_month' => array_values($formattedData),
        ]);
    }

    public function viewPopularPurchaseMethod()
    {
        $popularPurchaseMethod = \DB::table('transactions')
            ->selectRaw('payment_type, COUNT(id) as total_purchases')
            ->where('payment_type', '!=', null)
            ->groupBy('payment_type')
            ->get();

        return response()->json([
            'popular_purchase_method' => array_values($popularPurchaseMethod->toArray()),
        ]);
    }
}
