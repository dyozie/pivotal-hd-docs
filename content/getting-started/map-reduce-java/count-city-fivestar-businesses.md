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

###Step 4: Designing the Reducer  
The Reducer will loop through the values and prints the total count. The total count would be the total five star businesses it a city.

The Reduce code is shown below:

```java
@Override
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

The `FiveStarReviewedBusinessDriver` class uses the ToolRunner. Using the ToolRunner helps in parsing the arguments.
```java
public class FiveStarReviewedBusinessDriver extends Configured implements Tool {

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

###Step 5: Running the Map-Reduce on Pseudo distributed mode

####Building the project 

```bash
mvn clean compile
mvn package
```

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

###Congratulations! You have successfully completed the tutorial.

