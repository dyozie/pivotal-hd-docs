---
title: Loading data into HDFS using DataLoader
---

#### Load the *.tsv.gz data files into HDFS using DataLoader
    1. Start services: sudo -u dataloader /usr/local/gphd/dataloader-2.0.1/bin/dataloader.sh start -s
    2. Open localhost:12380/manager in browser
    3. Login as gpadmin/password
    4. Create Job
    5. Select localfs as source, click + next to retail_demo to select full directory
    6. Select / on hdfs2 in destination
    7. Click Submit then Submit on next screen
    8. Data will copy and show complete on next screen

#### Verify that you get the expected result:

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
    
####Verify one of the tables previously created is able to query this data

    - Run an SQL query using psql, or just ./verify_data_load.sh

#### Why the need for the "customers_dim" directory -- it seems redundant?  
    That will help, later, when we define the Hive external tables and also when
    we run out HBase build import, as both of these operations work with
    directory paths as opposed to files.

    Note on why we're using gzip compression, even though it's not splittable
    in HDFS: gzip seems to have about a 4x speedup vs. bzip2 for reads.

    [mac:retail_demo_export]$ time zcat orders.tsv.gz | wc -l
      512071

      real  0m3.179s
      user  0m2.436s
      sys 0m0.152s
    [mac:retail_demo_export]$ gunzip orders.tsv.gz 
    [mac:retail_demo_export]$ bzip2 orders.tsv 
    [mac:retail_demo_export]$ time bzcat orders.tsv.bz2 | wc -l
      512071

      real  0m14.419s
      user  0m13.593s
      sys 0m0.283s
