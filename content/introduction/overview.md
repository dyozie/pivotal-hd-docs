---
title: Introduction to Pivotal HD
---

Overview
-------
The new era of business intelligence is here with Big data. Big data is being generated continuosly from various different sources. The examples of big data sources include Web logs, RFID and sensor data, social networks, Internet search indexing, call detail records, military surveillance, and complex data in astronomic, bio/geo chemical, genomics, and atmospheric sciences. The volume of Big Data is creating challenges in capturing, storing, searching, sharing, analysis, and visualization of the data.

About Pivotal HD
----------------

Pivotal HD ™ is an Apache Hadoop distribution that natively integrates the industry-leading EMC Greenplum massively parallel processing (MPP) database technology with the Apache Hadoop framework.

Hadoop Virtualization Extensions (HVE) included in Pivotal HD Enterprise leverage VMware technology simplifies the deployment and management of Hadoop.
Pivotal HD Enterprise comes with the flexibility of on-premises deployment, on a wide range of available hardware. Pivotal HD comes with easy-to-deploy preconfigured Greenplum Data Computing Appliances.

###About Hadoop

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
There are multiple releases of Hadoop available. It is some times confusing which one to use.
Apache Hadoop 1.0.0(0.20->eventually became 1.0.0) should be the choice for using Hadoop V1. Hadoop version 2.0(0.23 eventually became 2.x) is in alpha and will take some time before it becomes available.

Hadoop 2.x maintains API compatibility with previous stable release (hadoop-0.20.205). This means that all Map-Reduce jobs should still run unchanged on top of MRv2 with just a recompile.


