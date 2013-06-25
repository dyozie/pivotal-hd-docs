---
title: GPXF External Tables predicate push-down -HBase
---

Overview 
--------

The parameter `gpxf_enable_filter_pushdown` when set, passes the predicates to the `RecordReader/InputFormat` improving the performance of the HAWQ queries.

In this exercise we will showcase GPXF predicate push-down feature.
We will use `gpxf_enable_filter_pushdown` statement .

##Pre-Requsities ##
* We reuse the table created in the [GPXF External Tables](/getting-started/hawq/gpxf-hbase-external-tables.html). Hence complete this Lab before proceding further, if you have not already done.
* Make sure that HBase is running,if not start HBase using

	<pre class="terminal">
	sudo /etc/init.d/hbase-master start
	sudo /etc/init.d/hbase-regionserver start
	</pre>
##Create GPXF External Tables with HDFS Fragmenter

1. Login to `psql` and use retail_demo schema

	<pre class="terminal">
	psql -l 8432
	show databases;
	use retail_demo;
	</pre>

2. Describe retail_demo schema 

	<pre class="terminal">
	\d retail_demo.*
	</pre>
4. Describe retail_demo.customers_dim_hbase

	<pre class="terminal">
	demo=#\d retail_demo.customers_dim_hbase;
	External table "retail_demo.customers_dim_hbase"
     	Column     |     Type     | Modifiers 
	----------------+--------------+-----------
 	recordkey      | integer      | 
 	cf1:first_name | text         | 
 	cf1:last_name  | text         | 
 	cf1:gender     | character(1) | 
	Type: readable
	Encoding: UTF8
	Format type: custom
	Format options: formatter 'gpxfwritable_import' 
	External location: gpxf://pivhdsne:50070/customers_dim?FRAGMENTER=HBaseDataFragmenter
	</pre>


        Describe view....
5. Set the gpxf_enable_filter_pushdown variable value to off if not set

	<pre class="terminal">
        psql
	show gpxf_enable_filter_pushdown;
	gpxf_enable_filter_pushdown
	-----------------------------
 	off
	(1 row)
	</pre>

        If not set, set the parameter `gpxf_enable_filter_pushdown` to off

	<pre class="terminal">
	demo=#set gpxf_enable_filter_pushdown=off;
	</pre>

6. Issue a query with the paramter `gpxf_enable_filter_pushdown` set to off. Notice the time take for the query.

	<pre class="terminal">
	demo=#  select  * from retail_demo.customers_dim_hbase where id="10005";
 	count  
	--------
	401430
	(1 row)
	
	Time: 172998.782 ms
	</pre>

7. Set gpxf_enable_filter_pushdown to on 

	<pre class="terminal">
	demo=#set gpxf_enable_filter_pushdown=on;
	</pre>

8. Issue a the same query  and notice the time taken for query

	<pre class="terminal">
	demo=#  select  * from retail_demo.customers_dim_hbase where id="10005";
	count  
	--------
	(1 row)

	Time: 1979.671 ms
	</pre>

9. Conclusion
   The parameter `gpxf_enable_filter_pushdown` increases the performance of the HAWQ queries by many fold.

