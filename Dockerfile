FROM node:alpine
WORKDIR '/app'
RUN ["npm","install","-g","nodemon"]
COPY ./package.json ./
RUN ["npm","install"]
COPY ./ ./

CMD ["npm","run","dev"]
