<?php

namespace Database\Seeders;

use App\Models\StockItem;
use Illuminate\Database\Seeder;

class StockItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Compressor 12.000 BTUs', 'category' => 'Compressores', 'qty' => 4, 'min_qty' => 2, 'location' => 'Prateleira A1', 'notes' => 'Rotativo - Gás R-410A. Marca Embraco.'],
            ['name' => 'Compressor 18.000 BTUs', 'category' => 'Compressores', 'qty' => 1, 'min_qty' => 2, 'location' => 'Prateleira A1', 'notes' => 'Rotativo - Gás R-22. Verificar disponibilidade com fornecedor.'],
            ['name' => 'Compressor 24.000 BTUs', 'category' => 'Compressores', 'qty' => 3, 'min_qty' => 1, 'location' => 'Prateleira A2', 'notes' => 'Scroll - Gás R-410A. Copeland.'],
            ['name' => 'Correia A-42', 'category' => 'Correias', 'qty' => 12, 'min_qty' => 5, 'location' => 'Gaveta B3', 'notes' => 'Uso em motores de ventilação das condensadoras.'],
            ['name' => 'Correia A-55', 'category' => 'Correias', 'qty' => 3, 'min_qty' => 5, 'location' => 'Gaveta B3', 'notes' => 'Para fan coils de grande porte.'],
            ['name' => 'Correia B-68', 'category' => 'Correias', 'qty' => 7, 'min_qty' => 3, 'location' => 'Gaveta B4', 'notes' => 'Uso geral em motores trifásicos.'],
            ['name' => 'Motor Ventilador 1/4 CV', 'category' => 'Motores', 'qty' => 2, 'min_qty' => 1, 'location' => 'Depósito 2', 'notes' => 'Motor monofásico 220V. Eixo 12mm.'],
            ['name' => 'Motor Ventilador 1/2 CV', 'category' => 'Motores', 'qty' => 0, 'min_qty' => 1, 'location' => 'Depósito 2', 'notes' => 'ESGOTADO - Fazer pedido urgente! Motor trifásico 380V.'],
            ['name' => 'Motor Ventilador 1 CV', 'category' => 'Motores', 'qty' => 1, 'min_qty' => 1, 'location' => 'Depósito 2', 'notes' => 'Trifásico 380V. WEG W22.'],
            ['name' => 'Hélice 400mm 3 Pás', 'category' => 'Hélices', 'qty' => 6, 'min_qty' => 3, 'location' => 'Prateleira C1', 'notes' => 'Plástico reforçado. Encaixe eixo 12mm.'],
            ['name' => 'Hélice 500mm 5 Pás', 'category' => 'Hélices', 'qty' => 2, 'min_qty' => 2, 'location' => 'Prateleira C1', 'notes' => 'Alumínio. Para condensadoras de grande porte.'],
            ['name' => 'Capacitor 25µF', 'category' => 'Componentes Elétricos', 'qty' => 15, 'min_qty' => 5, 'location' => 'Gaveta D1', 'notes' => '440V. Uso em motores monofásicos de compressor.'],
            ['name' => 'Contator Tripolar 25A', 'category' => 'Componentes Elétricos', 'qty' => 4, 'min_qty' => 2, 'location' => 'Gaveta D2', 'notes' => 'Bobina 220V. Schneider LC1D25.'],
            ['name' => 'Filtro Secador 3/8"', 'category' => 'Componentes Frigorígenos', 'qty' => 8, 'min_qty' => 4, 'location' => 'Prateleira E1', 'notes' => 'Solda. Para linhas de líquido até 3TR.'],
            ['name' => 'Gás Refrigerante R-410A (11,3kg)', 'category' => 'Componentes Frigorígenos', 'qty' => 2, 'min_qty' => 3, 'location' => 'Depósito 3 - Área ventilada', 'notes' => 'Cilindro descartável. Conferir validade na etiqueta.'],
        ];

        foreach ($items as $item) {
            StockItem::create($item);
        }
    }
}
