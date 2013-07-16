---
title: Getting Started with Hive Tables
---

Overview 
--------

In this exercise we will create Hive tables and load data into them using the `LOAD` Command.

##Prerequisites ##

*  Pivotal HD is installed 
*  Single/Multi Node cluster has been started
*  pivotal-samples have been downloaded from github.

##Introduction ##

HIVE is shipped along with Pivotal HD distribution. You will use Hive to load and query the data. 

##Create HIVE tables

Execute the following commands to create tables in Hive.

1. Start the `hive` command line interface - cli. 

	<pre class="terminal">
        $ hive
        hive> 
	</pre>

2. Create database `retail_demo`.

	<pre class="terminal">
        CREATE DATABASE IF NOT EXISTS retail_demo;
        USE retail_demo;
	</pre>

3. Create table `retail_demo.order_lineitems_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.order_lineitems_hive
	(
	  Order_ID                      string
	, Order_Item_ID                 bigint
	, Product_ID                    int
	, Product_Name                  string
	, Customer_ID                   int
	, Store_ID                      int
	, Item_Shipment_Status_Code     string
	, Order_Datetime                timestamp
	, Ship_Datetime                 timestamp
	, Item_Return_Datetime          timestamp
	, Item_Refund_Datetime          timestamp
	, Product_Category_ID           int
	, Product_Category_Name         string
	, Payment_Method_Code           string
	, Tax_Amount                    double
	, Item_Quantity                 int
	, Item_Price                    double
	, Discount_Amount               double
	, Coupon_Code                   string
	, Coupon_Amount                 double
	, Ship_Address_Line1            string
	, Ship_Address_Line2            string
	, Ship_Address_Line3            string
	, Ship_Address_City             string
	, Ship_Address_State            string
	, Ship_Address_Postal_Code      string
	, Ship_Address_Country          string
	, Ship_Phone_Number             string
	, Ship_Customer_Name            string
	, Ship_Customer_Email_Address   string
	, Ordering_Session_ID           string
	, Website_URL                   string
	)
	  -- PARTITIONED BY (Order_Datetime timestamp)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/order_lineitems/';	</pre>
		
4. Create table `retail_demo.orders_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.orders_hive
	(
	  Order_ID                      string
	, Customer_ID                   int
	, Store_ID                      int
	-- , Order_Datetime_Orig           timestamp
	, Order_Datetime                timestamp
	, Ship_Completion_Datetime      timestamp
	, Return_Datetime               timestamp
	, Refund_Datetime               timestamp
	, Payment_Method_Code           string
	, Total_Tax_Amount              double
	, Total_Paid_Amount             double
	, Total_Item_Quantity           int
	, Total_Discount_Amount         double
	, Coupon_Code                   string
	, Coupon_Amount                 double
	, Order_Canceled_Flag           string
	, Has_Returned_Items_Flag       string
	, Has_Refunded_Items_Flag       string
	, Fraud_Code                    string
	, Fraud_Resolution_Code         string
	, Billing_Address_Line1         string
	, Billing_Address_Line2         string
	, Billing_Address_Line3         string
	, Billing_Address_City          string
	, Billing_Address_State         string
	, Billing_Address_Postal_Code   string
	, Billing_Address_Country       string
	, Billing_Phone_Number          string
	, Customer_Name                 string
	, Customer_Email_Address        string
	, Ordering_Session_ID           string
	, Website_URL                   string
	)
	  -- PARTITIONED BY (Order_Datetime timestamp)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/orders/';	</pre>
		
5. Create table `retail_demo.products_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.products_dim_hive
	(
	  Product_ID      int,
	  Category_ID     smallint,
	  Price           double,
	  Product_Name    string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/products_dim/';	</pre>
		
6. Create table `retail_demo.categories_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.categories_dim_hive
	(
	  Category_ID    bigint,
	  Category_Name  string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/categories_dim/';	</pre>
		
7. Create table `retail_demo.email_addresses_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.email_addresses_dim_hive
	(
	  Customer_ID     int,
	  Email_Address   string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/email_addresses_dim/';
		</pre>
	
8. Create table `retail_demo.date_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.date_dim_hive
	(
	  calendar_day      timestamp,
	  reporting_year    smallint,
	  reporting_quarter smallint,
	  reporting_month   smallint,
	  reporting_week    smallint,
	  reporting_dow     smallint
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/date_dim/';	</pre>
	
9. Create table `retail_demo.customers_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.customers_dim_hive
	(
	  Customer_ID    bigint,
	  First_Name     string,
	  Last_Name      string,
	  Gender         string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/customers_dim/';	
	</pre>
	
10. Create table `retail_demo.payment_methods_hive`

      <pre class="terminal">
	CREATE TABLE retail_demo.payment_methods_hive
	(
	  Payment_Method_ID    SMALLINT,
	  Payment_Method_Code  string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/payment_methods/';	
	</pre>
		
11. Create table `retail_demo.customer_addresses_dim_hive`

	<pre class="terminal">
	CREATE TABLE retail_demo.customer_addresses_dim_hive
	(
	  Customer_Address_ID  bigint,
	  Customer_ID          bigint,
	  Valid_From_Timestamp timestamp,
	  Valid_To_Timestamp   timestamp,
	  House_Number         string,
	  Street_Name          string,
	  Appt_Suite_No        string,
	  City                 string,
	  State_Code           string,
	  Zip_Code             string,
	  Zip_Plus_Four        string,
	  Country              string,
	  Phone_Number         string
	)
	  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	  STORED AS TEXTFILE
	  LOCATION '/retail_demo/customer_addresses_dim/';
	</pre>
	
Note: You can also execute the script [create_hive_tables.sql](https://github.com/PivotalHD/pivotal-samples/tree/master/hive/create_hive_tables.sql) to create tables.

##Load Data into Hive tables##

Run the following commands on the Hive CLI to load data from a Local File System into Hive. You will use `LOAD` command in the format listed below. It can directed load data in `.tsv.gz` format into a Hive table which has a row format delimited fields set as `\t`

```bash
LOAD DATA LOCAL INPATH '/retail_demo/order_lineitems/order_lineitems.tsv.gz' OVERWRITE INTO TABLE retail_demo.order_lineitems_hive;
LOAD DATA LOCAL INPATH '/retail_demo/orders/orders.tsv.gz' OVERWRITE INTO TABLE retail_demo.orders_hive;
LOAD DATA LOCAL INPATH '/retail_demo/products_dim/products_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.products_dim_hive;
LOAD DATA LOCAL INPATH '/retail_demo/categories_dim/categories_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.categories_dim_hive;
LOAD DATA LOCAL INPATH '/retail_demo/email_addresses_dim/email_addresses_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.email_addresses_dim_hive;
LOAD DATA LOCAL INPATH '/retail_demo/date_dim/date_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.date_dim_hive;
LOAD DATA LOCAL INPATH '/retail_demo/customers_dim/customers_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.customers_dim_hive;
LOAD DATA LOCAL INPATH '/retail_demo/payment_methods/payment_methods.tsv.gz' OVERWRITE INTO TABLE retail_demo.payment_methods_hive;
LOAD DATA LOCAL INPATH '/retail_demo/customer_addresses_dim/customer_addresses_dim.tsv.gz' OVERWRITE INTO TABLE retail_demo.customer_addresses_dim_hive;
```


##Running Hive Queries ##

You can run the Hive queries on the data loaded. Following are some simple queries to find the Number of entries in each tables

*  Number of Email Addressess in the table : retail_demo.email_addresses_dim_hive 

	<pre class="terminal">
	hive > select count(*) from retail_demo.email_addresses_dim_hive ;
	Total MapReduce jobs = 1
	Launching Job 1 out of 1
	....
	Job 0: Map: 1  Reduce: 1   Cumulative CPU: 3.13 sec   HDFS Read: 7761205 HDFS Write: 7 SUCCESS
	Total MapReduce CPU Time Spent: 3 seconds 130 msec
	OK
	401430
	Time taken: 20.389 seconds
	</pre>

*  Number of Customers in the table retail_demo.customers_dim_hive

	<pre class="terminal">
	hive> select count(*) from retail_demo.customers_dim_hive;
	Total MapReduce jobs = 1
	..
	2 seconds 940 msec
	Ended Job = job_1370914856264_0009
	MapReduce Jobs Launched: 
	Job 0: Map: 1  Reduce: 1   Cumulative CPU: 2.94 sec   HDFS Read: 4646997 HDFS Write: 7 SUCCESS
	Total MapReduce CPU Time Spent: 2 seconds 940 msec
	OK
	401430
	Time taken: 20.03 seconds
	</pre>

##Cleaning up the Environment ##

In case you want to drop all the tables and start fresh, you can execute this following queries from Hive Cli. 
Issue the following commands will drop all the tables.

```bash
DROP TABLE IF EXISTS retail_demo.order_lineitems_hive;
DROP TABLE IF EXISTS retail_demo.orders_hive;
DROP TABLE IF EXISTS retail_demo.products_dim_hive;
DROP TABLE IF EXISTS retail_demo.categories_dim_hive;
DROP TABLE IF EXISTS retail_demo.email_addresses_dim_hive;
DROP TABLE IF EXISTS retail_demo.date_dim_hive;
DROP TABLE IF EXISTS retail_demo.customers_dim_hive;
DROP TABLE IF EXISTS retail_demo.payment_methods_hive;
DROP TABLE IF EXISTS retail_demo.customer_addresses_dim_hive;
```
