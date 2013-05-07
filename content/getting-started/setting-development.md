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
* Download hadoop 2.x version [here](http://hadoop.apache.org/releases.html#Download)
* Download maven from [here](http://apache.techartifact.com/mirror/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz) and extract it in the home directory

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

####Create the cluster configuration `hadoop-mycluster.xml` as shown below.

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

Note: Make sure NAMENODE_SERVER and RESOURCE_MANAGER are replaced by host names where namenode and resourcemanager are deployed. Check Greenplum documentation to get these values.

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

You can check that the job is submitted in the Command Center dashboard.
Monitor the job using Command Center -> MapReduce Job Monitor 

Browse the hadoop file system and check for the output directory. 

The output directory should contain the part-r-0000-file.

Use the following command to see the output.

```bash
hadoop fs -cat /user/foobar/output/part-r-0000
```

##Using Eclipse for running MapReduce programs


###Clone the source from git repository

```bash

```

###Importing source code to Eclipse

Select File->Import and select `Existing projects into Workspace`

![import](/images/gs/setup/import-maven.png)

Click `Browse` to select the directory where source code is present

![import](/images/gs/setup/mean-2.png)

Select the directory and click `Open`

![import](/images/gs/setup/mean-3.png)

Click `Deselect All` and check the box for the project we are interested in and Click `Finish`

![import](/images/gs/setup/mean-4.png)

###Build the project
Go to package Explorer, select the project and right click to get properties.
Click `Run As -> Maven Install` to build the project.

###Running the project

From Eclipse Main Menu Explorer,  Main Menu, Click `Run->Run Configurations`

![import](/images/gs/setup/run.png)

Click on the `+` sign to create a new Java configuration
Provide the Main Class, or if you have selected the Main on PackageExplorer and click 'Run As Java Application`, it will auto-populate the main class.

![import](/images/gs/setup/main-class.png)

Provide input and output paths as arguments and click `Run`.

![import](/images/gs/setup/arguments.png)

Messages on the console show that the MapReduce program is running. If there are any issues, you can see an exception thrown onto the console. Use these messages to fix the problem.

![import](/images/gs/setup/console.png)

The output should be available on the output folder.

###Running Unit tests

Go to eclipse Main Menu, Select `Run As -> Junit Test` to run the unit tests

##Running the tutorial in command line
The following instructions can be used to the run the sample on the Psuedo distributed cluster.

####Building the project 

```bash
mvn clean compile
mvn package
```

####Upload the input

```bash
hadoop fs -put PROJECT_DIR/input/business.json /user/gpadmin/sample1/input
```
Note: Replace PROJECT_DIR with the project directory.

####Create the configuration file

```xml
<configuration>
    <property>
        <name>fs.default.name</name>
            <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>http://localhost:8032</value>
    </property>
</configuration>
```
###Run the tests
Run the unit tests with the following command.

```bash
mvn test
```

###Submit the job

Submit the job with the following command

```bash
hadoop jar target/count_businesses_incity-0.0.1.jar com.pivotal.hadoop.city.business. CityBusinessDriver -conf $HADOOP_HOME/hadoop-mycluster.xml  /user/foobar/input /user/foobar/output
```

####Check the output
See the output using the following command:

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000
```

##Running the tutorial on Pivotal HD Cluster

The following instructions will apply to all the tutorials.
Create the file with the following contents:

```xml
<configuration>
    <property>
        <name>fs.default.name</name>
            <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>http://localhost:8032</value>
    </property>
</configuration>
```
####Third-party libraries
The tutorialis use third-party library `json-simple-1.1.jar`. Maven will download keep the library in the repository. Copy the library to the target folder.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
```
####Transfer the tutorial code to a node on the cluster. Let us assume it is historyserver.

```bash
tar -zcvf sample1.tar.gz target/*
scp sample1.jar history_server_host_name:/home/gpadmin/sample1.tar.gz 
```

####Create the cluster configuration file
Login to one of the Pivotal HD Cluster nodes. Let us assume it is the node where history server is running.

Extract the sample into home folder.

```bash
mkdir sample1
tar -zxvf ../sample1.tar.gz 
```
Create the file hadoop-mycluster.xml with the following contents:

```xml
<configuration>
    <property>
        <name>fs.default.name</name>
            <value>hdfs://NAMENODE:9000</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>http://RESOURCE_MANAGER:8032</value>
    </property>
</configuration>
```

Replace NAMENODE and RESOURCE_MANAGER with hostnames of namenode and resourcemanager respectively.

####Upload the complete data set to HDFS

```bash
hadoop fs -put business.json /user/gpadmin/sample1/input
```
Note: Replace PROJECT_DIR with the project directory.

####Submit the job to the Pivotal HD Cluster

```bash
hadoop jar target/count_businesses_incity-0.0.1.jar com.pivotal.hadoop.city.business.CityBusinessDriver -conf hadoop-mycluster.xml -libjars target/json-to-json-simple-1.1.jar /user/gpadmin/sample1/input /user/gpadmin/sample1/output
```

If there are more third-party libraries, add to the -libjars option separated by `,`.

####Check the output

Verify the job in the hadoop cluster.

Browse the hadoop file system and check the output directory `/user/gpadmin/sample1/output` contains the part-r-0000-file.

See the output using the following command:

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000
```

