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

16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;1.000    
16/12/2006;17:25:00;5.360;0.436;233.630;23.000;0.000;1.000;1.000    
16/12/2006;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000    
16/12/2006;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000    
16/12/2006;17:28:00;3.666;0.528;235.680;15.800;0.000;1.000;1.000    
02/05/2008;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000
16/11/2010;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000

Approach
--------

Map-Reduce functions can be implemented by using the 'Key-value ' pair. By taking  'year' as  __key__, we can group the values year wise. By taking the sum of all the sub-meter readings as __value__, we form the key-value pair. The sum values will be used by the reducer to find  mean for the selected key value i.e., the year. 

![map_reduce](/images/map_reduce.png)

As shown in the fig. 1, the mapper will extract the year(key) and the value(energy consumed) as key-value pairs.
All the pairs are collected across all the mappers and send to reduce part. In the Reducer, all the values are added and divided by the total number of records to compute the mean energy consumption.

Working with the exercise
--------------------------

###Step 1: Import the project into eclipse

Download the exercise from [here](/code/average_energy.tar.gz "here") and extract into a folder. This will create average_energy folder.

* From Eclipse File Menu, click Import and select 'Existing Projects into Workspace'

  ![select import](/images/gs/avg_energy/mean-1.png)

* Click browse

  ![browse folder](/images/gs/avg_energy/mean-2.png)

* Select the extracted folder average_energy

  ![browse and select folder](/images/gs/avg_energy/mean-3.png)

* Click the check box corresponding average_energy. You can deselect other entries if any

  ![select project](/images/gs/avg_energy/mean-4.png)


###Step 2: Designing the mapper
The mapper function will  process each input record to calculate the sum of energy values of the three meters. The output key is the 'year' which is parsed from the data attribute. The output value is the sum of three columns: sub_metering_1,sub_metering_2,sub_metering_3. 


#### Mapper code:
The mapper code is shown below:

```xml
public class AverageConsumptionMapper extends
		Mapper<LongWritable, Text, IntWritable, DoubleWritable>  {

....

@Override
	protected void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		
	}

}

```
Each line of input is passed as Key, Value to the map method of mapper. See that, the Key(LongWritable) and Value(Text) datatypes should be correct and should be same as that of defined in the class while extending the Mapper Abstract class as shown above:

Copy the following code and paste it to the map method.

```java
// check if record is valid
if (!isValidRecord(value.toString())) {
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
The code checks if the line is valid. If valid, the line is parsed to a POJO class.
The sum of meters readings is calculated and writtn to the local disk of the mapper using context.write api.

###Step 3: Designing the Reducer  

THe reducer iterates through all the values for the year, sum is calculated by adding the present value to the cumulative value and  increments the count. Finally, the average consumption for the year is calculated by dividing the sum by the total count.


####Reducer code  
The Reducer code is shown below:
```xml
public class AverageConsumptionReducer extends
		Reducer<IntWritable, DoubleWritable, IntWritable, DoubleWritable> {

...

	@Override
	protected void reduce(IntWritable key, Iterable<DoubleWritable> values,
			Context context) throws IOException, InterruptedException {

	}
```
The output of Mapper is passed to Reducer as Key and list of values. The output of all the maps is grouped with a common key and send to the Reducer grouped by the common key.
The Key(IntWritable) and values (Iterable<DoubleWritable> values) are passed to the Reducer.

Copy the following code and paste it to the Reduce method.

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

###Step 4: Writing the MapReduce Driver Code
The MapReducer Driver code is shown below:

```xml
Job job = new Job(new Configuration());
job.setJarByClass(AverageConsumptionDriver.class);

job.setMapperClass(AverageConsumptionMapper.class);
job.setReducerClass(AverageConsumptionReducer.class);

job.setInputFormatClass(TextInputFormat.class);

job.setMapOutputKeyClass(IntWritable.class);
job.setMapOutputValueClass(DoubleWritable.class);

job.setOutputKeyClass(IntWritable.class);
job.setOutputValueClass(DoubleWritable.class);

FileInputFormat.addInputPath(job, new Path(args[0]));

Path output = new Path(args[1]);
FileSystem.get(new Configuration()).delete(output, true);
FileOutputFormat.setOutputPath(job, output);

int result = job.waitForCompletion(true) ? 0 : 1;
System.exit(result);
```

The MapReducer Driver is a simply a main program that creates the Job and Submits the Job.
The driver does the following:

* Create the Job with the configuration. Since we are running the program in eclipse and standalone mode, the configuration object takes the default values.
* setJarByClass(AverageConsumptionDriver.class) - Informs the MapRedeuce Framework to run this main class
* setMapperClass(AverageConsumptionMapper.class)  - Sets the mapper to AverageConsumptionMapper
* setReducerClass(AverageConsumptionReducer.class)  - Sets the Reducer to AverageConsumptionReducer
* setInputFormatClass(TextInputFormat.class)  - Depends in the inputformation. In this example, we are using TextInputFormat.
* setMapOutputKeyClass(IntWritable.class) - Sets the output key class for the mapper.
* setMapOutputValueClass(DoubleWritable.class) - Sets the output value class for the mapper. The output is written to the local disk of the mapper
* setOutputKeyClass(IntWritable.class) - Sets the output Key class for the Reducer, which is also the Output of the MapReduce Job
* setOutValueClass(DoubleWritable.class) - Sets the output value class for the Reducer
* FileInputFormat.addInputPath() - Set the input path for the MapReduce Job
* FileInputFormat.setOutputPath() - Set the ouput path for the MapReduce Job

###Step 5: Unit testing Mapper

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

###Step 6: Unit Testing Reducer
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

###Step 7: Testing Mapper and Reducer together
   
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

###Step 8: Running the Map-Reduce  in eclipse

The MapReduce programs can run in standalone mode in Eclipse. The Mapper and Reducer programs are designed, developed and tested before running them on the cluster. With eclipse IDE, the mapper and reducer code can also be debugged in case of issues. This allows developer to process data for all kinds of sample input before running it in the cluster.

From Eclipse Main Menu, select Run and Run Configuration

![Run in Eclipse](/images/gs/avg_energy/run.png)

Select the AverageConsumptionDriver in the PackageBrowser and click + sign on the top right handside to create a Run Configuration.
Edit the Arguments by supplying input path of the file and output folder.

![Run in Eclipse](/images/gs/avg_energy/arguments.png)

Click Run to run the MapReduce program.
The console output should be as follows:

![Run in Eclipse](/images/gs/avg_energy/console.png)

The output can be seen in the output directory.

```bash
#ls
#ls output
_SUCCESS	part-r-00000

#cat part-r-00000
2006	2.8
2008	4.0
2010	4.0
```

###Step 9: Running the Map-Reduce execution in the cluster

Load data into HDFS. 

```bash
cd $HADOOP_HOME
$bin/hadoop dfs -copyFromLocal /home/laxman/input/sample-data.txt /household
```   

Go to the project home directory and issue the build command using maven
Replace the PROJECT_DIR with the directory of the project.
The command will build the project and creates the jar file in target dir as GettingStarted-0.0.1-SNAPSHOT.jar

Make sure that HADOOP_HOME is to hadoop installation directory. The program picks up the configuration files from HADOOP_HOME directory.
Otherwise, the MapReduce program will run in standalone mode

```bash
cd PROJECT_DIR
$ mvn package

cd $HADOOP_HOME
$bin/hadoop jar project_dir/target/GettingStarted-0.0.1-SNAPSHOT.jar com.pivotal.hadoop.summary.AverageConsumptionDriver /household /output
```

The following output is seen on the console.

```xml
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


###Step 10: Checking the output
To see output, type   

```java
$bin/hadoop dfs -cat /output/*
```
The output should be like this :  

```java
2006  10.873181156784286
2007  8.66401492133901
2008  8.3997608677086
2009  9.095407810941456
2010  9.333240051246847
```

The average energy consumption  for each year  in the dataset is shown above. It is interestig to see that, average is high on 2006, it went down in 2007 and 2008 and slowly increasing, but has not reached 2006 levels.

###Congratulations! You have successfully completed Exercise 1 of 'Map-Reduce with Java'
The solution is available __[here](/code/average_energy_solution.tar.gz "here")__
You can also run the code with the full data set. The data set can be obtained from
[link](http://archive.ics.uci.edu/ml/datasets/Individual+household+electric+power+consumption "DataSet")

