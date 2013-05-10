---
title: List of Five star reviewers for a Business
---

List of Five star reviewers(users) for a Business
----------------------------------------

* Approximate time: 1 hour 
* Level: Advanced

Use case
--------
The goal of the tutorial is to find out list of all users who has rated a business as five star. The use cases is same as [List of Five star reviewers for a Business](list-fivestar-reviewers-business.html), except that we display usernames instead of userid's.

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
In this tutorial, the following important concepts are demonstrated:
* Reduce side Join, joined by a common key across the datasets
* Multiple data sets, processed by individual mappers
* Join the smaller data set using distributed cache 

Following are the steps to the exercise:

*  Understand the Data formats
*  Design the Mapper
*  Design the Reducer

Working with the Tutorial
------------------------

###Step 1: Understand the InputFormat

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

###Step 3: Designing the Mappers

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

The review mapper over-rides the setup to load the names from the distributed cache. The file is copied to distributed cache when the job is submitted to hadoop using the `-files` option.

```java
protected void setup(Context context) throws IOException,
		InterruptedException {

	URI[] files = DistributedCache
			.getCacheFiles(context.getConfiguration());
	System.out.println("Reading Bloom filter from: " + files[0].getPath());
	
	userCache = FileUtils.readFile(
			files[0].getPath(),
			context.getConfiguration());
}
```
The Review Mapper, simple replace the user_id with username. The user name is looked up in the HashMap created by reading the file from the distributed cache.

```java
public void map(LongWritable key, MapWritable value, Context context)
		throws IOException, InterruptedException {

	starKey = value.get(new Text("stars"));
	userIdKey = value.get(new Text("user_id"));
	businessId = (Text) value.get(new Text("business_id"));

	if (StringUtils.isNotEmpty(userIdKey.toString())
			&& StringUtils.isNotEmpty(businessId.toString())
			&& checkReview(Double.parseDouble(starKey.toString()))) {
	
		String userKey = userIdKey.toString();
		String username = userCache.get(userKey);
		
		if (username != null) {
			userId.set(userCache.get(userIdKey.toString()));
		}

		outputvalue.set("R:" + userIdKey.toString() + ":"
				+ starKey.toString());
		context.write(businessId, outputvalue);
	}

}
```

As you can see, the user_id is set to user name if it is not null, otherwise user_id is passed as it is. This is one type of join, happening on the mapper side, specially if the data set is smaller. This will not work for large data sets, since there may not enought memory to fit a large data set into a hash table. However it works like a magic for smaller data sets. 

###Step 4: Designing the Reducer  
All the action happens in the Reducer. Each Reducer will get the `business_id` as the key and the list of values from both the input data sets.

The Reducers constructs a single record out of the two data sets. The output of BusinessMapper is unique, since there is only one record for every business in the business dataset.

There will be multiple values from the ReviewMapper, since there can be multiple reviews by the users.

The reducers collects the output from both the mappers and joins them. The output is business_name, city, users count followed by comma separated list of user_id.

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

###Step 5: Preparing user names
The following code extracts the userid's and names from the user data set. 

###Create file with usernames and userid's

```java
public class UserJSONParserUtil {

	private static final Logger LOG = LoggerFactory
			.getLogger(UserJSONParserUtil.class);

	private final static JSONParser jsonParser = new JSONParser();

	public static void main(String[] args)
			throws org.json.simple.parser.ParseException, ParseException {
		
		
		 Configuration conf = new Configuration();
		    conf.addResource(new Path("$HADOOP-HOME/conf/core-site.xml"));
		    conf.addResource(new Path("$HADOOP_HOME/conf/hdfs-site.xml"));
			createUserListFile(args[0], args[1], conf);

	}

	public static void createUserListFile(String inputFile, String outputFile, Configuration conf)
			throws org.json.simple.parser.ParseException, ParseException {
		
		Path inputFile1 = new Path(inputFile);
		Path bfFile = new Path(outputFile);

		String line = null;
		FileSystem fs;

		try {
			fs = FileSystem.get(conf);
			FSDataOutputStream strm = fs.create(bfFile);

			for (FileStatus status : fs.listStatus(inputFile1)) {
				BufferedReader rdr = new BufferedReader(new InputStreamReader(
						fs.open(status.getPath())));
				System.out.println("Reading " + status.getPath());
				while ((line = rdr.readLine()) != null) {
					HashMap<String, String> value = parseLineToJSON(jsonParser,
							line);
					StringBuffer output = new StringBuffer();
					output.append(value.get("user_id"));
					output.append("==");
					output.append(value.get("name") + "\n");
					strm.write(output.toString());
				}
				rdr.close();
				strm.flush();
				strm.close();
			}
		} catch (IOException e) {
			LOG.warn("Error in reading file" + inputFile.toString(), e);
			e.printStackTrace();
		}
	}

	public static HashMap<String, String> parseLineToJSON(JSONParser parser,
			String line) throws org.json.simple.parser.ParseException,
			ParseException {
		HashMap<String, String> value = new HashMap<String, String>();
		try {
			JSONObject jsonObj = (JSONObject) parser.parse(line.toString());

			for (Object key : jsonObj.keySet()) {
				String mapKey = new String(key.toString());
				String mapValue = null;
				if (jsonObj.get(key) != null) {
					mapValue = new String(jsonObj.get(key).toString());
				}
				value.put(mapKey, mapValue);
			}
			return value;
		} catch (NumberFormatException e) {
			LOG.warn("Parsing Error in Number Field" + line, e);
			return value;
		}
	}

}

###Run the program with the following arguments

```bash
com.pivotal.hadoop.review.business.UserJSONParserUtil hdfs_input_dir/user/jso hdfs_output_dir/usernames.txt
```
```
The program converts the json structure into the following format:

```xml
userid==username
```

###Copy the file from HDFS to local file system

Copy the file from HDFS to local file system using the following command:

```bash
hadoop fs -get /hdfs_dir/usernames.txt projectdir/input/usernames.txt
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

###Step 7: Running the exercise with Eclipse IDE

Download the exercise from [here](git://url "here") and extract into a folder. 
This will create count_businesses_in_city folder. 
Import the tutorial into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html)

###Step 9: Running the tutorial on Pivotal HD cluster

Point namenode and resourcemanager to the Pivotal HD cluster in the `hadoop-mycluster.xml`

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
export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:json-simple-1.1.jar
```

####Submit the job

```bash
hadoop jar target/list_fivestar-business-reviewers-with-username-0.0.1.jar com.pivotal.hadoop.review.business.UserNameListBusinessDriver  -libjars target/json-simple-1.1.jar -files output2/usernames.txt /user/reddyraja/yelp/uc4/input/business.json /user/reddyraja/yelp/uc4/input/review.json /user/reddyraja/yelp/uc4/output

```

Do not forget to replace path to the PATH_TO_JSON_JAR with the path where json-simple-1.1.jar is present.

Monitor the job status in the Command Center dashboard.

####Check the output

Verify the job in the Pivotal Command Center Dashboard

Browse the hadoop file system and check the output directory. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/foobar/output/part-r-00000
```

###Congratulations! You have successfully completed the tutorial.

