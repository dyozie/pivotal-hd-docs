---
title: Setting up the Development Environment
---

Pre-requisites are common for both Pivotal HD Virtual Machine and Pivotal HD Cluster

##Pre-requisites
The development machine should have the following:

* Desktop with Ubuntu 10.x or Centos 6.x and 4GB RAM
* JDK 1.6 and above installed and set JAVA_HOME
* Apache Maven installed and mvn command available in the $PATH variable
* Eclipse with Maven plugin
* Clone the source from the git repository

```bash
git clone https://github.com/PivotalHD/pivotal-samples.git
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
Click `Run As -> Maven install` to build the project.

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

##Running the tutorial in Pivotal HD Virtual Machine and Pivotal HD Cluster
The following instructions can be used to the run the sample on the Pivotal Hd Virtual Machine.
Same instructions can be used for Pivotal HD Cluster.

Running the mapreduce job requires starting Pivotal HD services in Pivotal HD VM, refer to [Installing the VM](./pivotalhd-vm.html) for instructions.


####Building the project 

Go to the project directory

```bash
cd  pivotal-­samples/map­-reduce­-java
ls
cd customer_first_and_last_order_dates
```

```bash
mvn clean compile
mvn -DskipTests package
```

####Upload the input

Load [DataSet](https://github.com/PivotalHD/pivotal-samples/tree/master/sample-data) by running `load_data_to_HDFS.sh` in `sample-data` folder

```bash
cd sample-data
./load_data_to_HDFS.sh
```
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

137    8228753927    2010-10-02 09:26:40    6952760836    2010-10-10 23:46:16
274    6952804085    2010-10-10 14:16:48    8038062167    2010-10-14 09:17:33
411    5987514832    2010-10-05 23:49:40    6326675610    2010-10-11 11:32:28
548    6734479225    2010-10-01 08:31:08    6953064348    2010-10-10 19:20:25
1096    8181753531    2010-10-07 04:04:26    8181753531    2010-10-07 04:04:26
1370    6326626699    2010-10-11 06:33:05    7412417661    2010-10-12 23:46:44
1507    8238655247    2010-10-06 11:01:33    7412451029    2010-10-12 07:37:18
1644    4876892978    2010-10-13 11:21:59    8038062935    2010-10-14 17:27:29
2055    7570913900    2010-10-08 23:29:35    4877101631    2010-10-13 21:12:05
2192    7136693581    2010-10-04 19:48:16    8037933831    2010-10-14 12:35:21
2603    8502193355    2010-10-09 13:41:22    7412316965    2010-10-12 21:31:32
2877    8456624891    2010-10-03 01:19:32    6952627429    2010-10-10 12:09:08
3151    6326825025    2010-10-11 02:11:35    6326825025    2010-10-11 02:11:35

```
You have successfully run the sample on Pivotal HD !.



