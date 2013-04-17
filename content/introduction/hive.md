---
title: Hive
---

Overview
--------
Hive is a data warehouse system for Hadoop that facilitates easy data summarization,
ad-hoc queries, and the analysis of large datasets stored in Hadoop compatible file systems.
Hive is initially developed by Facebook, Hive is now part of Apache.
The paper describes how Hive can be used to build a PetaByte Scale warehouse using Hive
[hive-icde2010.pdf](http://infolab.stanford.edu/~ragho/hive-icde2010.pdf)


About Hive
----------

An overview of Hive is shown below:

![Hive](/images/hive1.jpg)

**FIG. 1 Hive Overview**

Hive provides a mechanism to project structure onto this data and query the data using a SQL-like language called HiveQL. At the same time this language also allows traditional map/reduce programmers to plug in their custom mappers and
reducers when it is inconvenient or inefficient to express this logic in HiveQL.

With Hive, one can create tables that can be queries using SQL. Hive support DDL and DML queries like, create table, alter table, joins, select as, filters, group by and multi table inserts.
The data for the tables is stored in HDFS and the meta data for the tables is stored.
in Database. Hive ships with Embedded database and can be configured with MySQL for production use.


