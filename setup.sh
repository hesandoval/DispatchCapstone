#!/bin/bash

#git setup
sudo apt-get install -y git

#kafka setup
sudo add-apt-repository -y ppa:webupd8team/java
sudo apt-get update
sudo apt-get -y install oracle-java8-installer
sudo apt-get install -y zookeeperd
mkdir ~/Downloads
cd ~/Downloads
wget "http://mirror.ox.ac.uk/sites/rsync.apache.org/kafka/0.9.0.0/kafka_2.11-0.9.0.0.tgz" -O kafka.tgz
sudo mkdir -p /opt/kafka
cd /opt/kafka
sudo tar xvfz ~/Downloads/kafka.tgz --strip 1
cd /etc/init.d
sudo wget https://gist.githubusercontent.com/superscott/a1c67871cdd54b0c8693/raw/1a66fafd7fd39d8ba251e194ed123700dcd4d77b/kafka
sudo chmod 755 kafka
sudo update-rc.d kafka defaults

sudo service zookeeper start
sudo service kafka start

#python setup
cd ~/Downloads
wget https://3230d63b5fc54e62148e-c95ac804525aac4b6dba79b00b39d1d3.ssl.cf1.rackcdn.com/Anaconda2-2.5.0-Linux-x86_64.sh
bash Anaconda2-2.5.0-Linux-x86_64.sh
source ~/.bashrc

#node setup
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install forever -g

#rethinkDB setup
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install rethinkdb
sudo cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/instance.conf
sudo /etc/init.d/rethinkdb restart

ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa