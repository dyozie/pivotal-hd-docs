---
title: Example Data Set :Retail Demo
---

Overview 
--------

The DataSet  [here](https://github.com/PivotalHD/pivotal-samples/tree/master/sample-data) is a sample retail data made up of following entities.

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


###Load the Files into HDFS ###

In the following commands we are doing the following steps

*  Creating a root folder `/retail_demo` in HDFS.
*  Creating subdirectory for each data type.
*  Executing `hadoop fs -put` command on each `.tsv.gz` file.

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
hadoop fs -mkdir /retail_demo/date_dim/
hadoop fs -put date_dim.tsv.gz /retail_demo/date_dim/
hadoop fs -mkdir /retail_demo/payment_methods/
hadoop fs -put payment_methods.tsv.gz /retail_demo/payment_methods/
```

Verify Existence of the files with the  command `hdfs fsck` : This is a HDFS filesystem checking utility.

```bash
hdfs fsck /retail_demo -files
```

If the files have been successfully loaded your output will be similar to the listing below

```bash
Connecting to namenode via http://pivhdsne:50070
FSCK started by gpadmin (auth:SIMPLE) from /127.0.0.1 for path /retail_demo at Tue Jul 09 00:25:59 EDT 2013
.
/retail_demo/categories_dim/categories_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_5968091463222355492_2817. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/customer_addresses_dim/customer_addresses_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_-4875484741672585545_2819. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/customers_dim/customers_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_-6836584912720581197_2821. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/date_dim/date_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_-2570524376762075821_2823. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/email_addresses_dim/email_addresses_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_5638230189209458384_2825. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/order_lineitems/order_lineitems.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_1040364891077656135_2827. Target Replicas is 3 but found 1 replica(s).

/retail_demo/order_lineitems/order_lineitems.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_4746464352650439858_2828. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/orders/orders.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_59429671209988123_2830. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/payment_methods/payment_methods.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_6615105348023851323_2832. Target Replicas is 3 but found 1 replica(s).
.
/retail_demo/products_dim/products_dim.tsv.gz:  Under replicated BP-1552558461-127.0.0.1-1370125227629:blk_6775814360242838123_2834. Target Replicas is 3 but found 1 replica(s).
Status: HEALTHY
 Total size:	300332616 B
 Total dirs:	10
 Total files:	9
 Total blocks (validated):	10 (avg. block size 30033261 B)
 Minimally replicated blocks:	10 (100.0 %)
 Over-replicated blocks:	0 (0.0 %)
 Under-replicated blocks:	10 (100.0 %)
 Mis-replicated blocks:		0 (0.0 %)
 Default replication factor:	3
 Average block replication:	1.0
 Corrupt blocks:		0
 Missing replicas:		20 (66.666664 %)
 Number of data-nodes:		1
 Number of racks:		1
FSCK ended at Tue Jul 09 00:25:59 EDT 2013 in 17 milliseconds


The filesystem under path '/retail_demo' is HEALTHY
```

This completes the process of loading retail_demo sample data into HDFS.
