<?php

namespace App\Models;

enum ProcurementStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Completed = 'completed';
}
