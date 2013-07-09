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
![Manager login](/images/gs/dataloader/dl1.png)

Create Job and Submit
---------------------

####Create a Job
* Click on `Create Job` Menu
* Select the Data Source to copy from
* Select `localfs` option in `Source Datastore`
* Click `+` to `retail_demo` to select full directory

     ![Manager login](/images/gs/dataloader/dl2.png)
* Select `hdfs2://localhost:8020/` in Target Datastore
* Click `Submit` on screen

Data will be copied from local file system to hdfs
Once copied, the Dataloader screen will show the job as completed. The `Status` indicates the status of the Dataloader Job as shown below:
     ![Manager login](/images/gs/dataloader/dl3.png)

Verify The Result In Hdfs
-------------------------

```bash
    $hdfs fsck /retail_demo -files

    Connecting to namenode via http://pivhdsne:50070
    FSCK started by gpadmin (auth:SIMPLE) from /127.0.0.1 for path /retail_demo at Tue Jun 25 07:09:39 EDT 2013
    /retail_demo <dir>
    /retail_demo/categories_dim <dir>
    /retail_demo/customer_addresses_dim <dir>
    /retail_demo/customer_addresses_dim/customer_addresses_dim.tsv.gz 53995977 bytes, 1 block(s):  Under replicated                           BP-1552558461-127.0.0.1-1370125227629:blk_-7932086622190299743_2572. Target Replicas is 3 but found 1 replica(s).
    .....
    .....
    .....
    Status: HEALTHY
     Total size:    300314155 B
     Total dirs:    10
     Total files:    6
     Total blocks (validated):    7 (avg. block size 42902022 B)
     Minimally replicated blocks:    7 (100.0 %)
     Over-replicated blocks:    0 (0.0 %)
     Under-replicated blocks:    7 (100.0 %)
     Mis-replicated blocks:        0 (0.0 %)
     Default replication factor:    3
     Average block replication:    1.0
     Corrupt blocks:        0
     Missing replicas:        14 (66.666664 %)
     Number of data-nodes:        1
     Number of racks:        1
    FSCK ended at Tue Jun 25 07:09:39 EDT 2013 in 11 milliseconds
```
