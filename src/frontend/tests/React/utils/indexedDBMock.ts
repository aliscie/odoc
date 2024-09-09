import { mock } from "vitest-mock-extended";

const IDBIndexMock = mock({
  get: () => {},
  getKey: () => {},
  getAll: () => {},
  getAllKeys: () => {},
  count: () => {},
});

Object.defineProperty(window, "IDBIndex", {
  value: IDBIndexMock,
});

const IDBCursorMock = mock({
  advance: () => {},
  continue: () => {},
  delete: () => {},
  update: () => {},
});

Object.defineProperty(window, "IDBCursor", {
  value: IDBCursorMock,
});

const IDBDatabaseMock = mock({
  close: () => {},
  createObjectStore: () => {},
  deleteObjectStore: () => {},
  transaction: () => IDBTransactionMock,
});

Object.defineProperty(window, "IDBDatabase", {
  value: IDBDatabaseMock,
});

const IDBObjectStoreMock = mock({
  createIndex: () => IDBIndexMock,
  index: () => IDBIndexMock,
  openCursor: () => IDBCursorMock,
  add: () => {},
  put: () => {},
  get: () => {},
  delete: () => {},
  clear: () => {},
});

Object.defineProperty(window, "IDBObjectStore", {
  value: IDBObjectStoreMock,
});

const IDBTransactionMock = mock({
  objectStore: () => IDBObjectStoreMock,
  abort: () => {},
  commit: () => {},
});

Object.defineProperty(window, "IDBTransaction", {
  value: IDBTransactionMock,
});

const IDBRequestMock = mock<IDBRequest>({
  addEventListener: (type: string, listener: EventListener) => {},
  removeEventListener: (type: string, listener: EventListener) => {},
  result: IDBTransactionMock,
  error: null,
  readyState: "done",
  onsuccess: () => {},
  onerror: () => {},
});

const indexedDBMock = mock({
  open: () => Promise.resolve(IDBRequestMock),
  deleteDatabase: () => Promise.resolve(IDBRequestMock),
  cmp: () => 0,
});

Object.defineProperty(window, "indexedDB", {
  value: indexedDBMock,
});

Object.defineProperty(window, "IDBRequest", {
  value: IDBRequestMock,
});

export { indexedDBMock, IDBRequestMock };
