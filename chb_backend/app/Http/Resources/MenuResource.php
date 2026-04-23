<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'image_path' => Storage::url($this->image_path),
            'name' => $this->name,
            'description' => $this->description,
            'is_available' => $this->is_available,       
            'sizes' => MenuSizeResource::collection($this->sizes)
        ];
    }
}
