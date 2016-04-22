#!/bin/bash
# The Coordinates for Carry Robot on CSUMB
sudo su << EOF
source activate CapstoneEnv1
python $PWD/msg-generator.py 36.654767 -121.801105 36.654771 -121.800207
python $PWD/msg-generator.py 36.654777 -121.799259 36.654770 -121.798227
python $PWD/msg-generator.py 36.654759 -121.797876 36.654750 -121.796613
python $PWD/msg-generator.py 36.654748 -121.796240 36.654746 -121.795285
python $PWD/msg-generator.py 36.654742 -121.794848 36.654720 -121.793443
python $PWD/msg-generator.py 36.654629 -121.793359 36.654093 -121.793364
python $PWD/msg-generator.py 36.653983 -121.793369 36.652862 -121.793371
python $PWD/msg-generator.py 36.652815 -121.793376 36.652335 -121.793379
python $PWD/msg-generator.py 36.652337 -121.793698 36.652343 -121.794310
python $PWD/msg-generator.py 36.652840 -121.795611 36.652844 -121.797499
EOF
echo "Messages Generated!"
