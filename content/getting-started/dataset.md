---
title: Example Data Set :Retail Demo
---

Overview 
--------

The DataSet  [here](http://github.com/rajdeepd/pivotal-samples/sample-data) is a sample retail data made up of following entities delimited by `|`

##Schema

|---
| Entity | Description 
|:-|:-:|
| customers_dim | Customer Data |
| email_addresses_dim | Email addresses of customers |
| product_dim | Product Details |
| customer_addresses_dim | Address of each customer |
| order_lineitems | Line Item for each Order |
| orders | Details of an Order |
| categories_dim | Category for each Product |
|---

##Loading Data into HDFS ##

You will load the Retail Demo data into hdfs directory `/retail_demo`

###Cleanup HDFS

On the Namenode type the following command

```bash
hadoop fs -rm -r /retail_demo
```

###Create directory structure  in HDFS

```bash
hadoop fs -mkdir /retail_demo
```

For each entity create corresponding folder

```bash
hadoop fs -mkdir /retail_demo/customer_addresses_dim
hadoop fs -mkdir /retail_demo/customers_dim
hadoop fs -mkdir /retail_demo/email_addresses_dim
hadoop fs -mkdir /retail_demo/order_lineitems
hadoop fs -mkdir /retail_demo/orders
hadoop fs -mkdir /retail_demo/products_dim
hadoop fs -mkdir /retail_demo/categories_dim
```


###Load the Files into HDFS ###

Execute the following put commands to upload `tsv.gz` files to HDFS.

```bash
hadoop fs -mkdir /retail_demo
hadoop fs -mkdir /retail_demo/categories_dim
hadoop fs -put categories_dim.tsv.gz /retail_demo/categories_dim/
hadoop fs -mkdir /retail_demo/customer_addresses_dim
hadoop fs -put customer_addresses_dim.tsv.gz /retail_demo/customer_addresses_dim/
hadoop fs -mkdir /retail_demo/customers_dim
hadoop fs -put customers_dim.tsv.gz /retail_demo/customers_dim/
hadoop fs -mkdir /retail_demo/email_addresses_dim
hadoop fs -put email_addresses_dim.tsv.gz /retail_demo/email_addresses_dim/
hadoop fs -mkdir /retail_demo/order_lineitems
hadoop fs -put order_lineitems.tsv.gz /retail_demo/order_lineitems/
hadoop fs -mkdir /retail_demo/orders
hadoop fs -put orders.tsv.gz /retail_demo/orders/
hadoop fs -mkdir /retail_demo/products_dim
hadoop fs -put products_dim.tsv.gz /retail_demo/products_dim/
```

Verify Existence of the files with the  command `hdfs fsck` : This is a HDFS filesystem checking utility.

```bash
hdfs fsck /retail_demo -files
```

If the files have been successfully loaded your output will be similar to the listing below

```bash
Connecting to namenode via http://pivhdsne:50070
FSCK started by gpadmin (auth:SIMPLE) from /127.0.0.1 for path /retail_demo at Wed Jun 05 00:46:49 EDT 2013
/retail_demo <dir>
/retail_demo/customer_addresses_dim <dir>
/retail_demo/customer_addresses_dim/customer_addresses_dim.tsv.gz 53995977 bytes, 1 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_-3444967948050158773_3347. Target Replicas is 3 but found 1 replica(s).
/retail_demo/customers_dim <dir>
/retail_demo/customers_dim/customers_dim.tsv.gz 4646775 bytes, 1 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_-634814030839628602_3349. Target Replicas is 3 but found 1 replica(s).
/retail_demo/email_addresses_dim <dir>
/retail_demo/email_addresses_dim/email_addresses_dim.tsv.gz 7760971 bytes, 1 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_4366275706078040799_3351. Target Replicas is 3 but found 1 replica(s).
/retail_demo/order_lineitems <dir>
/retail_demo/order_lineitems/order_lineitems.tsv.gz 137780165 bytes, 2 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_-1448686265800988512_3353. Target Replicas is 3 but found 1 replica(s).
 Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_-5238730078283780219_3354. Target Replicas is 3 but found 1 replica(s).
/retail_demo/orders <dir>
/retail_demo/orders/orders.tsv.gz 72797064 bytes, 1 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_2747787889934219069_3356. Target Replicas is 3 but found 1 replica(s).
/retail_demo/products_dim <dir>
/retail_demo/products_dim/products_dim.tsv.gz 23333203 bytes, 1 block(s):  Under replicated BP-1801932862-127.0.0.1-1365034401630:blk_-8464904072467287261_3358. Target Replicas is 3 but found 1 replica(s).
Status: HEALTHY
 Total size:	300314155 B
 Total dirs:	7
 Total files:	6
 Total blocks (validated):	7 (avg. block size 42902022 B)
 Minimally replicated blocks:	7 (100.0 %)
 Over-replicated blocks:	0 (0.0 %)
 Under-replicated blocks:	7 (100.0 %)
 Mis-replicated blocks:		0 (0.0 %)
 Default replication factor:	3
 Average block replication:	1.0
 Corrupt blocks:		0
 Missing replicas:		14 (66.666664 %)
 Number of data-nodes:		1
 Number of racks:		1
FSCK ended at Wed Jun 05 00:46:49 EDT 2013 in 10 milliseconds
```

This completes the process of loading retail_demo sample data into HDFS.
