#!/bin/sh

tmp=`pwd`
echo `pwd`
cd /home/ubuntu/HarvestMini/web/
python manage.py runserver 0.0.0.0:8080 > /dev/null 2>&1 &

cd $tmp
echo `pwd`