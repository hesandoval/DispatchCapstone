# DispatchCapstone

## Project Setup
Notes for installing dependencies:
* During the Anaconda installation you will need to provide the directory
to install anaconda, by default it will be set to 
`/home/<user>/anaconda2` you need to set the path to `/opt/anaconda2/`
* After Anaconda is done installing **DO NOT** provide `yes` as an answer
to the question when the installer asks if you want to set your path. We will
set the path manually at the end of the installation
```bash
$ bash setup.sh
...
```
### Setting Python environment for all users:
* We will update `/etc/environment` to include our anaconda environment
* On the line containing `PATH=` add `/opt/anaconda2/bin:` after the opening quote
```bash
$ sudo nano /etc/environment
```
* Finally update the environment and PATH:
```bash
$ source /etc/environment && export PATH
```
### Clone project:
```bash
cd /srv
/srv$ sudo git clone https://github.com/hesandoval/DispatchCapstone.git
Cloning into 'DispatchCapstone'...
Username for 'https://github.com': <username>
Password for 'https://<username>@github.com': <password> 
...
Checking connectivity... done.
```

### Run node project:
```bash
/srv/$ cd DispatchCapstone/WheresCarry
$ sudo PORT=80 forver start app.js
```

### Load Capstone Env1
```bash
/srv$ sudo su
root@/srv$ cd Kafka/py
root@/srv$Kafka/py$ conda env create -f environment.yml
```


### Generating Fake Data:
```bash
root@/srv$Kafka/py$ source activate CapstoneEnv1
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654767 -121.801105 36.654771 -121.800207
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654777 -121.799259 36.654770 -121.798227
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654759 -121.797876 36.654750 -121.796613
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654748 -121.796240 36.654746 -121.795285
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654742 -121.794848 36.654720 -121.793443
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.654629 -121.793359 36.654093 -121.793364
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.653983 -121.793369 36.652862 -121.793371
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.652815 -121.793376 36.652335 -121.793379
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.652337 -121.793698 36.652343 -121.794310
(CapstoneEnv1)root@/srv/Kafka/py$ python msg-generator.py 36.652840 -121.795611 36.652844 -121.797499
```

### Start TCP Server:
```bash
(CapstoneEnv1)root@/srv$ cd Kafka/py
(CapstoneEnv1)root@/srvKafka/py$ sudo python Producer/DispatchTCPServer.py
```

### Start Consumer:
```bash
(CapstoneEnv1)root@/srv$Kafka/py$ sudo python Consumer/TestConsumer.py --setup
Database completed. Run application
(CapstoneEnv1)root@/srvKafka/py$ sudo python Consumer/TestConsumer.py --database
...
```

### Start Data Transfer Client:
```bash
(CapstoneEnv1)root@/srvKafka/py$ python Producer/DataTransferClient.py
...
```
