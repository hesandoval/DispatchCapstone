# Kafka Setup
1. Download
http://kafka.apache.org/documentation.html#quickstart_download
2. Untar
```bash tar -xzf kafka_2.11-0.9.0.0.tgz```
## Specifications
version: 0.9.0
# How to Run
1. Travel to root directory
```bash cd kafka_2.11-0.9.0.0```
2. Start Zookeeper
```bash bin/zookeeper-server-start.sh config/zookeeper.properties```
3. Start Kafka Server
```bash bin/kafka-server-start.sh config/server.properties```