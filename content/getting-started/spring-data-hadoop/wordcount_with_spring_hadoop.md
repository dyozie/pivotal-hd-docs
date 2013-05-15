---
title: Run wordcount example with Spring Hadoop
---

##Run wordcount example with Spring Hadoop on Pivotal HD
The tutorial demonstrates running the wordcount example with Spring Hadoop 1.0.0 RC1 on Pivotal HD 1.0

* Approximate time: 45 Mins
* Level: Basic

##Use case
Count the words in a directory or document.

##Pre-requisites
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed

##Approach
Every MapReduce program comes with the `Main` class; that used the MapReduce API to submit the job.
With Spring Hadoop, the job creation is handled by Spring Hadoop. The jobs can be submitted with various configuration options without changing the code. 

Designing and writing of Mapper and Reducer classes does not change with Hadoop. With Spring Batch, the job can be part of chain of Jobs. The Spring Hadoop helps by providing a clean way of invoking MapReduce jobs without worrying about the complexity.

*  Creating Application Context with Spring Hadoop
*  Run the example

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `spring-hadoop` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 


###Step 3: Creating Application Context with Spring Hadoop

The Application Context file is shown below,

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/hadoop"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:beans="http://www.springframework.org/schema/beans"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
	http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
	http://www.springframework.org/schema/hadoop http://www.springframework.org/schema/hadoop/spring-hadoop.xsd">

	<context:property-placeholder location="hadoop.properties" />

	<configuration>
		fs.default.name=${hd.fs}
		mapred.job.tracker=${hd.jt}
	</configuration>

	<job id="wordcountJob" input-pfath="${wordcount.input.path}"
		output-path="${wordcount.output.path}" libs="${LIB_DIR}/spring-hadoop-0.0.1.jar"
		mapper="com.akrantha.springhadoop.edu.WordCount.TokenizerMapper"
		reducer="com.akrantha.springhadoop.edu.WordCount.IntSumReducer" />

	<job-runner id="runner" run-at-startup="true" job-ref="wordcountJob" />

</beans:beans>
```

Spring Hadoop has the namespace, which is made default in the above xml.
The configuration tag provides the location of HDFS and Jobtracker to submit the jobs.
The Job is defined with xml as shown above, and the JobRunner runs the Job.

###Step 4: Spring Hadoop Driver

The code for the main driver program is shown below:

```java
public static void main(String[] args) {
    // TODO Auto-generated method stub
    String[] res = (args != null && args.length > 0 ? args : CONFIGS);
    AbstractApplicationContext ctx = new ClassPathXmlApplicationContext(res);
    // shutdown the context along with the VM
    ctx.registerShutdownHook();
}
```
The code creates the Application Context and Spring Hadoop run the job after initialization. 

###Step 5: Running the tutorial

####Build the project

Follow the instructions [Setting Development Environment](../setting-development.html)  to build the project in eclipse.

This will create target directory with `spring-hadoop-0.0.1.jar` file

####Customize **hadoop-properties** in `resources` directory

```xml
wordcount.input.path=/user/gpadmin/spring-hadoop/input
wordcount.output.path=/user/gpadmin/spring-hadoop/output

hd.fs=hdfs://localhost:9000
hd.jt=localhost:9001
LIB_DIR=file:///home/gpadmin/spring-hadoop/target
```
Change the LIB_DIR to the direcotry where the jar is present.

####Upload the input

```bash
hadoop fs -mkdir -p /user/gpadmin/spring-hadoop/input
hadoop fs -put input/animals.txt /user/gpadmin/spring-hadoop/input
```

####Launch the Main Program from Eclipse

You will see that the MapReduce program is submitted to the cluster. See the messages on the console.

###Step 6: Check the output

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

```bash
hadoop fs -cat /user/gpadmin/spring-hadoop/output/part-r-00000

```

####You have successfully completed the Basic SpringHadoop Tutorial.

