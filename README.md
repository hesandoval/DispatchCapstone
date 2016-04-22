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
(CapstoneEnv1)root@capstone-large-2:/srv/DispatchCapstone/Kafka/py# ps -au
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root       931  0.0  0.0  14536   920 tty4     Ss+  Apr20   0:00 /sbin/getty -8 
root       934  0.0  0.0  14536   924 tty5     Ss+  Apr20   0:00 /sbin/getty -8 
root       939  0.0  0.0  14536   912 tty2     Ss+  Apr20   0:00 /sbin/getty -8 
root       940  0.0  0.0  14536   916 tty3     Ss+  Apr20   0:00 /sbin/getty -8 
root       942  0.0  0.0  14536   920 tty6     Ss+  Apr20   0:00 /sbin/getty -8 
root      1094  0.0  0.0  14536   920 tty1     Ss+  Apr20   0:00 /sbin/getty -8 
nick     18668  0.0  0.1  21648  4240 pts/0    Ss   19:36   0:00 -bash
root     20115  0.4 11.1 4070416 428844 pts/0  Sl   19:46   0:18 java -Xmx1G -Xm
root     29464  0.0  0.0  63668  2112 pts/0    S    20:18   0:00 sudo su
root     29465  0.0  0.0  63248  1776 pts/0    S    20:18   0:00 su
root     29466  0.0  0.0  19820  2284 pts/0    S    20:18   0:00 bash
root     30170  0.2  0.3  85604 11696 pts/0    S    20:50   0:00 python Producer
root     30184  0.0  0.0  17164  1328 pts/0    R+   20:51   0:00 ps -au
```
ps -au lists all running processes
find process ID number of the process to kill
```bash
$ kill 30170
```
NOTE: [pid] is the process ID
example: kill 1234

