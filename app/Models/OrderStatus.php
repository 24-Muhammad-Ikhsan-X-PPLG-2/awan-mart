<?php

namespace App\Models;

enum OrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Processing = 'processing';
    case Shipped = 'shipped';
    case Completed = 'completed';
    case Canceled = 'canceled';
}
