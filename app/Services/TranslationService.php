<?php

namespace App\Services;

use Illuminate\Support\Facades\{Http, Log};

class TranslationService
{
    private const API_URL = 'https://api.mymemory.translated.net/get';

    /**
     * Traduz um texto para vários idiomas
     *
     * @param string $text Texto para traduzir
     * @param string $fromLang Idioma de origem (pt, en, es, fr)
     * @return array Array com traduções ['en' => '...', 'es' => '...', 'fr' => '...']
     */
    public function translateToAll(string $text, string $fromLang = 'pt'): array
    {
        $languages    = ['pt', 'en', 'es', 'fr'];
        $translations = [];

        foreach ($languages as $targetLang) {
            if ($targetLang === $fromLang) {
                $translations[$targetLang] = $text;

                continue;
            }

            $translations[$targetLang] = $this->translate($text, $fromLang, $targetLang);
        }

        return $translations;
    }

    /**
     * Traduz um array de textos
     */
    public function translateArrayToAll(array $texts, string $fromLang = 'pt'): array
    {
        $languages = ['pt', 'en', 'es', 'fr'];
        $result    = [];

        foreach ($languages as $targetLang) {
            if ($targetLang === $fromLang) {
                $result[$targetLang] = $texts;

                continue;
            }

            $translated = [];

            foreach ($texts as $text) {
                $translated[] = $this->translate($text, $fromLang, $targetLang);
            }
            $result[$targetLang] = $translated;
        }

        return $result;
    }

    /**
     * Traduz um texto único
     */
    private function translate(string $text, string $from, string $to): string
    {
        try {
            $response = Http::get(self::API_URL, [
                'q'        => $text,
                'langpair' => "{$from}|{$to}",
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return $data['responseData']['translatedText'] ?? $text;
            }

            Log::warning("Translation failed for: {$text}", [
                'from'     => $from,
                'to'       => $to,
                'response' => $response->body(),
            ]);

            return $text; // Retorna original se falhar

        } catch (\Exception $e) {
            Log::error("Translation error: {$e->getMessage()}");

            return $text;
        }
    }
}
