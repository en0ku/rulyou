FROM node:22-alpine AS build
WORKDIR /opt/app
ADD *.json ./
RUN npm ci
ADD . .
RUN npm run build

FROM node:22-alpine
WORKDIR /opt/app
ADD *.json ./
ADD .env* ./
RUN npm ci --omit=dev
COPY --from=build /opt/app/dist ./dist
CMD ["node", "./dist/main.js"]
EXPOSE 3000/tcp