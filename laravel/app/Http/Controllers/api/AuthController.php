<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;


class AuthController extends Controller
{
    use SoftDeletes;

    private function purgeExpiredTokens(){
        // Only deletes if token expired 2 hours ago
        $dateTimetoPurge = now()->subHours(2);
        
        DB::table('personal_access_tokens')
            ->where('expires_at', '<', $dateTimetoPurge)->delete();
    }

    private function revokeCurrentToken(User $user){
        $currentTokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', $currentTokenId)->delete();
    }

    public function login(LoginRequest $request){
        $this->purgeExpiredTokens();
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        if ($user->blocked === 1) {
            return response()->json(['message' => 'User blocked'], 403);
        }

        $token = $request->user()->createToken(
            'authToken',
            ['*'],
            now()->addHours(2)
        )->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function logout(Request $request){
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());

        return response()->json(null, 204);
    }

    public function refreshToken(Request $request){
        // Revokes current token and creates a new token
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());

        $token = $request->user()->createToken(
            'authToken',
            ['*'],
            now()->addHours(2)
        )->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function register(RegisterRequest $request)
    {
        $user = new User();
        $user->fill($request->validated());
        $user->save();

        return new UserResource($user);
    }

    public function updateProfile(UpdateUserRequest $request)
    {
        $user = Auth::user();
        $data = $request->only(['name', 'email', 'nickname', 'password', 'confirmPassword']);

        if (!empty($data['password'])) {
            if (empty($data['confirmPassword']) || $data['password'] !== $data['confirmPassword']) {
                return response()->json([
                    'message' => 'Password and confirm password must match and both are required when updating password.',
                    'errors' => [
                        'confirmPassword' => ['Password and confirm password must match and both are required when updating password.']
                    ]
                ], 400);
            }

            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
            unset($data['confirmPassword']);
        }

        $user->update($data);

        return new UserResource($user);
    }  

    /**
     * Delete the user account
     * Soft delete the user account 
     */
    public function deleteAccount(Request $request)
    {
        $user = Auth::user();
        $user->delete();

        return response()->json(null, 204);
    }
}
