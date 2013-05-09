---
title: Pivotal Command Center Overview
---

##Overview

This document provides an overview of Pivotal Command Center 2.0 and instructions
for installing the product. This chapter provides an overview of Pivotal Command
Center, then briefly describes each component.

*  Pivotal Command Center Overview

   *  Pivotal Command Center UI  

   *  GPHD Manager

   *  Performance Monitor (nmon)

   *  PostgreSQL Database

*  Architectural Overview

##Pivotal Command Center Overview


The Pivotal Command Center allows an administrative user to administer and monitor
one or more Pivotal HD clusters. The Command Center has command-line tools to
deploy and configure Pivotal HD clusters, as well as, an intuitive graphical user
interface that is designed to help the user view the status of the clusters and take
appropriate action. This release of Command Center allows only administering and
monitoring of Pivotal HD Enterprise 1.0 clusters.
Pivotal Command Center 2.0 is comprised of the following:

                   
##Pivotal Command Center UI

The Pivotal Command Center UI provides the user with a single web-based graphical
interface to monitor and manage one or more Pivotal HD clusters. This web
application is hosted on a Ruby-on-Rails application which presents the status and
metrics of the clusters. This data comes from multiple sources. All of the Hadoop
specific data comes from the GPHD Manager component. The system metrics data is
gathered by our Performance Monitor (nmon) component.

##GPHD Manager


GPHD Manager provides complete life cycle management for Pivotal HD Clusters. It
performs the following two main groups of functions:

* Cluster installation, configuration and uninstalls

* Cluster monitoring and management

These functions are served through a set of RESTful web services that run as a web
application on an Apache-Tomcat server on the Command Center admin host. This is
called gphdmgr-webservices. This web application stores its metadata and cluster
configuration for Pivotal HD cluster nodes and services in the Pivotal Command
Center PostgreSQL database. It makes use of a Puppet Server to perform most of its
HD cluster installation and configuration. It also has a polling service that retrieves
Hadoop metrics from the cluster and stores them in the Command Center PostgreSQL
Database at periodic intervals.

GPHD Manager provides a command-line interface (CLI) for installation,
configuration and uninstalls. This tool invokes the gphdmgr-webservice APIs to
install and configure the various Pivotal HD services. The CLI also provides a way to
start and stop the clusters. For how to use this CLI, please refer to the Pivotal HD
Enterprise 1.0 Installation and Administrator Guide.
The Command Center UI also invokes the gphdmgr-webservice APIs to retrieve all
Hadoop-specific cluster metrics and status information. This includes the Hadoop
metrics that was previously retrieved by the polling service.

##Performance Monitor (nmon)


Pivotal Command Center comes with a Performance Monitor called nmon (for node
monitor). This makes use of a highly scalable message passing architecture to gather
performance metrics from each node that Command Center monitors. This consists of
a nmon master daemon that runs on the Command Center admin host and an nmon
daemon that runs on all the cluster nodes that report system metric information to the
nmon master. This includes metrics such as CPU, memory, disk I/O and network usage
information.
The nmon master on the admin host dumps the system metrics it receives from the
nmon agents on the cluster nodes into a PostgreSQL DB. This is then queried by the
Command Center UI application to display its cluster analysis graphs.

##PostgreSQL Database


Pivotal Command Center makes use of a PostgreSQL Database to store the following:

* Cluster configurations

* Hadoop cluster metrics

* System metrics of the cluster

* Pivotal Command Center Metadata

##Architectural Overview


For more details about Pivotal HD Enterprise 1.0, refer to the [Pivotal HD 1.0 Installation and Administrator Guide](pivotal-hd.html)

![Command Center Architecture](/images/cc/cc-architecture.png)




  

