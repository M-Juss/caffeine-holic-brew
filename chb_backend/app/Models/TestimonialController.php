<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TestimonialController extends Model
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string',
        ]);

        $testimonial = Testimonial::create([
            'user_id' => $request->user()->id,
            'message' => $data['message'],
        ]);

        return response()->json($testimonial, 201);
    }

   public function removeTestimonial(Request $request, Testimonial $testimonial)
   {
    
        if ($testimonial->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted']);
    
   } 
}
