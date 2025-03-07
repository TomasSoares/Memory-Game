<?php

namespace App\Policies;

use App\Models\User;

class StatisticsPolicy
{

    public function before(User $user, string $ability): bool|null
    {
        if ($user->type === 'A') {
            return true;
        }
        return null;
    }


    public function viewGeneral(User $user): bool
    {
        return true;
    }

    public function viewAdmin(User $user): bool
    {
        return $user->type === 'A';
    }
}
