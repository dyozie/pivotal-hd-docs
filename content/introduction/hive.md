---
title: Hive
---

Overview
--------
Business analysts use popular SQL query language for querying and analyzing data. With Hadoop, writing MapReduce programs will be time consuming and requires a very good skill in Java. Hive was created to solve this problem. Hive allows Business analysts with strong SQL skills to run queries and get insights from large volumes of data.

Hive and Hadoop combination are touted to be a next Dataware housing solution that can store and process large volumes of data. Hive is initially developed by Facebook and is now part of Apache.

The paper describes how Hive can be used to build a PetaByte Scale warehouse using Hive [hive-icde2010.pdf](http://infolab.stanford.edu/~ragho/hive-icde2010.pdf)


About Hive
----------

An overview of Hive is shown below:

![Hive](/images/introduction/hive.png)

**Fig. 1 Hive Overview**

Hive is a tool for querying and analyzing data lying in the HDFS. It is powerful in analysing web logs, provides queries and summarization and aggregation. It also provides rich data structures like Array, Map and Bag to represent nested structures in the data.

Hive essentially provides a structure to query data lying in the HDFS.
Hive is similar to MySQL and runs on a Desktop or Workstation.
Hive converts SQL queries into a series of java classes, which are MapReduce jobs for execution on Hadoop cluster.

Hive stores the Meta Data of the table structures in a Meta-Store. It provides JDBC and ODBC bridges for querying.

###Using Hive

* Just like an RDBMS, Hive organizes its data into tables. A simple create table statement is shown below. 

```xml
   CREATE TABLE records (year STRING, temperature INT)
   ROW FORMAT DELIMITED
   FIELDS TERMINATED BY '\t';
```

* Hive populates the data using the LOAD DATA as shown below:

```xml
   LOAD DATA LOCAL INPATH 'sample.txt'
   OVERWRITE INTO TABLE records;
```
The above command copies the data from local file system to HDFS. In HDFS, the table is mapped to a directory and the contents are stored in a file in the directory. By default the tables are stored in /user/hive/warehouse.

External directive can be used to crate table for an existing data in HDFS. The Location directive specifies the location of the file in the HDFS. it points to a directory in the HDFS.

```xml
   CREATE TABLE records (year STRING, temperature INT)
   ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t';
   LOCATION '/users/foobar/dataset1/sample.data'
```

* The tables can be queried using the standard SQL and shown below:

```xml
   hive> SELECT year, MAX(temperature)
   > FROM records
   > WHERE temperature != 9999
   > GROUP BY year;
```

###Configuring Hive
Hive is configured using an XML configuration file hive-site.xml. It is located in Hive’s conf directory. The default properties are in hive-default.xml, which documents all the properties.

The default properties can be overridden with the configuration directory that Hive looks for in hive-site.xml by passing the --config option to the hive command: 

```xml
% hive --config /Users/gp/hive/config
```

###Hive Services
Hive provides the following services:

* cli -  The command line interface to Hive (the shell). This is the default service.
* hiveserver - Exposed as a service, enables Thrift, JDBC, and ODBC connectors. 

###Data Model

* Tables - Analogous to tables in Relational Databases.  Each table has corresponding directory in HDFS
For example: The following directory maps to a table table1.

```xml
/user/hive/warehouse/john/table1/sample-data.txt
```

* Partitions - Hive supports partitions, help in querying large datasets, which can dramiatically improve the performance. 

An example of a partition is shown bellow:

```xml
/user/hive/warehouse/john/table1/ds=20090801/ctry=US
/user/hive/warehouse/john//table1/ds=20090801/ctry=CA
```
The partition columns ds, ctry are mapped to HDFS Directories.

* Buckets - Partitions can be further divided into buckets, which can reduce the processing time for joins drastically. 

An example of a bucket is shown below:

```xml
/user/hive/warehouse/john/table1/ds=20090801/ctry=US/part-00000
/user/hive/warehouse/john/table1/ds=20090801/ctry=US/part-00020
```
The buckets are part-0000 and part-00020.

* Data Types -  Apart from the primitive data types, Hive support rich data structures like Array, maps, structs and union.
