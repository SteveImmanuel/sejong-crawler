FROM node:16.15

RUN apt-get update && apt-get install -y \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libatk1.0-0 \
  libgtk-3-0 \
  libgbm-dev

COPY . /app/sejong-crawler/

WORKDIR /app/sejong-crawler/
RUN npm install

CMD npm start