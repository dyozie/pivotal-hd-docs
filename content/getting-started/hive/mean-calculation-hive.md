---
title: Basic Example on MapReduce
---

Compute the Average energy consumption of a household per year
-------------------------------------------------------------
The given data set has energy consumption of the households for 5 years. The data is recorded every minute for the past 5 years. The goal of the tutorial is to compute the average energy consumption of the household per year.
for the past 5 years. The goal of the tutorial is to compute the average energy consumption of the household per year.

Use case
--------
To find out the mean consumption of house hold energy for consequtive years from 2006 to 2010.

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
16/12/2006,17:24:00,4.216,0.418,234.840,18.400,0.000,1.000,1.000    
16/12/2006,17:25:00,5.360,0.436,233.630,23.000,0.000,1.000,1.000    
16/12/2006,17:26:00,5.374,0.498,233.290,23.000,0.000,2.000,2.000    
16/12/2006,17:27:00,5.388,0.502,233.740,23.000,0.000,2.000,2.000    
16/12/2006,17:28:00,3.666,0.528,235.680,15.800,0.000,1.000,1.000    
02/05/2008;17:26:00;5.374;0.498;233.290;23.000;0.000;2.000;2.000
16/11/2010;17:27:00;5.388;0.502;233.740;23.000;0.000;2.000;2.000


To find out the mean consumption of house hold energy for consequtive years from 2006 to 2011. 


Approach
--------
The following are built-in aggregate functions are supported in Hive:

##Built in Functions in Hive

###bigint   count(*), count(expr), count(DISTINCT expr[, expr_.])   count(*) 
Returns the total number of retrieved rows, including rows containing NULL values; count(expr) - Returns the number of rows for which the supplied expression is non-NULL; count(DISTINCT expr[, expr]) - Returns the number of rows for which the supplied expression(s) are unique and non-NULL.

###double   sum(col), sum(DISTINCT col)   
Returns the sum of the elements in the group or the sum of the distinct values of the column in the group

###double   avg(col), avg(DISTINCT col)   
Returns the average of the elements in the group or the average of the distinct values of the column in the group

###double   min(col)   
Returns the minimum of the column in the group

###double   max(col)   
Returns the maximum value of the column in the group

###double   variance(col), var_pop(col)   
Returns the variance of a numeric column in the group

###double   var_samp(col)   
Returns the unbiased sample variance of a numeric column in the group

###double   stddev_pop(col)   
Returns the standard deviation of a numeric column in the group


###double   stddev_samp(col)   
Returns the unbiased sample standard deviation of a numeric column in the group

###double   covar_pop(col1, col2)   
Returns the population covariance of a pair of numeric columns in the group

###double   covar_samp(col1, col2)   
Returns the sample covariance of a pair of a numeric columns in the group

###double   corr(col1, col2)   
Returns the Pearson coefficient of correlation of a pair of a numeric columns in the group

###double   percentile(BIGINT col, p)   
Returns the exact pth percentile of a column in the group (does not work with floating point types). p must be between 0 and 1. NOTE: A true percentile can only be computed for integer values. Use PERCENTILE_APPROX if your input is non-integral.

###array<double>  percentile(BIGINT col, array(p1 [, p2]...))   
Returns the exact percentiles p1, p2, ... of a column in the group (does not work with floating point types). pi must be between 0 and 1. NOTE: A true percentile can only be computed for integer values. Use PERCENTILE_APPROX if your input is non-integral.

###double   percentile_approx(DOUBLE col, p [, B])   
Returns an approximate pth percentile of a numeric column (including floating point types) in the group. The B parameter controls approximation accuracy at the cost of memory. Higher values yield better approximations, and the default is 10,000. When the number of distinct values in col is smaller than B, this gives an exact percentile value.

###array<double>   percentile_approx(DOUBLE col, array(p1 [, p2]...) [, B])   
Same as above, but accepts and returns an array of percentile values instead of a single one.

###array<struct {'x','y'}>   histogram_numeric(col, b)   
Computes a histogram of a numeric column in the group using b non-uniformly spaced bins. The output is an array of size b of double-valued (x,y) coordinates that represent the bin centers and heights

###array   collect_set(col)   
Returns a set of objects with duplicate elements eliminated

The example query below gives an average of one meter reading over all the records.

```bash

hive>select avg(Sub_metering_3) As average from household_pwr_consumption;
MapReduce Total cumulative CPU time: 15 seconds 120 msec
Ended Job = job_1365823789752_0010
Execution completed successfully
Mapred Local Task Succeeded . Convert the Join into MapJoin
OK
6.45844735712055
Time taken: 57.198 seconds
```

By using the group by clause along with AVG built-in function, we can compute the average energy consumption per household.

The syntax for the SQL GROUP BY clause is:

```xml

SELECT column1, column2, ... column_n, aggregate_function (expression)
FROM tables
WHERE predicates
GROUP BY column1, column2, ... column_n;

```
The GROUP BY statement is often used in conjunction with aggregate functions to group the result set by one or more columns and then perform an aggregation over each group.


Working with the tutorial
------------------------

###Step 1: Create the sample from the original dataset

Use any text editor and copy the  above sample data into sample.csv file

```bash
gpuser@ubuntu$mkdir dataset
gpuser@ubuntu$cd dataset

#copy the contents to sample.csv
```

###Step 2: Create Hive Table

```bash
#hive -x

#Will enter hive shell for issuing hive queries

hive>CREATE TABLE IF NOT EXISTS household_pwr_consumption(powerdate string,time string,global_active_power float,global_reactive_power  float,voltage float,global_intensity   float,  sub_metering_1   float,sub_metering_2 float,sub_metering_3 float)ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\;'
LINES TERMINATED BY '\n';

OK
Time taken: 0.156 seconds
```

###Step 3: Loading data

Confirm that the [sample data] is at the path mentioned below.

```bash

hive>LOAD DATA LOCAL INPATH '../dataset/sample.csv' INTO TABLE household_pwr_consumption;


Copying data from file:/home/gpuser/dataset/sample.csv
Copying file: file:/home/gpuser/dataset/sample.csv
Loading data to table default.household_pwr_consumption
OK
Time taken: 0.367 seconds
```

###Step 4: Run the hive query with Sample Data   
   
```bash

hive>select substring(powerdate,length(powerdate)-3,length(powerdate)) as year , avg(Sub_metering_1)+avg(Sub_metering_2)+avg(Sub_metering_3) as average from household_pwr_consumption group by substring(powerdate,length(powerdate)-3,length(powerdate));

MapReduce Total cumulative CPU time: 51 seconds 540 msec
Ended Job = job_1365823789752_0011
Execution completed successfully
Mapred Local Task Succeeded . Convert the Join into MapJoin
OK
2006  10.818931624546664
2007  8.66401492133901
2008  8.3997608677086
2009  9.095407810941456
2010  9.333240051246847
Time taken: 123.134 seconds
```

###Step 5: Testing the  Query with full dataset

Repeat the steps 1 and 2 with original data in place of the sample data. 

Confirm that the [original data] is at the path mentioned under.

###Loading data

```bash

hive>LOAD DATA LOCAL INPATH '../dataset/original.csv' INTO TABLE household_pwr_consumption;
Copying data from file:/home/gpuser/dataset/original.csv
Copying file: file:/home/gpuser/dataset/original.csv
Loading data to table default.household_pwr_consumption
OK
Time taken: 5.845 seconds
```

###Run the hive query   

```bash

hive>select substring(powerdate,length(powerdate)-3,length(powerdate)) as year , avg(Sub_metering_1 + Sub_metering_2 + Sub_metering_3) as average from household_pwr_consumption group by year;

MapReduce Total cumulative CPU time: 44 seconds 100 msec
Ended Job = job_1365823789752_0003
Execution completed successfully
Mapred Local Task Succeeded . Convert the Join into MapJoin
OK
2006  10.873181156784284
2007  8.66401492133901
2008  8.3997608677086
2009  9.095407810941456
2010  9.333240051246847
Time taken: 64.919 seconds

```

###Congratulations! You have just finished  the tutorial. Compare the rresults with the MapReduce with Java tutorial.

