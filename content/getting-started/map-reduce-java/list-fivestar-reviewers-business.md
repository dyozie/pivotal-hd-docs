---
title: List of Five star reviewers for a Business
---

List of Five star reviewers(users) for a Business
----------------------------------------

* Approximate time: 1 hour 
* Level: Advanced

Use case
--------
The goal of the tutorial is to find out list of all users who has rated a business as five star.

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)


In this tutorial, the following important concepts are demonstarted:

* Reduce side Join, joined by a common key across the datasets

* Multiple data sets, processed by individual mappers

Approach
--------
*  Understand the Data formats
*  Design the Mapper
*  Design the Reducer

Working with the Tutorial
------------------------


###Step 1: Clone the source from the git repository

```bash
git clone https://@github.com:rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `list-fivestar-business-reviewers` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

###Step 3: Understand the InputFormat

A sample business record is shown below:

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
A sample review record is show below:

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

The two data sets have the business_id as the common key. Hadoop core API provides MultipleInputs class, which can take multiple inputs. Each input can have a separate Mapper.

In this we will have two mappers `BusinessMapper` and `ReviewMapper`.

The output of these two mappers will be sent to the Reducer using a common key `business_id`. We also need to tag the map output so that Reducer knows from which input data set, the output belongs to. 

###Step 4: Designing the Mappers

####BusinessMapper

The mappper process the data from input data set 1. The key will be `business_id`. 

The output of the mapper would be as follows:

```xml
mapper output key=business_id
mapper output value=B:business name: city
```
Note that the value will be tagged with data source. In this case, the output of mapper is tagged with the value `B`.

The BusinessMapper code is shown below:

```java
public void map(LongWritable key, MapWritable value, Context context)
			throws IOException, InterruptedException {

	businessId = (Text) value.get(businessIdKey);
	busninessName = (Text) value.get(businessNameKey);

	city = (Text) value.get(cityKey);

	if (StringUtils.isNotEmpty(businessId.toString())
			&& StringUtils.isNotEmpty(busninessName.toString())) {
		outputValue.set("B:" + busninessName.toString() + ":"
				+ city.toString());
		context.write(businessId, outputValue);
	}

}
```
####Review Mapper

The mappper process the data from input data set 2. The key will be `business_id`. 
The output of the mapper would be as follows:

```xml
mapper output key=business_id
mapper output value=R:user_id:review_rating
```
Note that the output value will is tagged with data source. In this case, the output of mapper is tagged with the value `R`.

The ReviewMapper code is shown below:

```java
public void map(LongWritable key, MapWritable value, Context context)
			throws IOException, InterruptedException {

	starKey = value.get(new Text("stars"));
	userIdKey = value.get(new Text("user_id"));
	businessId = (Text)value.get(new Text("business_id"));

	if (StringUtils.isNotEmpty(userIdKey.toString())
			&& StringUtils.isNotEmpty(businessId.toString())
			&& checkReview(Double.parseDouble(starKey.toString()))) {
		userId.set(userIdKey.toString());
		outputvalue.set("R:" + userIdKey.toString() + ":"
				+ starKey.toString());
		context.write(businessId, outputvalue);
	}

}
```

###Step 5: Designing the Reducer  
All the action happens in the Reducer. Each Reducer will get the `business_id` as the key and the list of values from both the input data sets.

The Reducers constructs a single record out of the two data sets. The output of BusinessMapper is unique, since there is only one record for every business in the business dataset.

There will be multiple values from the ReviewMapper, since there can be multiple reviews by the users.

The reducers collects the output from both the mappers and joins them. The output is business_name, city, users count followed by comma separated list of user_id.

Ideally, the userids should be replaced by the usernames. Take a look at the next tutorial [User names with distributed cache](list-fivestar-reviewers-business-with-usernames.html) on how to output the user names instead of user_ids.

The reducer code is shown below:

```java
protected void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {

	boolean first_time = true;
	int count = 0;
	StringBuffer userList = new StringBuffer();
	for (Text value : values) {

		if (StringUtils.contains(value.toString(), "B:")) {
			StringBuffer outputKey = new StringBuffer(
					getName(value.toString()));
			outputKey.append(",");
			outputKey.append(getCity(value.toString()));
			outputKey.append(",");
			businessName.set(outputKey.toString());
		}

		if (first_time) {
			userList.append(",");
			if (StringUtils.contains(value.toString(), "R:")) {
				userList.append(getUserid(value.toString()));
			}
			first_time = false;
		} else {
			if (StringUtils.contains(value.toString(), "R:")) {
				userList.append(getUserid(value.toString()) + ",");
			}
		}
		count++;
	}
		userList.delete(userList.length() - 1, userList.length());
		userList.insert(0, count);
		outputValue.set(userList.toString());
		context.write(businessName, outputValue);
}
```

###Step 6: Writing the MapReduce Driver Code

```java
public int run(String[] args) throws Exception {
	Job job = new Job(getConf());
	job.setJarByClass(UserListBusinessDriver.class);

	Path out = new Path(args[2]);
	out.getFileSystem(getConf()).delete(out, true);

	MultipleInputs.addInputPath(job, new Path(args[0]),
			YelpDataInputFormat.class, BusinessMapper.class);
	
	MultipleInputs.addInputPath(job, new Path(args[1]),
			YelpDataInputFormat.class, ReviewMapper.class);

	job.setReducerClass(BusinessUserReducer.class);

	FileOutputFormat.setOutputPath(job, new Path(args[2]));

	job.setMapOutputKeyClass(Text.class);
	job.setMapOutputValueClass(Text.class);

	job.setOutputKeyClass(Text.class);
	job.setOutputValueClass(Text.class);

	job.waitForCompletion(true);
	return 0;
}
```
Note that `MultipleInputs.addInputPath` is used to set the inputdata set and the associated mapper as shown below:

```java
MultipleInputs.addInputPath(job, new Path(args[0]),
                         YelpDataInputFormat.class, BusinessMapper.class);

MultipleInputs.addInputPath(job, new Path(args[1]),
		YelpDataInputFormat.class, ReviewMapper.class);
```

###Step 7: Running the tutorial in command line
The following instructions can be used to run the sample on the Pseudo distributed cluster.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd list-fivestar-business-reviewers
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
hadoop fs -put input/business.json /user/gpadmin/sample3/input

hadoop fs -put input/review.json /user/gpadmin/sample3/input
```

####Submit the job

```bash
hadoop jar target/list-fivestar-business-reviewers-0.0.1.jar com.pivotal.hadoop.review.business.UserListBusinessDriver -libjars target/json-simple-1.1.jar /user/gpadmin/sample3/input/business.json /user/gpadmin/sample3/review.json /user/gpadmin/sample3/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample3/output/part-r-00000

```

###Step 8: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanodes.
Execute the following commands on the development machine.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
tar -zcvf sample3.tar.gz target/* input/*
scp sample3.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample3.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanodes is running.

####Extract the Archive
Login to datanode and extract the `sample3.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir list-fivestar-business-reviewers
cd list-fivestar-business-reviewers
tar -zxvf ../sample3.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample3/input
hadoop fs -put input/business.json /user/gpadmin/sample3/input
hadoop fs -put input/review.json /user/gpadmin/sample3/input
```

####Submit the Job

```bash
hadoop jar target/list-fivestar-business-reviewers-0.0.1.jar com.pivotal.hadoop.review.business.UserListBusinessDriver -libjars target/json-simple-1.1.jar /user/gpadmin/sample3/input/business.json /user/gpadmin/sample3/input/review.json /user/gpadmin/sample3/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample3/output/part-r-00000

```

You have successfully run the sample on Pivotal HD Cluster!.

