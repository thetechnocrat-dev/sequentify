FROM golang

ADD . /go/src/github.com/user/sequentify/backend
RUN go get ./src/github.com/user/sequentify/backend
ENTRYPOINT /go/bin/backend

EXPOSE 8080
