---
title: Business reviews by Month and Season 
---

Business reviews by Month and Season 
----------------------------------
The given dataset has information about the Businesses, reviews and users. It is interesting to know how the reviews are spread across the year. Does it have any relation to seasons. The tutorial summarizes the reviews by season and by month. The output of the tutorial can be used to plot a histogram.

* Approximate time: 45 mins
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
Following are the steps to the exercise:

*  Understand the Data formats
*  Design the Mapper
*  Design the Reducer

Working with the Tutorial
------------------------

###Step 1: Understand the Data formats

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

###Step 3: Designing the Mapper

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
Jan	3
Jul	2
Jun	2
May	2
Spring	6
Winter	3
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

###Step 8: Running the exercise with Eclipse IDE

Download the exercise from [here](git://url "here") and extract into a folder. 
This will count-businesses-reviews-seasona folder. 
Import the tutorial into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html)

###Step 9: Running the tutorial on Pivotal HD cluster

Point Namenode and Resourcemanager to the Pivotal HD cluster in the `hadoop-mycluster.xml`

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

####Building the project 

```bash
mvn clean package
```

####Upload the input

```bash
hadoop fs -put data/business.json /user/foobar/input
hadoop fs -put data/review.json /user/foobar/input
```

####Set the Hadoop Class Path for third-party libraries

```bash
export HADOOP_CLASSPATH=path-to-json-simple-1.1.jar
```

####Submit the job

```bash
hadoop jar target/count-businesses-reviews-season-0.0.1.jar com.pivotal.hadoop.review.business.SeasonDriver -conf $HADOOP_HOME/hadoop-mycluster.xml  /user/foobar/input/review.json /user/foobar/output

```

Monitor the job status in the Command Center dashboard.

####Check the output

Verify the job in the Pivotal Command Center Dashboard

Browse the hadoop file system and check the output directory. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/foobar/output/part-r-00000
```

###Congratulations! You have successfully completed the tutorial.

