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

* Hive organizes data into tables just like it's RDBMS counterpart. 
An example of `create table` statement is shown as follows:

```xml
   CREATE TABLE weblogs (TIMESTAMP date, STRING program, String message)
   ROW FORMAT DELIMITED
   FIELDS TERMINATED BY '\t';
```

* Hive populates the data using the LOAD DATA as shown below:

```xml
   LOAD DATA LOCAL INPATH 'sample.txt'
   OVERWRITE INTO TABLE records;
```

The above command copies the data from local file system to HDFS. In HDFS, the table is mapped to a directory and the contents are stored in a file in the directory. By default, the tables are stored in /user/hive/warehouse.

External clause can be used to crate table for an existing data in HDFS. The Location directive specifies the location of the file in the HDFS. it points to a directory in the HDFS.

```xml
   CREATE TABLE weblogs (TIMESTAMP date, STRING program, STRING MESSAGE_TYPE, STRING message)
   ROW FORMAT DELIMITED
   FIELDS TERMINATED BY '\t';
   LOCATION '/users/foobar/weblogs/2008/data1.data'
```

* Queries are standard SQL queries as shown below:

```xml
   hive> SELECT date,  program, message 
   > FROM WEBLOGS 
   > WHERE MESSAGE_TYPE == 'Error`
   > GROUP BY program;
```

###Configuring Hive
Hive configuration file `hive-site.xml` is located in Hive's conf directory. All the default properties are in `hive-default.xml`. Hive is invoked with the `--config` option to override default properties.

```xml
% hive --config /home/gp/hive/config
```

###Using Hive
Hive has two ways of usage:

* Using command line interface: Hive gives a shell, just like mysql shell. SQL commands can be executed on the shell.
* Using JDBC/ODBC Drivers: Hive is exposed as a service that enables enables Thrift, JDBC, and ODBC connectors. Hive Server has to be configured for this purpose.

###Data Model

* Tables - Similar to Relational Databases, but mapped to a directory in HDFS. 
For example, the following HDFS directory `weblogs` maps to a table `weblogs`.

```xml
/user/hive/warehouse/weblogs/sample-data.txt
```

* Partitions - Hive supports partitions for partitioning the data and directory maps to the `where` clause. This reduces the amount of data to be processed.

An example of a partition is shown below:

```xml
/user/hive/warehouse/weblogs/ds=2009/ctry=US
/user/hive/warehouse/weblogs/ds=2010/ctry=CA
```
The partition columns ds, ctry are mapped to HDFS Directories.

* Buckets - Partitions can be further divided into buckets, which can reduce the processing time further. Hive uses Buckets in join queries to limit the dataset for join.

An example of a bucket is shown below:

```xml
/user/hive/warehouse/weblogs/ds=2009/ctry=US/part-00000/data1.data
/user/hive/warehouse/weblogs/ds=2010/ctry=US/part-00020/data2.data
```
The buckets are part-0000 and part-00020.

* Data Types -  Apart from the primitive data types, Hive support rich data structures like Array, maps, structs and union.


