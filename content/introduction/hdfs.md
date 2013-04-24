---
title: HDFS
---

Overview
--------
BigData comes with a big challenge of storing and retrieving large sets of data. Any BigData storage system should be capable of dealing with the following challenges:

* Streaming Data Access
* High Aggregate Bandwidth
* Scalable to hundreds of servers
* Fault-tolerant
* Build out of commodity hardware

Apache Hadoop File System, part of the Hadoop distribution provides these capabilities to a great extent. HDFS has become very popular for storing large data sets.

About HDFS
----------

An overview of HDFS architecture is shown below:

![HDFS Architecture](/images/hdfs-diagram.png)

**Fig. 1 HDFS Architecture**

HDFS stores files by splitting them into blocks. Each block by default is 64MB and can be changed. This is choosen to minimize the cost of seeks. Small files does not occupy the complete blocks. HDFS block abstraction allows 

* Support for large files (Files are split as blocks and stored)
* Blocks need not be stored in the same disk or machine
* It simplifies the storage subsystem, by separating the concerns
* Capable of providing high aggregate bandwidth
* Good support for replication

HDFS uses traditional master slave architecture, with master being the namenode managing the files and meta-data. The meta-data has information about the file, blocks and location of the blocks on the Data Nodes. Datanodes has the responsibility to store and retrieve the blocks. Datanodes can form a large cluster, where each server has a set of inexpensive internal disk drives.

Block replication is shown below:

![Replication](/images/introduction/replication.png)

**Fig 2. Block Replication in HDFS**

Block replication provides the required tolerance for the files in the HDFS. It also helps in Data Locality while allocating tasks for running MapReduce.

###Namenode

The NameNode is the centerpiece of an HDFS file system. It keeps the directory tree of all files in the file system, and tracks where across the cluster the file data is kept. It does not store the data of these files itself. Client applications talk to the Namenode to locate the files. There is only one Name Node in the cluster.
The Name Node should also have as much RAM as possible because it keeps the entire file system meta-data in memory.

###Datanode
A typical HDFS cluster has many Data Nodes. DataNodes provide high aggregate bandwidth and support pipelined writing. The client while reading can directly read from the datanodes after getting their locations. Each Data Node also reports to the Name Node periodically with the list of blocks it stores.

###Namenode and Singlepoint of failure
The availability of Namenode becomes critical, without which the HDFS becomes unavailable. Apache Hadoop 1.0 provides mechanisms to manage the meta-data in case of Namenode failures, which can be quickly recovered.
Apache Hadoop 2.0 comes with built-in high availability. The high availablity is provided by zookeeper wth a quorum of servers. Hadoop 2.x also provides the HDFS federation required to support very very large file systems as BigData becomes bigger.
