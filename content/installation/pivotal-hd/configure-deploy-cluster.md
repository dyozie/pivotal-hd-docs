---
title: Configuring and Deploying a Cluster
---

##Step 1: Fetching Default Cluster Configuration Templates


The fetch-template option of icm_client fetches default configurations for a cluster (as
a directory on disk) from the Admin node. This can be modified manually and
provided as an input to subsequent commands. This configuration template contains
certain default parameters and some placeholders which need to be filled up. This
directory contains files which describe the topology of the cluster along with
configurations for various services that will be installed on the cluster.

```xml
[gpadmin]# icm_client fetch-template --help
Usage: /usr/bin/icm_client fetch-template [options]
Options:
-h, --help
show this help message and exit
-o OUTDIR, --outdir=OUTDIR
Directory path to store the cluster
configuration
template files
```

##Example:

```xml
[gpadmin]# icm_client fetch-template -o ~/ClusterConfigDir

```

##Step 2: Editing Cluster Configurations (Topology and Configuration)


The directory structure of the cluster configuration templates is structured as follows:

```xml
clusterConfig.xml
hdfs
├── core-site.xml
├── hadoop-env.sh
├── hadoop-metrics2.properties
├── hadoop-metrics.properties
├── hadoop-policy.xml
├── hdfs-site.xml
└── log4j.properties
yarn
├── container-executor.cfg
├── mapred-env.sh
├── mapred-queues.xml
├── mapred-site.xml
├── yarn-env.sh
└── yarn-site.xml
zookeeper
├── log4j.properties
└── zoo.cfg
├── hbase
│
├── hadoop-metrics.properties
│
├── hbase-env.sh
│
├── hbase-policy.xml
│
├── hbase-site.xml
│
└── log4j.properties
├── hawq
│
└── gpinitsystem_config
```

The clusterConfig.xml contains a default Cluster Configuration template which
contains mandatory configurations and topology that must be filled up by the user.
This is the only file that the user has to fill up to deploy a simple cluster. The other
files are provided for advanced cluster configurations.

##Head section

This is the metadata section that contains the following:

• clusterName: Configure the name of the cluster

• gphdStackVer: Pivotal HD Version. This defaults to 2.0

• services: Configure the services that are required to be deployed. By default every service that GPHD Manager supports is listed here.

**Note:** zookeeper, hdfs, and yarn are mandatory services. hbase and hawq are on an as needed
basis.

##Topology Section <hostRoleMapping>

This section associates hosts to each role that belongs to the service. Only services that
are configured in the head section, will need to be allocated hosts. Also every role
needs to be allocated on at least one host.

##Global Service Properties <servicesConfigGlobals>

This section defines the mandatory global parameters (like Mount Points, Directories
and Ports). The configured mount points: datanode.disk.mount.points,
namenode.disk.mount.points, secondary.namenode.disk.mount.points are used as the
base location for deriving paths for other properties in datanode, namenode and
secondarynamenode respectively. (These properties can be found in the Service's
configuration files).

**Note:** The two HAWQ directory configurations are required if HAWQ services is used.

##Step 3: For Hadoop Service Configuration (Mandatory)


Each service has its corresponding directory that contains its standard configuration
files. You can override properties to suit your cluster requirements, or consult with the
Pivotal HD Team to decide on a configuration to suit your specific cluster needs.
Any changes made to these files, like adding new configuation parameters or
changing existing config paramters are reflected on the cluster nodes when you
perform a deploy or reconfigure.

**Important:** Please refrain from overriding properties derived from the global
service properties (in particular properties dervied from role information).

**Example**

In hdfs/core-site.xml: fs.defaultFS which is set to hdfs://${namenode}:${dfs.port}

##Step 4: HAWQ Configuration


HAWQ configuration can be found in hawq/gpinitsystem_config.You can override the
HAWQ database default port in MASTER_PORT (default is 8432). The HAWQ DFS
path default value can be found in DFS_URL.

**Important:** For performance optimization, add the hdfs configuration overrides
mentioned in this section.

##Step 5: Validate Cluster Configuration


Currently, minimal validations are performed on the cluster configuration supplied by
the user. The user is expected to manually check the following conditions in the
configurations before deploying/reconfiguring a cluster.


**Table 1.7** Cluster Configuration


| Name | Description |
|:-|:-:|
| Cluster Name check | Do not permit a cluster with duplicate name or an empty name. |
| GPHD Stack version check | Ensures that the stack version cannot be empty. When additional stacks are supported, this value can be changed accordingly.|
| Cluster Config XML validity check |Ensure that the xml files modified are wellformed. You can use "xmlwf" command to quickly check for validity.|
|Empty host allocation |If you do not want an optional role, please remove the complete line from the XML file. Do not have roles with empty hostnames.|
| Hostname check | Ensure that you do not use hosts already allocated for other clusters |
|---

{: rules="groups"}


**Table 1.7** Cluster Configuration

| Name | Description |
|:-|:-:|
| Master Role node allocation check | All master roles such as namenode, gpsql-master, etc. must be allocated a single node.|
|Admin Node check| Admin node should not be allocated as any cluster role|
|Service Name check| Do not alter the service names in the template.|
|Role Name check| Do not alter the role names in the template|
|Slave node collocation | HDFS Data Nodes, HAWQ Segment Nodes and YARN NodeManager Nodes should be co-located |
|HAWQ Master check | HAWQ Master Node should not be co-located with a HAWQSegment Node |
|HAWQ Directory check | Make sure the HAWQ Master and Segment directories are not used for any other role/property |
|---

{: rules="groups"}

##Step 6: Installing a Cluster


Pivotal Command Center uses the template directory updated in Step 1 to deploy a
cluster.

**Important:** Multiple simultaneous deployments not supported. Please run only
one deploy command at a time. Simultaneous deployments might result in
deployment failure.

```xml

 icm_client deploy --help
Usage: /usr/bin/icm_client deploy [options]
Options:
-h, --help
show this help message and exit
-c CONFDIR, --confdir=CONFDIR
Directory path where cluster
configuration is stored
```

**Example:**

```xml
icm_client deploy -c ~/ClusterConfigDir
```
**On Admin**

* /var/log/gphd/gphdmgr/GPHDClusterInstaller_XXX.log

* /var/log/gphd/gphdmgr/gphdmgr-webservices.log

* /var/log/messages

* /usr/lib/gphd/gphdmgr/apache-tomcat/logs/catalina.out

* /var/log/gphd/gphdmgr/installer.log

**On Cluster Nodes**

* /tmp/GPHDNodeInstaller_XXX.log

##Step 7: Post Installation Step (For HAWQ Only)

The following steps are required to Exchange SSH Keys between HAWQ Master and
Segment Nodes.

**Important: Execute the following commands from the HAWQ Master.** The hostfile only needs to contain the HAWQ Segment Nodes.

```xml
[gpadmin]# source /usr/local/hawq/greenplum_path.sh
[gpadmin]# /usr/local/hawq/bin/gpssh-exkeys -f ./HAWQ_Hosts.txt
```

##Pivotal HD Directory Layout

**Table 1.8** Pivotal HD Directory Layout

| Directory Location |Description|
|:-|:-:|
|/usr/lib/gphd/* |The default $GPHD_HOME folder. This is the default parent folder of all Pivotal HD components.|
|/etc/gphd/* | The default $GPHD_CONF folder. This is the folder where PivotalHD component's configuration files are stored.|
|/etc/default/| The directory used to store the scripts for setting up the component environment variables that may be used by components Linux Service scripts.|
|/etc/init.d | The location where the component’s Linux Service scripts are stored. |
|/var/log/gphd/*| The default location of the $GPHD_LOG diretory. The logs of the Pivotal HD components are placed here.|
|/var/run/gphd/*| The location where the component’s process information is stored, if the component has the daemon process.|
|/usr/share/doc/gphd*| The documentation of the components is stored here.|
|/usr/bin |This folder is used to store the component’s command scripts; only sym-links or wrapper scripts are created here.|
{: rules="groups"}


**Note:** The tailing * indicates a a designated folder for each Pivotal HD component.


