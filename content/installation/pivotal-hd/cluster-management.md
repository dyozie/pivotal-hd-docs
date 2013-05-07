-----
title: Cluster Management
-----

This section describes the following:

* Starting a Cluster
* Stopping a Cluster
* Managing HAWQ
* Reconfiguring a Cluster
* Retrieving Configuration of a Deployed Cluster
* Listing Clusters
* Uninstalling a Cluster
* Role/Host Level Operation

Starting a Cluster
-----------------

The start option lets the user start all configured services of the cluster.
**Important:** Please use --force options for every start operation
**Important:** --services option has known issues. Please refrain from using it
```xml
[gpadmin]#./icm_client start -h
Usage: ./icm_client start [options]
Options:
-h, --help
-v, --verbose
show this help message and exit
increase output verbosity
-l CLUSTERNAME, --clustername=CLUSTERNAME
the name of the cluster on which the operation is
performed
-s SERVICES, --service=SERVICES
service to be started
-f, --force  forcibly start cluster (even if install is incomplete)
-r, --reformat Reformat/Reinitialize the cluster (Namenode Format & Data Cleanup)

```
The following is the list of values for service: hdfs, mapred, zookeeper, hbase:

* icm_client start -l cluster_name --- Starts all configured cluster services in the
right topological order based on service dependencies.
* icm_client start -l cluster_name -f = Force starts the cluster even if the installation
   is incomplete.
* icm_client start -l cluster_name -r = Formats the namenode and data directories
   before starting the cluster.
* icm_client start -l cluster_name -s hbase --- Starts hive. The system makes sure
   the hadoop services (hdfs,mapred) are started prior to starting Hive services.
The first time the Cluster is Started, GPHD Manager implicitly initializes the Cluster
which includes the following:
* Namenode Format
* Creation of directories on local filesystem of cluster nodes and on hdfs with
   appropriate permission overrides. (Refer to the “Directory Permission Overrides”
      section.)
* Creation of hdfs directories required for additional services such as HBase if
   included in the configured services.
For subsequent invocations of Cluster Start, the Cluster initialization does not happen.

**Important:** When installing/starting a new cluster on nodes that have
pre-existing data on the configured mount points, please make sure that you either
backup or wipe out all the data prior to Starting the new cluster.
**Important:** Please refer to “Ve

Stopping a Cluster
------------------

The stop option lets the user stop an entire cluster or a single service.
```xml
[gpadmin]#./icm_client stop -h
Usage: ./icm_client stop [options]
Usage: ./icm_client stop [options]
Options:
-h, --help
show this help message and exit
-v, --verbose
increase output verbosity
-l CLUSTERNAME, --clustername=CLUSTERNAME
the name of the cluster on which the operation is
performed
-s SERVICES, --service=SERVICES
service to be stopped
```
List of values for service: hdfs, mapred, zookeeper, hbase
icm_client stop -l cluster_name –- Stops all configured cluster services in the right
topological order based on service dependencies.
icm_client stop -l cluster_name -s hdfs –- Stops hdfs. The system makes sure all
dependant services are stopped prior to stopping the given service.

Managing HAWQ
-------------
HAWQ management does not happen implicitly as part of Cluster Management,
specifically for Start and Stop.
These need to be initiated directly on the HAWQ Master.

Initializing HAWQ
-----------------
Hawq initialize is a **one time operation** that needs to be done only after the cluster is
started (specifically after hdfs is up and running).
[gpadmin]#./etc/init.d/hawq init
As part of this step, the following occurs:
* The HAWQ Masterand the segment hosts are initialized.
* The HAWQ Master and segments are started. At this point the underlying postgres
   database is also up and running.
**Important:** This operation takes a few minutes to complete. Please be patient.

Starting HAWQ
-------------
This operation starts the HAWQ Master and all the segments hosts along with the
postgres database on the HAWQ Master.
[gpadmin]#./etc/init.d/hawq start

Stopping HAWQ
-------------
This operation stops the HAWQ Master and all the segments hosts along with the
postgres database on the HAWQ Master.
[gpadmin]#./etc/init.d/hawq stop

Modifying HAWQ User Configuration
---------------------------------
**Important:** Optional: Required only for Pivotal Command Center to contact HAWQ.
You can do this as user "gpadmin".
Since the Admin host is not part of the HAWQ cluster, you will need to
manually give the Admin host the ability to remote query to HAWQ. This is
done by modifying the pg_hba.conf file in the HAWQ Master.
1. Logon to the HAWQ Master as user ‘gpadmin’
2. Update $MASTER_DATA_DIRECTORY/pg_hba.conf. Look for the following
  entry host all gpadmin <master_host_ip>/32 trust and change the subnet entry
 depending on your network configuration host all gpadmin <master_host_ip>/24
trust
3. Restart HAWQ
```xml
/etc/init.d/hawq restart
```
4. You must test HAWQ from the Admin host by running the following command.
```xml
$ sudo -u gpadmin psql -h <HAWQ MASTER NODE> -p <HAWQ PORT> -U
gpadmin postgres -c "select * from pg_stat_activity;"
```

Reconfiguring a Cluster
-----------------------

The reconfigure option lets the user update specific configurations for an existing
cluster. Some of the cluster specific configs that can't be updated are:
* No changes allowed to configurations related to topology changes: For example,
   changing the namenode to a different node, adding new set of datanodes to a
  cluster
* No changes allowed to properties which are derived based on hostnames: For
   example, fs.defaultFS, dfs.namenode.http-address
* No changes allowed to properties having directory paths as values. The table
   below enlists specific properties that should not be changed.

Table 1.9 Cluster Properties

|Property Name | Configuration File |
|datanode.disk.mount.points | clusterConfig.xml |
|namenode.disk.mount.points | clusterConfig.xml |
|secondary.namenode.disk.mount.points |clusterConfig.xml|
|hawq.master.directory | clusterConfig.xml|
|hawq.segment.directory | clusterConfig.xml|
**Important:** No changes allowed to properties which are derived from the
properties listed in the above table.

```xml
#icm_client reconfigure -h
Usage: ./icm_client reconfigure [options]
Options:
-h, --help
show this help message and exit
-l CLUSTERNAME, --clustername=CLUSTERNAME
the name of the cluster on which the operation is performed
-c CONFDIR, --confdir=CONFDIR
Directory path where cluster configuration is stored
```
The steps below describe how to reconfigure an existing cluster.
1. Stop the cluster :
icm_client stop -l CLUSTERNAME
2. Fetch the configurations for the cluster in a local directory
icm_client fetch-configuration -l CLUSTERNAME -o LOCALDIR
3. Edit the configuration files in the cluster configuration directory(LOCALDIR).
4. Reconfigure the cluster.
icm_client reconfigure -l CLUSTERNAME -c LOCALDIR.

Retrieving Configuration of a Deployed Cluster
----------------------------------------------
The fetch-configuration option allows the user to fetch the configurations for an
existing cluster and store them in a local file-system directory.
```xml
./icm_client fetch-configuration -h
Usage: ./icm_client fetch-configuration [options]
Options:
-h, --help
show this help message and exit
-o OUTDIR, --outdir=OUTDIR
Directory path to store the cluster
configuration
template files
-l CLUSTERNAME, --clustername=CLUSTERNAME
Name of the deployed cluster whose configurations need to be
fetched
Sample Usage:
icm_client fetch-configuration -l CLUSTERNAME -o LOCALDIR
```
###Listing Clusters


The list option lets the user see all the installed clusters.
```xml
[gpadmin]# icm_client list --help
Usage: /usr/bin/icm_client list [options]
Options:
-h, --help
-v, --verbose
show this help message and exit
increase output verbosity
Sample Usage:
icm_client list
```

###Uninstalling a Cluster


The uninstall option lets the user uninstall the cluster. Note that uninstall will not stop
any running clusters.
**Important:** Stop all running clusters before you uninstall them.
**Important:** Uninstall will not delete dfs.data.dir, dfs.name.dir, dfs.mapred.dir
and dfs.checkpoint.dir directories. This is done intentionally to preserve user data.
```xml
[gpadmin]#./icm_client uninstall -h
Usage: ./icm_client uninstall [options]
Options:
-h, --help
show this help message and exit
-v, --verbose
increase output verbosity
-l CLUSTERNAME, --clustername=CLUSTERNAME
the name of the cluster to be
uninstalled
Sample Usage
icm_client uninstall -l CLUSTERNAME
```

###Role/Host Level Operation


GPHD Manager currently does not support starting/stopping individual cluster roles
or individual roles on a particular host.
The table below shows the service commands for each service role to start, stop, check
status and restart.

**Table 1.10** Role/Host Level Operation

|Role Name | Service Command |
|Namenode | sudo service hadoop-hdfs-namenode{start\|stop\|status\|restart} |
|Secondary NameNode | sudo service hadoop-hdfs-secondarynamenode
                  {starts|stop|status|restart} |
|Datanode | sudo service hadoop-hdfs-datanode
        {starts|stop|status|restart} |
|Resource Manager | sudo service hadoop-yarn-resourcemanager
                {starts|stop|status|restart}|
|Node Manager | sudo service hadoop-yarn-nodemanager
            {starts|stop|status|restart}|
|History Server | sudo service hadoop-mapreduce-historyserver
              {starts|stop|status|restart}|
|History Server | sudo service hadoop-mapreduce-historyserver
              {starts|stop|status|restart}|
|Zookeeper Server | sudo service zookeeper-server
                {starts|stop|status|restart} |
|HBase Master | sudo service hbase-master
            {starts|stop|status|restart} |
|HBase Region Server | sudo service hbase-regionserver
                   {starts|stop|status|restart}|
|HAWQ Master |sudo /etc/init.d/hawq
           {starts|stop|status|restart}|

You have the following options based on your choice of operation:

###Operate Locally

You can locally manage the service role on the target host. If you wish to restart a
datanode say node100.
```xml
[gpadmin]# ssh gpadmin@node100
[gpadmin]# sudo service hadoop-hdfs-namenode restart
```
###Operate from Admin Node

You can remotely manage the service role across one of more target hosts.
If you wish to restart a datanode on say node100.
```xml
[gpadmin]# massh node100 verbose 'sudo service hadoop-hdfs-datanode restart'
```
If you wish to remotely restart all the datanodes create a newline separated file named
'hostfile' containing all the datanode(s) you wish to start/stop/restart or check status.

```xml
[gpadmin]# massh hostfile verbose 'sudo service
hadoop-hdfs-datanode restart'
```


