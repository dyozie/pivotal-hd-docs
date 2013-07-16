---
title: PXF External Tables predicate push-down -HBase
---

Overview 
--------

The parameter `pxf_enable_filter_pushdown` when set, passes the predicates to the `RecordReader/InputFormat` improving the performance of the HAWQ queries.

In this exercise we will showcase PXF predicate push-down feature.
We will use `pxf_enable_filter_pushdown` statement.

##Pre-Requsities ##
* We reuse the table created in the [PXF External Tables](/getting-started/hawq/pxf-hbase-external-tables.html) lab. Ensure to complete [PXF External Tables](/getting-started/hawq/pxf-hbase-external-tables.html) Lab before proceding further.
* Make sure that HBase is running, if not start HBase using

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
	Format options: formatter 'pxfwritable_import' 
	External location: pxf://pivhdsne:50070/customers_dim?FRAGMENTER=HBaseDataFragmenter&Accessor=HBaseAccessor&Resolver=HBaseResolver
	</pre>

3. Set the pxf_enable_filter_pushdown variable value to `off` if not set

	<pre class="terminal">
    demo=#show pxf_enable_filter_pushdown;
	pxf_enable_filter_pushdown
	-----------------------------
 	off
	(1 row)
	
	demo=#set pxf_enable_filter_pushdown=off;
	</pre>

4. Issue a query with the parameter `pxf_enable_filter_pushdown` set to `off`. Notice the time take for the query.

	<pre class="terminal">
	demo=#select "cf1:customer_id","cf1:city" from retail_demo.customer_addresses_dim_hbase where "cf1:customer_id" = 41556895;
	cf1:customer_id |  cf1:city 
	-----------------+------------
		41556895 | CAMP VERDE
		41556895 | LAONA
	(2 rows)

	Time: 278099.006 ms
	</pre>

7. Set `gpxf_enable_filter_pushdown` to `on`

	<pre class="terminal">
	demo=#set pxf_enable_filter_pushdown=on;
	</pre>

8. Issue the same query and notice the time taken for query

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
   The parameter `pxf_enable_filter_pushdown` increases the performance of the HAWQ queries by many fold.

