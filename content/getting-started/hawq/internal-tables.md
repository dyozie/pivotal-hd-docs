---
title: HAWQ - Internal Tables
---

Overview 
--------

In this exercise we will create HAWQ tables and load data into them using the `COPY` Command

##Create Internal HAWQ tables

Execute the following `create table` commands to create the tables in HAWQ. You can also execute the script [create_tables_hawq.sql](https://github.com/rajdeepd/pivotal-samples/blob/master/hawq/hawq_tables/create_hawq_tables.sql)

1. Create <code>retail_demo</code> Schema

	<pre class="terminal">
	CREATE SCHEMA retail_demo;
	</pre>

2. Create table `retail_demo.categories_dim_hawq`

	<pre class="terminal">
	CREATE TABLE retail_demo.categories_dim_hawq
	(
	    category_id integer NOT NULL,
	    category_name character varying(400) NOT NULL
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
3. Create table `retail_demo.customers_dim_hawq`

	<pre class="terminal">
	CREATE TABLE retail_demo.customers_dim_hawq
	(
	    customer_id TEXT,
	    first_name TEXT,
	    last_name TEXT,
	    gender TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
4. Create table `retail_demo.order_lineitems_hawq`

	<pre class="terminal">
	CREATE  TABLE retail_demo.order_lineitems_hawq
	(
	    order_id TEXT,
	    order_item_id TEXT,
	    product_id TEXT,
	    product_name TEXT,
	    customer_id TEXT,
	    store_id TEXT,
	    item_shipment_status_code TEXT,
	    order_datetime TEXT,
	    ship_datetime TEXT,
	    item_return_datetime TEXT,
	    item_refund_datetime TEXT,
	    product_category_id TEXT,
	    product_category_name TEXT,
	    payment_method_code TEXT,
	    tax_amount TEXT,
	    item_quantity TEXT,
	    item_price TEXT,
	    discount_amount TEXT,
	    coupon_code TEXT,
	    coupon_amount TEXT,
	    ship_address_line1 TEXT,
	    ship_address_line2 TEXT,
	    ship_address_line3 TEXT,
	    ship_address_city TEXT,
	    ship_address_state TEXT,
	    ship_address_postal_code TEXT,
	    ship_address_country TEXT,
	    ship_phone_number TEXT,
	    ship_customer_name TEXT,
	    ship_customer_email_address TEXT,
	    ordering_session_id TEXT,
	    website_url TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
5. Create table `retail_demo.orders_hawq`

	<pre class="terminal">
	CREATE TABLE retail_demo.orders_hawq
	(
	    order_id TEXT,
	    customer_id TEXT,
	    store_id TEXT,
	    order_datetime TEXT,
	    ship_completion_datetime TEXT,
	    return_datetime TEXT,
	    refund_datetime TEXT,
	    payment_method_code TEXT,
	    total_tax_amount TEXT,
	    total_paid_amount TEXT,
	    total_item_quantity TEXT,
	    total_discount_amount TEXT,
	    coupon_code TEXT,
	    coupon_amount TEXT,
	    order_canceled_flag TEXT,
	    has_returned_items_flag TEXT,
	    has_refunded_items_flag TEXT,
	    fraud_code TEXT,
	    fraud_resolution_code TEXT,
	    billing_address_line1 TEXT,
	    billing_address_line2 TEXT,
	    billing_address_line3 TEXT,
	    billing_address_city TEXT,
	    billing_address_state TEXT,
	    billing_address_postal_code TEXT,
	    billing_address_country TEXT,
	    billing_phone_number TEXT,
	    customer_name TEXT,
	    customer_email_address TEXT,
	    ordering_session_id TEXT,
	    website_url TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
6. Create table `retail_demo.customer_addresses_dim_hawq`

	<pre class="terminal">
	CREATE TABLE retail_demo.customer_addresses_dim_hawq
	(
	    customer_address_id TEXT,
	    customer_id TEXT,
	    valid_from_timestamp TEXT,
	    valid_to_timestamp TEXT,
	    house_number TEXT,
	    street_name TEXT,
	    appt_suite_no TEXT,
	    city TEXT,
	    state_code TEXT,
	    zip_code TEXT,
	    zip_plus_four TEXT,
	    country TEXT,
	    phone_number TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
7. Create table `retail_demo.date_dim_hawq`


8. Create table `retail_demo.email_addresses_dim_hawq`

	<pre class="terminal">
	CREATE TABLE retail_demo.email_addresses_dim_hawq
	(
	    customer_id TEXT,
	    email_address TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>
	
9. Create table `retail_demo.payment_methods_hawq

	<pre class="terminal">
	CREATE TABLE retail_demo.payment_methods_hawq
	(
	    payment_method_id smallint,
	    payment_method_code character varying(20)
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	ALTER TABLE retail_demo.payment_methods_hawq OWNER TO gpadmin;
	</pre>
	
10. Create table `retail_demo.products_dim_hawq

	<pre class="terminal">
	CREATE TABLE retail_demo.products_dim_hawq
	(
	    product_id TEXT,
	    category_id TEXT,
	    price TEXT,
	    product_name TEXT
	)
	WITH (appendonly=true, compresstype=quicklz) DISTRIBUTED RANDOMLY;
	</pre>

##Load Data into HAWQ tables	 ##

Run the following sql scripts from the `pivotal_samples/sample_data` folder to upload data into HAWQ tables.

```bash
zcat customers_dim.tsv.gz | psql -c "COPY retail_demo.customers_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat categories_dim.tsv.gz | psql -c "COPY retail_demo.categories_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat order_lineitems.tsv.gz | psql -c "COPY retail_demo.order_lineitems_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat orders.tsv.gz | psql -c "COPY retail_demo.orders_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat customer_addresses_dim.tsv.gz | psql -c "COPY retail_demo.customer_addresses_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat email_addresses_dim.tsv.gz | psql -c "COPY retail_demo.email_addresses_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat products_dim.tsv.gz | psql -c "COPY retail_demo.products_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat payment_methods.tsv.gz | psql -c "COPY retail_demo.payment_methods_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
zcat date_dim.tsv.gz | psql -c "COPY retail_demo.date_dim_hawq FROM STDIN DELIMITER E'\t' NULL E'';"
```

You can also run a perl script [load_hawq_data_perl.sh](https://github.com/rajdeepd/pivotal-samples/blob/master/hawq/hawq_tables/load_hawq_tables_perl.sh) which will upload all the files from folder with extension `.gz`. 

##Verifying Data loaded ##

Run the following script to check the count of all the tables in schema `retail_demo`.
[verify_load_hawq_tables.sh](https://github.com/rajdeepd/pivotal-samples/blob/master/hawq/hawq_tables/verify_load_hawq_tables.sh)

Output of the sh script should look like

```bash
[gpadmin@pivhdsne hawq_tables]$ ./verify_load_hawq_tables.sh							    
        Table Name           |    Count 
-----------------------------+------------------------
 customers_dim_hawq          |   401430  
 categories_dim_hawq         |   56 
 customer_addresses_dim_hawq |   1130639
 email_addresses_dim_hawq    |   401430
 order_lineitems_hawq        |   1024158
 orders_hawq                 |   512071
 payment_methods_hawq        |   5
 products_dim_hawq           |   698911
-----------------------------+------------------------
```

##Running HAWQ Queries ##

TODO
