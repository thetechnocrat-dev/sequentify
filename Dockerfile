FROM golang

ADD . /go/src/github.com/user/sequentify_api
RUN go install github.com/user/sequentify_api
ENTRYPOINT /go/bin/sequentify_api

EXPOSE 8080
