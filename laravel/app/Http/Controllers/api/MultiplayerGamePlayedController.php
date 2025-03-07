<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\MultiplayerGamePlayed;
use Illuminate\Http\Request;

class MultiplayerGamePlayedController extends Controller
{

    public function index()
    {
        $multiplayerGamesPlayed = MultiplayerGamePlayed::with(['user', 'game'])->get();
        return response()->json($multiplayerGamesPlayed);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:games,id',
            'player_won' => 'required|boolean',
            'pairs_discovered' => 'required|integer|min:0',
        ]);

        $multiplayerGamePlayed = MultiplayerGamePlayed::create($validatedData);
        return response()->json($multiplayerGamePlayed, 201);
    }


    public function show($id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::with(['user', 'game'])->findOrFail($id);
        return response()->json($multiplayerGamePlayed);
    }


    public function update(Request $request, $id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::findOrFail($id);

        $validatedData = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'game_id' => 'sometimes|exists:games,id',
            'player_won' => 'sometimes|boolean',
            'pairs_discovered' => 'sometimes|integer|min:0',
        ]);

        $multiplayerGamePlayed->update($validatedData);
        return response()->json($multiplayerGamePlayed);
    }

    
    public function destroy($id)
    {
        $multiplayerGamePlayed = MultiplayerGamePlayed::findOrFail($id);
        $multiplayerGamePlayed->delete();
        return response()->json(['message' => 'Multiplayer game record deleted successfully']);
    }
}
