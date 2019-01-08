
import request from "supertest";
import {httpServer} from "./app";

describe("request an random url", () => {
  it("should return 404", (done) => {
    request(httpServer).get("/reset")
      .expect(404, done);
  });
});
