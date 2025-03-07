<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_user_id',
        'winner_user_id',
        'type',
        'status',
        'total_turns',
        'total_time',
        'board_id',
    ];


    public function transactions():HasMany
    {
        return $this->hasMany(Transaction::class, 'game_id', 'id');
    }


    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }


    public function multiplayerGamesPlayed():HasMany
    {
        return $this->hasMany(MultiplayerGamePlayed::class, 'game_id', 'id');
    }


    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }


    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_user_id');
    }
    
}
