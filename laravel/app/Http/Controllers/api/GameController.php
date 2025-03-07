<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class GameController extends Controller
{

    public function index()
    {
        $games = Game::with(['transactions', 'board', 'multiplayerGamesPlayed', 'creator', 'winner'])->get();
        return response()->json($games);
    }

    public function store(Request $request)
    {
        $user = new UserResource($request->user());

        $validatedData = $request->validate([
            'total_time' => 'required|numeric',
            'total_turns_winner' => 'required|numeric',
            'board_id' => 'required|exists:boards,id',
        ]);

        $user_id = $user->id;
        $board_id = $validatedData['board_id'];
        $total_time = $validatedData['total_time'];
        $total_turns = $validatedData['total_turns_winner'];

        $personalBest = Game::where('created_user_id', $user_id)
            ->where('board_id', $board_id) 
            ->whereNotNull('total_turns_winner')
            ->whereNotNull('total_time')
            ->orderBy('total_turns_winner', 'asc')
            ->orderBy('total_time', 'asc')
            ->first();

        \Log::info('Personal Best:', ['personalBest' => $personalBest]);

        $beatPersonalBest = (!$personalBest) || 
        ($total_turns < $personalBest->total_turns_winner) || 
        ($total_turns === $personalBest->total_turns_winner && $total_time < $personalBest->total_time); 

        $beatGlobalTop3 = $this->isGlobalTop3($board_id, $total_turns, $total_time);

        if ($beatPersonalBest && $beatGlobalTop3) {
            $user = User::find($user_id);
            $user->increment('brain_coins_balance', 2);
        } elseif ($beatPersonalBest || $beatGlobalTop3) {
            $user = User::find($user_id);
            $user->increment('brain_coins_balance', 1);
        }

        $game = new Game();
        $game->created_user_id = $user_id;
        $game->board_id = $board_id;
        $game->total_time = $total_time;
        $game->total_turns_winner = $total_turns;
        $game->type = 'S'; 
        $game->status = 'E';
        $game->save();

        return response()->json([
            'message' => 'Game data saved successfully!',
            'game' => $game,
            //'beat_personal_best' => $beatPersonalBest,
            //'beat_global_top3' => $beatGlobalTop3,
        ]);
    }

    private function isGlobalTop3($boardId, $time)
    {
        $globalTop3 = Game::where('board_id', $boardId)
            ->whereNotNull('total_time')
            ->orderBy('total_time', 'asc')
            ->limit(3)
            ->pluck('total_time');

        return $globalTop3->count() < 3 || $time < $globalTop3->max();
    }


    public function show($id)
    {
        $game = Game::with(['transactions', 'board', 'creator', 'winner'])->findOrFail($id);
        return response()->json($game);
    }

    public function gamehistory(Request $request)
    {
        $user = new UserResource($request->user());

        $games = Game::with(['creator:id,nickname', 'winner:id,nickname'])
            ->where('created_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $customGames = $games->map(function ($game) {
            return [
                'id' => $game->id,
                'status' => $game->status,
                'num_turns' => $game->total_turns_winner ?? '0',
                'board' => $game->board->board_cols . 'x' . $game->board->board_rows,
                'created_at' => $game->created_at->format('d/m/Y H:i:s'),
            ];
        });

        return response()->json([
            'current_page' => $games->currentPage(),
            'data' => $customGames,
            'total' => $games->total(),
            'last_page' => $games->lastPage(),
            'per_page' => $games->perPage(),
            'next_page_url' => $games->nextPageUrl(),
            'prev_page_url' => $games->previousPageUrl(),
        ]);
    }

    public function personalScoreboard(Request $request)
    {
        $user = new UserResource($request->user());

        $scores = Game::join('users', 'games.created_user_id', '=', 'users.id')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->selectRaw('users.nickname as player, 
                        CONCAT(boards.board_cols, "x", boards.board_rows) as boardSize,  
                        games.total_time as bestTime, 
                        games.total_turns_winner as fewestTurns')
            ->where('games.created_user_id', $user->id)
            ->whereNotNull('games.total_time')
            ->orderBy('games.total_turns_winner', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->take(5)
            ->get();

        return response()->json($scores);
    }

    public function globalScoreboard_3por4()
    {
        $scores = Game::join('users', 'games.winner_user_id', '=', 'users.id')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->where('boards.board_cols', 3)
            ->where('boards.board_rows', 4)
            ->orderBy('games.total_turns_winner', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->take(5)
            ->get(['users.nickname as player', 'games.total_time as bestTime', 'games.total_turns_winner as fewestTurns']);

        return response()->json($scores);
    }

    public function globalScoreboard_4por4()
    {
        $scores = Game::join('users', 'games.winner_user_id', '=', 'users.id')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->where('boards.board_cols', 4)
            ->where('boards.board_rows', 4)
            ->orderBy('games.total_turns_winner', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->take(5)
            ->get(['users.nickname as player', 'games.total_time as bestTime', 'games.total_turns_winner as fewestTurns']);

        return response()->json($scores);
    }

    public function globalScoreboard_6por6()
    {
        $scores = Game::join('users', 'games.winner_user_id', '=', 'users.id')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->where('boards.board_cols', 6)
            ->where('boards.board_rows', 6)
            ->orderBy('games.total_turns_winner', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->take(5)
            ->get(['users.nickname as player', 'games.total_time as bestTime', 'games.total_turns_winner as fewestTurns']);

        return response()->json($scores);
    }


    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $validatedData = $request->validate([
            'created_user_id' => 'sometimes|exists:users,id',
            'winner_user_id' => 'nullable|exists:users,id',
            'type' => 'sometimes|in:PE,PL,E,I',
            'status' => 'sometimes|in:S,M',
            'total_time' => 'nullable|numeric',
            'board_id' => 'sometimes|exists:boards,id',
        ]);

        $game->update($validatedData);
        return response()->json($game);
    }


    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }

    // -------------------------------------------------------------------------
    // ------------------------------ Multiplayer ------------------------------
    // -------------------------------------------------------------------------

    public function multiplayerGameCreated(Request $request)
    {
        $user = new UserResource($request->user());

        $validatedData = $request->validate([
            'board_id' => 'required|exists:boards,id',
        ]);

        $board_id = $validatedData['board_id'];

        $game = new Game();
        $game->created_user_id = $user->id;
        $game->board_id = $board_id;
        $game->type = 'M';
        $game->status = 'PE';
        $game->save();

        return response()->json([
            'message' => 'Multiplayer game created successfully!',
            'game' => $game,
        ]);
    }

    public function multiplayerGameStarted(Request $request)
    {
        $user = new UserResource($request->user());

        $validatedData = $request->validate([
            'game_id' => 'required|exists:games,id',
        ]);

        $game_id = $validatedData['game_id'];

        $game = Game::findOrFail($game_id);
        $game->status = 'PL';
        $game->save();

        return response()->json([
            'message' => 'Multiplayer game started successfully!',
            'game' => $game,
        ]);
    }

    public function multiplayerGameDeleted(Request $request) {
        $user = new UserResource($request->user());

        $validatedData = $request->validate([
            'game_id' => 'required|exists:games,id',
        ]);

        $game_id = $validatedData['game_id'];

        $game = Game::findOrFail($game_id);
        $game->status = 'I';
        $game->save();

        return response()->json([
            'message' => 'Multiplayer game deleted successfully!',
            'game' => $game,
        ]);
    }
}
