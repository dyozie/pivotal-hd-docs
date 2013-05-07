---
title: Run wordcount example with Spring Hadoop
---

Run wordcount example with Spring Hadoop
--------------------------------------
The tutorial demonstrates running the worcount example with Spring Hadoop

* Approximate time: 30 mins
* Level: Basic

Use case
--------
Count the words in a directory or document

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
Every MapReduce program comes with the `Main` class, that used the MapReduce API to submit the job.
With Spring Hadoop, the job creation is handled by Spring Hadoop. The jobs can be submitted with various configuration options without changing the code. 

Designing and writing of Mapper and Reduce classes does not change with Hadoop. With Spring Batch, the job can be part of the chain of Jobs. The Spring Hadoop helps by providing a clean way of invoking MapReduce jobs without worrying about the complexity.

*  Creating Application Context with Spring Hadoop
*  Run the example

Working with the Tutorial
------------------------

###Creating Application Context with Spring Hadoop

The Application Context file is shown below.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/hadoop"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:beans="http://www.springframework.org/schema/beans"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
	http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
	http://www.springframework.org/schema/hadoop http://www.springframework.org/schema/hadoop/spring-hadoop.xsd">


	<context:property-placeholder location="hadoop.properties" />

	<configuration >
		fs.default.name=${hd.fs}
		mapred.job.tracker=${hd.jt}
	</configuration>

	<job id="wordcountJob" 
		input-path="${wordcount.input.path}"
		output-path="${wordcount.output.path}"
		libs="${LIB_DIR}/spring-hadoop-0.0.1.jar"
		mapper="com.pivotal.springhadoop.edu.WordCount.TokenizerMapper"
		reducer="com.pivotal.springhadoop.edu.WordCount.IntSumReducer" 
		/>

	<job-runner id="runner" run-at-startup="true" job-ref="wordcountJob" />

</beans:beans>
```

A sample hadoop.properties is shown below:

```xml
wordcount.input.path=/animals.txt
wordcount.output.path=/tmp/output

hd.fs=hdfs://localhost:9000
hd.jt=localhost:9001
LIB_DIR=file:///home/gpadmin/spring-hadoop/target
```

Spring Hadoop has the namespace, which is made default in the above xml.
The configuration tag provides the location of HDFS and Jobtracker to submit the jobs.
The Job is defined with xml as shown above and the JobRunner runs the Job.


###Step 2: Run the example

The code creates the Application Context and Spring Hadoop runs the job after initialization. 

```java

private static final String[] CONFIGS = new String[] { "applicationContext.xml" };

public static void main(String[] args) {
	String[] res = (args != null && args.length > 0 ? args : CONFIGS);
	AbstractApplicationContext ctx = new ClassPathXmlApplicationContext(res);
	ctx.registerShutdownHook();
}

```

###Step 8: Running the exercise with Eclipse IDE

Clone the source code from github.

```bash
git clone git@github.com:rajdeepd/pivotal-samples.git
```

Import the tutorial into eclipse and run using the instructions [Setting Development Environment](../setting-development.html).

###Step 9: Running the tutorial on command line

####Building the project 
```bash
mvn package
```

####Upload the input

```bash
hadoop fs -put data/business.json /user/gpadmin/input
```

####Submit the job

```bash
hadoop jar target/wordcount-0.0.1.jar com.pivotal.hadoop.WordCount /user/gpadmin/input /user/gpadmin/output
```
Monitor the job status in the Command Center dashboard.

####Check the output

Verify the job in the Pivotal Command Center Dashboard

Browse the hadoop file system and check the output directory. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/output/part-r-00000
```

###You have successfully SpringHadoop Tutorials.

