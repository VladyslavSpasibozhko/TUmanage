type SupportedLocale = string;

type TranslationParams = Record<string, string | number>;

type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

type PluralForm = Partial<Record<PluralCategory, string>>;

type TranslationText = string | PluralForm;

interface TranslationValue {
  text: TranslationText;
  description: string;
}

type TranslationResources = Record<
  SupportedLocale,
  Record<string, Record<string, TranslationValue>>
>;

export type {
  SupportedLocale,
  TranslationParams,
  PluralCategory,
  PluralForm,
  TranslationText,
  TranslationValue,
  TranslationResources,
};
