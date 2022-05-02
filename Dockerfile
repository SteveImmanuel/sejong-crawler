FROM node:16.15

COPY . /app/sejong-crawler/

WORKDIR /app/sejong-crawler/
RUN npm install

CMD npm start