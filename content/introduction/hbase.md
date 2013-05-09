---
title: HBase
---

Overview
--------
HBase is a key/value store. Specifically it is a Sparse, Consistent, Distributed, Multidimensional, Sorted map.
HBase maintains maps of Keys to Values (key -> value). Each of these mappings is called a "KeyValue" or a "Cell". You can find a value by its key.


About HBase
----------

An overview of HBase is shown below:

![HBase](/images/hbase2.jpeg)

**FIG. 1 HBase Overview**


![HBase](/images/hbase3.jpeg)

**FIG. 2 HBase Table**


These cells are sorted by the row key. This is a very important property as it allows for searching ("give me all values for which the key is between X and Y"), rather than just retrieving a value for a known key.
The key itself has structure. Each key consists of the following parts:
row-key, column family, column, and time-stamp.



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


iAccessing a particular cell value is through the mapping as shown below:
(rowkey, column family, column, timestamp) -> value

rowkey and value are just bytes (column family needs to be printable), so you can store anything that you can serialize into a byte[] into a cell.

HBase detail
-----------
An over view of HBase architecture is shown below:

![Hive](/images/hbase1.png)

**FIG. 2 HBase Architecture overview**

