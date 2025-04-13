#need this to install and run npm
FROM node:18

WORKDIR /
COPY package.json ./
COPY ./src ./src

RUN npm install
CMD ["node", "src/server.js"]
