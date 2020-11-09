import * as request from "supertest";

// move to enviroment;
const API_URL = "localhost:8080";
const agent = request.agent(API_URL);

describe("Get /article/id/changes", () => {
  test("Returns 404 if there are no changes", async () => {
    return agent.get("/articles/00000/changes").expect(404);
  });

  test("Can get changes for an article", async () => {
    const change = {
      articleId: "54296",
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
    return agent
      .post("/articles/54296/changes")
      .send(change)
      .expect(200)
      .then(() =>
        agent
          .get("/articles/54296/changes")
          .expect("Content-Type", /json/)
          .then((response) => {
            const changes = response.body.changes;
            const { _id, ...rest } = changes[0];
            expect(changes.length).toBe(1);
            expect(rest).toEqual(change);
          })
      );
  });
});
