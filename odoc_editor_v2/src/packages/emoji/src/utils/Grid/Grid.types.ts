export type Unknown = unknown;

export type GridRow = {
  elements: string[];
  id: number;
};

export type GridRows = GridRow[];

export type SectionId = string;

export type SectionElements = string[];

export interface IGridSection<R, T> {
  addElements: (elements: SectionElements) => this;
  getRows: () => GridRows;
  id: T;
  root: R;
  rowsNum: number;
  setIndexRowStart: (start: number) => this;
  updateElements: (elements: SectionElements) => this;
}

export type GridElements<S extends SectionId = SectionId> = Record<S, string[]>;

export interface IGrid<R, T extends SectionId> {
  addSection: (
    sectionId: T,
    section: IGridSection<R, T>,
    elements: GridElements
  ) => this;
  indexOf: (sectionId: T) => number;
  section: (sectionId: T) => IGridSection<R, T>;
  sections: () => IGridSection<R, T>[];
  size: number;
  updateSection: (sectionId: T, elements: SectionElements) => this;
}
