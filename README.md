# DispatchCapstone

## Project Setup
Notes for installing dependencies:
* The script installs java, zookeeper, kafka, anaconda, and node in that order. The java install requires user input

```bash
$ bash setup.sh
...
```
* During the Anaconda installation you will need to provide the directory
to install anaconda, by default it will be set to 
`/home/<user>/anaconda2` you need to set the path to `/opt/anaconda2/`
```bash
Anaconda2 will now be installed into this location:
/home/<user>/anaconda2

- Press ENTER to confirm the location
- Press CTRL-C to abort the installation
- Or specify a different location below

[/home/<user>/anaconda2] >>> /opt/anaconda2/  
```
* After Anaconda is done installing **DO NOT** provide `yes` as an answer
to the question when the installer asks if you want to set your path. We will
set the path manually at the end of the installation
```bash
Python 2.7.11 :: Continuum Analytics, Inc.
creating default environment...
installation finished.
Do you wish the installer to prepend the Anaconda2 install location
to PATH in your /home/<user>/.bashrc ? [yes|no]
[no] >>> no
...
```
### Setting Python environment for all users:
* We will update `/etc/environment` to include our anaconda environment
* On the line containing `PATH=` add `/opt/anaconda2/bin:` after the opening quote
```bash
$ sudo nano /etc/environment
```
* Finally reload the environment and PATH:
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
/srv/DispatchCapstone/WheresCarry$ sudo npm install
/srv/DispatchCapstone/WheresCarry$ sudo PORT=80 forever start app.js
```

### Load Capstone Env1
```bash
/srv/DispatchCapstone/WheresCarry$ cd ..
/srv/DispatchCapstone$ sudo su
root@/srv/DispatchCapstone$ cd Kafka/py
root@/srv/DispatchCapstone/Kafka/py$ conda env create -f environment.yml
```


### Generating Fake Data:
```bash
root@/srv/DispatchCapstone/Kafka/py$ chmod +x test_coordinates.sh
root@/srv/DispatchCapstone/Kafka/py$ ./test_coordinates.sh
Messages Generated!
```

### Start TCP Server:
```bash
root@/srv/DispatchCapstone/Kafka/py$ source activate CapstoneEnv1
(CapstoneEnv1)root@/srv/DispatchCapstone/Kafka/py$ python Producer/DispatchTCPServer.py & disown
```

### Start Consumer:
```bash
(CapstoneEnv1)root@/srv/DispatchCapstone/Kafka/py$ python Consumer/TestConsumer.py --setup
Database completed. Run application
(CapstoneEnv1)root@/srv/DispatchCapstone/Kafka/py$ python Consumer/TestConsumer.py --database & disown
...
```

### Start Data Transfer Client:
```bash
(CapstoneEnv1)root@/srv/DispatchCapstone/Kafka/py$ python Producer/DataTransferClient.py & disown
...
```

### Killing Processes:
```bash
$ ps
```
ps lists all running processes
find process ID number of the process to kill
```bash
$ kill [pid]
```
NOTE: [pid] is the process ID
example: kill 1234

