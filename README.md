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
/srv$ cd Kafka/py
/srv/Kafka/py$ conda env create -f environment.yml
```


### Generating Fake Data:
```bash
/srv/Kafka/py$ source activate CapstoneEnv1
(CapstoneEnv1)/srv/Kafka/py$ sudo bash test_coordinates.sh

Messages Generated!
```

### Start TCP Server:
```bash
(CapstoneEnv1)/srv$ cd Kafka/py
(CapstoneEnv1)/srv/Kafka/py$ sudo python Producer/DispatchTCPServer.py
```

### Start Consumer:
```bash
(CapstoneEnv1)/srv/Kafka/py$ sudo python Consumer/TestConsumer.py --setup
Database completed. Run application
(CapstoneEnv1)/srv/Kafka/py$ sudo python Consumer/TestConsumer.py --database
...
```

### Start Data Transfer Client:
```bash
(CapstoneEnv1)/srv/Kafka/py$ python Producer/DataTransferClient.py
...
```
