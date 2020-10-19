import { default as express } from 'express';
import path from 'path';
import { logRequest } from '../middlewares/log-request';

export default (articleService: any): express.Router => {
  const router = express.Router();

  // Log all requests on this route.
  router.use(logRequest);
  
  // Get a list of all the available articles.
  router.get('/', async (req, res) => {
    const articles = await articleService.getArticles(req.query.page || 0);
    res
      .type("application/json")
      .status(200)
      .json({ articles });
  });
  
  // Gets the specified article.
  router.get('/:articleId', async (req, res) => {
    const accept = req.headers.accept || "";
    const articleId = req.params.articleId;

    const article = await articleService.findByArticleId(articleId); 

    if (!article) {
      res.sendStatus(404);
    }

    if (accept.includes("application/xml")) {
      console.log("Hit", accept);
      res
        .type("text/xml")
        .status(200)
        .send(article.xml);
    } else {
      res
        .type("application/json")
        .status(200)
        .json(article);
    }
  });

  return router;
} 