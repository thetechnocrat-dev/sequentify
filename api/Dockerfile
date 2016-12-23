FROM golang

ADD . /go/src/github.com/user/sequentify/api
RUN go get ./src/github.com/user/sequentify/api
ENTRYPOINT /go/bin/api

EXPOSE 8080
