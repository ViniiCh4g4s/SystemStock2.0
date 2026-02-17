<?php

namespace App\Http\Controllers;

use App\Models\StockItem;
use App\Models\StockItemPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StockItemController extends Controller
{
    public function index()
    {
        $items = StockItem::with('photos')
            ->orderBy('name')
            ->get()
            ->map(fn (StockItem $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'qty' => $item->qty,
                'minQty' => $item->min_qty,
                'location' => $item->location,
                'notes' => $item->notes ?? '',
                'photos' => $item->photos->pluck('url')->toArray(),
                'photoIds' => $item->photos->pluck('id')->toArray(),
                'createdAt' => $item->created_at->getTimestampMs(),
                'updatedAt' => $item->updated_at->getTimestampMs(),
            ]);

        return Inertia::render('home', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'qty' => 'required|integer|min:0',
            'min_qty' => 'required|integer|min:0',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|max:2048',
        ]);

        $item = StockItem::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? '',
            'qty' => $validated['qty'],
            'min_qty' => $validated['min_qty'],
            'location' => $validated['location'] ?? '',
            'notes' => $validated['notes'] ?? '',
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $i => $photo) {
                $path = $photo->store('stock-photos', 'public');
                $item->photos()->create(['path' => $path, 'sort_order' => $i]);
            }
        }

        return redirect()->route('home')->with('toast', [
            'type' => 'success',
            'message' => 'Item adicionado ao estoque.',
        ]);
    }

    public function update(Request $request, StockItem $stockItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'qty' => 'required|integer|min:0',
            'min_qty' => 'required|integer|min:0',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|max:2048',
            'kept_photo_ids' => 'nullable|array',
            'kept_photo_ids.*' => 'integer|exists:stock_item_photos,id',
        ]);

        $stockItem->update([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? '',
            'qty' => $validated['qty'],
            'min_qty' => $validated['min_qty'],
            'location' => $validated['location'] ?? '',
            'notes' => $validated['notes'] ?? '',
        ]);

        // Remove photos not in kept_photo_ids
        $keptIds = $validated['kept_photo_ids'] ?? [];
        $photosToDelete = $stockItem->photos()->whereNotIn('id', $keptIds)->get();
        foreach ($photosToDelete as $photo) {
            Storage::disk('public')->delete($photo->path);
            $photo->delete();
        }

        // Add new photos
        if ($request->hasFile('photos')) {
            $currentCount = $stockItem->photos()->count();
            foreach ($request->file('photos') as $i => $photo) {
                if ($currentCount + $i >= 5) break;
                $path = $photo->store('stock-photos', 'public');
                $stockItem->photos()->create(['path' => $path, 'sort_order' => $currentCount + $i]);
            }
        }

        return redirect()->route('home')->with('toast', [
            'type' => 'success',
            'message' => 'Item atualizado.',
        ]);
    }

    public function updateQty(Request $request, StockItem $stockItem)
    {
        $validated = $request->validate([
            'qty' => 'required|integer|min:0',
        ]);

        $stockItem->update(['qty' => $validated['qty']]);

        return redirect()->route('home')->with('toast', [
            'type' => 'success',
            'message' => 'Quantidade atualizada.',
        ]);
    }

    public function destroy(StockItem $stockItem)
    {
        foreach ($stockItem->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }
        $stockItem->delete();

        return redirect()->route('home')->with('toast', [
            'type' => 'success',
            'message' => 'Item excluído do estoque.',
        ]);
    }
}
