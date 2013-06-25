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

1. Describe retail_demo schema 

	<pre class="terminal">
	demo=#\d retail_demo.*
	</pre>
2. Describe retail_demo.customers_dim_hbase

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

3. Set the gpxf_enable_filter_pushdown variable value to off if not set

	<pre class="terminal">
    demo=#show gpxf_enable_filter_pushdown;
	gpxf_enable_filter_pushdown
	-----------------------------
 	off
	(1 row)
	
	demo=#set gpxf_enable_filter_pushdown=off;
	</pre>

4. Issue a query with the parameter `gpxf_enable_filter_pushdown` set to off. Notice the time take for the query.

	<pre class="terminal">
	demo=#select "cf1:customer_id","cf1:city" from retail_demo.customer_addresses_dim_hbase where "cf1:customer_id" = 41556895;
	cf1:customer_id |  cf1:city 
	-----------------+------------
		41556895 | CAMP VERDE
		41556895 | LAONA
	(2 rows)

	Time: 278099.006 ms
	</pre>

7. Set gpxf_enable_filter_pushdown to on 

	<pre class="terminal">
	demo=#set gpxf_enable_filter_pushdown=on;
	</pre>

8. Issue a the same query  and notice the time taken for query

	<pre class="terminal">
	demo=#select "cf1:customer_id","cf1:city" from retail_demo.customer_addresses_dim_hbase where "cf1:customer_id" = 41556895;
	cf1:customer_id |  cf1:city 
	-----------------+------------
		41556895 | CAMP VERDE
		41556895 | LAONA
	(2 rows)

	Time: 10438.065 ms
	</pre>

9. Conclusion
   The parameter `gpxf_enable_filter_pushdown` increases the performance of the HAWQ queries by many fold.

