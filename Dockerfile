FROM node:12

WORKDIR /usr/src/facerec-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]