FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8806
CMD [ "node", "ttsapp.js" ]

