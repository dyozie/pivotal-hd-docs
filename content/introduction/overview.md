---
title: Introduction to Pivotal HD
description: Pivotal HD Installation and Administration
---

Overview
-------
The technologies in processing large data sets have become more important today than before.
The new era of business intelligence is here with Big data. There is a tremendous growth in the amount of Data that needs to stored and analyzed. The examples of big data sources include Web logs, electronic health records, Weather, social media, internet search, call records from operators, surveillance data, astronomical observations, bio/Geo chemical, genomics, and atmospheric sciences. The volume, velocity and variety in such data are posing a challenge in processing.

Enterprises and Government are the biggest consumers of BigData technologies. The insights in Big Data cab help governments to arrive at effective solutions to Global warming, weather predictions, water shortage, power usage and generation etc. GE and IBM are talking about industrial internet, where data from a large number of devices like health care instruments, aviation etc, can be processed for big insights. With hadoop large data processing has become affordable and easier compared to earlier frameworks.
Governments are using these technologies to provide the same quality of service cheaper, faster and better.
 
Hadoop is becoming the standard for processing big data. A number of vendors are distributing Hadoop along with extensions to Hadoop. Pivotal HD is an Apache Hadoop distribution with powerful extensions like Massively Parallel processing technology, making processing of BigData faster and efficient.  

About Pivotal HD
----------------

Pivotal HD ™ is an Apache Hadoop distribution that natively integrates the industry-leading EMC Greenplum massively parallel processing (MPP) database technology with the Apache Hadoop framework.

Hadoop Virtualization Extensions (HVE) included in Pivotal HD Enterprise leverage VMware technology simplifying the deployment and management of Hadoop. Pivotal HD Enterprise comes with the flexibility of on-premises deployment on a wide range of hardware.

###About Hadoop

Apache Hadoop is a framework for distributed processing and storing of large data sets. Hadoop follows the age old technique of moving the program to the location where data is. Apache Hadoop is becoming increasing popular because of its simplicity, ease of use. It provides cost-effective and scalable infrastructure for batch data processing systems with huge volumes of data. Hadoop takes care of storage and distributed computation letting users focus on the business of writing data processing scripts.

Hadoop is primarily made up of two components:

* Distributed file system called the Hadoop Distributed File system (HDFS) and 
* Computation layer that implements a processing paradigm called MapReduce.

While The distributed file system provides the fault-tolerant data storage infrastructure, the distributed computing helps in crunching large datasets using the MapReduce programming model.

In MapReduce, the application is divided into many small units of work called map, each of which may be executed on any node in the cluster. While the Map function filters and reduces the data to a smaller subset, the reducer aggregates the results from all the maps and further reduces to a small subset. Hadoop provides the implementation for the MapReduce paradigm.

Hadoop 2.0 overcomes the limitations of Hadoop version 1.0 by providing better resource utilization, support for alternative programming paradigms such as MPI and Graph processing, and improvement in the wire protocols for cluster compatibility.

#####Hadoop releases

There are multiple releases of Hadoop available. Apache Hadoop 1.0.0 (0.20-eventually became 1.0.0) should be the choice for using Hadoop V1. Hadoop version 2.0 (0.23 eventually became 2.x) is in alpha.

Hadoop 2.x maintains API compatibility with previous stable release (Hadoop-0.20.205). The MapReduce programs can be run after a re-compilation with the new Hadoop libraries.
