<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function address(Request $req)
    {
        try {
            $validated = $req->validate([
                'recipient_name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:20'],
                'address' => ['required', 'string', 'max:1000'],
                'city' => ['required', 'string', 'max:100'],
                'province' => ['required', 'string', 'max:100'],
                'postal_code' => ['required', 'string', 'max:10'],
            ]);
            $user = Auth::user();
            if ($user->role->value === 'pelanggan') {
                Pelanggan::query()->where('user_id', '=', $user->id)->update([
                    'alamat' => $validated
                ]);
            }
            return response()->json([
                'message' => 'Successfully update address.'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'message' => $e->getMessage(),
            ]);
        }
    }
}
