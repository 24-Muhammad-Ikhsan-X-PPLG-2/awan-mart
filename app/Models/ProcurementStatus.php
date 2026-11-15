<?php

namespace App\Models;

enum ProcurementStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Shipped = 'shipped';
    case Completed = 'completed';
}
