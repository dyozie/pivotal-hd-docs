
##Hadoop installation for a single node cluster 
    
###Detailed steps for a single node installation of Hadoop 2.0.3 

[toc]  
Pre-requisites    
		OS Installation      
		JVM installation     
		Hadoop 2 installation      
		SSH configuration      

Setting Environment Variables    
Creating Directories      
Setting up the config files       
		etc/hadoop/yarn-site.xml      
		etc/hadoop/core-site.xml    
	 	etc/hadoop/hdfs-site.xml  
		etc/hadoop/mapred-site.xml   
   
Formatting namenode   
Starting HDFS processes  
Starting Hadoop Map-Reduce Processes   
		Resource Manager   
		Node Manager   
		Job History Server  
Verification   
		Word countexample
		Web Interface      
 ----- 
Hadoop 2.0.3  release involves many changes to Hadoop and MapReduce.The centralized JobTracker service is replaced with a __ResourceManager__      that manages the resources in the cluster and an __ApplicationManager__ that manages the application lifecycle. This section deals with    installing Hadoop 2.0.3 (_also called YARN_ ) on a single-node cluster.         
        
### _About Yarn_   
  
Yarn is the next-generation architecture for running MapReduce. It has different set of daemons and configuration options as compared to     classic MapReduce. It is useful to know some details of the configuration files.             
  
###_Prerequisites_   
   
Ensure that the following are installed before proceeding with the Hadoop installation (min. 2GB RAM is required)  
 
1.**Linux Ubuntu 12.04 LTS** :       [Ubuntu 12.04](http://releases.ubuntu.com/12.04/ "http://releases.ubuntu.com/12.04/" )  
     
a. Install Ubuntu   
                  
b. Create a group by name hadoop     
          
		#sudo addgroup hadoop    
c. Create a user by name hadoop & add user 'hadoop' to the group 'hadoop'. Use password as 'hadoop'  
            
		#sudo adduser --ingroup hadoop hadoop		 
d. Login as hadoop and proceed with further installation process  
  
2.**Java Virtual Machine** : Available here : [JVM](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html "http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html")  _(Note: If you are using a 64bit processor, download the 64bit jvm)_    
a.  Create a folder 'java' in /home/hadoop and copy the downloaded file to this location.  
  
		hadoop@ubuntu$mkdir java
		hadoop@ubuntu:~$cd java
		hadoop@ubuntu/java$
b.  Run the following command to extract the JVM files  
     
		#tar –xvzf jdk-7u17-linux-i586.tar  
c. Ensure JDK is correctly set up. Open ___~/.bashrc___  file in your favourite editor and add these lines  

		# export JAVA_HOME=$HOME/java/jdk1.7.0_17    
		# export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin  
d. To verify, type the following command on the command line  

		hadoop@ubuntu:~# java -version  
e. The output will be : 
    
		java version "1.7.0_17"        
		Java(TM) SE Runtime Environment (build 1.7.0_17-b02)       
		Java HotSpot(TM) Client VM (build 23.7-b01, mixed mode 
     
3.**SSH configuration** : 
   
This is required to start the hadoop proceses without the need for a password. Hadoop uses ssh to start the proceses.
This requires installation of ssh.    
     
a. Install SSH  using the following command:

		sudo apt-get install ssh
		sudo apt-get install rsync      
(Note : _rsync - It can perform differential uploads and downloads (synchronization) of files across the network, transferring only data that     has changed._)  
     
b. Generate an RSA key pair by typing the following in the hadoop user account:   
                     
		hadoop@ubuntu:~$ ssh-keygen -t rsa -P ""   
c. Generate public/private RSA key pair. 
      
d. Enter file in which to save the key     
      
		(/home/hadoop/.ssh/id_rsa):                     
		Your identification has been saved in /home/hadoop/.ssh/id_rsa.         
		Your public key has been saved in /home/hadoop/.ssh/id_rsa.pub.      
		The key fingerprint is:      
		c9:ef:87:29:4c:68:9b:fb:04:09:db:42:f9:7b:c3:30 hadoop@ubuntu      
		The key's randomart image is:       
		+--[ RSA 2048]----+          
e. Make sure that the public key is in the ~/.ssh/authorized_keys file.        
                 
		hadoop@ubuntu:~$ cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys   
f. Finally test the SSH setup by connecting to the local machine with the hadoop user.  
        
		hadoop@ubuntu:~$ ssh localhost                            
g. If the following message comes wihtout asking password, then ssh configuration is successful.  
    
		Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-23-generic x86_64)    
 		* Documentation:  https://help.ubuntu.com/
		535 packages can be updated.
		166 updates are security updates.
		Last login: Sat Mar 23 07:11:28 2013 from localhost

   
4.**Getting Hadoop Software** :


a. Download _hadoop-2.0.3-alpha.tar.gz_  from [Hadoop](http://apache.techartifact.com/mirror/hadoop/common/hadoop-2.0.3-alpha/ "http://apache.techartifact.com/mirror/hadoop/common/hadoop-2.0.3-alpha/")  
   

b. Create a folder  yarn   

		#mkdir yarn
c. Move the downloaded folder **hadoop-2.0.3-alpha.tar.gz** to the yarn folder  
   
		cp Downloads/hadoop-2.0.3-alpha.tar.gz  yarn
		cd yarn  
d. Run the following command on the command line to extract the files      
        
        $ tar -xvzf hadoop-2.0.3-alpha.tar.gz  
e. Give permissions by running the following commands on the command line (_assuming dedicated user for Hadoop to be  “hadoop"_)  
     	
		$ sudo chown -R hadoop:hadoop hadoop-2.0.3-alpha 

###_Setting up the Environment Variables_   
     
1.Add the following to ***~/.bashrc*** at the end ( use editor ___v___i or ___emacs___ or ___gedit___)       
 
     	# export HADOOP_HOME=$HOME/yarn/hadoop-2.0.3-alpha      
     	# export HADOOP_MAPRED_HOME=$HOME/yarn/hadoop-2.0.3-alpha    
    	# export HADOOP_COMMON_HOME=$HOME/yarn/hadoop-2.0.3-alpha    
     	# export HADOOP_HDFS_HOME=$HOME/yarn/hadoop-2.0.3-alpha    
     	# export YARN_HOME=$HOME/yarn/hadoop-2.0.3-alph
     	# export HADOOP_CONF_DIR=$HOME/yarn/hadoop-2.0.3-alpha/etc/hadoop    
     	# export JAVA_HOME=$HOME/java/jdk1.7.0_06    
     	# export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin

2.Execute by typing the following in command line :             

     	#source ~/.bashrc  
  
###_Creating directories_        

1.Create the following 2 directories to be used by the **NameNode** and the **DataNode**.            

		# mkdir -p $HOME/yarn/data/namenode
		# mkdir -p $HOME/yarn/data/datanode

###_Setting up the config files_   
           
_Brief about the Yarn configuration files_   

 The important yarn configuration files and their purpose is described here:  
   
**core-site.xml**- It is used for the Name configuration 
   
**mapred-site.xml**- It is used for mapredurce configuration.

**hdfs-site.xml**- It is used for Hadoop File System configuration.

**yarn-site.xml**- It is used for ___Yarn daemons___ Configuration settings:the ___resource manager___, the ___job history server___, the ___webapp proxy server___ and the ___node manager___   

**yarn-env.sh**-  It is used to set the Environment variables that are used in the scripts to run Yarn.  
  
**libexec/hadoop-config.sh** - It is used for hadoop environment configuration  
  
The Yarn configuration procedure steps are given below :   
        
1.Go to YARN_HOME using          

		# cd $YARN_HOME  
  
2.Add the following properties under configuration tag in the files mentioned below:  
      
a. **etc/hadoop/yarn-site.xml**:    
  
 (_Configuration files for running MapReduce on YARN.This file is added new in Hadop 2.0.This is not present in Hadoop 1.0_)          

           	<property>
             	 <name>yarn.nodemanager.aux-services</name>
             	 <value>mapreduce.shuffle</value>
           	</property>
           	<property>
             	 <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
             	 <value>org.apache.hadoop.mapred.ShuffleHandler</value>
           	</property>         
The path is       
 
		hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$cd etc/hadoop/yarn-site.xml     
YARN  relies on shuffle handlers to serve map outputs to reduce tasks which are long-running auxiliary services running in node managers.       
Since YARN is a general-purpose service the shuffle handlers need to be explictly enabled in the yarn-site.xml by setting the      _yarn.nodemanager.aux-services_ property to _mapreduce.shuffle_.    

b. **etc/hadoop/core-site.xml**: 
    
Configuration settings for Hadoop Core, such as I/O settings that are comman to HDFS and MapReduce.(This is required for Hadoop File System)     

           	<property>
            	 <name>fs.default.name</name>
            	 <value>hdfs://localhost:9000</value>
           	</property>  
The path is  

		hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$cd etc/hadoop/core-site.xml   
c. **etc/hadoop/hdfs-site.xml**: 
    
Configuration settings for HDFS daemons: the namenode and the datanodes.                   

           	<property>
             	 <name>dfs.replication</name>
             	 <value>1</value>
           	</property>
           	<property>
             	 <name>dfs.namenode.name.dir</name>
             	 <value>file:/home/hadoop/yarn/data/namenode</value>
           	</property>
           	<property>
            	 <name>dfs.datanode.data.dir</name>
            	 <value>file:/home/hadoop/yarn/data/datanode</value>
           	</property>  
The path is  

		hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$cd etc/hadoop/hdfs-site.xml   
d. **etc/hadoop/mapred-site.xml**:  
  
Configuration settings for MapReduce daemons.(Create _mapred-site.xml_ file in the hadoop folder if not present already. )    

           	<?xml version="1.0"?>
            	 <configuration>
             	  <property>
              	   <name>mapreduce.framework.name</name>
              	   <value>yarn</value>
             	  </property>
           	</configuration>  
The path is  

		hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$cd etc/hadoop/mapred-site.xml  

###_Formatting namenode_   

Namenode needs to be initialized before starting with Hadoop File System. Namenode createa a unique namespace id for this instance    
of the Hadoop File System.  

1. First time only. (_Note: Repeated formatting will result in loss of content on HDFS._)              
a. Execute by typing the following in command line :  
             
    	$ bin/hadoop namenode -format     
The command formats the namenode. It starts the namenode, formats it and then shuts it down.  
b. Output :  
Output will be...     
             	
	  	13/03/28 09:33:40 INFO namenode.NameNode: Caching file names occuring more than 10 times
	  	13/03/28 09:33:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.threshold-pct =  0.9990000128746033
           	13/03/28 09:33:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.min.datanodes = 0
           	13/03/28 09:33:40 INFO namenode.FSNamesystem: dfs.namenode.safemode.extension     = 30000
           	Re-format filesystem in Storage Directory/home/hadoop/yarn/hadoop-2.0.3-alpha/tmp/dfs/name ? (Y or N) y
           	13/03/28 09:33:45 INFO common.Storage: Storage directory/home/hadoop/yarn/hadoop-2.0.3-alpha/tmp/dfs/name                     			has been successfully formatted.
           	13/03/28 09:33:45 INFO namenode.FSImage: Saving image file/home/hadoop/yarn/hadoop-2.0.3-
         		alpha/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
          	13/03/28 09:33:46 INFO namenode.FSImage: Image file of size 122 saved in 0 seconds.
          	13/03/28 09:33:46 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
          	13/03/28 09:33:46 INFO util.ExitUtil: Exiting with status 0
          	13/03/28 09:33:46 INFO namenode.NameNode: SHUTDOWN_MSG:
          	/************************************************************
           	SHUTDOWN_MSG: Shutting down NameNode at ubuntu/10.42.0.16
           	************************************************************/
            	hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$     
 
###_Starting HDFS processes_                 
       
1. Name node:          

	   	$ sbin/hadoop-daemon.sh start namenode
	   	starting namenode, logging to /home/hadoop/yarn/hadoop-2.0.3-alpha/logs/hadoop-hadoop-namenode-pc3-laptop.out
	   	$ jps
	   	18509 Jps
	   	17107 NameNode

2. Data node:          

            	$ sbin/hadoop-daemon.sh start datanode
	   	_Start datanode_ logging to /home/hadoop/yarn/hadoop-2.0.1-alpha/logs/hadoop-hadoop-datanode-pc3-laptop.out
	   	$ jps
	   	18509 Jps
	   	17107 NameNode
	   	17170 DataNode

###_Starting Hadoop Map-Reduce Processes_   
         
1. Resource Manager:          

	    	$ sbin/yarn-daemon.sh start resourcemanager
	    	starting resourcemanager, logging to /home/hadoop/yarn/hadoop-2.0.1-alpha/logs/yarn-hadoop-resourcemanager-pc3-laptop.out
	    	$ jps
	    	18509 Jps
	    	17107 NameNode
	    	17170 DataNode
	    	17252 ResourceManager  

2. Node Manager:           

	    	$ sbin/yarn-daemon.sh start nodemanager
             	starting nodemanager, logging to /home/hadoop/yarn/hadoop-2.0.1-alpha/logs/yarn-hadoop-nodemanager-pc3-laptop.out
	    	$jps
	    	18509 Jps
	    	17107 NameNode
	    	17170 DataNode
	    	17252 ResourceManager
	    	17309 NodeManager

3. Job History Server:           

	    	$ sbin/mr-jobhistory-daemon.sh start historyserver
	    	starting historyserver, logging to /home/hadoop/yarn/hadoop-2.0.1-alpha/logs/yarn-hadoop-historyserver-pc3-laptop.out
	    	$jps
			18509 Jps
	    	17107 NameNode
	    	17170 DataNode	    
	    	17252 ResourceManager
	    	17309 NodeManager
	    	17626 JobHistoryServer    


###_Verification_                  
       
Verify the installation by running the Wordcount Example. This is an example to count the number of times,   
each word appeared in the given data set.The steps to follow to verify are :   
 
1. Copy a file from local system to the Hadoop file system.   
a. Create a text file "animals.txt" with the following contents:      
cat dog elephant zebra wolf     
cat dog elephant zebra wolf      
cat dog elephant zebra wolf      
cat dog elephant zebra wolf   
b. Copy the animals.txt file from local filesystem to a '/test' file in hadoop filesystem.              
Use the following command on the command line :  

		hadoop@ubuntu:~/yarn/hadoop-2.0.3-alpha$ bin/hadoop dfs -copyFromLocal /home/hadoop/Documents/animals.txt /test  
   
2. Run the MapReduce program: 
            
a.Use the following command on the command line :  
 
		$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.*-alpha.jar wordcount /test /output  
( _wordcount_ is the classname, _test_  is the input dir and  _output_ is the output dir.)     
3.  Check the output: 
 
a.Execute by typing the following in command line :           

		$ bin/hadoop dfs -cat /output/*       
b.  get the output :       

		cat 4
		dog 4
		elephant 4
		zebra 4
		wolf 4  
###Congrtualations, you have just finsiued the hadoop 2.0 installation on single node.





