---
title: Setting up the Development Environment
---


##Pre-requisites

The development machine should have the following:

* Desktop with Ubuntu 10.x or Centos 6.x and 4GB RAM
* JDK 1.6 and above installed and set JAVA_HOME
* Apache Maven installed and mvn command available in the $PATH variable
* Eclipse with Maven plugin

##Downloads
* Download hadoop 2.x verision [here](http://hadoop.apache.org/releases.html#Download)
* Download maven [here](http://apache.techartifact.com/mirror/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz) and extract in the home directory

##Set the environment variables

```bash
export MAVEN_HOME=/home/foobar/apache-maven-3.0.5
export HADOOP_HOME=/home/foobar/hadoop-2.0.3-alpha
HADOOP_HOME=/home/foobar/hadoop-2.0.3-alpha
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export HADOOP_YARN_HOME=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export YARN_CONF_DIR=$HADOOP_HOME/etc/hadoop
export PATH=$JAVA_HOME/bin:$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$MAVEN_HOME/bin
```

Note: The variables can be set in .bashrc(Linux) or .bash_profile(MacOS)

##Verify the environment with the following steps

####Create the cluster confguration file

```xml
<configuration>
	<property>
		<name>fs.default.name</name>
		<value>hdfs://NAMENODE_SERVER:9000</value>
	</property>
	<property>
		<name>yarn.resourcemanager.address</name>
		<value>RESOURCE_MANAGER:8032</value>
	</property>
</configuration>
```

Note: Make sure NAMENODE_SERVER and RESOURCE_MANAGER is replaced by host names where namenode and resourcemanager are deployed. Check greenplum documentation to get these values.

####Create and upload the input to HDFS
Create a sample file `sample.txt` with the following content:

```xml
elephant hadoop resource node config cluster submit
elephant hadoop resource node config cluster submit
elephant hadoop resource node config cluster submit
elephant hadoop resource node config cluster submit
elephant hadoop resource node config cluster submit
```

```bash
hadoop fs -put sample.txt /user/foobar/input
```

####(optional)For using third-party libraries, set HADOOP_CLASSPATH 

For example 

```bash
export HADOOP_CLASSPATH=path1/jar1.jar:path2/jar2.jar
```

####Submit the job to the cluster

```bash
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.0.3-alpha.jar wordcount -conf hadoop-mycluster.xml  /user/foobar/input /user/foobar/output
```

####Check the output

You can check that the job is submitted in the ccmaster dashboard.

Browse the hadoop file system and check the output directory. 
The output directory should contain the part-r-0000-file.

Use the following command to see the output.

```bash
hadoop fs -cat /user/foobar/output/part-r-0000
```

###Congratulations! You have successfully set up the Development environment.


##Importing source code to Eclipse


##Building the project from Command line

```bash
mvn -DskipTests package
```
The command should create the jar file in the target directory.


