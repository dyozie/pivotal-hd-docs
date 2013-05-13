---
title: List of Five star reviewers for a Business
---

##List of Five star reviewers(users with names) for a Business

* Approximate time: 1 hour 
* Level: Advanced

##Use case
The goal of the tutorial is to find out list of all users who has rated a business as five star. The use cases is same as [List of Five star reviewers for a Business](list-fivestar-reviewers-business.html), except that we display usernames instead of userid's.

The tutorial uses distributed cache provide by MapReduce to cache the files required for applications. The MapReduce Framework copies the files to the slave nodes before any task is executed.  

Using distributed cache is also called as Replication Join. The data set is cached and used in Mapper or Reducer. 

Generally this type if join is useful in smaller datasets and should not be used for large data sets.

##Pre-requisites
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

##Approach
In this tutorial, the following important concepts are demonstrated:
* Reduce side Join, joined by a common key across the datasets
* Multiple data sets, processed by individual mappers
* Join the smaller data set using distributed cache 

Following are the steps to the exercise:

*  Understand the Data formats
*  Preparing the user names
*  Design the ReviewMapper

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://@github.com:rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `list-fivestar-business-reviewers-with-username` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

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
   "funny": 0, "useful": 5, "cool": 2}, 
   "user_id": "rLtl8ZkDX5vH5nAx9C3q5Q", 
   "review_id": "fWKvX83p0-ka4JS3dc6E5A", 
   "stars": 5, 
   "date": "2011-01-26", 
   "text": "My wife took me here on my birthday for breakfast and it was excellent.  The weather was perfect which made sitting outside overlooking their grounds an absolute pleasure.  Our waitress was excellent and our food arrived quickly on the semi-busy Saturday morning.  It looked like the place fills up pretty quickly so the earlier you get here the better.\n\nDo yourself a favor and get their Bloody Mary.  It was phenomenal and simply the best I've ever had.  I'm pretty sure they only use ingredients from their garden and blend them fresh when you order it.  It was amazing.\n\nWhile EVERYTHING on the menu looks excellent, I had the white truffle scrambled eggs vegetable skillet and it was tasty and delicious.  It came with 2 pieces of their griddled bread with was amazing and it absolutely made the meal complete.  It was the best \"toast\" I've ever had.\n\nAnyway, I can't wait to go back!", 
   "type": "review", 
   "business_id": "rncjoVoEFUJGCUoC1JgnUA"
}
```

A sample user record is shown below:

```
{
   "votes": 
        {"funny": 0, 
         "useful": 7, 
         "cool": 0
        }, 
    "user_id": "rLtl8ZkDX5vH5nAx9C3q5Q", 
    "name": "Jim", 
    "average_stars": 5.0, 
    "review_count": 6, 
    "type": "user"}
}
```

Hadoop core API provides MultipleInputs class, which can take multiple inputs. Each input can have a separate Mapper. The two data sets have the business_id as the common key. The tutorial is similar to the previous one except that, the `userid's` are replaced by `usernames`.

The output of these two mappers will be sent to the Reducer using a common key `business_id`. We also need to tag the map output so that Reducer knows from which input data set, the output belongs to. 

In this tutorial we will change the review mapper to use Distributed Cache to output names instead of userid's. The Business Mapper does not change at all. We will change the review mapper to load the users from the Distributed Cache and output usernames as part of the output.

###Step 4: Preparing the user names

The following code parses the `users.json` and creates a file `usernames.txt` in the `cache` folder.

```java
public class UserJSONParserUtil {

	private static final Logger LOG = LoggerFactory
			.getLogger(UserJSONParserUtil.class);

	private final static JSONParser jsonParser = new JSONParser();

	public static void main(String[] args)
			throws org.json.simple.parser.ParseException, ParseException {

		if (args.length != 2) {
			System.out
					.println("UserJSONParserUtil <input_file>  <output_file>");
			System.exit(-1);
		}

		Configuration conf = new Configuration();
		createUserListFile(args[0], args[1], conf);
	}

	public static void createUserListFile(String inputFile, String outputFile,
			Configuration conf) throws org.json.simple.parser.ParseException,
			ParseException {

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
					// loadJsonToMap(line);
					System.out.println(value.get("user_id"));
					System.out.println(value.get("name"));
					StringBuffer output = new StringBuffer();
					output.append(value.get("user_id"));
					output.append("==");
					output.append(value.get("name") + "\n");
					strm.writeBytes(output.toString());
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
```

The  `UserJSONParserUtil` class reads the `user.json` using the JSON Parser and extracts userid and username. The output is written to `usernames.txt` file.

Use eclipse to run the above program by passing the following arguments.

```java
input/user.json cache/usernames.txt
```

output:

```java
rLtl8ZkDX5vH5nAx9C3q5Q==Jim
0a2KyEL0d3Yb1V6aivbIuQ==Kelle
0hT2KtfLiobPvh6cDC8JQg==Stephanie
....
```

###Step 5: Designing the ReviewMapper

The `ReviewMapper` uses the setup method to initialize the cache. the code is shown below:

The output of the mapper would be as follows:


```java
protected void setup(Context context) throws IOException,
			InterruptedException {

	URI[] files = DistributedCache.getCacheFiles(context.getConfiguration());
	System.out.println("Reading Bloom filter from: " + files[0].getPath());
	
	userCache = FileUtils.readFile(
	files[0].getPath(),
		context.getConfiguration());
}
```

The `DistributedCache.getCacheFiles()` returns all the files in the cache. The `FileUtils class` reads the file and returns the Map with key as `userid` and value as `username`.

The code `FileUtils` is shown below:

```java
public static HashMap<String, String> readFile(String fileName,
		Configuration conf) {
	Path inputFile = new Path(fileName);

	String line = null;
	FileSystem fs;

	HashMap<String, String> userCache = new HashMap<String, String>();
	try {
		fs = FileSystem.get(conf);
		for (FileStatus status : fs.listStatus(inputFile)) {
			BufferedReader rdr = new BufferedReader(new InputStreamReader(
					fs.open(status.getPath())));
			System.out.println("Reading " + status.getPath());
	
			while ((line = rdr.readLine()) != null) {
				String str = new String(line);
				System.out.println("line = " + str);
				String tokens[] = str.split("==");
				userCache.put(tokens[0], tokens[1]);
			}
			rdr.close();
		}
	} catch (IOException e) {
		LOG.warn("Error in reading file" + inputFile.toString(), e);
		e.printStackTrace();
	}
	return userCache;
}
```

The Review Mapper, simple replace the user_id with username. The user name is looked up in the HashMap created by reading the file from the distributed cache.
In the `ReviewMapper class` we use the cache to replace `userid` with `username`. The Mapper code is shown below:

```java
public void map(LongWritable key, MapWritable value, Context context)
	throws IOException, InterruptedException {

    starKey = value.get(new Text("stars"));
	userIdKey = value.get(new Text("user_id"));
	businessId = (Text) value.get(new Text("business_id"));

	if (StringUtils.isNotEmpty(userIdKey.toString())
			&& StringUtils.isNotEmpty(businessId.toString())
			&& checkReview(Double.parseDouble(starKey.toString()))) {

		System.out.println("Reading Bloom filter from: "
				+ userCache.get(userIdKey.toString()));
		String userKey = userIdKey.toString();
		String username = userCache.get(userKey);
		if (username != null) {
			System.out.println("Reading Bloom filter from: "+ userCache.get(userIdKey.toString()));
			userId.set(username);
		} else {
			userId.set(userKey);
		}

		outputvalue.set("R:" + userId.toString() + ":" + starKey.toString());
		context.write(businessId, outputvalue);
	}
}
```

See that the userid is replaced by username from the cache.

```java
String username = userCache.get(userKey);
if (username != null) { 
	System.out.println("Reading Bloom filter from: "+ userCache.get(userIdKey.toString()));
	userId.set(username);
} else {
	userId.set(userKey);
}       

```

####Output of ReviewMapper

```xml
mapper output key=business_id
mapper output value=R:user_name:review_rating
```

As you can see, the user_id is set to user name if it is not null, otherwise user_id is passed as it is. This is one type of join on the mapper side, specially if the data set is smaller. 

###Step 6: Desiging the Reducer
The Reducer is same as that of previous tutorial [List of Five star reviewers for a Business](list-fivestar-reviewers-business.html).

###Step 7: Running the exercise with Eclipse IDE

Import the tutorial into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html)

To test the code in standalone mode in eclipse, replace the following code in `setup()` method of `ReviewMapper` class.

```java
URI[] files = DistributedCache .getCacheFiles(context.getConfiguration());
System.out.println("Reading Bloom filter from: " + files[0].getPath());

userCache = FileUtils.readFile(files[0].getPath(),
		context.getConfiguration());
```

with
```java
userCache = FileUtils.readFile("cache/usernames.txt",context.getConfiguration());
```

###Step 7: Running the tutorial in command line
The following instructions can be used to run the sample on the Pseudo distributed cluster.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd list-fivestar-business-reviewers-with-username
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
hadoop fs -put input/business.json /user/gpadmin/sample4/input
hadoop fs -put input/review.json /user/gpadmin/sample4/input
```

####Submit the job

```bash
hadoop jar target/list_fivestar-business-reviewers-with-username-0.0.1.jar com.pivotal.hadoop.review.business.UserNameListBusinessDriver  -libjars target/json-simple-1.1.jar -files cache/usernames.txt /user/gpadmin/sample4/input/business.json /user/gpadmin/sample4/input/review.json /user/gpadmin/sample4/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample4/output/part-r-00000
```

###Step 8: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanodes.
Execute the following commands on the development machine.

```bash
cp $HOME/.m2/repository/com/googlecode/json-simple/json-simple/1.1/json-simple-1.1.jar target/
tar -zcvf sample4.tar.gz target/* input/* cache/*
scp sample4.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample4.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanodes is running.

####Extract the Archive
Login to datanode and extract the `sample3.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir list-fivestar-business-reviewers-with-username
cd list-fivestar-business-reviewers-with-username
tar -zxvf ../sample4.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample4/input
hadoop fs -put input/business.json /user/gpadmin/sample4/input
hadoop fs -put input/review.json /user/gpadmin/sample4/input
```

####Submit the Job

```bash
hadoop jar target/list-fivestar-business-reviewers-with-username-0.0.1.jar com.pivotal.hadoop.review.business.UserNameListBusinessDriver -libjars target/json-simple-1.1.jar -files cache/usernames.txt /user/gpadmin/sample4/input/business.json /user/gpadmin/sample4/input/review.json /user/gpadmin/sample4/output
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample4/output/part-r-00000

```

You have successfully run the sample on Pivotal HD Cluster!.
























###Step 9: Running the tutorial on Pivotal HD cluster























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

