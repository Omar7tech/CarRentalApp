<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandCollection;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = QueryBuilder::for(Brand::class)
            ->allowedFilters('name', 'show_on_website')
            ->paginate(10);
        return Inertia::render('brands/index', [
            'brands' => BrandResource::collection($brands),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        //
    }

    public function toggleShowOnWebsite(Brand $brand)
    {
        $brand->update([
            'show_on_website' => !$brand->show_on_website,
        ]);

        return back();
    }
}
