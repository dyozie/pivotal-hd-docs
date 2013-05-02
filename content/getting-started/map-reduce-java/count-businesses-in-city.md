---
title: Count of Businesses in a City
---

Count the Total Number of Business in a City
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
* [Development Environment setup](getting-started/setting-development.html)

Approach
--------
Following are the steps to the exercise:

*  Understand the Data formats
*  Decide on the Input and output formats and implement custom classes if required
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
{
  "business_id": "G2Re2E5Jkv_UF1xrenSsDg", 
  "full_address": "4500 E Cactus Rd\nPhoenix, AZ 85032", "open": true, "categories": ["Department Stores", "Fashion", "Shopping"], "city": "Phoenix", "review_count": 11, "name": "Macy's", "neighborhoods": [], "longitude": -111.9820907, "state": "AZ", "stars": 4.0, "latitude": 33.599323599999998, "type": "business"}
```

The data is in JSON format. It is well structured for processing. However we cannot use FileInputFormat becuase, we need to strip down the braces and there could be nested JSON structure inside.

Hence it is clear, we have to write our own custom Input Format class. Fortunately, the json libraary comes with a parse, which we can directly use.

###Step 2: Designing the custom InputFormat

Since the data is JSON and we need to parse the JSON to get the key and value pairs.
A custom InputFormat is written, which will process one JSON structure at a time. Inorder to do this,
we need to read one JSON line at a time and convert into to key/value pairs for processing. This is the job of the RecordrReader, which will have the necessary intelligence built in to read the one JSON structure at a time.

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

The framework calls `nextKeyValue()` to check for the presence of next line and calls `getGetcurrentKey()` and getCurrentValue() to get the key and value respectively.

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
 
###Step 3: Designing the Mapper

The Mapper is simpler class similar to the classic wordocount program in the examples. We are couting the businesses in a city instead of the wordcount.

#### Mapper code:

```java
city = value.get(new Text("city"));
businessId = value.get(new Text("business_id"));

if (StringUtils.isNotEmpty(city.toString())
		&& StringUtils.isNotEmpty(businessId.toString())) {
	context.write((Text) city, one);
}
```

###Step 4: Designing the Reducer  
The Recucer is also a simple one similar to the classic wordcount example. In this case, we are counting the total businesses in the coty.


```java
int totalRecords = 0;
for (IntWritable value : values) {
	totalRecords++;
}
context.write(key, new IntWritable(totalRecords));
```

###Step 4: Writing the MapReduce Driver Code

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

###Step 5: Unit testing Mapper

We use __MRUnit__ to write various tests for this Job. Three key classes in MRUnits are MapDriver for __Mapper Testing__, __ReduceDriver__   for Reducer Testing and __MapReduceDriver__ for end to end MapReduce Job testing.    
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

It is done by using MapDriver class and only tests the map function .   
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
The ___withInput___ method is used to specify an input key/value, which will be fed to the Mapper.   
The ___withOutput___ method is used to specify the output key/value, which MRUnit will compare against the output generated by the mapper    being tested  

###Step 6: Unit Testing Reducer
It is done by using ReduceDriver class and only tests the reduce function .     
(_Specify the key/value input and output types for the reducer being tested in this class._)  

   
```java
@Test
public void testCityBusinessReducer() throws Exception {

	new ReduceDriver<Text, IntWritable, Text, IntWritable>()
			.withReducer(new CityBusinessReducer())
			.withInputKey(new Text("Surprise"))
			.withInputValues(
					Arrays.asList(new IntWritable(1), new IntWritable(1),
							new IntWritable(1)))
			.withOutput(new Text("Surprise"), new IntWritable(3)).runTest();
}
```

The ___withInput___ method is used to specify an input key/value.When testing the reducer  specify a list of values that MRUnit sends to the reducer.Add the expected output for the using ___withOutput___.

###Step 7: Testing Mapper and Reducer together
   
MRUnit also supports testing the map and reduce functions in the same test. It is done by using MapReduceDriver class and  tests both the map and reduce functions  
  
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
###Step 8: Import the project into eclipse

Download the exercise from [here](/code/average_energy.tar.gz "here") and extract into a folder. 
This will create average_energy folder. Import the exercise using the similar instructions as illustrated in mean calculation exercise.


###Step 9: Running the Map-Reduce  in eclipse

The CityBusinessDriver main class can be executed from within the eclipse IDE. Follow the Average Energy Consumption exercise to run the MapReduce Program in the eclipse IDE.

###Step 9: Running the Map-Reduce on Pivotal HD cluster

####Building the project 

```bash
mvn -DskipTests package
```

####Upload the input

```bash
hadoop fs -put data/business.json /user/foobar/input
```

####Set the Hadoop Class Path for third-party libraies

```bash
export HADOOP_CLASSPATH=path-to-json-simple-1.1.jar
```

####Submit the job

```bash
hadoop jar target/count_businesses_incity-0.0.1.jar com.pivotal.hadoop.city.business.CityBusinessDriver -conf $HADOOP_HOME/hadoop-mycluster.xml  /user/foobar/input /user/foobar/output

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

