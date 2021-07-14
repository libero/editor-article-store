import { default as express } from 'express';
import { http415Response } from '../providers/errors';
import { logRequest } from '../middlewares/log-request';
import { ArticleService } from '../services/article';
import { TransformService } from '../services/transform';

export default (
    articleService: ArticleService,
    transformerService: TransformService,
    config: { exportTransformEnabled: boolean },
): express.Router => {
    const router = express.Router();

    // Log all requests on this route.
    router.use(logRequest);

    // Get a list of all the available articles.
    router.get(
        '/',
        async (req, res, next) => {
            const accept = req.headers.accept || '*/*';
            if (accept.includes('application/json') || accept.includes('*/*')) {
                // todo: address as part of the depedency injection work
                const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 0;
                const articles = await articleService.getArticles(page);
                return res.type('application/json').status(200).json({ articles });
            } else {
                next();
            }
        },
        http415Response,
    );

    // Gets the specified article.
    router.get('/:articleId', async (req, res) => {
        const accept = req.headers.accept || '';
        const articleId = req.params.articleId;

        const article = await articleService.findByArticleId(articleId);

        if (!article) {
            console.log(`No Article Found: ${articleId}`);
            return res.sendStatus(404);
        }

        if (accept.includes('application/xml')) {
            return res.type('text/xml').status(200).send(article.xml);
        } else {
            return res.type('application/json').status(200).json(article);
        }
    });

    // exports the specified article XML with changes.
    router.get('/:articleId/export', async (req, res) => {
        const accept = req.headers.accept || '';
        const articleId = req.params.articleId;

        let xml = await articleService.exportXml(articleId);
        xml = await transformerService.articleMetaOrderTransform(xml as string);

        if (xml === null) {
            return res.sendStatus(404);
        }

        if (config.exportTransformEnabled) {
            xml = await transformerService.exportTransform(xml as string);
        }

        if (accept.includes('application/xml')) {
            return res.type('text/xml').status(200).send(xml);
        } else {
            // anything but XML is unacceptable
            return res.sendStatus(406);
        }
    });

    return router;
};
