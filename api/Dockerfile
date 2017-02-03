FROM golang

ADD . /go/src/github.com/McMenemy/sequentify/api
RUN go get github.com/McMenemy/sequentify/api

ENTRYPOINT /go/bin/api

EXPOSE 8080
