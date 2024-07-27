import React from 'react';

import type { EmojiCategoryList } from '../../types';

import { AGridSection, Grid, type IGrid } from '../Grid';

export type EmojiFloatingGridType = IGrid<
  React.RefObject<HTMLDivElement>,
  EmojiCategoryList
>;

export class EmojiFloatingGrid extends Grid<
  React.RefObject<HTMLDivElement>,
  EmojiCategoryList
> {
  public createRootRef() {
    return React.createRef<HTMLDivElement>();
  }
}

export class EmojiGridSectionWithRoot extends AGridSection<
  React.RefObject<HTMLDivElement>,
  EmojiCategoryList
> {
  protected createRootRef() {
    this._root = React.createRef<HTMLDivElement>();
  }
}
