---
title: Introduction to Pivotal HD
---

Overview
-------
The new era of business intelligence is here with Big data. New technologies or techniques are being used every day to process BigData faster, cheaper and better. Enterprises and Government are the biggest consumers of BigData technologies, as they figure out innovative ways to provide the same quality of service cheaper, faster and better.
Big data is being generated continuously from various different sources. The examples of big data sources include Web logs, RFID and sensor data, social networks, Internet search indexing, call detail records, military surveillance, and complex data in astronomic, bio/geo chemical, genomics, and atmospheric sciences. The volume of Big Data is creating challenges in capturing, storing, searching, sharing, analysis, and visualization of the data. Hadoop is becoming the defacto standard for processing big data. A number of vendors are distributing Hadoop along with extensions to Hadoop. Pivotal HD is an Apache Hadoop distribution with powerful extensions like Massively Parallel processing technology, making processing of BigData faster and efficient.

About Pivotal HD
----------------

Pivotal HD ™ is an Apache Hadoop distribution that natively integrates the industry-leading EMC Greenplum massively parallel processing (MPP) database technology with the Apache Hadoop framework.

Hadoop Virtualization Extensions (HVE) included in Pivotal HD Enterprise leverage VMware technology simplifying the deployment and management of Hadoop. Pivotal HD Enterprise comes with the flexibility of on-premises deployment on a wide range of hardware.

###About Hadoop

Apache Hadoop is an open-source software framework for distributed processing and storing of the large data sets.
Hadoop provides a pragmatic, cost-effective and scalable infrastructure for building batch data processing systems for enormous amounts of data. 

Hadoop is primarily made up of two components:

* Distributed file system called the Hadoop Distributed File system (HDFS) and 
* Computation layer that implements a processing paradigm called MapReduce.

While The distributed file system provides the fault-tolerant data storage infrastructure, the distributed computing helps in crunching large datasets using the MapReduce programming model.

In MapReduce, the application is divided into many small units of work called map, each of which may be executed or re-executed on any node in the cluster. While the Map function filters and reduces the data to a smaller subset, the reducer aggregates the results from all the maps and further reduces to a small subset. Hadoop provides the implementation for the MapReduce paradigm.

Hadoop 2.0 overcomes the limitations of Hadoop version 1.0 by providing better resource utilization, support for alternative programming paradigms such as MPI and Graph processing, and improvement in the wire protocols for cluster compatibility.

#####Hadoop releases
There are multiple releases of Hadoop available. Apache Hadoop 1.0.0 (0.20->eventually became 1.0.0) should be the choice for using Hadoop V1. Hadoop version 2.0 (0.23 eventually became 2.x) is in alpha.

Hadoop 2.x maintains API compatibility with previous stable release (hadoop-0.20.205). The MpaReduce programs can be run after a re-compilation with the new Hadoop libraries. 


