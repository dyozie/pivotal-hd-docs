---
title: HDFS
---

Overview
--------
Big Data poses challenges in storage and processing.  Any BigData storage system should be capable of dealing with the following challenges:

* Streaming Data Access
* High Aggregate Bandwidth
* Scalable to hundreds of servers
* Fault-tolerant
* Build out of commodity hardware

Apache Hadoop Distributed File System (HDFS), part of the Hadoop distribution provides these capabilities to a great extent. HDFS has become very popular for storing large data sets.

About HDFS
----------

An overview of HDFS architecture is shown below:

![HDFS Architecture](/images/hdfs-diagram.png)

**Fig. 1 HDFS Architecture**

HDFS stores files by splitting them into blocks. Each block by default is 64MB and can be changed. This is chosen to minimize the cost of seeks. Small files do not occupy the complete blocks. HDFS block abstraction allows to store large files and simplifies the storage and management of Data Blocks.

HDFS uses traditional master slave architecture, with the master being the namenode managing files and meta-data. The meta-data has information about the file, blocks and location of the blocks on the Data Nodes. Data nodes has the responsibility to store and retrieve the blocks. Data nodes can form a cluster where each node has inexpensive internal disk drives.

Block replication is shown below:

![Replication](/images/introduction/replication.png)

**Fig 2. Block Replication in HDFS**

Block replication provides the required tolerance for the files in the HDFS. It also helps in Data Locality while allocating tasks for running MapReduce.

###Namenode

The NameNode is the heart of the Hadoop distributed File System.. NameNode does not store Data. NameNode stores the Meta information about the File. NameNode supports hierarchical directory structure similar to Unix file system. NameNode keeps the meta information in memory. The Size of the File System is limited by the Amount of Memory NameNode has.

###Datanode

A typical HDFS cluster has many Data Nodes. DataNodes provide high aggregate bandwidth and support pipelined writing. The client while reading can directly read from the DataNodes after getting the Block Locations from NameNode. Each Data Node sends the Block report to NameNode at startup.

###Namenode and Singlepoint of failure

The availability of Name is critical to the availability of HDFS. Apache Hadoop 1.0 provides mechanisms to manage the meta-data in case of Name failures, which can be quickly recovered. Apache Hadoop 2.0 comes with built-in high availability. The high availablity is provided by zookeeper with a quorum of servers. Hadoop 2.x also provides the HDFS federation required to support very large file systems as BigData becomes bigger.

