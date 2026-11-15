<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

if (!function_exists('getInformationUser')) {
    function getInformationUser()
    {
        $user = Auth::getUser();
        if (!$user) {
            return null;
        }

        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;
        $profile = match ($role) {
            'admin' => $user->admin,
            'supplier' => $user->supplier,
            default => $user->pelanggan,
        };

        return [
            'email' => $user->email,
            'role' => $role,
            'name' => $profile?->name,
            'alamat' => $profile?->alamat,
            'telp' => $profile?->telp,
        ];
    }
}

if (!function_exists('getInformationUserRequest')) {
    function getInformationUserRequest(User|null $user)
    {
        if (!$user) {
            return null;
        }

        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;
        $profile = match ($role) {
            'admin' => $user->admin,
            'supplier' => $user->supplier,
            default => $user->pelanggan,
        };

        return [
            'email' => $user->email,
            'role' => $role,
            'name' => $profile?->name,
            'alamat' => $profile?->alamat,
            'telp' => $profile?->telp,
        ];
    }
}
