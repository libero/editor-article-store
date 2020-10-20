FROM node:lts-alpine as build

WORKDIR /app
COPY ./package.json ./dist ./
RUN npm install --production

FROM node:lts-alpine
COPY --from=build /app /
EXPOSE 8080/tcp

CMD ["node", "index.js"]