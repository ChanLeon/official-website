FROM node:8.9.1

RUN npm config set registry https://registry.npm.taobao.org/

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --unsafe-perm
COPY . /usr/src/app
RUN npm run fis

CMD [ "npm", "run", "dev" ]
EXPOSE 7001