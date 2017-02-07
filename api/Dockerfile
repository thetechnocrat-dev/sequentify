FROM golang

ARG app_env
ENV APP_ENV $app_env

ADD . /go/src/github.com/McMenemy/sequentify/api
WORKDIR /go/src/github.com/McMenemy/sequentify/api

RUN go get github.com/McMenemy/sequentify/api
RUN go build

RUN export ENV=${ENV}

CMD if [ ${APP_ENV} = "production" ]; \
	then \
	api; \
	else \
	go get github.com/pilu/fresh && \
	fresh; \
	fi
	
EXPOSE 8080
