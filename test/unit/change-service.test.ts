import changeService from "../../src/services/changes";

let insertMock = jest.fn();
let getMock = jest.fn();
const mockChangesRepo =  {
    insert: insertMock,
    get: getMock,
};

describe("changeService", () => {

  beforeEach(async () => {
    jest.restoreAllMocks();
    getMock.mockImplementation(() => null);
    insertMock.mockImplementation(() => null);
  });

  test("should not throw", () => {
    expect(() => {
      changeService((mockChangesRepo));
    }).not.toThrow();
  });

  test("Returns id if inserted", async () => {
    insertMock.mockImplementation(() => "507f1f77bcf86cd799439011");
    const insertedId = await changeService(mockChangesRepo).registerChange({
      articleId: "123",
      applied: false,
      user: 'static-for-now',
      type: 'steps',
      steps: [],
      path: 'abstract',
      timestamp: 1605198300275,
    });
    expect(insertedId).toBe("507f1f77bcf86cd799439011");
  });

  test("Returns list of changes", async () => {
    const change = {
      articleId: "1234",
      applied: false,
      user: 'static-for-now',
      path: 'abstract',
      timestamp: 1605198300275,
      steps: [
        {
          stepType: "replace",
          from: 121,
          to: 121,
          slice: {
            content: [
              {
                type: "text",
                text: "a",
              },
            ],
          },
        },
      ],
    };
    getMock.mockImplementation(() => ({ total: 1, changes: [change] }));
    const changes = await changeService(mockChangesRepo).getChangesforArticle("1234", 0);
    expect(changes).toEqual({ total: 1, changes: [change] });
  });
});
