---
title: HDFS
---

Overview
--------
Hadoop uses commonly available servers in a very large cluster, where each server has a set of inexpensive internal disk drives.
Within Hadoop, the data is divided into blocks, and copies of these blocks are stored on other servers in the Hadoop cluster.
With this kind of architecture Hadoop can scale to thousands of machines, providing built-in fault tolerance and fault compensation capabilities.

About HDFS
----------

An overview of HDFS architecture is shown below:

![HDFS Architecture](/images/hdfs-diagram.png)

**FIG. 1 HDFS Architecture**

The replication factor provides the fault tolerance for the data and helps increase the performance using Data locality.
The map and reduce functions are executed on smaller subsets of your larger data sets, and
this provides the scalability that is needed for big data processing.

###Namenode
The NameNode is the centerpiece of an HDFS file system. It keeps the directory tree of all files in the file system, and tracks where across the cluster the file data is kept. It does not store the data of these files itself. Client applications talk to the Namenodeto locate the files. There is only one Name Node in the cluster.
The Name Node should also have as much RAM as possible because it keeps the entire file system meta-data in memory.

###Datanode
Any typical HDFS cluster has many Data Nodes.
They store the blocks of data and when a client requests a file, it finds out from the Name Node which Data Nodes stores the blocks that make up that file and the client directly reads the blocks from the individual Data Nodes.
Each Data Node also reports to the Name Node periodically with the list of blocks it stores.



