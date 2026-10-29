<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function loginView()
    {
        return Inertia::render('auth/login');
    }
    public function registerView()
    {
        return Inertia::render('auth/register');
    }
    public function login(Request $req)
    {
        $dataForm = $req->validate([
            'email' => 'required|email',
            'password' => 'min:8'
        ]);
        if (!Auth::attempt($dataForm, true)) {
            return redirect()->to('/auth/login')->withErrors([
                'email' => 'Email atau password salah',
                'password' => 'Email atau password salah'
            ])->onlyInput('email');
        }
        $req->session()->regenerate();
        return redirect()->intended('/');
    }
    public function register(Request $req)
    {
        $dataForm = $req->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|unique:pelanggan,name|min:4',
            'password' => 'required|string|min:8|confirmed:confirmPassword',
        ], [
            // Email
            'email.required' => 'Email tidak boleh kosong!',
            'email.email' => 'Format email tidak valid!',
            'email.unique' => 'Email sudah terdaftar!',

            // Name
            'name.required' => 'Nama tidak boleh kosong!',
            'name.string' => 'Nama harus berupa teks!',
            'name.unique' => 'Nama sudah digunakan!',
            'name.min' => 'Nama minimal 4 karakter!',

            // Password
            'password.required' => 'Password tidak boleh kosong!',
            'password.string' => 'Password harus berupa teks!',
            'password.min' => 'Password minimal 8 karakter!',
            'password.confirmed' => 'Konfirmasi password tidak cocok!',
        ]);
        // buat dlu user nya
        $user = User::query()->create([
            'email' => $dataForm['email'],
            'password' => $dataForm['password'],
            'role' => 'pelanggan'
        ]);
        // baru buat data pelanggan
        Pelanggan::query()->create([
            'id_user' => $user->id,
            'name' => $dataForm['name'],
        ]);
        Auth::login($user, true);
        $req->session()->regenerate();
        return redirect()->intended('/');
    }
    public function logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();
        return redirect()->to('/auth/login');
    }
}
