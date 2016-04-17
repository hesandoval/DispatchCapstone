# DispatchCapstone

## Project Setup
To install all Dependencies:
```bash
$ bash setup.sh
```
Clone project:
```bash
cd /srv
/srv$ sudo git clone https://github.com/hesandoval/DispatchCapstone.git
Cloning into 'DispatchCapstone'...
Username for 'https://github.com': <username>
Password for 'https://<username>@github.com': <password> 
...
Checking connectivity... done.
```

Run node project:
```bash
/srv/$ cd DispatchCapstone/WheresCarry
$ sudo PORT=80 forver start app.js
```

Start TCP Server:
```bash
/srv$ source activate CapstoneEnv1
(CapstoneEnv1)/srv$ cd Kafka/py
(CapstoneEnv1)/srv/Kafka/py$ sudo python Producer/DispatchTCPServer.py
```

Start Consumer:
```bash
(CapstoneEnv1)/srv/Kafka/py$ sudo python Consumer/TestConsumer.py --setup
Database completed. Run application
(CapstoneEnv1)/srv/Kafka/py$ sudo python Consumer/TestConsumer.py --database
...
```