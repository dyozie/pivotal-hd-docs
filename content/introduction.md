---
title: Apache Hadoop Tutorial series
---

Introduction to Apache Hadoop
-----------------------------
The goal of the document is to give a brief introduction to Hadoop version 2.x platform eco system.


##Overview
The amount of data in expanding rapidly. The new era of business intelligence here with Big data. Big data is being generated continuosly from various sources. The examplesof big data sources include Web logs, RFID and sensor data, social networks, Internet search indexing, call detail records, military surveillance, and complex data in astronomic, bio/geo chemical, genomics, and atmospheric sciences. The volume of Big Data is creating challenges in capturing, storing, searching, sharing, analysis, and visualization of the data. 

Enterprises are slowly adopting Big data platforms like Apache Hadoop. Multiple commercial distributions are

##Predictive Analytics 
Predictive analytics is an area of statistical analysis that deals with extracting information from data and using it to predict 
trends and behavior patterns. In business, predictive models exploit patterns found in historical and transactional data 
to identify risks and opportunities. Models capture relationships among many factors to allow assessment of risk or 
potential associated with a particular set of conditions.

Traditional analytics environments are complex programming environments separated from the sources of data, 
Extracting data from the source database platform with traditional analytics programs is slow and complex.
With the advent of Big Data, Enterprises require an analytics ecosystem that is architecturally
capable of near - real time processing of predictive models, a platform capable of delivering accurate,
actionable, and timely predictive insight - no matter the size or the location of the data.
Organizations are finding new ways to use data that was previously believed to be of little value, 
or far too expensive to retain, to better serve their constituents. 

Exploring Big Data and using predictive analytics is within reach of more organizations if only the workforce adapts to the new architecture and system. Pivotal HD is the platform that unleashes the power of BigData processing and analytics to the hands of traditionally available SQL workforces in the organization and the market.

About Hadoop 
------------
Apache Hadoop is an open-source software framework that supports data-intensive distributed applications, licensed under the Apache v2 license. 
Hadoop provides a pragmatic, cost-effective and scalable infrastructure for building batch data processing systems for enormous amounts of data. 

Hadoop is made up of a distributed file system called the Hadoop Distributed File system (HDFS) and a computation layer that implements a processing paradigm called MapReduce.
The application is divided into many small fragments of work, each of which may be executed or re-executed on any node in the cluster.
Hadoop is tolerant to hardware and software failures.

Hadoop uses a cluster of commodity servers with no specialized  hardware or network infrastructure to form a single, logical, storage and compute platform - *cluster*, that can be shared by multiple individuals or groups.
Computation in  Hadoop MapReduce is performed in parallel, automatically, with a simple abstraction  for developers that obviates complex synchronization and network programming.
Hadoop runs the user-provided  processing logic on the machine where the data lives rather than dragging the data  across the network and so vastly improves performance.

Hadoop 1.0 is all about HDFS and MapReduce. Hadoop 2.0 is about HDFS Federation and generic framework that can be used writing multiple applications. MapReduce is of one such applications.
Hadoop 2.0 overcomes the limitations of Hadoop version 1.0 by providing better resource utilization, support for alternative programming paradigms such as MPI and Graph processing, and improvment in the wire protocols for cluster comaptibility.

The entire Apache Hadoop platform consists of the Hadoop kernel, MapReduce and Hadoop Distributed File System (HDFS),
as well as a number of related projects including Apache Hive, Apache HBase, and others.

#####Hadoop releases
There are multiple releases of Hadoop available. It is some time confusing which one to use.
Apache Hadoop 1.0.0(0.20->eventually became 1.0.0) should be the choice for using Hadoop V1. Hadoop version 2.0(0.23 eventually became 2.x) is in alpha and will take some time before it becomes available.

Hadoop 2.x maintains API compatibility with previous stable release (hadoop-0.20.205). This means that all Map-Reduce jobs should still run unchanged on top of MRv2 with just a recompile.

Hadoop 2.0 Architecture
-----------------------
Apache Hadoop 2.0 Big data eco system offers the has the following services:  
  
#####HDFS - Hadoop File System, a distributed storage

#####YARN - Framework for running distributed applications. MapReduce is one application

#####ZooKeeper - A quorum of servers for configuration management 

#####HBase - A columnar, sparsely distributed data base

#####Hive - A framework for running  SQL like queries

#####Pig - A data flow language somewhat similar to Hive  

A detailed view of YARN architecture is presented below:
http://hadoop.apache.org/docs/r2.0.3-alpha/hadoop-yarn/hadoop-yarn-site/YARN.html

A brief introduction to each of the service is given below:
 
HDFS
----
Hadoop uses commonly available servers in a very large cluster, where each server has a set of inexpensive internal disk drives.
Within Hadoop, the data is divided into blocks, and copies of these blocks are stored on other servers in the Hadoop cluster. 
With this kind of architecture Hadoop can scale to thousands of machines, providing built-in fault tolerance and fault compensation capabilities. 

An overview of HDFS architecture is shown below:
![HDFS Architecture](/images/hdfs-diagram.png)
FIG. 1
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

YARN
----
Hadoop version 1.0 had Jobtracker taking care resource management and job scheduling. With the new architecture, resource management and jobs scheduling has becomer separate services.

A brief overview of yarn archtecture is show below:
![yarn](/images/yarn.png)
FIG. 2  YARN Architecture

YARN allows applications to launch any process and, unlike existing Hadoop MapReduce in hadoop-1.x (aka MR1), it isn’t limited to Java applications alone. Yarn has the following main services.

###Resource manager
The ResourceManager and per-node slave, the NodeManager, form the data-computation framework. The ResourceManager is the ultimate authority that arbitrates resources among all the applications in the system.
The ResourceManager has two main components: Scheduler and ApplicationsManager.
The Scheduler is responsible for allocating resources to the various running applications subject to familiar constraints of capacities, queues etc. The Scheduler is pure scheduler in the sense that it performs no monitoring or tracking of status for the application. Also, it offers no guarantees about restarting failed tasks either due to application failure or hardware failures. The Scheduler performs its scheduling function based the resource requirements of the applications; it does so based on the abstract notion of a resource Container which incorporates elements such as memory, cpu, disk, network etc. In the first version, only memory is supported.

###Node Manager
The NodeManager is the per-machine framework agent responsible for containers, monitoring their resource usage (cpu, memory, disk, network) and reporting the same to the ResourceManager/Scheduler.

###Application master
ApplicationMaster is framework specific library and is tasked with negotiating resources from the Resource Manager and working with the NodeManager(s) to execute and monitor the tasks. Application master is bundled along with the Node Manager. The per-application ApplicationMaster has the responsibility of negotiating appropriate resource containers from the Scheduler, tracking their status and monitoring for progress. Applcation master provides the fault tolerance.

###Container
The basic unit of allocation is now container, instead of a Map or a Reduce task in Hadoop 1.0. The container for example could be defined as one with attributes like memory, cpu, disk etc.
This granualirty in define resources and allocating them allows the resource management to be efficient and helps meet multiple processing requirements.

###History Server
History server maintains the history of all the jobs. After a job is complere, application master will not longer be available for any queries. The designers chose to have an independent history server for managing the history of the jobs.

Hive
----
Hive is a data warehouse system for Hadoop that facilitates easy data summarization, 
ad-hoc queries, and the analysis of large datasets stored in Hadoop compatible file systems.
Hive is initially developed by Facebook, Hive is now part of Apache. 
The paper describes how Hive can be used to build a PetaByte Scale warehouse using Hive
http://infolab.stanford.edu/~ragho/hive-icde2010.pdf

Hive provides a mechanism to project structure onto this data and query the data using a SQL-like language called HiveQL. At the same time this language also allows traditional map/reduce programmers to plug in their custom mappers and 
reducers when it is inconvenient or inefficient to express this logic in HiveQL.

With Hive, one can create tables that can be queries using SQL. Hive support DDL and DML queries like, create table, alter table, joins, select as, filters, group by and multi table inserts.
The data for the tables is stored in HDFS and the meta data for the tables is stored.
in Database. Hive ships with Embedded database and can be configured with MySQL for production use.

Pig
---
Pig is a DataFlow Language, initially developed at Yahooo! to allow users using Hadoop to focus on analyzing largedata sets, and spend less time having to write mapper and reducer programs. 

Pig is some where between simple SQL and multi-step mapreduce in terms of complexity. It can be used to create complex multi-step data flows that, otherwise, would be available only to very experienced Java programmers. Pig is made up of two components. first, is the language itself called PigLatin. Second, Pig Engine, which parses, optimizes, and automatically executes PigLatin scripts as a series of MapReduce jobs on a Hadoop cluster.

Pig statements represent data operations similar to individual operators in SQL – load, sort, join, group, aggregate, etc. Each Pig statement accepts one or more datasets as inputs and returns a single data set as an output.
Pig is extensible through User Defined Functions that are written in Java. These can be used to implement complex business logic, bridge to other systems such as Mahout or R, and read or write from external data sources.

ZooKeeper
--------
ZooKeeper maintains common objects needed in large clusters environments.  Some of the examples of objects are
configuration information, hierarchical naming space, and so on.
An application can create a state in what is called as znode within Zookeeper. The znode can be updated by
any node in the cluster and any node in the cluster can register to be informed of changes to that znode.
Using this znode infrastructure applications can synchronize their tasks across the distributed cluster
by updating their status in a ZooKeeper znode, which would then 
inform the rest of the cluster of a specific node’s status change. This cluster-wide status centralization 
service is essential for management and serialization tasks across a large distributed set of servers.
Applications can leverage these services to coordinate distributed processing across large clusters.

HBase
-----
HBase is a key/value store. Specifically it is a Sparse, Consistent, Distributed, Multidimensional, Sorted map.
HBase maintains maps of Keys to Values (key -> value). Each of these mappings is called a "KeyValue" or a "Cell". You can find a value by its key.
These cells are sorted by the key. This is a very important property as it allows for searching ("give me all values for which the key is between X and Y"), rather than just retrieving a value for a known key.
The key itself has structure. Each key consists of the following parts:
row-key, column family, column, and time-stamp.
So the mapping is actually:
(rowkey, column family, column, timestamp) -> value
rowkey and value are just bytes (column family needs to be printable), so you can store anything that you can serialize into a byte[] into a cell.

HBase data can be spread over 100s or 1000s of machines and reach billions of cells. HBase manages the load balancing automatically.

####Rowkey

The rowkey is defined by the application. As the combined key is prefixed by the rowkey this allows the application to define the desired sort order. Defining the right sort order is extremely important as scanning is the only way retrieve any value for which the key is not known a priori.

The rowkey also provides a logical grouping of cells; and HBase ensures that all cells with the same rowkey are co-located on the same server (called a RegionServer in HBase), which allows for ACID guarantees for updates with the same rowkey without complicated and slow two-phase-commit or paxos.

####Column Families
Column families are declared when a table is created. They define storage attributes such as compression, number of versions to maintain, time to live, and minimum number of versions - among others.

####Columns
Columns are arbitrary names (or labels) assigned by the application.

####Timestamp
The timestamp is a long identifying (by default) the creation time of the of the cell. Each cell (as opposed to row) is versioned, which makes it interesting to reason about consistency and ACID guarantees (more on that later). No data is ever overwritten or changed in place, instead every "update" creates a new version of the affected set of cells.

Apache Mahout
------------
Machine learning is a subfield of artificial intelligence concerned with techniques that allow computers to 
improve their outputs based on previous experiences.. The field is closely related to data mining and often 
uses techniques from statistics, probability theory, pattern recognition, and a host of other areas. 
Although machine learning is not a new field, it is definitely growing. Many large companies like Google, Amazon, Yahoo!, and Facebook, have implemented machine-learning algorithms in their applications. 
Many more companies would benefit from leveraging machine learning in their applications to learn from users and past situations.
Mahout support broadly three types of Machine Learning Algorithms:

#####Collaborative filtering

#####Clustering

#####Categorization

