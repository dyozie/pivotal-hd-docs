---
title: HDFS
---

Overview
--------
BigData comes with a big challenge of storing and retriving the data. Any BigData storage system should be capable of dealing with the following challenges:

* Streaming Data Acess
* High Aggregate Bandwidth
* System should be scalable to hundreds of servers
* Should be fault-tolerant
* Should be build out of commodity hardware
* Should support large data sets and
* No single point of failure

Apache Hadoop File System, part of the Hadoop distribution provides these capabilities to a great extent. HDFS has become very popular for storing large data sets, because of its simplicity in the design.

About HDFS
----------

An overview of HDFS architecture is shown below:

![HDFS Architecture](/images/hdfs-diagram.png)

**FIG. 1 HDFS Architecture**

HDFS stores files by splitting them into blocks. Each block by default is 64MB and can be changed. This is choosen to minimize the cost of seeks. Small files does not occupy the complete blocks. HDFS block abstraction allows 

* Support for large files (Files are split as blocks and stored)
* Blocks need not be stored in the same disk or machine
* It simplifies the storage subsystem, by separating the concerns
* Block storage allows to manges blocks independently and easy to provide replications and
* Capabale of providing high aggregate bandwidth

HDFS uses traditional master slave architecture, with master being the namenode managing the files and meta-data. The meta has info about the file, blocks and location of the blocks on the Data Nodes. Datanodes responsibility is to store the blocks.  
Datanodes can form a large cluster, where each server has a set of inexpensive internal disk drives.
Block replication provides the required tolerance for the files in the HDFS. It also helps in Data Locality while allocating tasks for running MapReduce.

Block replication is shown below:

![Replication](/images/introduction/replication.png)

* Fig 2. Block Replication in HDFS

The map and reduce functions are executed on smaller subsets of larger data sets, and
this provides the scalability that is needed for big data processing.


###Namenode

The NameNode is the centerpiece of an HDFS file system. It keeps the directory tree of all files in the file system, and tracks where across the cluster the file data is kept. It does not store the data of these files itself. Client applications talk to the Namenodeto locate the files. There is only one Name Node in the cluster.
The Name Node should also have as much RAM as possible because it keeps the entire file system meta-data in memory.

###Datanode
Any typical HDFS cluster has many Data Nodes.
They store the blocks of data and when a client requests a file, it finds out from the Name Node which Data Nodes stores the blocks that make up that file and the client directly reads the blocks from the individual Data Nodes.
Each Data Node also reports to the Name Node periodically with the list of blocks it stores.

###Namenode and Singlepoint of failure
The availability of Namenode becomes critical, without which the HDFS is not available. Apache Hadoop 1.0 provides mechanisms to manage the meta data in case of Namenode failures, which can be quickly recovered.
With Apache Hadoop 2.0, Namenode is made highly avaiable with a quorum of servers managed by ZooKeeper. Hadoop 2.x also provides the HDFS deferation required to support very very large file systems as BigData becomes bigger.
