#!/bin/bash

docker pull techbazaar/dev-data:latest
cd /root/docker-compose/data
docker-compose down
docker-compose up -d
