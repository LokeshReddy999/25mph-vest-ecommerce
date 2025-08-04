from node:18

workdir /usr/src/app

copy package*.json ./

run npm install

copy . .

expose 3000

entrypoint [ "node" ]

cmd [ "server.js" ]
