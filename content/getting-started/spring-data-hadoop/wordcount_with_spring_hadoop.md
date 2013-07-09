---
title: Run WordCount example with Spring Data - Apache Hadoop
---

##Run WordCount example with Spring Data - Apache Hadoop
The tutorial demonstrates running the wordcount example with Spring Data for Apache Hadoop

* Approximate time: 45 Mins
* Level: Basic

##Use case
Count the words in a directory or a document.

##Pre-requisites
* Maven installed and available to build the project
* Hadoop 2.0.3-alpha is up and running on localhost
* The tutorial comes with spring data `1.0.1.RC1` version

##Approach
Every MapReduce program comes with the `Main` class; that used the MapReduce API to submit the job.
With Spring Hadoop, the job creation is handled by Spring Hadoop. The jobs can be submitted with various configuration options without changing the code. 

Designing and writing of Mapper and Reducer classes does not change with Hadoop. With Spring Batch, the job can be part of chain of Jobs. The Spring Hadoop helps by providing a clean way of invoking MapReduce jobs without worrying about the complexity.

* Creating Application Context with Spring Hadoop
* Build the example to get the jar file for the job
* Run the WordCount example from eclipse

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/PivotalHD/pivotal-samples.git
```
This will create pivotal-samples directory.

Add the jar file to local maven repository using the following instructions:

```bash
cd pivotal-samples/spring-hadoop-wordcount
mvn install:install-file -Dfile=libs/spring-data-hadoop-1.0.1.RC1.jar -DgroupId=org.springframework.data \
    -DartifactId=spring-data-hadoop -Dversion=1.0.1.RC1 -Dpackaging=jar
```

The tutorial comes with pom.xml, which has the following entries. This will take care of the dependencies for the project.

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-hadoop</artifactId>
    <version>1.0.1.RC1</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>3.2.1.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>3.2.1.RELEASE</version>
</dependency>
```

###Building project
Build the project using maven

```bash
cd spring-hadoop-wordcount`
mvn clean
mvn compile package
```

###Step 2: Importing the project to Eclipse IDE

Import the sample `spring-hadoop-wordcount` project into eclipse.

* Select File->Import and select `Existing projects into Workspace`

![import](/images/gs/setup/import-maven.png)

* Click `Browse` to select the directory where source code is present
* Select the directory and click `Open`
* Click `Deselect All` and check the box for the project we are interested in and Click `Finish`

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

    <configuration >
        fs.default.name=${hd.fs}
    </configuration>

    <job id="wordcountJob" 
        input-path="${wordcount.input.path}"
        output-path="${wordcount.output.path}"
        libs="${LIB_DIR}/spring-hadoop-0.0.1.jar"
        mapper="com.pivotal.springhadoop.WordCount.TokenizerMapper"
        reducer="com.pivotal.springhadoop.WordCount.IntSumReducer" 
        />

        <job-runner id="runner" run-at-startup="true" job-ref="wordcountJob" />

</beans:beans>
```

The configuration tag provides the configuration for the Job. In the sample we are configuring hdfs url path using `fs.default.name` property.
The Job is defined in the `applicationContext.xml` as shown above. 
The `configuration` element will override the default configuration properties. Custom properties can also be included here and can be used in the mapper and reducer.
Spring Data for Apache Hadoop provides number of attributes for configuring the job. In this sample, we are using mapper, reducer, input, output and libs attributes. 

The attribute `run-at-startup="true"` runs the job as soon the spring application context is initialized.

###Step 4: Hadoop Driver class

The main program creates and initializes the application context. Since `run-at-startup="true"` is set for the runner, the runner will  invoke the mapreduce job as soon the context is initialized.

The code for the main driver program is shown below:

```java
package com.pivotal.springhadoop.wordcount;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class WordCount {

    private static final Log log = LogFactory.getLog(WordCount.class);

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext context = new ClassPathXmlApplicationContext(
                "/applicationContext.xml", WordCount.class);
        log.info("Word Count Application Running");
        context.registerShutdownHook();
    }

    public static class TokenizerMapper extends
            Mapper<Object, Text, Text, IntWritable> {

        private final static IntWritable one = new IntWritable(1);
        private Text word = new Text();

        public void map(Object key, Text value, Context context)
                throws IOException, InterruptedException {
            StringTokenizer itr = new StringTokenizer(value.toString());
            while (itr.hasMoreTokens()) {
                word.set(itr.nextToken());
                context.write(word, one);
            }
        }
    }

    public static class IntSumReducer extends
            Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values,
                Context context) throws IOException, InterruptedException {
            int sum = 0;
            for (IntWritable val : values) {
                sum += val.get();
            }
            result.set(sum);
            context.write(key, result);
        }
    }
}
```

###Step 5: Running the tutorial

####Build the project

###Build the project
Go to package Explorer, select the project and right click to get properties.
Click `Run As -> Maven Install` to build the project.

This will create target directory with `spring-hadoop-wordcount-0.0.1.jar` file

####Customize **hadoop-properties** in `resources` directory

```xml
wordcount.input.path=/user/gpadmin/spring-hadoop-wordcount/input
wordcount.output.path=/user/gpadmin/spring-hadoop-wordcount/output
hd.fs=hdfs://localhost:9000
LIB_DIR=file:///PROJECT_DIR/pivotal-samples/spring-hadoop-wordcount/target
```
Change the PROJECT_DIR to the `spring-hadoop-wordcount` project directory.

####Upload the input

```bash
hadoop fs -mkdir -p /user/gpadmin/spring-hadoop-wordcount/input
hadoop fs -put input/animals.txt /user/gpadmin/spring-hadoop-wordcount/input
```

####Launch the Main Program from Eclipse

Select the `WordCount` class in the package explorer
Go to eclipse main menu, select `Run -> Run As -> Java Application` to submit the job to the Hadoop cluster.

The MapReduce program is submitted to the cluster. The messages on the console indicate that the job is submitted and can be see on the url `http://localhost:8088/cluster/apps`

###Step 6: Check the output

Go to url `http://localhost:8088/cluster/apps`

![Jobs](/images/gs/spring-hadoop/job.png)

Click on the job to see the job details

![Jobs](/images/gs/spring-hadoop/job-details.png)

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

```bash
hadoop fs -cat /user/gpadmin/spring-hadoop-worcount/output/part-r-00000
```
You have successfully run the Spring Data sample on Apache Hadoop 2.0.3-alpha
