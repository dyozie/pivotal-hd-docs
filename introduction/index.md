*Greenplum Online*
##Pivotal HD  

Pivotal HD <sup>TM </sup> is integration of Greenplum database technology with  Apache Hadoop framework - the open source Big Data platform. It provides true SQL query interface. Pivotal HD <sup>TM </sup> creates an environment for improved data management and greater elasticity in terms of the storage, computation and analytics. It brings in  true SQL- capable front end with database-like latency to Hadoop. It combines the SQL-compliant ___HAWQ___ database engine (derived from Greenplum's data-warehousing engine) and the Hadoop components (___HDFS___ filesystem and the ___MapReduce___ core) to expand the capability of the hadoop ecosystem for more complex analytics using traditional database .   

  
###Big data and Predictive Analytics 

Big Data is a collection of data sets that are so large and complex that they become awkward to work with using traditional database management tools. The volume of Big Data created challenges for capture, storage, search, sharing, analysis, and visualization. Examples of big data sources include web logs, RFID and sensor data, social networks, Internet search indexing, call detail records, military surveillance, and complex data in astronomic, bio/geo chemical, genomics, and atmospheric sciences.   

Faster CPUs, cheaper memory, and massive parallel processing architectures-and new technologies such as Hadoop make it feasible to collect, analyze, and mine massive amounts of structured and unstructured data.    

Predictive analytics is an area of statistical analysis that deals with extracting information from data and using it to predict trends and behavior patterns. In business, predictive models exploit patterns found in historical and transactional data to identify risks and opportunities. Models capture relationships among many factors to allow assessment of risk or potential associated with a particular set of conditions. 

Traditional analytics environments are complex programming environments separated from the sources of data, Extracting data from the source database platform with traditional analytics programs is slow and complex. With the advent of Big Data, Enterprises require an analytics ecosystem that is architecturally capable of near - real time processing of predictive models , a platform capable of delivering accurate, actionable, and timely predictive insight - no matter the size or the location of the data. 

Organizations are finding new ways to use data that was previously believed to be of little value, or far too expensive to retain, to better serve their constituents. Sourcing and storing data is one half of the equation. Processing that data to produce information is fundamental to the daily operations of every modern business.This forms the other part. 

Exploring Big Data and using predictive analytics is within reach of more organizations if only the workforce adapts to the new architecture and system. Pivotal HD is the platform that unleashes the power of BigData processing and analytics to the hands of traditionally available SQL workforces in the organization and the market.

###Hadoop 
  
Apache Hadoop is an open-source software framework that supports data-intensive distributed applications.  
Hadoop provides a scalable infrastructure for building batch data processing systems for enormous amounts of data. Hadoop is made up of a    distributed file system called the ___Hadoop Distributed File system___ (HDFS) and a computation layer called ___MapReduce___.     
  
_The principle_  
  
Hadoop uses a cluster of commodity servers with no specialized  hardware or network infrastructure to form a single, logical, storage and compute platform - *cluster*, that can be shared by multiple individuals or groups. The application is divided into many small fragments of work, each of which is executed or re-executed on any node in the cluster. Computation in  Hadoop MapReduce is performed automatically & in parallel, without the need for external synchronization. Hadoop runs the user-provided  processing logic on the machine where the data lives rather than dragging the data  across the network and so vastly improves performance. Hadoop is tolerant to hardware and software failures.
The Apache Hadoop platform consists of the ___Hadoop kernel___, ___MapReduce___ and ___Hadoop Distributed File System___ (HDFS), as well as a number of related projects  including Apache Hive, Apache HBase, and others.  
  
Google published 2 papers that inspired Hadoop development - ***The Google File System*** scalable, distributed file system optimized for storing enormous datasets, GFS could also support large-scale, data-intensive, distributed processing applications & ***MapReduce: Simplified Data Processing on Large Clusters*** -  A programming model and accompanying framework that provided automatic parallelization, fault tolerance, and the scale to process hundreds of terabytes of data in a single job over thousands of machines. When paired, these two systems could be used to build large data processing clusters on relatively inexpensive, commodity machines. These papers directly inspired the development of HDFS and Hadoop MapReduce

###Hadoop 2.0  

Hadoop 1.0 is all about HDFS and MapReduce. Hadoop 2.0 is about HDFS with Federation and generic framework that can be used writing multiple applications. MapReduce is one such applications.Other applications that could potentially come in future or realtime data analysis frameworks, MPI etc. Hadoop 2.0 overcomes the limitations of Hadoop version 1.0 by prviding better resource utilization, support for alternative programming paradigms such as MPI and Graph processing and improvment in the wire protocols for cluster comaptibility.  

Hadoop 2.0 is orgnaized into the following components:   
**Hadoop Distributed File System** : A distributed file system, with federation
**Hadoop YARN**: A framework for scheduling jobs and resource management across the cluster
**Hadoop MapReduce**: MapReduce on YARN for processing of large data sets parallely
**Hadoop Common**: Common utilities across modules

####Hadoop 2.0 Architecture   
    
A detailed view of YARN architecture is available at 
[apache docs](http://hadoop.apache.org/docs/r2.0.3-alpha/hadoop-yarn/hadoop-yarn-site/YARN.html "http://hadoop.apache.org/docs/r2.0.3-alpha/hadoop-yarn/hadoop-yarn-site/YARN.html")  
  
[img](/home/qvantel/Desktop/gpoc/gpoc_intro/yarn_architecture.gif)

At a high level, Hadoop provides the storage and computing fabric scalable to thousands of Nodes without a single point of failure.
At the core of the design is the **Resource management** and **Application Life Cycle Management**, which has the following arcitectural compoents.

__Resource manager__:  
Global resource scheduler, and supports pluggable scheuduing with hierarchical queues. 

__Master of Application Masters__:   
This is part of the Resource Manager (no separate process), manages and monitors the Application masters on every node manager.    

__Node Manager__:    
Per Machine agent, manages the life cyle of the container, and monitors the resources.    

__Application master__:    
ApplicationMaster is framework specific library and is tasked with negotiating resources from the Resource Manager and working with the      NodeManager(s) to execute and monitor the tasks. Application master is bundled along with the Node Manager.     
  
__Hadoop File System__:    
Similar to Hadoop Version 1.0 (0.20*), the NameNode and DataNode forms the storage part of the fabric.    
  
__Container__:     
The basic unit of allocation is now container, instead of a Map or a Reduce task in Hadoop 1.0. The container for example could be defined as   one with 2GB RAM, 2 CPU etc.   
This granualirty allows the resource management to be efficient and helps meet multiple processing requirements.      
YARN allows applications to launch any process and, unlike existing Hadoop MapReduce in hadoop-1.x (aka MR1), it is not limited to Java applications alone.   
  
###Hadoop File System  
  
Hadoop uses commonly available servers in a very large cluster, where each server has a set of inexpensive internal disk drives.    
Within Hadoop, the data is divided into blocks, and copies of these blocks are stored on other servers in the Hadoop cluster. With this   
kind of architecture Hadoop can scale to thousands of machines, providing built-in fault tolerance and fault compensation capabilities.   
The replication factor provides the fault tolerance for the data and helps increase the performance using Data locality. The map and reduce   functions are executed on smaller subsets of your larger data sets, and this provides the scalability that is needed for big data processing.  

###Hive

Hive is a data warehouse system for Hadoop that facilitates easy data summarization,ad-hoc queries, and the analysis of large datasets stored in Hadoop compatible file systems.Hive is initially developed by Facebook, Hive is now part of Apache. This paper describes how Hive can be used to build a PetaByte Scale warehouse using Hive : [hive-icde2010.pdf](http://infolab.stanford.edu/~ragho/hive-icde2010.pdf "http://infolab.stanford.edu/~ragho/hive-icde2010.pdf")  
Hive provides a mechanism to project structure onto this data and query the data using a SQL-like language called HiveQL. 
At the same time this language also allows traditional map/reduce programmers to plug in their custom mappers and reducers when it is inconvenient or inefficient to express this logic in HiveQL. With Hive,  one can create tables that can be queried using SQL. Hive supports DDL and DML queries like _create table_, _alter table_, _joins_, _select as_, _filters_, _group by_ and _multi table inserts_.  
The data for the tables is stored in HDFS and the meta data for the tables is stored in Database. Hive ships with Embedded database and can be configured with MySQL for production use.

###Pig

Pig is a DataFlow Language, initially developed at Yahooo! to allow users using Hadoop to focus on 
analyzing largedata sets, and spend less time having to write mapper and reducer programs. 
Pig is made up of two components: the first is the language itself, which is called PigLatin
and the second is a runtime environment where PigLatin programs are executed. 
Like actual pigs, who eat almost anything, the Pig programming language is designed to handle any kind of dataÑhence the name!
 
###ZooKeeper

ZooKeeper maintains common objects needed in large clusters environments. Some of the examples of objects are
configuration information, hierarchical naming space, and so on.  
An application can create a state in what is called as ***znode*** within Zookeeper. The znode can be updated by
any node in the cluster and any node in the cluster can register to be informed of changes to that znode.
Infrastructure applications can synchronize their tasks across the distributed cluster by updating their status in a ZooKeeper znode,  
which would then inform the rest of the cluster of a specific nodeÕs status change. This cluster-wide status centralization 
service is essential for management and serialization tasks across a large distributed set of servers. Applications can leverage these  
services to coordinate distributed processing across large clusters.    

###Apache Mahout

___Machine learning___ (ML) is a subfield of artificial intelligence concerned with techniques that allow computers to improve their outputs based on previous experiences.. The field is closely related to data mining and often uses techniques from statistics, probability theory, pattern recognition and a host of other areas. Although machine learning is not a new field, it is definitely growing. Many large companies like Google, Amazon, Yahoo!, and Facebook have implemented machine-learning algorithms in their applications. 
Many more companies would benefit from leveraging machine learning in their applications to learn from users and past situations.  

Mahout supports broady three types of ML:    
**Collaborative filtering**        
**Clustering**      
**Categorization**     
There are others being added over time.   


 
