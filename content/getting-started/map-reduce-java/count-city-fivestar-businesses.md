---
title: Count of Five Star Businesses in a City
---

Count of Five Star Businesses in a City
------------------------------------------
The given dataset has information about the business, star rating and location. The MapReduce program counts the number of five star businesses in a city.

* Approximate time: 30 min
* Level: Basic

Use case
--------
The goal of the exercise is to count the total number of five star businesses in a city 

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../getting-started/setting-development.html)

Approach
--------
Following are the steps to the exercise:

*  Understand the Data formats
*  Design the Mapper
*  Design the Reducer

Working with the Tutorial
------------------------

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `count-city-fivestar-businesses` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html).

###Step 3: Understand the InputFormat

A sample record is shown below:

```xml
{
 "business_id": "rncjoVoEFUJGCUoC1JgnUA", 
 "full_address": "8466 W Peoria Ave\nSte 6\nPeoria, AZ 85345", 
 "open": true, 
 "categories": ["Accountants", "Professional Services", "Tax Services", "Financial Services"], 
 "city": "Peoria", 
 "review_count": 3, 
 "name": "Peoria Income Tax Service", 
 "neighborhoods": [], 
 "longitude": -112.241596, 
 "state": "AZ", 
 "stars": 5.0, 
 "latitude": 33.581867000000003, 
 "type": "business"
}
```

The dataset has all the information. 

###Step 4: Designing the Mapper

The Mapper is very simple. It prints out, the city as the key, business name as the value.

#### Mapper code:

```java
public class BusinessMapper extends
        Mapper<LongWritable, MapWritable, Text, Text> {

    Writable stars = new Text("stars");
    Writable businessKey = new Text("name");
    Writable cityKey = new Text("city");
    Text star = new Text();
    Text businessName = new Text();
    Text city = new Text();

    @Override
    protected void map(LongWritable key, MapWritable value, Context context)
            throws IOException, InterruptedException {

        star = (Text) value.get(stars);
        businessName = (Text) value.get(businessKey);
        city = (Text) value.get(cityKey);

        if (StringUtils.isNotEmpty(star.toString())
                && StringUtils.isNotEmpty(businessName.toString())) {
            if (checkReview(Double.parseDouble(star.toString()))) {
                context.write(city, businessName);
            }
        }
    }

    public static boolean checkReview(double reviewCount) {
        return (reviewCount == 5.0) ? true : false;
    }


```

The mapper outputs the city and business name. The tutorial can be expanded to print the business names along with the count.

###Step 5: Designing the Reducer  
The Reducer will loop through the values and prints the total count. The total count would be the total five star businesses it a city.

The Reduce code is shown below:

```java
@Override
    protected void reduce(Text key, Iterable<Text> values, Context context)
            throws IOException, InterruptedException {
        int count = 0;
        for (Text val : values) {
        count += 1;
            }
        businessCount.set(count);
            context.write(key, businessCount);
    }
```

###Step 6: Writing the MapReduce Driver Code

Check the Output format of the Reducer. The output key is set to `Text.class` and output value is `IntWritable`, since we are printing the count. The output of Mapper is also set with the methods `setMapOutputKey and setOutputVaue`.

```java
job.setMapOutputValueClass(Text.class);
job.setMapOutputKeyClass(Text.class);

job.setOutputKeyClass(Text.class);
job.setOutputValueClass(IntWritable.class);

```

The `FiveStarReviewedBusinessDriver` class uses the ToolRunner. Using the ToolRunner helps in parsing the arguments.
```java
public class FiveStarReviewedBusinessDriver extends Configured implements Too
        public static void main(String[] args) throws Exception {
            if (args.length != 2) {
                System.err.println("Usage: " + "FiveStarReviewedBusinessDriver"
                    + "<Business data> <out>");
                System.exit(2);
            }
        int exitCode = ToolRunner.run(new FiveStarReviewedBusinessDriver(),args);
        System.exit(exitCode);
    }
}
```

###Step 7: Running the exercise with Eclipse IDE

Import the tutorial into eclipse and run using the instructions given in the [Setting Development Environment](../setting-development.html)

###Step 8: Running the tutorial in command line

The following instructions can be used to run the sample on the Pseudo distributed cluster.

####Building the project 

Go to the project directory

```bash

cd  pivotal-samples
ls
cd count-city-fivestar-businesses
```

Build the project

```bash
mvn clean compile
mvn clean package
```
####Copy Third party libraries

Note: The tutorial assumes you are running Pseudo Distributed cluster.

This tutorial uses third-party library `json-simple-1.1.jar`. Maven will download keep the library in the repository. Copy the library to the target folder.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
```

At this point, one can directly run on the sample in Pivotal HD Cluster using `Step 9`.

Follow the steps below to run on the local machine in Pseudo-distributed mode.

####Set the environment

Make sure the following environment variables are set.

```bash
 export HADOOP_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_MAPRED_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_COMMON_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_HDFS_HOME=$HOME/hadoop-2.0.3-alpha
 export YARN_HOME=$HOME/hadoop-2.0.3-alpha
 export HADOOP_CONF_DIR=$HOME/hadoop-2.0.3-alpha/etc/hadoop
 export JAVA_HOME=$HOME/java/jdk1.7.0_17
 export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin
```

Note: The step assumes that, you have set up the local machine to run hadoop in Pseudo distributed mode.

####Upload the input

```bash
hadoop fs -put path-to-business.json /user/gpadmin/sample2/input
```
####Submit the job
Download json-simple-1.1.jar file and point it to hadoop by using -libjars.

```bash
hadoop jar target/count-city-fivestar-businesses-0.0.1.jar com.pivotal.hadoop.review.business.FiveStarReviewedBusinessDriver -libjars path-to-json-simple-1.1.jar   /user/gpadmin/sample2/input /user/gpadmin/sample2/output

```

####Check the output

Verify the job in the hadoop cluster.

Browse hadoop file system to check the output directory. The output directory should contain the part-r-0000-file.
See the output using

```bash
hadoop fs -cat /user/gpadmin/sample2/output
```


###Step 9: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanodes.
Execute the following commands on the development machine.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
tar -zcvf sample2.tar.gz target/* input/*
scp sample2.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample2.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanodes is running.

####Extract the Archive
Login to datanode and extract the `sample2.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir count-city-fivestar-businesses
cd count-city-fivestar-businesses
tar -zxvf ../sample2.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample2/input
hadoop fs -put input/business.json /user/gpadmin/sample2/input
```

####Submit the Job

```bash
hadoop jar target/count-city-fivestar-businesses-0.0.1.jar com.pivotal.hadoop.review.business.FiveStarReviewedBusinessDriver -libjars target/json-simple-1.1.jar /user/gpadmin/sample2/input /user/gpadmin/sample2/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample2/output/part-r-00000

```

###You have successfully completed the tutorial.

