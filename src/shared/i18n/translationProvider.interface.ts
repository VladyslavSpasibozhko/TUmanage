interface TranslationProvider {
  translate(
    text: string,
    from: string,
    to: string,
    context?: string,
  ): Promise<string>;
}

export type { TranslationProvider };
