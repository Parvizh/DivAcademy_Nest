FROM node:18.2.0-alpine3.15

WORKDIR /app

COPY package*.json ./

ENV GENERATE_SOURCEMAP=false
# ENV NODE_OPTIONS=--max-old-space-size=16384

RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
