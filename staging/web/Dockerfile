FROM node:18

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
RUN npm install
#RUN nginx install
COPY ./src /app/src
EXPOSE 3000
CMD ["node","src/server.js"]
