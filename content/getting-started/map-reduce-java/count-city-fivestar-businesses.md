---
title: Count of Five Star Businesses in a City
---

Count of Five Star Businesses in a City
------------------------------------------
The given dataset has information about the business, star rating and location. The MapReduce program counts the number of five star businesses in a city.

* Approximate time: 30 mins
* Level: Basic

Use case
--------
The goal of the exercise is to count the total number of five start businesses in a city 

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

###Step 1: Understand the InputFormat

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

###Step 2: Designing the Mapper

The Mapper is very simple. It prints out, the city as the key, business name as the value.

#### Mapper code:

```java
@Override
protected void map(LongWritable key, MapWritable value, Context context)
		throws IOException, InterruptedException {

	star = (Text) value.get(stars);
	businessName = (Text) value.get(businessKey);
	city = (Text) value.get(cityKey);

	if (StringUtils.isNotEmpty(star.toString())
			&& StringUtils.isNotEmpty(businessName.toString())) {
		if (testForStarRating(Double.parseDouble(star.toString()))) {
			context.write(city, businessName);
		}
	}
}

public static boolean testForStarRating(double reviewCount) {
	return (reviewCount >= STAR_RATING) ? true : false;
}

```

The mapper outputs the city and business name. The tutorial can be expanded to print the business names along with the count.

###Step 4: Designing the Reducer  
The Reducer will loop though the values and prints the total count. The total count would be the total five star businesses it a city.

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

###Step 4: Writing the MapReduce Driver Code

Check the Output format of the Reducer. The output key is set to `Text.class` and output value is `IntWritable`, since we are printing the count. The output of Mapper is also set with the methods `setMapOutputKey and setOutputVaue`.

```java
job.setMapOutputValueClass(Text.class);
job.setMapOutputKeyClass(Text.class);

job.setOutputKeyClass(Text.class);
job.setOutputValueClass(IntWritable.class);

```

The `FiveStarReviewedBusinessDriver` class uses the ToolRunner as shown below. Using the ToolRunner helps in parsing the arguments.
```java
p.ublic class FiveStarReviewedBusinessDriver extends Configured implements Tool {

	public static void main(String[] args) throws Exception {

		if (args.length != 2) {
			System.err.println("Usage: " + "FiveStarReviewedBusinessDriver"
					+ "<Business data> <out>");
			System.exit(2);
		}
		int exitCode = ToolRunner.run(new FiveStarReviewedBusinessDriver(),
				args);
		System.exit(exitCode);
	}
```

###Step 5: Running the Map-Reduce on Pivotal HD cluster

####Building the project 

```bash
mvn clean package
```

####Upload the input

```bash
hadoop fs -put input/business.json /user/foobar/input
```

####Set the Hadoop Class Path for third-party libraies

```bash
export HADOOP_CLASSPATH=path-to-json-simple-1.1.jar
```

####Submit the job

```bash
hadoop jar target/count-city-fivestar-businesses-0.0.1.jar com.pivotal.hadoop.review.business.FiveStarReviewedBusinessDriver -conf $HADOOP_HOME/hadoop-mycluster.xml  /user/foobar/input /user/foobar/output

```

Monitor the job status in the Command Center dashboard.

####Check the output

Verify the job in the Pivotal Command Center Dashboard

Browse the hadoop file system and check the output directory. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/foobar/output
```

###Congratulations! You have successfully completed the tutorial.

