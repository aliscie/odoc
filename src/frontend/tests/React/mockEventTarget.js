class MockEventTarget {
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {}
}

jest.mock('jsdom', () => {
  return {
    ...jest.requireActual('jsdom'),
    EventTarget: MockEventTarget,
  };
});
