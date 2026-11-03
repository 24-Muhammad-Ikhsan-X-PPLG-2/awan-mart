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
        $information = [
            'email' => $user->email,
            'role' => $user->role,
        ];
        if ($user->role === "admin") {
            $information['name'] = $user->admin->name;
            $information['alamat'] = $user->admin->alamat;
            $information['telp'] = $user->admin->telp;
            return $information;
        } else if ($user->role === "supplier") {
            $information['name'] = $user->supplier->name;
            $information['alamat'] = $user->supplier->alamat;
            $information['telp'] = $user->supplier->telp;
            return $information;
        } else {
            $information['name'] = $user->pelanggan->name;
            $information['alamat'] = $user->pelanggan->alamat;
            $information['telp'] = $user->pelanggan->telp;
            return $information;
        }
    }
}

if (!function_exists('getInformationUserRequest')) {
    function getInformationUserRequest(User|null $user)
    {
        if (!$user) {
            return null;
        }
        $information = [
            'email' => $user->email,
            'role' => $user->role->value,
        ];
        if ($user->role->value === "admin") {
            $information['name'] = $user->admin->name;
            $information['alamat'] = $user->admin->alamat;
            $information['telp'] = $user->admin->telp;
            return $information;
        } else if ($user->role->value === "supplier") {
            $information['name'] = $user->supplier->name;
            $information['alamat'] = $user->supplier->alamat;
            $information['telp'] = $user->supplier->telp;
            return $information;
        } else {
            $information['name'] = $user->pelanggan->name;
            $information['alamat'] = $user->pelanggan->alamat;
            $information['telp'] = $user->pelanggan->telp;
            return $information;
        }
    }
}
