import { ITranslator } from "./translator.interface";
import { TranslationParams } from "./types";

export class Translator implements ITranslator {
  constructor(readonly locale: string) {}
  t(key: string, params: TranslationParams) {
    return key;
  }
}
