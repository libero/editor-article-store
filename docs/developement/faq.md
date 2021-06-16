## Git commit & push hooks

`editor-article-store` uses [`husky`](https://www.npmjs.com/package/husky) to run pre-commit and pre-push checks on code. these are configured in the `package.json` `husky` section.

To override the pr-commit and pre-push checks use the `--no-verify` arg in your cli command. eg:

`git commit -m "feat: some change I don't want lint checked" --no-verify"`
