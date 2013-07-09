---
title: HAWQ -- GPXF External Tables - HBase
---

Overview 
--------

In this exercise we will create GPXF External tables.
We will use `HBaseDataFragmenter` while specifying the `LOCATION` in the HAWQ create statement.


##Create GPXF External Tables with HBase Fragmenter

Execute the following `create table` commands to create the tables in HAWQ. You can also execute the script [create_gpxf_hbase_tables.sql](https://github.com/PivotalHD/pivotal-samples/tree/master/hawq/gpxf_hbase_tables/create_gpxf_hbase_tables.sql)

1. Create <code>retail_demo</code> Schema if it is not already created

	<pre class="terminal">
	CREATE SCHEMA retail_demo;
	</pre>

2. Create table `retail_demo.categories_dim_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.categories_dim_hbase
	(
	    --category_id integer,
	    recordkey integer,
	    "cf1:category_name" character(400)
	)
	LOCATION ('gpxf://pivhdsne:50070/categories_dim?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
	</pre>
	
3. Create table `retail_demo.customers_dim_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.customers_dim_hbase
	(
	    -- customer_id integer,
	    recordkey integer,
	    "cf1:first_name" TEXT,
	    "cf1:last_name" TEXT,
	    "cf1:gender" character(1)
	)
	LOCATION ('gpxf://pivhdsne:50070/customers_dim?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
		</pre>
		
4. Create table `retail_demo.order_lineitems_hbase`

	<pre class="terminal">
	CREATE  EXTERNAL TABLE retail_demo.order_lineitems_hbase
	(
	    recordkey integer,
	    "cf1:order_id" TEXT,
	    "cf1:order_item_id" TEXT,
	    "cf1:product_id" TEXT,
	    "cf1:product_name" TEXT,
	    "cf1:customer_id" TEXT,
	    "cf1:store_id" TEXT,
	    "cf1:item_shipment_status_code" TEXT,
	    "cf1:order_datetime" TEXT,
	    "cf1:ship_datetime" TEXT,
	    "cf1:item_return_datetime" TEXT,
	    "cf1:item_refund_datetime" TEXT,
	    "cf1:product_category_id" TEXT,
	    "cf1:product_category_name" TEXT,
	    "cf1:payment_method_code" TEXT,
	    "cf1:tax_amount" TEXT,
	    "cf1:item_quantity" TEXT,
	    "cf1:item_price" TEXT,
	    "cf1:discount_amount" TEXT,
	    "cf1:coupon_code" TEXT,
	    "cf1:coupon_amount" TEXT,
	    "cf1:ship_address_line1" TEXT,
	    "cf1:ship_address_line2" TEXT,
	    "cf1:ship_address_line3" TEXT,
	    "cf1:ship_address_city" TEXT,
	    "cf1:ship_address_state" TEXT,
	    "cf1:ship_address_postal_code" TEXT,
	    "cf1:ship_address_country" TEXT,
	    "cf1:ship_phone_number" TEXT,
	    "cf1:ship_customer_name" TEXT,
	    "cf1:ship_customer_email_address" TEXT,
	    "cf1:ordering_session_id" TEXT,
	    "cf1:website_url" TEXT
	)
	LOCATION ('gpxf://pivhdsne:50070/order_lineitems?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
	
	</pre>
	
5. Create table `retail_demo.orders_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.orders_hbase
	(
	    --order_id TEXT,
	    recordkey integer,
	    "cf1:customer_id" TEXT,
	    "cf1:store_id" TEXT,
	    "cf1:order_datetime" TEXT,
	    "cf1:ship_completion_datetime" TEXT,
	    "cf1:return_datetime" TEXT,
	    "cf1:refund_datetime" TEXT,
	    "cf1:payment_method_code" TEXT,
	    "cf1:total_tax_amount" TEXT,
	    "cf1:total_paid_amount" TEXT,
	    "cf1:total_item_quantity" TEXT,
	    "cf1:total_discount_amount" TEXT,
	    "cf1:coupon_code" TEXT,
	    "cf1:coupon_amount" TEXT,
	    "cf1:order_canceled_flag" TEXT,
	    "cf1:has_returned_items_flag" TEXT,
	    "cf1:has_refunded_items_flag" TEXT,
	    "cf1:fraud_code" TEXT,
	    "cf1:fraud_resolution_code" TEXT,
	    "cf1:billing_address_line1" TEXT,
	    "cf1:billing_address_line2" TEXT,
	    "cf1:billing_address_city" TEXT,
	    "cf1:billing_address_state" TEXT,
	    "cf1:billing_address_postal_code" TEXT,
	    "cf1:billing_address_country" TEXT,
	    "cf1:billing_phone_number" TEXT,
	    "cf1:customer_name" TEXT,
	    "cf1:customer_email_address" TEXT,
	    "cf1:ordering_session_id" TEXT,
	    "cf1:website_url" TEXT
	)
	LOCATION ('gpxf://pivhdsne:50070/orders?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
		</pre>
	
6. Create table `retail_demo.customer_addresses_dim_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.customer_addresses_dim_hbase
	(
	    recordkey integer,
	    "cf1:customer_id" integer,
	    -- "cf1:valid_from_timestamp" timestamp without time zone,
	    "cf1:valid_from_timestamp" TEXT,
	    -- "cf1:valid_to_timestamp" timestamp without time zone,
	    "cf1:valid_to_timestamp" TEXT,
	    "cf1:house_number" TEXT,
	    "cf1:street_name" TEXT,
	    "cf1:appt_suite_no" TEXT,
	    "cf1:city" TEXT,
	    "cf1:state_code" TEXT,
	    "cf1:zip_code" TEXT,
	    "cf1:zip_plus_four" TEXT,
	    "cf1:country" TEXT,
	    "cf1:phone_number" TEXT
	)
	LOCATION ('gpxf://pivhdsne:50070/customer_addresses_dim?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
		</pre>
		
7. Create table `retail_demo.date_dim_hbase`

    <pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.date_dim_hbase
	(
	    recordkey integer,
	    "cf1:calendar_day" TEXT,
	    "cf1:reporting_year" integer,
	    "cf1:reporting_quarter" integer,
	    "cf1:reporting_month" integer,
	    "cf1:reporting_week" integer,
	    "cf1:reporting_dow" integer
	)
	LOCATION ('gpxf://pivhdsne:50070/date_dim?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
	    </pre>


8. Create table `retail_demo.email_addresses_dim_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.email_addresses_dim_gpxf
	(
	    customer_id TEXT,
	    email_address TEXT
	)
	LOCATION ('gpxf://pivhdsne:50070/retail_demo/email_addresses_dim/email_addresses_dim.tsv.gz?Fragmenter=HdfsDataFragmenter')
	FORMAT 'TEXT' (DELIMITER = E'\t');	</pre>
		
9. Create table `retail_demo.payment_methods_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.payment_methods_gpxf
	(
	    payment_method_id smallint,
	    payment_method_code character varying(20)
	)
	LOCATION ('gpxf://pivhdsne:50070/retail_demo/payment_methods/payment_methods.tsv.gz?Fragmenter=HdfsDataFragmenter')
	FORMAT 'TEXT' (DELIMITER = E'\t');	</pre>
		
10. Create table `retail_demo.products_dim_hbase`

	<pre class="terminal">
	CREATE EXTERNAL TABLE retail_demo.products_dim_hbase
	(
	    -- product_id integer,
	    recordkey integer,
	    "cf1:category_id" integer,
	    -- "cf1:price" numeric(15,2),
	    "cf1:price" TEXT,
	    "cf1:product_name" TEXT
	)
	LOCATION ('gpxf://pivhdsne:50070/products_dim?FRAGMENTER=HBaseDataFragmenter')
	FORMAT 'CUSTOM' (formatter='gpxfwritable_import');
      </pre>

##Verifying Table Creation

Execute the following command on HAWQ shell to verify all the `EXTERNAL`  HBase tables have been created

```bash
demo=# \dx retail_demo.*hbase
                            List of relations
   Schema    |             Name             | Type  |  Owner  | Storage  
-------------+------------------------------+-------+---------+----------
 retail_demo | categories_dim_hbase         | table | gpadmin | external
 retail_demo | customer_addresses_dim_hbase | table | gpadmin | external
 retail_demo | customers_dim_hbase          | table | gpadmin | external
 retail_demo | date_dim_hbase               | table | gpadmin | external
 retail_demo | email_addresses_dim_hbase    | table | gpadmin | external
 retail_demo | order_lineitems_hbase        | table | gpadmin | external
 retail_demo | orders_hbase                 | table | gpadmin | external
 retail_demo | payment_methods_hbase        | table | gpadmin | external
 retail_demo | products_dim_hbase           | table | gpadmin | external
(9 rows)
```

##Create tables in HBase ##

Execute the  Perl Script [create_hbase_tables.pl](https://github.com/PivotalHD/pivotal-samples/tree/master/hawq/gpxf_hbase_tables/create_hbase_tables.pl) to create corresponding tables in HBase. 

The script does the following

*  Runs a foreach loop on `%tables` array
*  For each element `$table` in `%tables`
   * Opens HBase shell
   * Executes `create $table` command 
   * Closes HBase shell

```bash
#!/usr/bin/env perl
my %tables = (
 "customers_dim",       
 "categories_dim",        
 "customer_addresses_dim",
 "email_addresses_dim",
 "order_lineitems",
 "orders",
 "payment_methods",
 "products_dim"
 );
foreach my $table (%tables){
  print "$table\n";
  print "Creating HBase table '$table' ...\n";
  open HBASE, "| hbase shell" or die $!;
  print HBASE "create '$table', 'cf1'\n";
  close HBASE;
}
```

##Load Data into HBase ##

###Using importtsv Utility ###

You will use `ImportTsv` utility shipped with HBase to bulk import `.tsv.gz` data into HBase. The command is give in the format `hadoop jar /path/to/hbase-VERSION.jar importtsv`

Execute the following commands

<ol>
	<li>
       <p>Import Data into `products_dim` HBase table</p>
	<pre class="terminal">hadoop jar /usr/lib/gphd/hbase/hbase-0.94.2-gphd-2.0.1.0-SNAPSHOT.jar importtsv -libjars /usr/lib/gphd/hbase/lib/guava-11.0.2.jar \
             - Dimporttsv.columns=HBASE_ROW_KEY,cf1:category_id,cf1:price,cf1:product_name products_dim /retail_demo/products_dim
	</pre>
	</li>
       <li>
       <p>Import Data into `email_addresses_dim` HBase table</p>
	<pre class="terminal">hadoop jar /usr/lib/gphd/hbase/hbase-0.94.2-gphd-2.0.1.0-SNAPSHOT.jar importtsv -libjars /usr/lib/gphd/hbase/lib/guava-11.0.2.jar \
            -Dimporttsv.columns=HBASE_ROW_KEY,cf1:email_address email_addresses_dim /retail_demo/email_addresses_dim
	</pre>
	</li>
       <li>
       <p>Import Data into `customer_addresses_dim` HBase table</p>
	<pre class="terminal">hadoop jar /usr/lib/gphd/hbase/hbase-0.94.2-gphd-2.0.1.0-SNAPSHOT.jar importtsv -libjars /usr/lib/gphd/hbase/lib/guava-11.0.2.jar \
-Dimporttsv.columns=HBASE_ROW_KEY,cf1:customer_id,cf1:valid_from_timestamp,cf1:valid_to_timestamp,cf1:house_number,cf1:street_name,cf1:appt_suite_no,cf1:city,cf1:state_code,cf1:zip_code,cf1:zip_plus_four,cf1:country,cf1:phone_number customer_addresses_dim /retail_demo/customer_addresses_dim
	</pre>
	</li>
        <li>
       <p>Import Data into `customer_addresses_dim` HBase table</p>
	<pre class="terminal">hadoop jar /usr/lib/gphd/hbase/hbase-0.94.2-gphd-2.0.1.0-SNAPSHOT.jar importtsv -libjars /usr/lib/gphd/hbase/lib/guava-11.0.2.jar -Dimporttsv.columns=HBASE_ROW_KEY,cf1:first_name,cf1:last_name,cf1:gender customers_dim /retail_demo/customers_dim
	</pre>
	</li>

       <li>
       <p>Import Data into `orders` HBase table</p>
	<pre class="terminal">
hadoop jar /usr/lib/gphd/hbase/hbase-0.94.2-gphd-2.0.1.0-SNAPSHOT.jar importtsv -libjars /usr/lib/gphd/hbase/lib/guava-11.0.2.jar -Dimporttsv.columns=HBASE_ROW_KEY,cf1:customer_id,cf1:store_id,cf1:order_datetime,cf1:ship_completion_datetime,cf1:return_datetime,cf1:refund_datetime,cf1:payment_method_code,cf1:total_tax_amount,cf1:total_paid_amount,cf1:total_item_quantity,cf1:total_discount_amount,cf1:coupon_code,cf1:coupon_amount,cf1:order_canceled_flag,cf1:has_returned_items_flag,cf1:has_returned_items_flag,cf1:has_returned_items_flag,cf1:fraud_code,cf1:fraud_resolution_code,cf1:billing_address_line1,cf1:billing_address_line2,cf1:billing_address_city,cf1:billing_address_state,cf1:billing_address_postal_code,cf1:billing_address_country,cf1:billing_phone_number,cf1:customer_name,cf1:customer_email_address,cf1:ordering_session_id,cf1:website_url orders /retail_demo/orders/orders.tsv.gz
	</pre>
	</li>
</ol>


##Verifying Data Loaded ##

Run the following commands on `psql` hawq shell to verify that the data has been successfully loaded.

* Count the number of rows in table `retail_demo.email_addresses_dim_hbase`

	<pre class="terminal">demo=# select count(*) from retail_demo.email_addresses_dim_hbase;
	count  
	--------
	401430
	(1 row)</pre>
	
* Count the number of rows in table `retail_demo.customer_addresses_dim_hbase`

	<pre class="terminal">demo=# select count("cf1:customer_id") from retail_demo.customer_addresses_dim_hbase;
	count  
	--------
	1130639
	(1 row)
	</pre>
	
* Count the number of rows in table `retail_demo.products_dim_hbase`

	<pre class="terminal">demo=# select count(*) from retail_demo.products_dim_hbase;
	count  
	--------
	698911
	(1 row)
	</pre>
	
* Count the number of rows in table `retail_demo.customers_dim_hbase`

	<pre class="terminal">demo=# select count(recordkey) from retail_demo.customers_dim_hbase;
	count  
	--------
	401430
	(1 row)
	</pre>
	
* Count the number of rows in table `retail_demo.orders_hbase`

	<pre class="terminal">demo=# select count(recordkey) from retail_demo.orders_hbase;
	count  
	--------
	401430
	(1 row)
	</pre>
	
##Running HAWQ Queries ##

###Use Case 1 ###

Query `retail_demo.orders_hbase` to show the  Orders placed and Tax collected based on `billing_address_postal_code` for 10 highest entries.

```bash
demo=# select "cf1:billing_address_postal_code", sum("cf1:total_paid_amount"::float8) as total, sum("cf1:total_tax_amount"::float8) as tax from retail_demo.orders_hbase                                                                                                                           group by "cf1:billing_address_postal_code" order by total desc limit 10;
```

```bash
 cf1:billing_address_postal_code |   total   |    tax    
---------------------------------+-----------+-----------
 48001                           | 111868.32 | 6712.0992
 15329                           | 107958.24 | 6477.4944
 42714                           | 103244.58 | 6194.6748
 41030                           |  101365.5 |   6081.93
 50223                           | 100511.64 | 6030.6984
 03106                           |  83566.41 |         0
 57104                           |  77383.63 | 3095.3452
 23002                           |  73673.66 |  3683.683
 25703                           |  68282.12 | 4096.9272
 26178                           |   66836.4 |  4010.184
(10 rows)
```


This completes the exercises on GPXF tables with data in HBase. We created the HBase tables, used importtsv to import data from hdfs into HBase. Finally we created gpxf tables pointing to these HBase tables.
