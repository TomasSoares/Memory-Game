<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Controller;

class UserController extends Controller
{

    public function index()
    {
        return User::all();
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);
        
        $user = User::create($validatedData);
        return response()->json($user, 201);
    }


    public function show($id)
    {
        $user = User::with(['transactions', 'gamesCreated', 'gamesWon', 'multiplayerGamesPlayed'])->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Display the authenticated user.
     */
    public function showMe(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Get all users.
     */
    public function getAllUsers(Request $request)
    {
        try {
            $nicknameFilter = $request->query('nickname', '');

            $users = User::where('type', 'P')
            ->where('nickname', 'like', '%' . $nicknameFilter . '%')
            ->orderBy('name')
            ->select([
                'id',
                'name',
                'nickname',
                'email',
                'type',
                'blocked',
                \DB::raw('(SELECT SUM(brain_coins) FROM transactions WHERE transactions.user_id = users.id) AS total_brain_coins'),
                \DB::raw('(SELECT COUNT(*) FROM transactions WHERE transactions.user_id = users.id) AS total_transactions')

            ])
            ->paginate(10);

            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar utilizadores: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao buscar utilizadores'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user);
    }

    /**
     * Block the specified user.
     * @param Request $request
     * @id int $id -> id do user para bloquear
     */
    public function block(Request $request)
    {
        try {
            $userToBlock = User::findOrFail($request->id);

            $userToBlock->blocked = 1;
            $userToBlock->save();

            return response()->json(['message' => 'User blocked successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao bloquear utilizador: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao bloquear utilizador'], 500);
        }
    }

    /**
     * Unblock the specified user.
     * @param Request $request
     * @id int $id -> id do user para desbloquear
     */
    public function unblock(Request $request)
    {
        try {
            $userToUnblock = User::findOrFail($request->id);

            $userToUnblock->blocked = 0;
            $userToUnblock->save();

            return response()->json(['message' => 'User unblocked successfully'], 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao desbloquear utilizador: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao desbloquear utilizador'], 500);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
