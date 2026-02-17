<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{App, Crypt, Hash};
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Só cria o admin fora do ambiente de testes
        if (!App::environment('testing')) {
            $this->createAdminUser();
        }
    }

    /**
     * Cria o usuário administrador padrão
     */
    private function createAdminUser(): void
    {
        // Cria o usuário administrador padrão (ou recupera se já existir)
        $user = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Vinicius Boschetti',
                'avatar'   => 'default-1.jpg',
                'password' => Hash::make('admin@123'),
            ]
        );

        // Configura 2FA para ambiente de desenvolvimento
        $secret = 'JBSWY3DPEHPK3PXP';

        // Gera recovery codes
        $recoveryCodes = [];

        for ($i = 0; $i < 8; $i++) {
            $recoveryCodes[] = Str::random(10);
        }

        $user->two_factor_secret         = Crypt::encrypt($secret);
        $user->two_factor_recovery_codes = Crypt::encrypt(json_encode($recoveryCodes));
        $user->two_factor_confirmed_at   = now();
        $user->save();
    }
}
