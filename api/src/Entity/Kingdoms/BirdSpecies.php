<?php

namespace App\Entity\Kingdoms;

use App\Entity\Species;
use Doctrine\ORM\Mapping as ORM;

// STI discriminator marker. Kingdom-specific fields live on Species because
// API Platform resolves the resource class (Species), not the runtime subclass.
#[ORM\Entity]
class BirdSpecies extends Species
{
}
