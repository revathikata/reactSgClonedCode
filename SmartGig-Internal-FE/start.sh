#!/bin/bash
sudo rm -rf /var/www/html/*
sudo cp -r /home/ubuntu/UI/dist/* /var/www/html/
sudo service nginx restart
