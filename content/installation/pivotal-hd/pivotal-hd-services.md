---
title: Pivotal HD Services
---

This section describes the following Pivotal HD Services.

* HDFS

* YARN

* Zookeeper

* HBase

* HAWQ

##HDFS


The following table displays the roles that belong to HDFS service.

**Table 1.1** HDFS Service

|---
| Role Name | Description|
|:-|:-:|
| NameNode  | NameNode serves as both directory namespace manager and "inode table" for the Hadoop DFS. There is a single NameNode running in any DFS deployment.|
| Secondary NameNode |The secondary NameNode periodically downloads current NameNode image and edits log files, joins them into new image and uploads the new image back to the (primary and the only) NameNode.|
| DataNodes | A DataNode stores data in the [HadoopFileSystem]. A functional filesystem has more than one DataNode, with data replicated across them.|
|---

{: rules="groups"}

##YARN

The following table displays the roles that belong to YARN service.
**Table 1.2** Yarn Service Roles

|---
| Role Name | Description |
|:-|:-:|
| Resource Manager | The Resource Manager is the master that manages all the cluster resources running on the YARN system |
|Node Manager | The NodeManager manages resources on a particular node. History Server The History Server stores and serves a history of the mapreduce jobs that were run on the cluster. |
|---

##Zookeeper

The following table displays the roles that belong to Zookeeper service.

**Table 1.3** ZookeeperService

|---
|Role Name | Description |
|:-|:-:|
|Zookeeper Server | ZooKeeper Quorum Servers |
|---

**Prerequisite:** None
GPHD Manager installs an Independent Zookeeper ensemble.

##HBase

The following table displays the roles that belong to HBase service.

**Table 1.4** HBase Service

|---
|Role Name | Description |
|:-|:-:|
|HBase Master | Storage server |
|Hbase RegionServer | Storage server |
|---

**Prerequisite:** HDFS, YARN, Zookeeper
Zookeeper is a prerequisite for HBase. So if you choose to install HBase and do not
have Zookeeper installed, as part of the installation of HBase, Zookeeper will also get
installed.

* GPHD Manager supports only Distributed Mode (Not Standalone Mode)
* GPHD Manager does not install HBase Thrift Server
* HBase does not manage Zookeeper ensemble


##HAWQ

The following table displays the roles that belong to HAWQ service.

**Table 1.5** HAWQ Service Roles

|---
| Role | Name |
|:-|:-:|
|Description | HAWQ Standby Master Standby master is activated in the event the primary master fails. Replicated logs are created that reflect the state of the master host if the it becomes unoperational. 
| HAWQ Segments | Queries submitted to HAWQ Master are optimized, broken into smaller components, then dispatched to segments |
| HAWQ Master | Database process that accepts client connections and processes SQL commands |
|---

**Prerequisite:** HDFS

##Preparing GPHD Manager (Admin Node)

Make sure the following required tarballs are made available on the Admin node.
Please ensure all the tarballs are extracted and readable by user “gpadmin”.

* Pivotal HD tarball (Pivotal Hadoop related services)

* GPADS tarball (HAWQ, GPXF services)

**Note:** GPADS and HAWQ Advanced Databased Services are present and available in this tarball only if purchased.

* Oracle JDK Package - e.g. jdk-6u43-linux-x64-rpm.bin You can download this from:

[http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html )


###Step 1: Enable Admin node with Hadoop and HAWQ Services

import is a utility provided to sync the **RPMs** from the specified source location into
the **GPCC** Admin local repository. The cluster nodes, during deployment stage, access
the **RPMs** from the Admin Nodes local yum repository. You will need to run the
import utility every time you wish to sync/import a new version of the package.

```bash
[gpadmin]# icm_client import --help
Usage: icm_client [options]
Options:
-h, --help
show this help message and exit
-p PATH, --path=PATH directory location of GPHD/GPADS RPMs
-v VERSION, --version=VERSION
the version of GPHD stack (1 or 2)
```
###Step 2. Enable Pivotal HD Services

**Important:** This step is mandatory.

```bash
[gpadmin]# icm_client import -p <PATH TO EXTRACTED GPHD TAR
BALL> -v <VERSION_NUMBER>
```
**Example:**

```bash
[gpadmin]# icm_client import -p GPHD-2.0.1-21/ -v 2.0
```
###Step 3. Enable HAWQ Service

**Note:** Required only for HAWQ/GPXF

```bash
[gpadmin]# icm_client import -p <PATH TO EXTRACTED GPADS TAR BALL> -v
<VERSION_NUMBER>
```
**Example:**

```bash
[gpadmin]# icm_client import -p GPADS/ -v 2.0
```
For more details and help with troubleshooting, refer to the log file located at:
/var/log/gphd/gphdmgr/gphdmgr-import.log
