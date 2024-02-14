#!/bin/bash
sudo rm -rf /var/www/build/*
echo " checking files in /var/www/build/"
ls -ltr /var/www/build
echo " copying file into var/www/build/"
sudo cp -r /home/ubuntu/internal_project_fe/build/* /var/www/build/
echo "files copied in the directory"
ls -ltr /var/www/build
