---
title: Load Retail DataSet to HDFS
---

Pre-requisites
-------------
   * The Dataloader installation can be done on any machine. In this tutorial, we will install the DataLoader in NameNode

Start DataLoader Services and Login
------------------------

####Start DataLoader services:

```bash
sudo -u dataloader /usr/local/gphd/dataloader-2.0.1/bin/dataloader.sh start -s
```

Open `localhost:12380/manager` in browser

#### Login to DataLoader

Use gpadmin/password to login 
![DataLoader](/images/gs/dataloader/dl1.png)

Create Job and Submit
---------------------

####Create a Job
* Click on `Create Job` Menu
* Select `localfs` option in `Source Datastore`
* Click `+` to `/retail_demo` to select full directory
![DataLoader](/images/gs/dataloader/dl2.png)
* Select `hdfs2://localhost:8020/` in Target Datastore
* Click `Submit` on screen

Data will be copied from local file system to HDFS.
Once copied, the Dataloader screen will show the job as completed. The `Status` indicates the status of the Dataloader Job as shown below:
![DataLoader](/images/gs/dataloader/dl3.png)

Verify The Result In Hdfs
-------------------------
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
