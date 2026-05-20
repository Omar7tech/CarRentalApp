<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => (string) $this->name,
            'slug' => (string) $this->slug,
            'logo' => (string) "https://www.carlogos.org/car-logos/" . $this->slug . "-logo.png",
            'show_on_website' => (bool) $this->show_on_website,
        ];
    }
}
