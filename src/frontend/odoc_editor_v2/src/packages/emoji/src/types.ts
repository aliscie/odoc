import type { Emoji } from '@emoji-mart/data';
import type { TriggerComboboxPlugin } from '@udecode/plate-combobox';
import type { EElementOrText } from '@udecode/plate-common';

type ReverseMap<T> = T[keyof T];

export type EmojiSettingsType = {
  buttonSize: {
    value: number;
  };
  categories: {
    value?: EmojiCategoryList[];
  };
  perLine: {
    value: number;
  };
  showFrequent: {
    key?: string;
    limit?: number;
    prefix?: string;
    value: boolean;
  };
};

export interface EmojiPlugin<TEmoji extends Emoji = Emoji>
  extends TriggerComboboxPlugin {
  createEmojiNode?: (emoji: TEmoji) => EElementOrText<any>;
}

export const EmojiCategory = {
  Activity: 'activity',
  Custom: 'custom',
  Flags: 'flags',
  Foods: 'foods',
  Frequent: 'frequent',
  Nature: 'nature',
  Objects: 'objects',
  People: 'people',
  Places: 'places',
  Symbols: 'symbols',
} as const;

export type EmojiCategoryList = ReverseMap<typeof EmojiCategory>;

export type i18nProps = {
  categories: Record<EmojiCategoryList, string>;
  clear: string;
  pick: string;
  search: string;
  searchNoResultsSubtitle: string;
  searchNoResultsTitle: string;
  searchResult: string;
  skins: Record<'1' | '2' | '3' | '4' | '5' | '6' | 'choose', string>;
};

export type EmojiIconList<T = string> = {
  categories: Record<EmojiCategoryList, { outline: T; solid: T }>;
  search: {
    delete: T;
    loupe: T;
  };
};
