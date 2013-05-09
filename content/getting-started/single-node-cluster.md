---
title: Pivotal HD tutorials
---

Running Hadoop Version 2 -  Single Node Cluster
-----------------------------------------------
The goal of the document is to get  Hadoop <i>version 2.0.3-alpha</i> up and running on a single node cluster.


About Hadoop Version 2
----------------------
Apache Hadoop has undergone a complete overhaul with vrsion 2, (MRv2) also called as YARN(Yet Another Negotiator)
YARN architecture splits the function of JobTracker into Resource Manager and per Application Master. NodeManager is similar to the Task tracke, with the task being abstracted as container. Hadoop 2.0 also comes with HDFS federation and High Avialble for namenode.

The tutorial has been tested with the following software versions:  
1. Ubuntu Linux 12.04 ([download Ubuntu](http://releases.ubuntu.com/12.04/ "http://releases.ubuntu.com/12.04/" ))     
2. JDK 1.7 (  [download JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html "http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html" )). The same tutorial works on JDK1.6 as well.  
 
Prerequisites
------------
A system with 2 GB RAM and Ubuntu 12.04 up and running.

Steps
-----

#####Create Dedicated User 
 
Create a user 'gpuser' and group 'gp'. We will be running Hadoop with this userid   

```bash
$sudo addgroup gp    
$sudo adduser --ingroup gp gpuser
``` 
#####Install JDK 

Ignore this step if JDK is already installed.
If not, [download JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html ) and install.  
Login with gpuser to proceed with further installation steps.  
  
Set JAVA_HOME  by adding the following lines at the end of ___.bashrc___ file located in gpuser home directory _/home/gpuser_ 

```bash
#export JAVA_HOME=$HOME/java/jdk1.7.0_17 
#export PATH=$PATH:$JAVA_HOME/bin
```
Verify the Java installation with the following command:

```bash  
gpuser@ubuntu:~$source ~/.bashrc
gpuser@ubuntu:~$java -version  
```

You should see java version 1.7.* printed on the console.

#####Download and Extract Hadoop

 Download [Hadoop](http://apache.techartifact.com/mirror/hadoop/common/hadoop-2.0.3-alpha/)  version 2.0.3

Extract hadoop at the home directory using the following command.

```bash
gpuser@ubuntu:~$ tar -xvzf hadoop-2.0.3-alpha.tar.gz
```
    

#####Setup SSH 
Hadoop requires SSH access and manage its nodes running hadoop. We will configure SSH to connect to localhost without a password

* Install SSH 

```bash
gpuser@ubuntu:~$sudo apt-get install ssh 
gpuser@ubuntu:~$sudo apt-get install rsync
```
* Generate public/private RSA key pairs using the following command.

```bash
gpuser@ubuntu:~$ ssh-keygen -t rsa -P ""
Generating public/private rsa key pair.
Enter file in which to save the key (/home/gpuser/.ssh/id_rsa): 
Created directory '/home/gpuser/.ssh'.
Your identification has been saved in /home/gpuser/.ssh/id_rsa.
Your public key has been saved in /home/gpuser/.ssh/id_rsa.pub.
The key fingerprint is:
3c:f7:ca:f2:49:a7:05:ee:90:66:05:0f:7b:a9:63:fc gpuser@ubuntu
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

* Enable ssh to the local machine using the following command.
                 
```bash
gpuser@ubuntu:~$ cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys   

```
* Finally test the ssh setup by connecting to the local machine with the gpuser user.  
        
```bash
gpuser@ubuntu:~$ ssh localhost

The authenticity of host 'localhost (127.0.0.1)' can't be established.
ECDSA key fingerprint is ca:96:1c:5a:38:f8:9f:99:45:d4:57:82:3c:1b:64:b7.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'localhost' (ECDSA) to the list of known hosts.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Welcome to Ubuntu 12.10 (GNU/Linux 3.5.0-17-generic i686)

 * Documentation:  https://help.ubuntu.com/
```

#####Configure Hadoop
Hadoop requires the following environment variables to be set correctly

* HADOOP environement variables

Open ___.bashrc___ file in the home folder and add the following lines at the end

  
```bash
# export HADOOP_HOME=$HOME/hadoop-2.0.3-alpha      
# export HADOOP_MAPRED_HOME=$HOME/hadoop-2.0.3-alpha    
# export HADOOP_COMMON_HOME=$HOME/hadoop-2.0.3-alpha    
# export HADOOP_HDFS_HOME=$HOME/hadoop-2.0.3-alpha    
# export YARN_HOME=$HOME/hadoop-2.0.3-alpha 
# export HADOOP_CONF_DIR=$HOME/hadoop-2.0.3-alpha/etc/hadoop    
# export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin
```
* Source the variables using the following command

```bash
gpuser@ubuntu$source ~/.bashrc 
```

* Update Configuration Files

Hadoop configration files at located at  $HADOOP_HOME/etc/hadoop.  
Update the configuration files with the following entries respectively.

#####yarn-site.xml  
```xml
<configuration>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce.shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>         
</configuration>
```
#####core-site.xml

```xml
<configuration>
  <property>
     <name>fs.default.name</name>
     <value>hdfs://localhost:9000</value>
  </property>  
</configuration>
```

#####hdfs-site.xml

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:/home/gpuser/data/namenode</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:/home/gpuser/data/datanode</value>
  </property>  
</configuration>
```

#####mapred-site.xml  
If this file does not exist, create it and paste the content provided below:

```xml
<?xml version="1.0"?>
<configuration>
  <property>
     <name>mapreduce.framework.name</name>
     <value>yarn</value>
  </property>
</configuration>
```

####Run Hadoop

####Initialize the Hadoop File system 

Namenode needs to be initialized before starting with Hadoop File System. Once intialized, Namenode creates a unique namespace id for this instance of the Hadoop File System.  

* Create the *Storage Directories* for HDFS 

```bash
$mkdir -p $HOME/data/namenode  
$mkdir -p $HOME/data/datanode
```

* Initialize the filesystem 

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ bin/hadoop namenode -format  


o/p:


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

gpuser@ubuntu:~/hadoop-2.0.3-alpha$ 
```
####Start Hadoop File System####
     
* Start Namenode

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ sbin/hadoop-daemon.sh start namenode
starting namenode, logging to /home/gpuser/hadoop-2.0.3-alpha/logs/hadoop-gpuser-namenode-ubuntu.out
```

* Start Datanode

```bash  
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ sbin/hadoop-daemon.sh start datanode
starting datanode, logging to /home/gpuser/hadoop-2.0.3-alpha/logs/hadoop-gpuser-datanode-ubuntu.out
```

* Verify that the Namenode and Datanode are running using _jps_

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ jps
18509 Jps
17107 NameNode
17170 DataNode
```
####Start Yarn Daemons####

#####Start Resource Manager  

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ sbin/yarn-daemon.sh start resourcemanager
starting resourcemanager, logging to /home/gpuser/hadoop-2.0.3-alpha/logs/yarn-gpuser-resourcemanager-ubuntu.out
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ jps
18509 Jps
17107 NameNode
17170 DataNode
17252 ResourceManager  
```
#####Start Node Manager

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ sbin/yarn-daemon.sh start nodemanager
starting nodemanager, logging to /home/gpuser/hadoop-2.0.3-alpha/logs/yarn-gpuser-nodemanager-ubuntu.out

gpuser@ubuntu:~/hadoop-2.0.3-alpha$jps
18509 Jps
17107 NameNode
17170 DataNode
17252 ResourceManager
17309 NodeManager
```
#####Start Job History Server 

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ sbin/mr-jobhistory-daemon.sh start historyserver

starting historyserver, logging to /home/gpuser/hadoop-2.0.3-alpha/logs/mapred-gpuser-historyserver-ubuntu.out
gpuser@ubuntu:~/hadoop-2.0.3-alpha$jps
18509 Jps
17107 NameNode
17170 DataNode      
17252 ResourceManager
17309 NodeManager
17626 JobHistoryServer    
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

```bash
cat dog elephant zebra wolf     
cat dog elephant zebra wolf      
cat dog elephant zebra wolf      
cat dog elephant zebra wolf     
```

Copy the animals.txt file from local filesystem to a '/input' file in hadoop filesystem using              

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -copyFromLocal \
      input/animals.txt /input
```

Run the wordcount MapReduce program

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ bin/hadoop jar \
    share/hadoop/mapreduce/hadoop-mapreduce-examples-2.*-alpha.jar 
    wordcount /input /output  

gpuser@ubuntu:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -ls /
DEPRECATED: Use of this script to execute hdfs command is deprecated.
Instead use the hdfs command for it.

Found 3 items
drwxr-xr-x   - gpuser supergroup          0 2013-04-04 02:44 /output
-rw-r--r--   1 gpuser supergroup        129 2013-04-04 02:43 /input
drwxrwx---   - gpuser supergroup          0 2013-04-04 02:42 /tmp
```
Use dfs cat command to see the output

```bash
gpuser@ubuntu:~/hadoop-2.0.3-alpha$ bin/hadoop dfs -cat /output/*       
cat 4
dog 4
elephant 4
zebra 4
wolf 4  
```

#####Congratualations! you have just finshed the Hadoop 2.0 installation on a single node.

