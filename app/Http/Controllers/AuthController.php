<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
            'password' => 'required'
        ]);
        $key = Str::lower($dataForm['email']) . '|' . $req->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
                'password' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
            ]);
        }
        if (!Auth::attempt($dataForm, true)) {
            RateLimiter::hit($key, 60);
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
            'user_id' => $user->id,
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
