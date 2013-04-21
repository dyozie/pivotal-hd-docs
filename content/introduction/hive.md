---
title: Hive
---

Overview
--------
Hive was created to make it possible for analysts with strong SQL skills (but meager Java programming skills) to run queries on the huge volumes of data that Facebook stored in HDFS and it has the huge advantage of being very well known in the industry. What’s more,
 SQL is the lingua franca in business intelligence tools (ODBC is a common bridge, for  example), so Hive is well placed to integrate with these products.

Today, Hive is a successful Apache project used by many organizations as a general-purpose, scalable data processing platform.
Of course, SQL isn’t ideal for every big data problem—it’s not a good fit for building  complex machine learning algorithms

Hive is a data warehouse system for Hadoop that facilitates easy data summarization,
ad-hoc queries, and the analysis of large datasets stored in Hadoop compatible file systems.
Hive is initially developed by Facebook, Hive is now part of Apache.
The paper describes how Hive can be used to build a PetaByte Scale warehouse using Hive
[hive-icde2010.pdf](http://infolab.stanford.edu/~ragho/hive-icde2010.pdf)


About Hive
----------

An overview of Hive is shown below:

![Hive](/images/hive1.jpg)

**FIG. 1 Hive Overview**

Hive runs on your workstation and converts your SQL query into a series of MapReduce jobs for execution on a Hadoop cluster.
Hive organizes data into tables, which provide a means for attaching structure to data stored in HDFS. Metadata— such as table schemas
is stored in a database called the metastore. 

The Hive shell is the primary way that we will interact with Hive, by issuing commands in HiveQL.
HiveQL is Hive’s query language, a dialect of SQL. It is heavily influenced by MySQL, so if you are familiar with MySQL you should feel at home using Hive.

Hive parses the SQL queries into Java classes, which are then submitted as MapReduce jobs to the the Hadoop cluster.

###Using Hive

* Just like an RDBMS, Hive organizes its data into tables. We create a table to hold the weather data using the CREATE TABLE statement:

```xml
   CREATE TABLE records (year STRING, temperature INT, quality INT)
   ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t';
```
The first line declares a records table with three columns: year, temperature, and quality. The type of each column must be specified, too: here the year is a string, while the other two columns are integers.

* Next we can populate Hive with the data. This is just a small sample, for exploratory purposes:

```xml
   LOAD DATA LOCAL INPATH 'input/ncdc/micro-tab/sample.txt'
   OVERWRITE INTO TABLE records;
```

Running the above command tells Hive to put the specified local file in its warehouse directory. 
This is a simple filesystem operation. 
Tables are stored as directories under Hive’s warehouse directory, which is controlled by the hive.metastore.warehouse.dir, and defaults to /user/hive/warehouse.

* Now that the data is in Hive, we can run a query against it:

```xml
   hive> SELECT year, MAX(temperature)
   > FROM records
   > WHERE temperature != 9999
   > AND (quality = 0 OR quality = 1 OR quality = 4 OR quality = 5 OR quality = 9)
   > GROUP BY year;
```

###Configuring Hive
Hive is configured using an XML configuration file like Hadoop’s. The file is called hive-site.xml and is located in Hive’s conf directory.  The default properties - hive-default.xml, which documents the properties that Hive exposes and their default values.

The default properties can be overriden with the configuration directory that Hive looks for in hive-site.xml by passing the --config option to the hive command: 

```xml
% hive --config /Users/tom/dev/hive-conf
```

###Hive Services
The Hive shell is only one of several services that you can run using the hive command.
Type hive –service help to get a list of available service names; the most useful are described below.

* cli -  The command line interface to Hive (the shell). This is the default service.
* hiveserver - Runs Hive as a server exposing a Thrift service, enabling access from a range of clients written in different languages. Applications using the Thrift, JDBC, and ODBC connectors need to run a Hive server to communicate with Hive. Set the HIVE_PORT environment variable to specify the port the server will listen on (defaults to 10,000).

###Data Model
Hive organizes tables into partitions, a way of dividing a table into coarse-grained parts based on the value of a partition column, such as date. Using partitions can make it faster to do queries on slices of the data.

Tables or partitions may further be subdivided into buckets, to give extra structure to the data that may be used for more efficient queries. For example, bucketing by user ID means we can quickly evaluate a user-based query by running it on a randomized sample of the total set of users.  

* Tables - Analogous to tables in relational DBs.  Each table has corresponding directory in HDFS
For example: The following directory maps to a table table1.

```xml
/user/hive/warehouse/john/table1/sample-data.txt
```

* Partitions - Analogous to dense indexes on partition columns. Partitions are  Nested sub-directories in HDFS for each combination of partition column values

```xml
For Example: Partition columns: ds, ctry will map to HDFS Directories
HDFS subdirectory for ds = 20090801, ctry = US
/user/hive/warehouse/john/table1/ds=20090801/ctry=US
HDFS subdirectory for ds = 20090801, ctry = CA
/user/hive/warehouse/john//table1/ds=20090801/ctry=CA
```
* External Tables - Point to existing data directories in HDFS.  Supports creation of tables and partitions – partition columns just become annotations to external directories
* Buckets - Split data based on hash of a column - mainly for parallelism
One HDFS file per bucket within partition sub-directory

```xml
For Example
Bucket column: user into 32 buckets
HDFS file for user hash 0
/user/hive/warehouse/john/table1/ds=20090801/ctry=US/part-00000
HDFS file for user hash bucket 20
/user/hive/warehouse/john/table1/ds=20090801/ctry=US/part-00020
```

