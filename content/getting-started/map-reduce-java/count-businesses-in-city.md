---
title: Count of Businesses in a City
---

Count the Total Number of Businesses in a City
--------------------------------------------------------------
The given dataset has information about the Businesses. Each business is located in a city. This use case is a simple example on how to get count how many businesses are there in a city.

* Approximate time: 45 mins
* Level: Basic

Use case
--------
The goal of the exercise is to count the total number of businesses in a city 

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
*  Understand the Data formats
*  Decide on the Input and output formats and implement custom classes if required
*  Design the Mapper
*  Design the Reducer

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com:rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `count-businesses-incity` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

###Step 3: Understand the Data formats

A sample record is shown below:

```json
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
{
  "business_id": "G2Re2E5Jkv_UF1xrenSsDg", 
  "full_address": "4500 E Cactus Rd\nPhoenix, AZ 85032", 
  "open": true, "categories": ["Department Stores", "Fashion", "Shopping"],
  "city": "Phoenix",
  "review_count": 11, 
  "name": "Macy's", 
  "neighborhoods": [], 
  "longitude": -111.9820907,
  "state": "AZ", 
  "stars": 4.0, 
  "latitude": 33.599323599999998,
  "type": "business"
}
```

The data is in JSON format. It is well structured for processing. However we cannot use FileInputFormat because we need to strip down the braces and there could be nested JSON structure inside.

Hence it is clear we have to write our own custom Input Format class. Fortunately, the json library comes with a parse, which we can directly use.

###Step 4:  Decide on the Input and output formats

Since the data is JSON and we need to parse the JSON to get the key and value pairs.
A custom InputFormat is written, which will process one JSON structure at a time. In order to do this,
we need to read one JSON line at a time and convert into to key/value pairs for processing. This is the job of the RecordrReader, which will have the necessary intelligence built in to read one JSON structure at a time.

The Custom InputFormat class `YelpDataInputFormat`  constructs the RecordReader Instance for the framework to use. The MapReduce framework uses the record reader to read the data logically.

```java

public class YelpDataInputFormat extends
        FileInputFormat<LongWritable, MapWritable> {

    private static final Logger log = LoggerFactory
            .getLogger(YelpDataInputFormat.class);

    @Override
    public RecordReader<LongWritable, MapWritable> createRecordReader(
            InputSplit split, TaskAttemptContext context) {
        return new YelpDataRecordReader();
    }
}

```

The RecordReader class is shown in below:

```java
public class YelpDataRecordReader extends
        RecordReader<LongWritable, MapWritable> {
    private static final Logger LOG = LoggerFactory
            .getLogger(YelpDataRecordReader.class);

    private LineRecordReader reader = new LineRecordReader();

    private final MapWritable value = new MapWritable();
    private final JSONParser jsonParser = new JSONParser();

    @Override
    public void initialize(InputSplit split, TaskAttemptContext context)
            throws IOException, InterruptedException {
        reader.initialize(split, context);
    }


.....

```

The framework calls `nextKeyValue()` to check for the presence of the next line and calls `getGetcurrentKey()` and getCurrentValue() to get the key and value respectively.

```java
     public boolean nextKeyValue() throws IOException, InterruptedException {
        while (reader.nextKeyValue()) {
            value.clear();
            try {
                try {
                    if (parseLineToJSON(jsonParser, reader.getCurrentValue(),
                            value)) {
                        return true;
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                    LOG.info("Parse Erorr", e.toString());
                }
            } catch (org.json.simple.parser.ParseException e) {
                e.printStackTrace();
                LOG.info("Parse Erorr", e.toString());
            }
        }
        return false;
    }

    public static boolean parseLineToJSON(JSONParser parser, Text line,
            MapWritable value) throws org.json.simple.parser.ParseException,
            ParseException {
        try {
            JSONObject jsonObj = (JSONObject) parser.parse(line.toString());
            for (Object key : jsonObj.keySet()) {
                Text mapKey = new Text(key.toString());
                Text mapValue = new Text();
                if (jsonObj.get(key) != null) {
                    mapValue.set(jsonObj.get(key).toString());
                }

                value.put(mapKey, mapValue);
            }
            return true;
        } catch (NumberFormatException e) {
            LOG.warn("Parsing Error in Number Field" + line, e);
            return false;
        }
    }
```
 
###Step 5: Designing the Mapper

The Mapper is simpler class similar to the classic wordcount program in the examples. We are counting the businesses in a city instead of the wordcount.

#### Mapper code:

```java

 protected void map(LongWritable key, MapWritable value, Context context)
            throws IOException, InterruptedException {
        city = (Text) value.get(cityKey);
        businessId = (Text) value.get(businessKey);

        if (StringUtils.isNotEmpty(city.toString())
                && StringUtils.isNotEmpty(businessId.toString())) {
            context.write(city, one);
        }
    }
```

###Step 6: Designing the Reducer  
The Reducer is also a simple one similar to the classic wordcount example. In this case, we are counting the total businesses in the city.


```java
 protected void reduce(Text key, Iterable<IntWritable> values,
            Context context) throws IOException, InterruptedException {
        int totalRecords = 0;
        for (IntWritable value : values) {
            totalRecords++;
        }
        context.write(key, new IntWritable(totalRecords));
    }
```

###Step 7: Writing the MapReduce Driver Code

```java
Configuration conf = new Configuration();
Job job = new Job(conf);
job.setJarByClass(CityBusinessDriver.class);

job.setOutputKeyClass(Text.class);
job.setOutputValueClass(IntWritable.class);

job.setMapperClass(CityBusinessMapper.class);
job.setReducerClass(CityBusinessReducer.class);
job.setInputFormatClass(YelpDataInputFormat.class);

FileInputFormat.addInputPath(job, new Path(args[0]));

Path output = new Path(args[1]);
FileSystem.get(new Configuration()).delete(output, true);
FileOutputFormat.setOutputPath(job, output);

job.waitForCompletion(true);

```

The setInputFormatClass sets the input format to the customer input format class YelpDataInputFormat.class

###Step 8: Unit testing Mapper

We use __MRUnit__ to write various tests for this Job. Three key classes in MRUnits are MapDriver for __Mapper Testing__, __ReduceDriver__   for Reducer Testing and __MapReduceDriver__ for an end to end MapReduce Job testing.    
MRUnit is a test framework  to unit test MapReduce code.  It should be noted that MRUnit supports both the old (org.apache.hadoop.mapred)    and new (org.apache.hadoop.mapreduce) MapReduce APIs          

Create the mapper Driver and ReduceDriver as part of the setup.

```java
@Before
public void setUp() throws Exception {
    CityBusinessMapper mapper = new CityBusinessMapper();
    CityBusinessReducer reducer = new CityBusinessReducer();
    mapDriver = MapDriver.newMapDriver(mapper);
    reduceDriver = ReduceDriver.newReduceDriver(reducer);
    mapReduceDriver = MapReduceDriver.newMapReduceDriver(mapper, reducer);
}
```

It is done by using MapDriver class and only tests the map function.   
(_Specify the key/value input and output types for the mapper being tested in this class._)   

```java     
@Test
@Test
public void testCityBusinessMapper() throws Exception {

    final LongWritable inputKey = new LongWritable(0);

    final Text outputKey = new Text("Surprise");
    final IntWritable outputValue = new IntWritable(1);

    final MapWritable inputValue = new MapWritable();
    inputValue.put(new Text("business_id"), new Text(
            "fecYnd2_OTDECk7bd6GOFw"));
    inputValue.put(new Text("full_address"), new Text(
            "12851 W Bell Rd\nSte 20\nSurprise, AZ 85374"));
    inputValue.put(new Text("open"), new Text("true"));
    inputValue.put(new Text("categories"), new Text("Pizza, Restaurants"));
    inputValue.put(new Text("city"), new Text("Surprise"));
    inputValue.put(new Text("review_count"), new Text("7"));
    inputValue.put(new Text("name"), new Text("Peter Piper Pizza"));
    inputValue.put(new Text("neighborhoods"), new Text("[]"));
    inputValue.put(new Text("longitude"), new Text("-112.3373424"));
    inputValue.put(new Text("state"), new Text("AZ"));
    inputValue.put(new Text("stars"), new Text("4.5"));
    inputValue.put(new Text("latitude"), new Text("33.638134100000002"));
    inputValue.put(new Text("type"), new Text("business"));

    mapDriver.withInput(inputKey, inputValue)
            .withOutput(outputKey, outputValue).runTest();

}

```
The `withInput` method is used to specify an input key/value which will be fed to the Mapper.   
The `withOutput` method is used to specify the output key/value which MRUnit will compare against the output generated by the mapper    being tested  

###Step 9: Unit Testing Reducer
It is done by using ReduceDriver class and only tests the reduce function.     
(_Specify the key/value input and output types for the reducer being tested in this class._)  

   
```java
@Test
public void testCityBusinessReducer() throws Exception {
    new ReduceDriver<Text, IntWritable, Text, IntWritable>()
        .withReducer(new CityBusinessReducer())
        .withInputKey(new Text("Surprise"))
        .withInputValues(
            Arrays.asList(new IntWritable(1),new IntWritable(1),new IntWritable(1)))
        .withOutput(new Text("Surprise"), new IntWritable(3)).runTest();
}
```

The ___withInput___ method is used to specify an input key/value. When testing the reducer  specify a list of values that MRUnit sends to the reducer. Add the expected output for the using ___withOutput___.

###Step 10: Testing Mapper and Reducer together
   
MRUnit also supports testing map and reduce functions in the same test. It is done by using MapReduceDriver class and  tests both the map and reduce functions  
  
```java

@Test
public void testCityBusinessMapperReducer() throws Exception {
    final MapWritable inputValue = new MapWritable();
    inputValue.put(new Text("business_id"), new Text(
            "fecYnd2_OTDECk7bd6GOFw"));
    inputValue.put(new Text("full_address"), new Text(
            "12851 W Bell Rd\nSte 20\nSurprise, AZ 85374"));
    inputValue.put(new Text("open"), new Text("true"));
    inputValue.put(new Text("categories"), new Text("Pizza, Restaurants"));
    inputValue.put(new Text("city"), new Text("Surprise"));
    inputValue.put(new Text("review_count"), new Text("7"));
    inputValue.put(new Text("name"), new Text("Peter Piper Pizza"));
    inputValue.put(new Text("neighborhoods"), new Text("[]"));
    inputValue.put(new Text("longitude"), new Text("-112.3373424"));
    inputValue.put(new Text("state"), new Text("AZ"));
    inputValue.put(new Text("stars"), new Text("4.5"));
    inputValue.put(new Text("latitude"), new Text("33.638134100000002"));
    inputValue.put(new Text("type"), new Text("business"));
    mapReduceDriver.withInput(new LongWritable(0), inputValue)
    .withOutput(new Text("Surprise"), new IntWritable(1)).runTest();
}
```   

###Step 11: Running the tutorial in command line
The following instructions can be used to run the sample on the Pseudo distributed cluster.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd count-businesses-incity
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

At this point, one can directly run on the sample in Pivotal HD Cluster using `Step 13`.

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
hadoop fs -put input/business.json /user/gpadmin/sample1/input
```

####Submit the job

```bash
hadoop jar target/count_businesses_incity-0.0.1.jar com.pivotal.hadoop.city.business.CityBusinessDriver -libjars target/json-simple-1.1.jar /user/gpadmin/sample1/input /user/gpadmin/sample1/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000
Peoria 1
Phonix 1
```

###Step 12: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanode.
Execute the following commands on the development machine.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
tar -zcvf sample1.tar.gz target/* input/*
scp sample1.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample1.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanode is running.

####Extract the Archive
Login to datanode and extract the `sample1.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir count-businesses-incity
cd count-businesses-incity
tar -zxvf ../sample1.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample1/input
hadoop fs -put input/business.json /user/gpadmin/sample1/input
```

####Submit the Job

```bash
hadoop jar target/count-businesses-incity-0.0.1.jar com.pivotal.hadoop.city.business.CityBusinessDriver -libjars target/json-simple-1.1.jar /user/gpadmin/sample1/input /user/gpadmin/sample1/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000
Peoria 1
Phonix 1
```

You have successfully run the sample on Pivotal HD Cluster!.

