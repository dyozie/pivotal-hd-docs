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
git clone git:githubcom/pivotal.git
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

##Building the project using command line

###Build the project

Run the maven command to build the project

```bash
mvn clean install package
```
After the build is complete, a target directory with jar file is created.

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

####Congratulations! You have successfully set up the Development environment.
