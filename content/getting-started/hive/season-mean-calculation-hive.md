---
title: Basic Example using Hive
---

Compute the Seasonal Average energy consumption of a household per year
-------------------------------------------------------------
The given data set has energy consumption of the households for 5 years. The data is recorded every minute for the past 5 years. The goal of the tutorial is to compute the average energy consumption of the household in the season year wise.

Use case
-------
To find out compute the Seasonal Average energy consumption of a household per year

Prerequisites
-------------

* Hadoop must be installed as per installation instructions
[Hadoop version 2.0.3 installation](/installation/single-node.html) 
* Hive must be installed as per installation instructions
[Hive version 0.10.0 installation](/getting-started/hive/hive_installation.html) 


Data set overview
----------------
The [data set](/getting-started/dataset.html) selected provides the electicity consumption measured by sub-meters in the household. The household consumption is divided into 3 areas : ___kitchen___, ___airconditioner___ and ___laundry___ with a sub-meter for each area to monitor the consumption.  In this exercise, we shall calculate the average active energy consumption for the year for the entire household.    

Sample data set   
.`date`........`time`.... `KW`...`KVAR`...`V(i)`....`I(i)`..`kw1`...`kw2`...`kw3 `    
16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;1.000    
16/12/2006;17:25:00;5.360;0.436;233.630;23.000;0.000;1.000;1.000    
16/12/2006;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000    
16/12/2006;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000    
16/12/2006;17:28:00;3.666;0.528;235.680;15.800;0.000;1.000;1.000    
02/05/2008;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000
16/11/2010;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000

To find out the mean consumption of house hold energy for consequtive years from 2006 to 2011. 

The full data set obtained from [here](http://archive.ics.uci.edu/ml/datasets/Individual+household+electric+power+consumption).

Approach
--------
The use case very typical in most of the dataware housing applications. In relational databases, one has to create the table schema before inserting the data. With Hadoop and Hive combination, one need not worry about schema at the time of creation. With Hive, logical schema can be deduced giving the power to user to consumer the data when requrired. 

Since, Hive is like SQL query language, the logical stucture can be created using SQL syntax. Once the table is created, we can query the databases with DML staatemente. Hive supports richer tuples like Bag, Array and Maps unlike standard SQL.

The following are the steps for analyzing the data using Hive:

* Get the sample of the data from the bigdata, understand the structure and map the structure to an SQL Like table. SQL like, since Hive supports richer data types. Hive also regular expressions while deducing the data and can be used to deal with several different structures of data 
* Create the logical schema using SQL statemnts.
* Write queries using Hive similar to SQL. Hive suppots multiple joins, order by, group clauses, like queries.

Working with the tutorial
-----------------------

###Step 1: Create the sample data from the original dataset

Use any text editor and copy the  above sample data into dataset/sample.csv file

```xml
16/12/2006;17:24:00;4.216;0.418;234.840;18.400;0.000;1.000;1.000    
16/12/2006;17:25:00;5.360;0.436;233.630;23.000;0.000;1.000;1.000    
16/12/2006;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000    
16/12/2006;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000    
16/12/2006;17:28:00;3.666;0.528;235.680;15.800;0.000;1.000;1.000    
02/05/2008;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000
16/11/2010;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000
```

A single line of data is shown below:

16/11/2010;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000

The fileds are separated by ';' and can be used to split the line to fields using this separator.  

###Step 2: Create Hive Table

The queries can be designed and tried out in local mode before running with the Hadoop Clusters.
Hive compiler generates map-reduce jobs for most queries. These jobs are then submitted to the Map-Reduce cluster. The queries can be run locally by setting  the variable: 

```bash

#hive -x
hive> SET mapred.job.tracker=local;
'''

###Step 2: Create Hive table

```bash
#hive -x 
hive> SET mapred.job.tracker=local;

hive>CREATE TABLE IF NOT EXISTS household_pwr_consumption(powerdate string,time string,global_active_power float,global_reactive_power  float,voltage float,global_intensity   float,  sub_metering_1   float,sub_metering_2 float,sub_metering_3 float)ROW FORMAT DELIMITED
     FIELDS TERMINATED BY '\;'
     LINES TERMINATED BY '\n';

OK
Time taken: 0.156 seconds
```
See that the create table has fields terminated by ";" and lines terminated by "\n"


###Step 3: Loading data
Load the data into the table from the sample.csv

```bash
#hive -x 

hive>LOAD DATA LOCAL INPATH '../dataset/sample.csv' INTO TABLE household_pwr_consumption;

Copying data from file:/home/gpuser/dataset/sample.csv
Copying file: file:/home/gpuser/dataset/sample.csv
Loading data to table default.household_pwr_consumption
OK
Time taken: 0.367 seconds
```

###Step 4: Run the hive query with Sample Data   



The intermediate table household_season_average can also be created using the following command:

```xml
hive>CREATE TABLE household_season_average AS 
	SELECT SPLIT(powerdate, '\\/')[2] as year,
	split(powerdate, '\\/')[1] as month,
	AVG(Sub_metering_1)+AVG(Sub_metering_2)+AVG(Sub_metering_3) as total_metering ,
      	CASE 
     		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>2 
			AND CAST(split(powerdate, '\\/')[1] as BIGINT)<=5 then 'spring'
     		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>5 
			AND CAST(split(powerdate, '\\/')[1] as BIGINT)<=8 then 'Summer'
     		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>8 
			AND CAST(split(powerdate, '\\/')[1] as BIGINT)<=11 then 'Autumn'
     		ELSE 'Winter' 
		END as season 
FROM household_pwr_consumption 
group by SPLIT(powerdate, '\\/')[2],split(powerdate, '\\/')[1];

```

```bash


hive> SELECT SEASON,YEAR,AVG(total_metering) FROM household_season_average WHERE SEASON IN ('Winter','spring','Summer','Autumn') GROUP BY YEAR,SEASON;

MapReduce Jobs Launched: 
Job 0: Map: 1  Reduce: 1   Cumulative CPU: 4.05 sec   HDFS Read: 503 HDFS Write: 148 SUCCESS
Total MapReduce CPU Time Spent: 4 seconds 50 msec
OK
Summer	2006	18.25
Winter	2006	17.5
spring	2006	18.166685104370117
Winter	2007	17.166666984558105
spring	2008	18.5
Summer	2009	18.0
spring	2009	17.5
Time taken: 27.491 seconds
```
###Step 5: Testing the  Query with full dataset on HDFS Cluster

Copy the full data set to hdfs using the command

```bash
gpuser@master:~/hadoop-2.0.3-alpha$ bin/hadoop fs -put /home/gpuser/dataset/original.csv /usr/gpuser/dataset/orignial.csv

```

###Loading data

```bash
#hive  -x

hive>drop table household_pwr_consumption;

hive>drop table household_season_average;

hive>SET mapred.job.tracker=localhost:50030

hive>CREATE EXTERNAL TABLE IF NOT EXISTS household_pwr_consumption(powerdate string,time string,global_active_power float,global_reactive_power  float,voltage float,global_intensity   float,  sub_metering_1   float,sub_metering_2 float,sub_metering_3 float)ROW FORMAT DELIMITED
     FIELDS TERMINATED BY '\;'
     LINES TERMINATED BY '\n'
     LOCATION '/usr/gpuser/dataset';

Time taken: 5.845 seconds

```
See that the LOCATION is pointing to the correct location of the file in HDFS.


###Run the hive query   

```bash
hive>CREATE TABLE household_season_average AS \
	SELECT SPLIT(powerdate, '\\/')[2] as year, \
	SPLIT(powerdate, '\\/')[1] as month, \
	AVG(Sub_metering_1)+AVG(Sub_metering_2)+AVG(Sub_metering_3) as total_metering, \
	CASE  \
		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>2 AND  \
			CAST(split(powerdate, '\\/')[1] as BIGINT)<=5 then 'spring' \
		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>5 AND  \
			CAST(split(powerdate, '\\/')[1] as BIGINT)<=8 then 'Summer' \
		WHEN CAST(split(powerdate, '\\/')[1] as BIGINT)>8 AND  \
			CAST(split(powerdate, '\\/')[1] as BIGINT)<=11 then 'Autumn' \
		ELSE 'Winter'  \
		END as season  \
     FROM household_pwr_consumption  \
     group by SPLIT(powerdate, '\\/')[2],SPLIT(powerdate, '\\/')[1];

Loading data to table greenplum.household
rmr: DEPRECATED: Please use 'rm -r' instead.
Deleted /user/hive/warehouse/greenplum.db/household
Table greenplum.household stats: [num_partitions: 0, num_files: 1, num_rows: 0, total_size: 278, raw_data_size: 0]
14 Rows loaded to household
MapReduce Jobs Launched: 
Job 0: Map: 1  Reduce: 1   Cumulative CPU: 5.54 sec   HDFS Read: 1484 HDFS Write: 278 SUCCESS
Total MapReduce CPU Time Spent: 5 seconds 540 msec
OK
Time taken: 29.313 seconds
```

```bash

hive>SELECT SEASON,YEAR,AVG(total_metering) 
	FROM household_season_average 
	WHERE SEASON IN ('Winter','spring','Summer','Autumn') 
	GROUP BY YEAR,SEASON;

MapReduce Jobs Launched: 
Job 0: Map: 1  Reduce: 1   Cumulative CPU: 4.52 sec   HDFS Read: 34297 HDFS Write: 511 SUCCESS
Total MapReduce CPU Time Spent: 4 seconds 520 msec
OK
TBD
Time taken: 27.314 seconds

```

###Congratulations! You have just finished  the tutorial. Compare the results with the MapReduce with Java tutorial.
