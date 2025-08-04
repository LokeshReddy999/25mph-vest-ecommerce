from node:18

workdir /usr/src/app

copy package*.json ./

run npm install

copy . .

entrypoint [ "node" ]

cmd [ "server.js" ]
