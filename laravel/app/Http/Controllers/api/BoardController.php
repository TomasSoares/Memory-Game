<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        if ($request->bool == 'true') {
            return Board::where('board_cols', 3)
                    ->where('board_rows', 4)
                    ->get();
        }
        
        return Board::all();
    }

    public function board(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:boards,id',
        ]);

        return Board::find($validated['id']);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'board_cols' => 'required|integer|min:1',
            'board_rows' => 'required|integer|min:1',
            'custom' => 'nullable|json'
        ]);

        $board = Board::create($validatedData);
        return response()->json($board, 201);
    }

    public function show($id)
    {
        $board = Board::with('games')->findOrFail($id);
        return response()->json($board);
    }

    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);

        $validatedData = $request->validate([
            'board_cols' => 'sometimes|integer|min:1',
            'board_rows' => 'sometimes|integer|min:1',
            'custom' => 'nullable|json'
        ]);

        $board->update($validatedData);
        return response()->json($board);
    }

    public function destroy($id)
    {
        $board = Board::findOrFail($id);
        $board->delete();
        return response()->json(['message' => 'Board deleted successfully']);
    }
}
