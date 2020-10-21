#
# Stage: Development build
#
FROM node:lts-alpine as dev

WORKDIR /app

COPY  ./package.json \
      ./package-lock.json \
      ./tsconfig.json \
      ./

RUN npm install

COPY src/ src/

CMD ["npm", "run", "dev"]


#
# Stage: Production build
#
FROM dev as build-prod

COPY --from=dev /app/ .
RUN npm run build

#
# Stage: Production
#
FROM node:lts-alpine as prod
COPY --from=dev /app/node_modules node_modules
COPY --from=build-prod /app/dist /
EXPOSE 8080/tcp

CMD ["node", "index.js"]