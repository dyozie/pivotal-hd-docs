---
title: Run WordCount example with Spring Data - Pivotal HD Cluster
---

##Run WordCount example with Spring Data - Pivotal HD Cluster
The tutorial demonstrates running the wordcount example with Spring Data for Apache Hadoop

* Approximate time: 45 Mins
* Level: Basic

##Use case
Count the words in a directory or a document.

##Pre-requisites
* Maven installed and available to build the project
* Pivotal HD Cluster installed
* git should be avialable on one of the machines in the Pivotal HD cluster
* The tutorial comes with spring data `1.0.1.RC1` version
* THe tutorial requires to be run on one of the nodes in the Pivotal HD cluster
* The tutorial is tested with Pivtoal HD product 2.0

###Install Maven if not present
Download maven binaries from [here](http://apache.claz.org/maven/maven-3/3.0.5/binaries/apache-maven-3.0.5-bin.tar.gz)

Set the PATH variable, so that maven is availble in the PATH as shown below:

```bash
export MAVEN_HOME=MAVEN_INSTALL_DIR
export PATH=$PATH:$MAVEN_HOME/bin
```
Replace MAVEN_INSTALL_DIR to the location where maven is installed.

##Approach
Every MapReduce program comes with the `Main` class; that used the MapReduce API to submit the job.
With Spring Hadoop, the job creation is handled by Spring Hadoop. The jobs can be submitted with various configuration options without changing the code. 

Designing and writing of Mapper and Reducer classes does not change with Hadoop. With Spring Batch, the job can be part of chain of Jobs. The Spring Hadoop helps by providing a clean way of invoking MapReduce jobs without worrying about the complexity.

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory. Change directory to project directory.

```bash
cd pivotal-samples
cd spring-hadoop-wordcount-gphd
```

###Add GPHD libraries to maven

```bash
chmod 755 src/main/scripts/add-to-maven.sh
src/main/scripts/add-to-maven.sh
```

This will add the spring data hadoop distribution and all required jars for running the application to a maven repository.
The jars are referenced in the `pom.xm` as shown below:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>spring-hadoop-wordcount-gphd</groupId>
    <artifactId>spring-hadoop-wordcount-gphd</artifactId>
    <version>0.0.1</version>
    <packaging>jar</packaging>

    <name>spring-hadoop-wordcount-gphd</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.3.2</version>
                <configuration>
                    <source>1.5</source>
                    <target>1.5</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>appassembler-maven-plugin</artifactId>
                <version>1.2.2</version>
                <configuration>
                    <repositoryLayout>flat</repositoryLayout>
                    <programs>
                        <program>
                            <mainClass>com.pivotal.springhadoop.wordcount.WordCount</mainClass>
                            <name>wordcount</name>
                        </program>
                    </programs>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.hamcrest</groupId>
            <artifactId>hamcrest-all</artifactId>
            <version>1.1</version>
        </dependency>
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
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.10</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-auth</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-hdfs</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-common</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-client-common</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-client-core</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-client-jobclient</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-examples</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-yarn-api</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-yarn-client</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-yarn-client</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>gphd</groupId>
            <artifactId>gphd-yarn-common</artifactId>
            <version>2.0.1.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava-testlib</artifactId>
            <version>11.0.2</version>
        </dependency>
        <dependency>
            <groupId>org.codehaus.jackson</groupId>
            <artifactId>jackson-core-asl</artifactId>
            <version>1.8.8</version>
        </dependency>
        <dependency>
            <groupId>org.codehaus.jackson</groupId>
            <artifactId>jackson-mapper-asl</artifactId>
            <version>1.8.8</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>1.7.1</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
        <dependency>
            <groupId>com.google.protobuf</groupId>
            <artifactId>protobuf-java</artifactId>
            <version>2.4.0a</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.1</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.6.1</version>
        </dependency>
            <artifactId>commons-cli</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>commons-configuration</groupId>
            <artifactId>commons-configuration</artifactId>
            <version>1.6</version>
        </dependency>
        <dependency>
            <groupId>commons-lang</groupId>
            <artifactId>commons-lang</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.1.1</version>
        </dependency>
        <dependency>
            <groupId>aopalliance</groupId>
            <artifactId>aopalliance</artifactId>
            <version>1.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.avro</groupId>
            <artifactId>avro-ipc</artifactId>
            <version>1.5.3</version>
        </dependency>
        <dependency>
            <groupId>commons-cli</groupId>
            <artifactId>commons-cli</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>commons-configuration</groupId>
            <artifactId>commons-configuration</artifactId>
            <version>1.6</version>
        </dependency>
        <dependency>
            <groupId>commons-lang</groupId>
            <artifactId>commons-lang</artifactId>
            <version>2.5</version>
        </dependency>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.1.1</version>
        </dependency>
    </dependencies>
</project>
```

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

###Step 5: Running the tutorial on Pivotal HD Cluster

####Customize **hadoop-properties** in `resources` directory

```xml
wordcount.input.path=/user/gpadmin/spring-hadoop-wordcount-gphd/input
wordcount.output.path=/user/gpadmin/spring-hadoop-wordcount-gphd/output
hd.fs=hdfs://NAMENODE:8020
LIB_DIR=file:///PROJECT_DIR/pivotal-samples/spring-hadoop-wordcount-gphd/target
```
Change the PROJECT_DIR to the `spring-hadoop-wordcount-gphd` project directory.

####Upload the input

```bash
hadoop fs -mkdir -p /user/gpadmin/pivotal-samples/spring-hadoop-wordcount-gphd/input
hadoop fs -put input/animals.txt /user/gpadmin/pivotal-samples/spring-hadoop-wordcount-gphd/input
```

###Build the project using maven

```bash
$ mvn clean package appassembler:assemble
```
The maven appassembler creates a shell script `wordcount` in the directory `target/appassembler/bin`. The shell script has the classpath correctly set.
 
Verify uisng the followig command

```bash
ls -al target/appassembler/bin/wordcount
chmod 755 target/appassembler/bin/wordcount
```

####Submit the Job

Run the shell script `wordcount`

```bash
target/appassembler/bin/wordcount
```

####Check the output

Verify the job in the hadoop cluster as shown below:

![Job Command Center](/images/gs/mapreduce/sample1.png)

Click View more job details to see the job details as shown below:

![Job Details](/images/gs/mapreduce/sample1-details.png)

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/pivotal-samples/spring-hadoop-wordcount-gphd/output/part-r-00000
```

You have successfully run the Spring Apache Hadoop sample on Pivotal HD Cluster!.

