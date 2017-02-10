# Sequentify Web App
[![Build Status](https://travis-ci.org/McMenemy/sequentify.svg?branch=master)](https://travis-ci.org/McMenemy/sequentify)

A web app to align DNA sequences ([Sequentify.com](http://sequentify.com/)).

## About
Sequentify is an open source web app that aligns DNA sequences. The purpose of the app is mostly to serve as an educational tool since it allows exploration of the alignment function through easy changing of function variables. However, it is also useful for researchers who just want a quick customizable alignment between sequences. For more complicated alignments, use [NCBI’s tool](https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastSearch&BLAST_SPEC=blast2seq&LINK_LOC=align2seq). For more information on how to make your alignment more biologically relevant read [here](https://en.wikipedia.org/wiki/Gap_penalty).

## Technical Features
* A web application utilizing dynamic programming to efficiently align submitted DNA Sequences
* Utilizes Go concurrency paradigms for efficient batch DNA alignments
* Backend RESTful API built in Golang; Frontend built in ReactJS; Deployed with Docker & AWS; Continuous integration with TravisCI

## Running locally
To run locally in dev mode, install docker-compose and then run the following command from the project folder:

$ docker-compose up

The app frontend will be running on localhost 5000 and the api will be running on localhost 3000.
The dev mode also features frontend hot-reloading and backend reloading on code changes.
