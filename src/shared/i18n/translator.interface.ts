import type { SupportedLocale, TranslationParams } from "./types";

interface ITranslator {
  readonly locale: SupportedLocale;
  t(key: string, params?: TranslationParams): string;
}

export type { ITranslator };
