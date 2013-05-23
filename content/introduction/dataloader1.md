---
title: DataLoader
---

Greenplum DataLoader is an advanced Big Data ingesting tool. It focuses on loading Big Data into data analytics platforms. It is an enterprise solution for staged, batch data-loading for offline data analytics as well as realtime data streaming for online incremental data analytics. It also allows easy migration of data between large data cluster deployments.
It features loading batch data onto large data warehouse or analytics platforms for offline analysis. It deploys code, partitions data into chunks, splits jobs into multiple tasks and schedules the tasks, taking into account data locality and network topology, and handles job failures.
Greenplum HD DataLoader can dynamically scale the execution of data loading tasks to maximize the system resource. With single node deployment, it linearly scales out on disk numbers up to the maximum machine bandwidth. With multi-node cluster deployment, it linearly scales out on machine numbers up to the maximum network bandwidth. This horizontal scalability promises optimized, and best possible throughput.

![Greenplum DataLoader](/images/dataloader1.png)

Staged, batch data loading is useful when throughput, linear scalability, and resource efficiency are priorities. In batch mode, Greenplum HD DataLoader can efficiently load large volumes of data.

Real time data streaming is useful in cases where latency, reliability, availability and connectivity are desired. Greenplum DataLoader can load large numbers of data feeds in real time, with linear scalability support.
DataLoader \partitions data into chunks when needed, splits jobs into multiple tasks, schedules the tasks, and handles job failures. Accounting for data locality and network topology is taken into account.
DataLoader provides an easy-to-use interface to:

* Explore source data and configure it as a data source
* Define, configure, and manage data sources and data feeds, as well as destinations
* Manage jobs and data streams from the user interface GUI or command line
* Monitor job progress
* Define job spec and data loading pipeline via the GUI interface

Scripts and commands in this manual may use the term “bulkloader.” This is a software synonym for the DataLoader.

