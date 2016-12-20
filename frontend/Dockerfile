FROM node
ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install -g http-server
RUN mkdir -p /app
WORKDIR /app

COPY /app/ ./
RUN npm install
RUN npm run build

CMD cd build && hs

EXPOSE 8080
