---
title: Running Hadoop on Multi Node Cluster
---

Running Hadoop 2.0.3-alpha On Ubuntu Linux - Multi Node Cluster
--------------------------------------------------------------
The goal of this tutorial is to run Hadoop 2.x on a multi-node cluster. 
For this exercise, we would be using two Ubuntu Linux boxes.

Prerequisities  
--------------

* Two Linux boxes with Ubuntu 12.* or One Linux box and one VM on the same box
* Running Hadoop Version 2 - Single Node cluster. Complete this tutorial before proceeding further.
[Singlenode Hadoop installation](single-node-cluster.html)  

This tutorial has been tested with the following software versions:

    Ubuntu Linux 12.04 LTS
    JDK 1.7 
	
Through out the tutorial, commands to be executed on the master and slave node are mentioned as follows:  

#####master -  execute commands on the master node

#####slave - execute commands on the slave node

Overview
--------
The following picture gives a brief overview of the cluster.
![Two Node Cluster](/images/multi-node.png)

FIG. 1 shows a two node cluster. Since, we have only two nodes, we will use the master node as both master and slave. For clarity, master and slave1 are shown as separate nodes. However, in this tutorial, master will also act as one of the slave.

Master node runs both the Namenode and ResourceManager . Since Master is also a slave, NodeManger and  DataNode also runs on the master node.

####Master
* NameNode
* Resource Manager
* NodeManager
* HstoryServer
* DataNode

####slave1
* Data Node
* Node Manager

Steps for Installation 
----------------------

####Step 1: Preparing the machines for the Cluster
Install the operating system on both the machines. The machines should be able to ping each other. Check the IP addresses of the machines. If dhcp is used, make sure the ip-address does not change for the rest of the tutorial.

Note the IP addresses. The IP address can be obtained by using the command 

```bash
$ sudo ifconfig eth0
```

master - 172.16.109.1  
slave - 172.16.109.128

*Note: IP addresses in your system may be different

* Edit /etc/hosts on the both master and slave. Add the following lines in /etc/hosts file

```xml
localhost	127.0.0.1
172.16.109.1	master
172.16.109.128	slave
```

Make sure other entries are removed or commented in the/etc/hosts file.
Verify that both machines ping each other 
```

#####master - Ping slave from master
From the master machine issue the following command

```bash
ping slave
```

#####slave - Ping master from slave
From the slave machine issue the following command

```bash
ping master
```
The ping should be successful, if not contact your IT support to fix any networking issues.

####Step 2: Creating dedicated user and storage directories

* Create user gpuser(home dir /home/gpuser) and group gp on both master and slave
* Create the following directories on namenode and masternode under home directory ___/home/gpuser___

#####master
```bash
mkdir -p data/namenode
mkdir -p data/datanode
```

#####slave
```bash
mkdir -p data/datanode
```

####Step 3: Install ssh and set up password less ssh between master and slave

##### master
Install SSH 

```bash
gpuser@master:~$sudo apt-get install ssh 
gpuser@master:~$sudo apt-get install rsync
```
Generate public/private RSA key pairs using the following command.

```bash
gpuser@master:~$ ssh-keygen -t rsa -P ""
Generating public/private rsa key pair.
Enter file in which to save the key (/home/gpuser/.ssh/id_rsa): 
Created directory '/home/gpuser/.ssh'.
Your identification has been saved in /home/gpuser/.ssh/id_rsa.
Your public key has been saved in /home/gpuser/.ssh/id_rsa.pub.
The key fingerprint is:
3c:f7:ca:f2:49:a7:05:ee:90:66:05:0f:7b:a9:63:fc gpuser@master
The key's randomart image is:
+--[ RSA 2048]----+
|                 |
|                 |
|        o        |
|       . = .     |
|        S B      |
|       . O o     |
|        X o +    |
|       +.B *     |
|         oE      |
+-----------------+
```

Press Enter to save the key in the default location.

Enable ssh to the local machine using the following command.
                 
```bash
gpuser@master:~$ cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys
```
* Test the ssh setup by connecting to the local machine with the gpuser user.
        
```bash
gpuser@master:~$ ssh localhost

The authenticity of host 'localhost (127.0.0.1)' can't be established.
ECDSA key fingerprint is ca:96:1c:5a:38:f8:9f:99:45:d4:57:82:3c:1b:64:b7.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'localhost' (ECDSA) to the list of known hosts.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
```

#####slave
repeat the above steps on slave  

#####Authorize master to allow ssh on slave node without the password

#####master
```bash
gpuser@master~$ ssh-copy-id -i $HOME/.ssh/id_rsa.pub gpuser@slave
```
Execute the command `ssh slave` to verify ssh to slave works without the password

```bash
gpuser@master:~$ ssh slave
Welcome to Ubuntu 12.10 (GNU/Linux 3.5.0-17-generic i686)

 * Documentation:  https://help.ubuntu.com/

329 packages can be updated.
98 updates are security updates.

Last login: Fri Apr  5 00:32:00 2013 from ip6-localhost
gpuser@slave:~$ 
#exit from the ssh
gpuser@slave:~$ exit
```

####Step 4: Install Hadoop on Master
Follow the steps as outlined in the tutorial 'Running Hadoop Version 2 - Single Node cluster' and complete the installation
of Hadoop on  master.

####Step 5: Master node configuration
Set the following environement variables in .bashrc

Open `.bashrc` file in the home folder and add the following lines at the end

```bash  
 export HADOOP_HOME=$HOME/hadoop-2.0.3-alpha      
 export HADOOP_MAPRED_HOME=$HOME/hadoop-2.0.3-alpha    
 export HADOOP_COMMON_HOME=$HOME/hadoop-2.0.3-alpha    
 export HADOOP_HDFS_HOME=$HOME/hadoop-2.0.3-alpha    
 export YARN_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_CONF_DIR=$HOME/hadoop-2.0.3-alpha/etc/hadoop    
 export JAVA_HOME=$HOME/java/jdk1.7.0_17
 export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin
```

Source the variables using the following command

```bash
$ source ~/.bashrc
```

Search for JAVA_HOME and set export JAVA_HOME variable in ___libexec/hadoop-config.sh___

```xml
export JAVA_HOME=$HOME/java/jdk1.7.0_17
```
Add following lines at start of script in ___etc/hadoop/yarn-env.sh___ :

```xml
	export JAVA_HOME=$HOME/java/jdk1.7.0_17
	export HADOOP_HOME=/home/hadoop-2.0.3-alpha
	export HADOOP_MAPRED_HOME=$HADOOP_HOME
	export HADOOP_COMMON_HOME=$HADOOP_HOME
	export HADOOP_HDFS_HOME=$HADOOP_HOME
	export YARN_HOME=$HADOOP_HOME
	export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
	export YARN_CONF_DIR=$HADOOP_HOME/etc/hadoop
```


Hadoop configration files at located at  $HADOOP_HOME/etc/hadoop.  
Update the configuration files with the following entries respectively.

#####$HADOOP_HOME/etc/hadoop/master 
Open `master` file and add the following line

```xml
master
```

#####$HADOOP_HOME/etc/hadoop/slaves
Open `slaves` file and add the following lines

```xml
master
slave
```
*Note that the master is also listed as one the slave.

Open the file and copy the following contents respectively.

#####$HADOOP_HOME/etc/hadoop/core-site.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
  <property>
    <name>fs.default.name</name>
    <value>hdfs://master:9000</value>
  </property>
</configuration>
```

#####$HADOOP_HOME/etc/hadoop/hdfs-site.xml 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
 <configuration>
   <property>
     <name>dfs.replication</name>
     <value>2</value>
   </property>
    <property>
   <name>dfs.namenode.name.dir</name>
   <value>master:/home/data/namenode</value>
 </property>
 <property>
   <name>dfs.datanode.data.dir</name>
   <value>master:/home/data/datanode</value>
 </property>
 </configuration>
```

#####$HADOOP_HOME/etc/hadoop/mapred-site.xml 

```xml
<?xml version="1.0"?>
<configuration>
 <property>
   <name>mapreduce.framework.name</name>
   <value>yarn</value>
 </property>
</configuration>
```

#####$HADOOP_HOME/yarn-site.xml :  

```xml
<?xml version="1.0"?>
 <configuration>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce.shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>
  <property>
    <name>yarn.resourcemanager.scheduler.address</name>
    <value>master:8030</value>
  </property>
    <property>
    <name>yarn.resourcemanager.resource-tracker.address</name>
    <value>master:8031</value>
  </property>
  <property>
    <name>yarn.resourcemanager.address</name>
    <value>master:8032</value>
  </property>
 </configuration>

```

####Step 6: Install hadoop on Slave node

#####master
Use the following command to copy hadoop installation from master to the slave

```bash
gpuser@master:~$ scp -r hadoop-2.0.3-alpha gpuser@slave:/home/gpuser
```

#####slave
Verify that the following folder exists on slave.

```bash
gpuser@slave:~$ ls -al hadoop-2.0.3-alpha
```
####Step 7: Slave node configuration

Open `.bashrc` file in the home folder and add the following lines at the end

```bash  
 export HADOOP_HOME=$HOME/hadoop-2.0.3-alpha      
 export HADOOP_MAPRED_HOME=$HOME/hadoop-2.0.3-alpha    
 export HADOOP_COMMON_HOME=$HOME/hadoop-2.0.3-alpha    
 export HADOOP_HDFS_HOME=$HOME/hadoop-2.0.3-alpha    
 export YARN_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_CONF_DIR=$HOME/hadoop-2.0.3-alpha/etc/hadoop    
 export JAVA_HOME=$HOME/java/jdk1.7.0_17
 export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin
```

Source the variables using the following command

```bash
$ source ~/.bashrc
```
Search for JAVA_HOME and set export JAVA_HOME variable in ___libexec/hadoop-config.sh___

```xml
export JAVA_HOME=$HOME/java/jdk1.7.0_17
```
Search for JAVA_HOME and set export JAVA_HOME variable in ___etc/hadoop/yarn-env.sh___

```xml
export JAVA_HOME=$HOME/java/jdk1.7.0_17
```
Remove the file $HADOOP_HOME/etc/hadoop/slaves

#####slave
```bash
rm $HADOOP_HOME/etc/hadoop/slaves
```

open the file and copy the following contents respectively

#####yarn-site.xml

```xml
<?xml version="1.0"?>
<configuration>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce.shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>     
  <property>
    <name>yarn.resourcemanager.scheduler.address</name>
    <value>master:8030</value>
  </property>
    <property>
    <name>yarn.resourcemanager.resource-tracker.address</name>
    <value>master:8031</value>
  </property>
  <property>
    <name>yarn.resourcemanager.address</name>
    <value>master:8032</value>
  </property>
</configuration>
```

#####core-site.xml

```xml
<?xml version="1.0"?>
<configuration>
  <property>
     <name>fs.default.name</name>
     <value>hdfs://master:9000</value>
  </property>  
</configuration>
```

#####hdfs-site.xml

```xml
<?xml version="1.0"?>
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>master:/home/data/namenode</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>master:/home/data/datanode</value>
  </property>  
</configuration>
```

#####mapred-site.xml  

```xml
<?xml version="1.0"?>
<configuration>
  <property>
     <name>mapreduce.framework.name</name>
     <value>yarn</value>
  </property>
</configuration>
```

####Step 8: Initialize Hadoop File System

Namenode needs to be initialized before starting with Hadoop File System. Namenode creates a unique namespace id for this instance of the Hadoop File System.  

```bash
gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop namenode -format  



Formatting using clusterid: CID-8b844021-d1ea-4b0a-a625-d17dcc133299
13/04/04 02:07:39 INFO util.HostsFileReader: Refreshing hosts (include/exclude) list
13/04/04 02:07:39 INFO blockmanagement.DatanodeManager: dfs.block.invalidate.limit=1000
13/04/04 02:07:39 INFO blockmanagement.BlockManager: dfs.block.access.token.enable=false
13/04/04 02:07:39 INFO blockmanagement.BlockManager: defaultReplication         = 1
13/04/04 02:07:39 INFO blockmanagement.BlockManager: maxReplication             = 512
13/04/04 02:07:39 INFO blockmanagement.BlockManager: minReplication             = 1
13/04/04 02:07:39 INFO blockmanagement.BlockManager: maxReplicationStreams      = 2
13/04/04 02:07:39 INFO blockmanagement.BlockManager: shouldCheckForEnoughRacks  = false
13/04/04 02:07:39 INFO blockmanagement.BlockManager: replicationRecheckInterval = 3000
13/04/04 02:07:39 INFO blockmanagement.BlockManager: encryptDataTransfer        = false
13/04/04 02:07:39 INFO namenode.FSNamesystem: fsOwner             = gpuser (auth:SIMPLE)
13/04/04 02:07:39 INFO namenode.FSNamesystem: supergroup          = supergroup
13/04/04 02:07:39 INFO namenode.FSNamesystem: isPermissionEnabled = true
13/04/04 02:07:39 INFO namenode.FSNamesystem: HA Enabled: false
13/04/04 02:07:39 INFO namenode.FSNamesystem: Append Enabled: true
13/04/04 02:07:40 INFO namenode.NameNode: Caching file names occuring more than 10 times
13/04/04 02:07:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.threshold-pct = 0.9990000128746033
13/04/04 02:07:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.min.datanodes = 0
13/04/04 02:07:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.extension     = 30000
13/04/04 02:07:41 INFO common.Storage: Storage directory /home/gpuser/data/namenode has been successfully formatted.
13/04/04 02:07:41 INFO namenode.FSImage: Saving image file /home/gpuser/data/namenode/current/fsimage.ckpt_0000000000000000000 using no compression
13/04/04 02:07:41 INFO namenode.FSImage: Image file of size 121 saved in 0 seconds.
13/04/04 02:07:41 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
13/04/04 02:07:41 INFO util.ExitUtil: Exiting with status 0
13/04/04 02:07:41 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at ubuntu/127.0.1.1
************************************************************   
gpuser@master:~/hadoop-2.0.3-alpha$ 
```


####Step 9: Start HDFS on Master Node

```bash       
$ sbin/hadoop-daemon.sh start namenode
$ sbin/hadoop-daemons.sh start datanode
```


#####Verify namenode and data node running on master and slave
Check namenode and datanode running using the following command

#####master

```bash
$ jps
19785 DataNode
24567 Jps
16407 NameNode
```

#####slave
Check datanode running using the following command

```bash
$ jps
13589 DataNode
15203 Jps
```

####Step 10: Start Yarn Services
Run the following commands on the master node

```bash
$ sbin/yarn-daemon.sh start resourcemanager
$ sbin/yarn-daemons.sh start nodemanager
$ sbin/mr-jobhistory-daemon.sh start historyserver
```

Verify yarn services running in master node

#####master

```bash
$ jps
19785 DataNode
24567 Jps
16407 NameNode
16409 ResourceManager
16410 NodeManager
```

Verify yarn services running in slave node

#####slave

```bash
$ jps
13589 DataNode
13520 NodeManager
15203 Jps
```

####Verify Hadoop installation####

#####With Web Interfaces. 
Open the browser with the following URL's

* HDFS-UI: http://localhost:50070 
![HDFS-UI](/images/hdfs.png)

* Resource Mnager UI: http://localhost:8088
![ResourceManager](/images/resourcemanager.png)
  
* Job History UI: http://localhost:19888
![NodeManager](/images/jobhistory.png)
  
#####Run the WordCount example
       
Verify the installation by running the Wordcount Example. This is an example to count the number of times, each word appears in the given input data set.  
Create input dir and create a sample file 'animals.txt' with the following content. Use your favoirite editor vi or emacs or gedit.

```xml
cat dog elephant zebra wolf     
cat dog elephant zebra wolf      
cat dog elephant zebra wolf      
cat dog elephant zebra wolf     
```

Copy the animals.txt file from local filesystem to a '/input' file in hadoop filesystem using              

```bash
gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -copyFromLocal /home/animals.txt /input
```

Run the wordcount MapReduce program

```bash
gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop jar \
		share/hadoop/mapreduce/hadoop-mapreduce-examples-2.*-alpha.jar 
		wordcount /input /output  

gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -ls /
DEPRECATED: Use of this script to execute hdfs command is deprecated.
Instead use the hdfs command for it.

Found 3 items
drwxr-xr-x   - gpuser supergroup          0 2013-04-04 02:44 /output
-rw-r--r--   1 gpuser supergroup        129 2013-04-04 02:43 /input
drwxrwx---   - gpuser supergroup          0 2013-04-04 02:42 /tmp
```
Use dfs cat command to see the output

```bash
gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -cat /output/*       
cat 4
dog 4
elephant 4
zebra 4
wolf 4  
```

#####Congratulations! you have just finshed the Hadoop 2.0 installation in clustered environment

