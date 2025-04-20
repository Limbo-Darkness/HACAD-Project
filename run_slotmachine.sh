#!/bin/bash

echo "Starting the slot machine!"

cd staging

sudo docker stack deploy --detach=true -c docker-stack.yml myapp

sudo docker stack services myapp

cd ..
