<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller sederhana untuk area admin.
 *
 * Saat ini hanya dipakai sebagai entry point umum ke view dashboard admin,
 * sementara detail fitur yang lebih kompleks dikelola di controller spesifik
 * seperti AdminOrderController dan AdminProcurementController.
 */
class AdminController extends Controller
{
    /**
     * Menampilkan halaman dashboard admin utama.
     */
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }
}
