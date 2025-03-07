<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'transaction_datetime',
        'user_id',
        'game_id',
        'type',
        'euros',
        'brain_coins',
        'payment_type',
        'payment_reference'
    ];


    public function game():HasOne
    {
        return $this->hasOne(Game::class, 'id', 'game_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
