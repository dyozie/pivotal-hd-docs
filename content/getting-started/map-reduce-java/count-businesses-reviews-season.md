---
title: Business reviews by Month and Season 
---

Business reviews by Month and Season 
----------------------------------
The given dataset has information about the Businesses, reviews and users. It is interesting to know how the reviews are spread across the year. Does it have any relation to seasons. The tutorial summarizes the reviews by season and by month. The output of the tutorial can be used to plot a histogram.

* Approximate time: 45 min
* Level: Intermediate

Use case
--------
The goal of the tutorial is to count the number of business reviews by month and season.

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
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

Import the sample `count-businesses-reviews-season` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

###Step 3: Understand the Data formats

A sample review record is shown below:

```xml
{
    "votes": 
        {"funny": 0, "useful": 5, "cool": 2}, 
    "user_id": "rLtl8ZkDX5vH5nAx9C3q5Q", 
    "review_id": "fWKvX83p0-ka4JS3dc6E5A", 
    "stars": 5, 
    "date": "2011-01-26", 
    "text": "My wife took me here on my birthday for breakfast and it was excellent.  The weather was perfect which made sitting outside overlooking their grounds an absolute pleasure.  Our waitress was excellent and our food arrived quickly on the semi-busy Saturday morning.  It looked like the place fills up pretty quickly so the earlier you get here the better.\n\nDo yourself a favor and get their Bloody Mary.  It was phenomenal and simply the best I've ever had.  I'm pretty sure they only use ingredients from their garden and blend them fresh when you order it.  It was amazing.\n\nWhile EVERYTHING on the menu looks excellent, I had the white truffle scrambled eggs vegetable skillet and it was tasty and delicious.  It came with 2 pieces of their griddled bread with was amazing and it absolutely made the meal complete.  It was the best \"toast\" I've ever had.\n\nAnyway, I can't wait to go back!", 
    "type": "review", 
    "business_id": "rncjoVoEFUJGCUoC1JgnUA"
}
```

Since 

###Step 4: Designing the Mapper

####SeasonReviewMapper
The code for SeasonMapper is shown below:

```java
@Override
protected void map(LongWritable key, MapWritable value, Context context)
    throws IOException, InterruptedException {

    reviewDate = (Text) value.get(dateKey);
    if (reviewDate == null) {
        return;
    }

    if (StringUtils.isNotEmpty(reviewDate.toString())) {
        // date is in this format 2011-07-27
        String tokens[] = StringUtils.split(reviewDate.toString(), "-");
        String month = tokens[1];
        writeToSeason(month, context);
        writeToMonth(month, context);
    }
}
```

Mapper outputs the months and its count. The code is show below:

```java
public void writeToMonth(String month, Context context) {

    String[] months = new String[] { "dummy", "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" };
    int monthNumber;
    monthNumber = Integer.parseInt(month);
    try {
        monthly.set(months[monthNumber]);
        context.write(monthly, one);
    } catch (IOException e) {
        e.printStackTrace();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

Mapper outputs the seasons and its count. The code is show below:
In both the cases one can use the combiner to make the MapReduce more efficient.

The output of the mapper is shown below:

```xml
Jan    3
Jul    2
Jun    2
May    2
Spring    6
Winter    3
```

###Step 4: Designing the Reducer  
The Reducer is similar to the WordCount. It simply counts the count of reviews by month and seasons.

The Reducer code is shown below:

```java
@Override
protected void reduce(Text key, Iterable<IntWritable> values,
        Context context) throws IOException, InterruptedException {
    int count = 0;
    for (IntWritable x : values) {
        count += 1;
    }
    seasonCount.set(count);
    context.write(key, seasonCount);
}
```

###Step 4: Writing the MapReduce Driver Code

```java
public int run(String[] args) throws Exception {

    Job job = new Job(getConf());
    job.setJarByClass(SeasonDriver.class);

    FileInputFormat.setInputPaths(job, new Path(args[0]));
    Path outputPath = new Path(args[1]);
    outputPath.getFileSystem(job.getConfiguration()).delete(outputPath,
            true);

    job.setMapperClass(SeasonReviewMapper.class);
    job.setReducerClass(SeasonCountReducer.class);
    job.setCombinerClass(SeasonCountReducer.class);

    job.setInputFormatClass(YelpDataInputFormat.class);
    FileOutputFormat.setOutputPath(job, new Path(args[1]));

    job.setMapOutputKeyClass(Text.class);
    job.setMapOutputValueClass(IntWritable.class);

    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(IntWritable.class);

    job.waitForCompletion(true);
    return 0;
}
```

The combiner class is set using the following line:

```java
job.setCombinerClass(SeasonCountReducer.class);
```

###Step 5: Running the tutorial in command line
The following instructions can be used to run the sample on the Pseudo distributed cluster.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd count-businesses-reviews-season
```
Build the project

```bash 
mvn clean compile
mvn -DskipTests package
```
####Copy Third party libraries

Note: The tutorial assumes you are running Psuedo Distributed cluster.

This tutorial uses third-party library `json-simple-1.1.jar`. Maven will download keep the library in the repository. Copy the library to the target folder.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
```

At this point, one can directly run on the sample in Pivotal HD Cluster using `Step 8`.

Follow the steps below to run on the local machine in Psuedo-distributed mode.

####Set the environment

Make sure the following environment variable are set.

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

Note: The step assumes that, you have set up the local machine to run hadoop in Psuedo distributed mode.

####Upload the input

```bash
hadoop fs -put input/business.json /user/gpadmin/sample5/input

hadoop fs -put input/review.json /user/gpadmin/sample5/input
```

####Submit the job

```bash
hadoop jar target/count-businesses-reviews-season-0.0.1.jar com.pivotal.hadoop.review.business.SeasonDriver -libjars target/json-simple-1.1.jar  /user/gpadmin/sample5/review.json /user/gpadmin/sample5/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample5/output/part-r-00000

```

###Step 8: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanodes.
Execute the following commands on the development machine.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
tar -zcvf sample5.tar.gz target/* input/*
scp sample5.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample5.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanodes is running.

####Extract the Archive
Login to datanode and extract the `sample5.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir count-businesses-reviews-season
cd count-businesses-reviews-season
tar -zxvf ../sample5.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample5/input
hadoop fs -put input/review.json /user/gpadmin/sample5/input
```

####Submit the Job

```bash
hadoop jar target/count-businesses-reviews-season-0.0.1.jar com.pivotal.hadoop.review.business.SeasonDriver -libjars target/json-simple-1.1.jar  /user/gpadmin/sample5/input/review.json /user/gpadmin/sample5/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample5/output/part-r-00000

```
You have successfully run the sample on Pivotal HD Cluster!.

