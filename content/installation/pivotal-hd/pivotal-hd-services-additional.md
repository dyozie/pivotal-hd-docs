---
title: Pivotal HD Services Additional Information
---

Directory Permission Overrides
------------------------------

The following table shows the list of directories that the GPHD Manager overrides
with specific owner and permission level. Directories not mentioned in the following
table follow standard Apache ownership and permission convention.

### Local Filesystem

**Table 1.11 Directory Permission Overrides**

|Service| Directory | Location  | Owner | Permission |	
| Hdfs | hadoop.tmp.dir | All hadoop nodes | hdfs:hadoop | 777 |
      | dfs.namenode.name.dir | Namenode | hdfs:hadoop | 700 |
      |	dfs.datanode.data.dir | Datanodes | hdfs:hadoop | 770 |
      | dfs.namenode.checkpointdir |----| hdfs:hadoop | 700

| Yarn | mapreduce.cluster.local.dir | All yarn nodes | mapred:hadoop |----|
       | mapreduce.cluster.temp.dir | All yarn nodes | mapred:hadoop | 755 |
       | yarn.nodemanager.local-dirs | Node Managers | yarn:yarn | 755 |
       | yarn.nodemanager.log-dirs | Node Managers | yarn:yarn | 755 |
| Zookeeper | dataDir(/var/lib/zookeeper) | Zookeeper Servers | zookeeper:zookeeper | 775 |
            | dataDir/myid | Zookeeper Servers | gpadmin | 644 |
| HAWQ | MASTER_DIRECTORY | HAWQ Master & Standby | gpadmin:hadoop | 755 |
       | DATA_DIRECTORY | HAWQ Segments | gpadmin:hadoop | 755 |


On HDFS
-------

The following table displays the roles that belong to HDFS service.

**Table 1.12 Hdfs Service Roles**

| Service | Directory | Owner | Permissions |
| Hdfs | hadoop.tmp.dir | hdfs:hadoop | 777 |
       | /tmp | hdfs:hadoop | 777 |
       | mapreduce.jobtracker.system.dir | mapred:hadoop | 700 |

**Table 1.12 Hdfs Service Roles**
| Service | Directory | Owner | Permissions |
          | yarn.app.mapreduce.am.staging-dir (/user) | mapred:hadoop | 777 |
 
          | mapreduce.jobhistory.intermediate-done-dir (/user/history/done) | mapred:hadoop | 777 |
          | mapreduce.jobhistory.done-dir (/user/history/done)  | mapred:hadoop | 755 |
          | yarn.nodemanager.remote-app-log-dir | mapred:hadoop | --- |
| HBase   | hbase directory (/apps/hbase/data) | hdfs:hadoop | 775 |
| HAWQ    | hawq directory (/hawq_data) | hdfs:hadoop | 755 |

