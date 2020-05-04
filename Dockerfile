FROM node:lts-alpine as build

WORKDIR /app
COPY ./package.json ./dist/release ./
COPY ./resources ./resources/
RUN npm install --production

FROM node:lts-alpine
COPY --from=build /app /
EXPOSE 8080/tcp

CMD ["node", "bundle.min.js"]