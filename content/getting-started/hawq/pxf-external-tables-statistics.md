---
title: PXF External Tables Statistics
---

Overview 
--------

Analyze command ensures that the query planner has up-to-date statistics about the table. With no statistics or obsolete statistics the planner may make poor decisions during query planning, leading to poor performance on any tables with inaccurate or nonexistant statistics.

In this exercise, we will `analyze` command to illustrate Statistics on External Tables.

1. Create a dummy text file for the exercise (containing 1.0E+07 rows)

	<pre class="terminal">
	$ seq 1 10000000 > /tmp/demo.txt
	</pre>

2. Load this text file into hdfs

	<pre class="terminal">
	$ hadoop fs -put /tmp/demo.txt /
	</pre>
3. Create pxf external table to point to this text file (edit the namenode info accordingly)
	
	<pre class="terminal">
	demo# drop external table demo;
	demo# CREATE EXTERNAL TABLE demo (val INT)
	LOCATION ('pxf://pivhdsne:50070/demo.txt?
        FRAGMENTER=HdfsDataFragmenter&Analyzer=HdfsAnalyzer&Accessor=TextFileAccessor&Resolver=TextResolver') 
        FORMAT 'TEXT' (DELIMITER = '|');
	</pre>

4. Look at the stats prior to analyze (default stats before collecting stats)

	<pre class="terminal">	
	demo=#select relpages,reltuples from pg_class where relname='demo';
	relpages | reltuples
	----------+-----------
	1000 |     1e+06
	(1 row)
	Time: 4.578 ms
	</pre>
	
	<pre class="terminal">
	demo=#select val from demo where val=59999;
	val 
	-------
	59999
	(1 row)

	Time: 6985.484 ms
	</pre>

5. Run analyze on the pxf table to gather statistics
	
	<pre class="terminal">
	demo=#analyze demo;
	ANALYZE
	Time: 689.777 ms
	</pre>

6. Look at the stats after running analyze
	
	<pre class="terminal">
	demo=#select relpages,reltuples from pg_class where relname='demo';
	relpages | reltuples
	----------+-----------
	4096 |     1e+07
	(1 row)

	Time: 1.450 ms
	</pre>

	<pre class="terminal">
	demo=#select val from demo where val = 59999;
	val 
	-------
	59999
	(1 row)
	</pre>

7. Drop this external table
	
	<pre class="terminal">
	demo# drop external table demo;
	</pre>


###Conclusion
With analyze command, the query planner has the statistics to use in query planning. If a table has significantly updated the data, use analyze command to update the statistics on the table using `analyze` command for better query performance.

Notes: 
By default, pxf assumes that there are 1 million rows in the data source. By
analyzing the table, we are giving the hawq engine better statistics about
source data which will help the optimizer to come with optimal query execution
plans (decisions related to redistribute vs broadcast, hash agg vs group agg,
merge join vs hash join vs nested loop etc.)
