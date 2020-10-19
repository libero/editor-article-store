import { default as express } from "express";
import { default as path } from "path";
import initialiseDb from "../db";
import articleRepository from "../repositories/articles";

// Route to ensure that the requested Article exists
export async function checkArticleExists(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  // todo: address as part of the depedency injection work
  const db = await initialiseDb('mongodb://root:password@localhost:27017', 'editor');
  const repo = articleRepository(db);
  const article = await repo.getByArticleId(request.params.articleId);
  if (!article) {
    response.sendStatus(404);
  }
  next();
}

// Returns the Article as XML
export async function getArticleAsXML(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const accept = request.headers.accept || "";
  if (accept.includes("application/xml")) {
    // todo: address as part of the depedency injection work
    const db = await initialiseDb('mongodb://root:password@localhost:27017', 'editor');
    const repo = articleRepository(db);
    const {xml} = await repo.getByArticleId(request.params.articleId);
    response
      .type("application/xml")
      .status(200)
      .sendFile(path.resolve(xml));
  } else {
    next();
  }
}

// Returns the Article as JSON
export async function getArticleAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const accept = request.headers.accept || "*/*";
  if (accept.includes("application/json") || accept.includes("*/*")) {
    // todo: address as part of the depedency injection work
    const db = await initialiseDb('mongodb://root:password@localhost:27017', 'editor');
    const repo = articleRepository(db);
    const article = await repo.getByArticleId(request.params.articleId);
    response
      .type("application/json")
      .status(200)
      .json(article);
  } else {
    next();
  }
}
