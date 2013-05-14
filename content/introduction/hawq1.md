---
title: HAWQ
---

Pivotal Advanced Database Services (ADS) powered by HAWQ, extends Pivotal Hadoop (HD) Enterprise, adding rich, proven parallel SQL processing facilities. These render Hadoop queries faster than any Hadoop-based query interface on the market today, enhancing productivity. Pivotal ADS enables SQL analysis of data in a variety of Hadoop-based data formats using the Greenplum Extension Framework (GPXF), without duplicating or converting HBase files. Alternatively, an optimized format is available for Pivotal ADS table storage for best performance.

##About HAWQ 1.0
HAWQ is a parallel SQL query engine that combines the key technological advantages of the industry-leading Greenplum Database with the scalability and convenience of Hadoop. HAWQ reads data from and writes data to HDFS natively.
Using HAWQ functionality, you can interact with petabyte range data sets. HAWQ provides users with a complete, standards compliant SQL interface.
Leveraging Greenplum Database’s parallel database technology, HAWQ consistently performs tens to hundreds of times faster than all Hadoop query engines in the market.

##About GPXF
GPXF enables SQL querying on data in the Hadoop components such as HBase, Hive, and any other distributed data file types. These queries execute in a single, zero materialization and fully-parallel workflow. GPXF also uses the HAWQ advanced query optimizer and executor to run analytics on these external data sources, or transfers it to HAWQ to analyze locally. The GPXF connects Hadoop-based components to facilitate data joins, such as between HAWQ tables and HBase table. Additionally, the framework is designed for extensibility, so that user-defined connectors can provide parallel access to other data storage mechanisms and file types.

###GPXF Interoperability
GPXF operates as an integral part of HAWQ, and as a light add-on to Pivotal HD. On the database side, GPXF leverages the external table custom protocol system. Therefore, creating a GPXF table provides the same interoperability as an external table in Greenplum Database. On the Pivotal HD side, the GPXF component physically lives on the Namenode and each or some Datanodes. It operates mostly as a separate service and does not interfere with Hadoop components internals.
