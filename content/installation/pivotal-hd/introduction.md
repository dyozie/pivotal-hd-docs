---
title: Introduction
---

Greenplum Hadoop (GPHD) Manager provides complete life cycle management for
Hadoop Clusters. It consists of two main components, Install & Configuration
Manager (ICM) and System Management & Monitoring (SM) of Hadoop services.
Both components are deployed as RESTful web services on the management node and
provides API for complete life cycle management of GPHD Clusters.
The GPHD Manager is installed on the admin node as a web service. It sets up a local
yum repository and hosts the GPHD and other supplementary packages required for
deployment of GPHD cluster. Presently it is required to have dedicated Admin Node
for the GPHD Manager separate from the Hadoop cluster nodes.

##High Level Architecture

The figure below shows the high level architecture of GPHD Manager. In GPHD
Manager Version 1.0.0, ICM provides Command Line Interface (CLI) to install,
configure and start/stop various Hadoop services. CLI is built using RESTful web
services API. Eventually, ICM will also support all the operations through the Pivotal
Command Center GUI, a uniform management and monitoring interface for both
Greenplum database (GPDB) and GPHD. ICM stores the metadata for Hadoop cluster
nodes and services along with cluster configuration, while SM stores all the system
and Hadoop metrics into PostgreSQL database Admin Node. In the background,
GPHD Manager uses Puppet to manage the installation of Hadoop services. Puppet is
one of the popular open source technologies used for large scale cluster configuration
management. Puppet runs in Master/Slave mode, where Puppet Master is installed on
the management node and provides a single point to deploy various puppet manifests
generated for Hadoop services installation, as well as receiving the installation reports
from individual cluster nodes. Puppet agents installed on the individual cluster nodes,
receive the deployment instructions (manifests) from Puppet master and take the
necessary action to configure the cluster node with appropriate Hadoop service roles.
Puppet agents are not run in a continuous daemon mode but rather invoked on demand
for the deployment of Hadoop service components.

![](/images/pivotal-hd/architecture.png)

[Figure 1.1 GPHD High Level Architecture]

##Features supported by GPHD Manager Version 2.0.0

* Ability to scan the cluster nodes to check the pre-requisites for the cluster nodes

* Helper commands to prepare the cluster nodes with required configuration before
   cluster deployment

* Ability to install and Configure supported Pivotal HD cluster services using CLI

* Ability to Reconfigure cluster services using CLI

* Ability to Start/Stop cluster services

* Ability to Monitor the Pivotal HD Services through GPCC UI

* Multi-cluster support

##Hadoop Services supported by GPHD Manager Version 1.0.0


The GPHD Manager Version 1.0.0 ICM supports installation of the following Hadoop
Services based on Apache Hadoop.

1.	HDFS	

2. 	YARN

3. 	Zookeeper

4. 	HBase

5. 	HAWQ

**Note:** If you have a Apache-based 1.x Hadoop Cluster, please review your potential upgrade
options to migrate your data to an Apache-based 2.x Hadoop Cluster.

