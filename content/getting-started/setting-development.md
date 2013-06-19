---
title: Setting up the Development Environment
---

Pre-requisites are common for both Pivotal HD virtual machine and Pivotal HD cluster

##Pre-requisites
The development machine should have the following:

* Desktop with Ubuntu 10.x or Centos 6.x and 4GB RAM
* JDK 1.6 and above installed and set JAVA_HOME
* Apache Maven installed and mvn command available in the $PATH variable
* Eclipse with Maven plugin
* Clone the source from the git repository

```bash
git clone https://github.com/rajdeepd/pivotal-samples.git
```

##Using Eclipse for running MapReduce programs

###Importing source code to Eclipse

Select File->Import and select `Existing projects into Workspace`

![import](/images/gs/setup/import-maven.png)

Click `Browse` to select the directory where source code is present

![import](/images/gs/setup/browse.png)

Select the directory and click `Open`

Click `Deselect All` and check the box for the project we are interested in and Click `Finish`

![import](/images/gs/setup/select-project.png)

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

##Running the tutorial in Pivotal Hd virtual machine
The following instructions can be used to the run the sample on the Pivotal Hd virtual machine.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd customer_first_and_last_order_dates
```

```bash
mvn clean compile
mvn package
```

####Upload the input
Please refer [here](../dataset.html) for loading data to hdfs. 

###Run the tests
Run the unit tests with the following command.

```bash
mvn test
```

###Submit the job

Submit the job with the following command

```bash
hadoop jar target/customer_first_and_last_order_dates-1.0.jar com.pivotal.hadoop.CustomerFirstLastOrderDateDriver /retail_demo/orders/orders.tsv.gz /output-mr2
```
####Check the output
See the output using the following command:

```bash
hadoop fs -cat /output-mr2/part-r-00000
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

####Transfer the tutorial code to a node on the cluster. Let us assume it is historyserver.

```bash
tar -zcvf sample2.tar.gz target/*
scp sample2.jar history_server_host_name:/home/gpadmin/sample2.tar.gz 
```

####Create the cluster configuration file
Login to one of the Pivotal HD Cluster nodes. Let us assume it is the node where history server is running.

Extract the sample into home folder.

```bash
mkdir sample1
tar -zxvf ../sample2.tar.gz 
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

Please refer [here](../dataset.html) for loading data to hdfs.

####Submit the job to the Pivotal HD Cluster

```bash
hadoop jar target/customer_first_and_last_order_dates-1.0.jar com.pivotal.hadoop.CustomerFirstLastOrderDateDriver /retail_demo/orders/orders.tsv.gz /output-mr2
```

####Check the output

Verify the job in the hadoop cluster.

Browse the hadoop file system and check the output directory `/output-mr2` contains the part-r-0000-file.

See the output using the following command:

```bash
hadoop fs -cat /output-mr2/part-r-00000
```

