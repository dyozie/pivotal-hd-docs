---
title: PIG - Count Businesses in a City
---


In this tutorial you will learn how to use PIG  with Open Source Hadoop 2.0.x release  to load and query data.

##Use Case##
The sample dataset has information about the Businesses. Each business is located in a city. This use case is a simple example of how to get count how many businesses are there in a city using Pig's command line tool `grunt`

##Sample Data ##

For our tutorial we will use the sample data from the following format 

```java
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

We have transformed the original `json` data into the format so that it can be loaded by using `grunt`. The data for businesses reviewed can be found in the directory [pivotal-samples/sample-data/hawq/business.txt](https://github.com/rajdeepd/pivotal-samples/blob/master/sample-data//hawq/business.txt)

##Pig Compatibility with Hadoop 2.x ##

For this tutorials we tested with **Pig 0.11.1** and **Hadoop 2.0.2 Alpha**

##Installing Pig 0.11.1 with Hadoop 2.0.3-Alpha ##

*	Download the source for Pig 0.11.1 from the [pig.apache.org/releases](http://pig.apache.org/releases.html)
*	Extract the file `pig-0.11.1-src.tar.gz` to a folder `pig-0.11.1-src`.

```bash
$ tar -xvf pig-0.11.1-src.tar.gz
$ cd pig-0.11.1-src
```

*	Run the `ant` tool with a flag to compile it with Hadoop 2.0.4

```bash
$ ant -Dhadoopversion=23
```

*	Make sure Hadoop 2.0.3 installation is running and the `HADOOP_HOME` environment variable is pointing to the right directory.

*	Execute the command `pig` from directory `pig-0.11.1.-src/bin`, `grunt` command line shell for Pig will start

``` bash
$  ./pig
grunt> 
```

## Loading Data ##

We are going to use `LOAD` utility to load data into a Schema for business from HDFS

*	Copy the file `business.txt` downloaded from github into hdfs folder `/yelp-dataset`

###Summary ###

In this tutorial we learnt how to use HAWQ to insert and query data in internal and external tables.
