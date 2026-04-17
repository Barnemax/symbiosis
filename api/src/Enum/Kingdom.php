<?php

namespace App\Enum;

enum Kingdom: string
{
    case Bird = 'bird';
    case Tree = 'tree';
    case Fungus = 'fungus';

    public function plural(): string
    {
        return match ($this) {
            self::Bird => 'birds',
            self::Tree => 'trees',
            self::Fungus => 'fungi',
        };
    }

    public function slug(): string
    {
        return $this->plural();
    }
}
