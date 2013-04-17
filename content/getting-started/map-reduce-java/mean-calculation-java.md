---
title: Basic Example on MapReduce
---

Compute the Average energy consumption of a household per year
--------------------------------------------------------------
The given data set has energy consumption of the households for 5 years. The data is recorded every minute for the past 5 years.
The goal of the exercise is to compute the average energy consumption of the household per year.

Use case
--------
To find out the mean consumption of house hold energy for consequtive years from 2006 to 2010. 

Prerequisites
-------------

* Hadoop must be installed as per installation instructions
	[Hadoop installation](/installation/single-node.html)
* Eclipse must have been installed
* Maven for building and running the example using command line

Data set overview
----------------

The [data set](/getting-started/dataset.html) selected provides the electicity consumption measured by sub-meters in the household. The household consumption is divided into 3 areas : ___kitchen___, ___airconditioner___ and ___laundry___ with a sub-meter for each area to monitor the consumption.  In this exercise, we shall calculate the average active energy consumption for the year for the entire household.    

A Sample from the data set   
.`date`........`time`.... `KW`...`KVAR`...`V(i)`....`I(i)`..`kw1`...`kw2`...`kw3 `    

16/12/2006,17:24:00,4.216,0.418,234.840,18.400,0.000,1.000,17.000    
16/12/2006,17:25:00,5.360,0.436,233.630,23.000,0.000,1.000,16.000    
16/12/2006,17:26:00,5.374,0.498,233.290,23.000,0.000,2.000,17.000    
16/12/2006,17:27:00,5.388,0.502,233.740,23.000,0.000,1.000,17.000    
16/12/2006,17:28:00,3.666,0.528,235.680,15.800,0.000,1.000,17.000    

Approach
--------

Map- Reduce functions can be implemented by using the 'Key-value ' pair. By taking  'year' as  __key__, we can group the values year wise. By taking the sum of all the sub-meter readings as __value__, we form the key-value pair. The sum values will be used by the reducer to find  mean for the selected key value i.e., the year. 

![map_reduce](/images/map_reduce.png)

As shown in the fig. 1, the mapper will extract the year(key) and the value(energy consumed) as key-value pairs.
All the pairs are collected across all the mappers and send to reduce part. In the Reducer, all the values are added and divided by the total number of records to compute the mean energy consumption.

Working with the exercise
--------------------------

###Step 1: Import the project into eclipse

Down the exercise from 
[here](/code/average_energy.tar.gz "here")
and extract into a folder. This will create average_energy folder.

From Eclipse File Menu, click Import and select 'Existing Projects into Workspace'
![select import](/images/gs/avg_energy/mean-1.png)

Click browse
![browse folder](/images/gs/avg_energy/mean-2.png)

Select the extracted folder average_energy
![browse and select folder](/images/gs/avg_energy/mean-3.png)

Click the check box corresponding average_energy. 
You can deselect other entries if any
![select project](/images/gs/avg_energy/mean-4.png)


###Step 2: Designing the mapper
The mapper function will  process each input record to calculate the sum of energy values of the three meters. The output key is the 'year' which is parsed from the data attribute. The output value is the sum of three columns: sub_metering_1,sub_metering_2,sub_metering_3. 


Copy the following code and paste it to the map method.

#### Mapper code:

```java
	// check if record is valid
	if (isValidRecord(value.toString())) {
		return;
	}

	//Prepare the PowerConsumption Record using the value
	PowerConsumptionRecord record = new PowerConsumptionRecord(
			value.toString());

	double sumOfMeters = record.getSub_metering_1()
			+ record.getSub_metering_2() + record.getSub_metering_3();
	year.set(record.getYear());
	consumption.set(sumOfMeters);
	context.write(year, consumption);
```

###Step 3: Designing the Reducer  

THe reducer iterates through all the values for the year, sum is calculated by adding the present value to the cumulative value and  increments the count. Finally, the average consumption for the year is calculated by dividing the sum by the total count.

####Reducer code  

```java
	double totalVolume = 0.0;
	double totalRecords = 0;
	for (DoubleWritable value : values) {
		totalVolume += value.get();
		totalRecords++;
	}
	double mean = totalVolume / totalRecords;
	consumption.set(mean);
	context.write(key, consumption);
```    

###Step 4: Unit testing Mapper

We use __MRUnit__ to write various tests for this Job. Three key classes in MRUnits are MapDriver for __Mapper Testing__, __ReduceDriver__   for Reducer Testing and __MapReduceDriver__ for end to end MapReduce Job testing.    
MRUnit is a test framework  to unit test MapReduce code.  It should be noted that MRUnit supports both the old (org.apache.hadoop.mapred)    and new (org.apache.hadoop.mapreduce) MapReduce APIs          

Create the mapper Driver and ReduceDriver as part of the setup.

```java

@Before
public void setUp() throws Exception {

	AverageConsumptionMapper mapper = new AverageConsumptionMapper();
	AverageConsumptionReducer reducer = new AverageConsumptionReducer();
	mapDriver = MapDriver.newMapDriver(mapper);
	reduceDriver = ReduceDriver.newReduceDriver(reducer);
	mapReduceDriver = MapReduceDriver.newMapReduceDriver(mapper, reducer);
}
```
It is done by using MapDriver class and only tests the map function .   
(_Specify the key/value input and output types for the mapper being tested in this class._)   

```java     

@Test
public void testMeanMapper() throws Exception {

	final LongWritable inputKey = new LongWritable(0);
	final Text inputValue = new Text(
			"16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000");
	final IntWritable outputKey = new IntWritable(2006);
	final DoubleWritable outputValue = new DoubleWritable(18.0);

	mapDriver.withInput(inputKey, inputValue)
		.withOutput(outputKey, outputValue).runTest();

}
```
   
The ___withInput___ method is used to specify an input key/value, which will be fed to the Mapper.   

The ___withOutput___ method is used to specify the output key/value, which MRUnit will compare against the output generated by the mapper    being tested  

Input  

```xml
Key ---- 0 (line number)
Value ---  16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;17.000
```
Output  

```xml
Key ----  2006
Value ---   18.0
```

###Step 5: Unit Testing Reducer
It is done by using ReduceDriver class and only tests the reduce function .     
(_Specify the key/value input and output types for the reducer being tested in this class._)  

   
```java
@Test
public void testMeanReducer() throws Exception {

new ReduceDriver<IntWritable, DoubleWritable, IntWritable, DoubleWritable>()
	.withReducer(new AverageConsumptionReducer())
	.withInputKey(new IntWritable(2006))
	.withInputValues(
			Arrays.asList(new DoubleWritable(3.00),
					new DoubleWritable(3.00), new DoubleWritable(
							3.00)))
	.withOutput(new IntWritable(2006), new DoubleWritable(3.00))
	.runTest();
}
```

The ___withInput___ method is used to specify an input key/value.When testing the reducer  specify a list of values that MRUnit sends to the reducer.Add the expected output for the using ___withOutput___.

Input

```xml
key-- 2006
values-- 3.0,3.0,3.0
```
Output

```xml
Key-- 2006
Values—3.0
``` 

###Step 6: Testing Mapper and Reducer together
   
MRUnit also supports testing the map and reduce functions in the same test. It is done by using MapReduceDriver class and  tests both the map and reduce functions  
  

```java
@Test
public void testMeanMapReduce() throws Exception 
{

	mapReduceDriver
	.withInput(
	new LongWritable(0),
	new Text(
		"16/12/2006;17:24:00;4.216;0.418;3.0;18.400;0.000;1.000;17.000"))
	.withInput(
	new LongWritable(1),
	new Text(
		"16/12/2006;17:24:00;4.216;0.418;3.0;18.400;0.000;1.000;17.000"))
	.withInput(
	new LongWritable(2),
	new Text(
		"16/12/2006;17:24:00;4.216;0.418;3;18.400;0.000;1.000;17.000"))
	.withOutput(new IntWritable(2006), new DoubleWritable(18.00))
	.runTest();
}
```   

Inputs are supplied to the mapper and expected outputs are given as reducer output.   
Specify thefollowing 6 input and output types for the MapReduce driver   
___mapper___    
input key   
input value    
output key  
output value   
___reducer___   
output key   
output value   
   
Input:   
   
```xml
6/12/2006;17:24:00;4.216;0.418;3.0;18.400;0.000;1.000;17.000
16/12/2006;17:24:00;4.216;0.418;3.0;18.400;0.000;1.000;17.000
16/12/2006;17:24:00;4.216;0.418;3;18.400;0.000;1.000;17.000
```
Output:   

```xml
2006   18.00
```

###Step 7: Running the Map-Reduce execution from the command line

Load data into HDFS. 

```bash
cd $HADOOP_HOME
$bin/hadoop dfs -copyFromLocal /home/laxman/input/household.txt /household

```   

Go to the project home directory and issue the build command using maven
Replace the PROJECT_DIR with the directory of the project.
The command will build the project and creates the jar file in target dir as GettingStarted-0.0.1-SNAPSHOT.jar

```bash
cd PROJECT_DIR
$ mvn package

#Now change dir to HADOOP_HOME and run the mapreduce job.

cd $HADOOP_HOME

$bin/hadoop jar project_dir/target/GettingStarted-0.0.1-SNAPSHOT.jar com.pivotal.hadoop.summary.AverageConsumptionDriver /household /output

#The following output is seen on the console.
13/04/13 11:51:52 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
13/04/13 11:51:53 INFO service.AbstractService: Service:org.apache.hadoop.yarn.client.YarnClientImpl is inited.
13/04/13 11:51:53 INFO service.AbstractService: Service:org.apache.hadoop.yarn.client.YarnClientImpl is started.
13/04/13 11:51:53 WARN mapreduce.JobSubmitter: Hadoop command-line option parsing not performed. Implement the Tool interface and execute your application with ToolRunner to remedy this.
13/04/13 11:51:54 INFO input.FileInputFormat: Total input paths to process : 1
13/04/13 11:51:54 INFO mapreduce.JobSubmitter: number of splits:2
13/04/13 11:51:54 WARN conf.Configuration: mapred.jar is deprecated. Instead, use mapreduce.job.jar
13/04/13 11:51:54 WARN conf.Configuration: mapred.output.value.class is deprecated. Instead, use mapreduce.job.output.value.class
13/04/13 11:51:54 WARN conf.Configuration: mapred.mapoutput.value.class is deprecated. Instead, use mapreduce.map.output.value.class
13/04/13 11:51:54 WARN conf.Configuration: mapreduce.map.class is deprecated. Instead, use mapreduce.job.map.class
13/04/13 11:51:54 WARN conf.Configuration: mapred.job.name is deprecated. Instead, use mapreduce.job.name
13/04/13 11:51:54 WARN conf.Configuration: mapreduce.reduce.class is deprecated. Instead, use mapreduce.job.reduce.class
13/04/13 11:51:54 WARN conf.Configuration: mapreduce.inputformat.class is deprecated. Instead, use mapreduce.job.inputformat.class
13/04/13 11:51:54 WARN conf.Configuration: mapred.input.dir is deprecated. Instead, use mapreduce.input.fileinputformat.inputdir
13/04/13 11:51:54 WARN conf.Configuration: mapred.output.dir is deprecated. Instead, use mapreduce.output.fileoutputformat.outputdir
13/04/13 11:51:54 WARN conf.Configuration: mapred.map.tasks is deprecated. Instead, use mapreduce.job.maps
13/04/13 11:51:54 WARN conf.Configuration: mapred.output.key.class is deprecated. Instead, use mapreduce.job.output.key.class
13/04/13 11:51:54 WARN conf.Configuration: mapred.mapoutput.key.class is deprecated. Instead, use mapreduce.map.output.key.class
13/04/13 11:51:54 WARN conf.Configuration: mapred.working.dir is deprecated. Instead, use mapreduce.job.working.dir
13/04/13 11:51:54 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1365833749426_0002
13/04/13 11:51:55 INFO client.YarnClientImpl: Submitted application application_1365833749426_0002 to ResourceManager at /0.0.0.0:8032
13/04/13 11:51:55 INFO mapreduce.Job: The url to track the job: http://localhost:8088/proxy/application_1365833749426_0002/
13/04/13 11:51:55 INFO mapreduce.Job: Running job: job_1365833749426_0002
13/04/13 11:52:08 INFO mapreduce.Job: Job job_1365833749426_0002 running in uber mode : false
13/04/13 11:52:08 INFO mapreduce.Job:  map 0% reduce 0%
13/04/13 11:52:20 INFO mapreduce.Job:  map 17% reduce 0%
13/04/13 11:52:23 INFO mapreduce.Job:  map 32% reduce 0%
13/04/13 11:52:26 INFO mapreduce.Job:  map 47% reduce 0%
13/04/13 11:52:29 INFO mapreduce.Job:  map 62% reduce 0%
13/04/13 11:52:31 INFO mapreduce.Job:  map 100% reduce 0%
13/04/13 11:52:41 INFO mapreduce.Job:  map 100% reduce 100%
13/04/13 11:52:41 INFO mapreduce.Job: Job job_1365833749426_0002 completed successfully
13/04/13 11:52:41 INFO mapreduce.Job: Counters: 43
File System Counters
	FILE: Number of bytes read=28689926
	FILE: Number of bytes written=57596089
	FILE: Number of read operations=0
	FILE: Number of large read operations=0
	FILE: Number of write operations=0
	HDFS: Number of bytes read=132964916
	HDFS: Number of bytes written=113
	HDFS: Number of read operations=9
	HDFS: Number of large read operations=0
	HDFS: Number of write operations=2
Job Counters 
	Launched map tasks=2
	Launched reduce tasks=1
	Rack-local map tasks=2
	Total time spent by all maps in occupied slots (ms)=41805
	Total time spent by all reduces in occupied slots (ms)=8378
Map-Reduce Framework
	Map input records=2075259
	Map output records=2049280
	Map output bytes=24591360
	Map output materialized bytes=28689932
	Input split bytes=188
	Combine input records=0
	Combine output records=0
	Reduce input groups=5
	Reduce shuffle bytes=28689932
	Reduce input records=2049280
	Reduce output records=5
	Spilled Records=4098560
	Shuffled Maps =2
	Failed Shuffles=0
	Merged Map outputs=2
	GC time elapsed (ms)=1656
	CPU time spent (ms)=51020
	Physical memory (bytes) snapshot=711925760
	Virtual memory (bytes) snapshot=3067699200
	Total committed heap usage (bytes)=619970560
Shuffle Errors
	BAD_ID=0
	CONNECTION=0
	IO_ERROR=0
	WRONG_LENGTH=0
	WRONG_MAP=0
	WRONG_REDUCE=0
File Input Format Counters 
	Bytes Read=132964728
File Output Format Counters 
	Bytes Written=113
```   


###Step 7: Checking the output
To see output, type   

```java
$bin/hadoop dfs -cat /output/*
```
The output should be like this :  

```java
2006	10.873181156784286
2007	8.66401492133901
2008	8.3997608677086
2009	9.095407810941456
2010	9.333240051246847
```

The average energy consumption  for each year  in the dataset is shown above. It is interestig to see that, average is high on 2006, it went down in 2007 and 2008 and slowly increasing, but has not reached 2006 levels.

###Congratulations! You have successfully completed Exercise 1 of 'Map-Reduce with Java'
The solution is available __[here](/code/average_energy_solution.tar.gz "here")__
You can also run the code with the full data set. The data set can be obtained from
[link](http://archive.ics.uci.edu/ml/datasets/Individual+household+electric+power+consumption "DataSet")

