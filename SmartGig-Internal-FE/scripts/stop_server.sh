#!/bin/bash
# this file runs first, so during an initail installation error might happen

# simply stop the application process using pm2
echo "stopping service"
sudo service nginx stop