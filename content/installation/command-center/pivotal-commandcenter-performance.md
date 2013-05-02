---
title: Pivotal Command Center Performance
---

Monitor
-------

This section provides an overview of the Pivotal Command Center performance
monitor known as nmon.

Overview
--------

Pivotal Command Center comes with a Performance monitor called nmon (for node
monitor). This makes use of a highly scalable message passing architecture to gather
performance metrics from each node that Command Center monitors. This consists of
a nmon master daemon that runs on the Command Center admin host and an nmon
daemon that runs on all the cluster nodes that report system metric information to the
nmon master. This includes metrics such as CPU, memory, disk I/O and network usage
information.
The nmon master on the admin host dumps the system metrics it receives from the
nmon agents on the cluster nodes into a PostgreSQL DB. This is then queried by the
Command Center UI application to display its cluster analysis graphs.
The nmon agents hosts are deployed throughout the cluster during Pivotal HD cluster
deployment itself (see Pivotal HD Enterprise 1.0 Installation and Administrator
Guide for details).
The agents are deployed as services on each host, including on the Pivotal Command
Center admin host. To stop or start the nmon service run the following as root:

```xml
# service nmon stop
# service nmon start

```

A.Creating a YUM EPEL Repository
--------------------------------

Pivotal Command Center and Pivotal HD Enterprise expect some prerequisite
packages to be pre-installed on each host, depending on the software that gets
deployed on a particular host. In order to have a smoother installation it is
recommended that each host would have yum access to an EPEL yum repository. If
you have access to the Internet, then you can configure your hosts to have access to
the external EPEL repositories. However, if your hosts do not have Internet access (or
you are deploying onto a large cluster), then having a local yum EPEL repo would be
highly recommended. This will also give you some control on the package versions
you want deployed on your cluster.
Following are the steps to create a local yum repo:
1. Mount the RHEL/CentOS DVD on a machine that will act as the local yum repo
2. Install a webserver on that machine (e.g. httpd), making sure that HTTP traffic can
  reach this machine
3. Install the following packages on the machine:

```xml
yum-utils
createrep
```
4.Go to the directory where the DVD is mounted and run the following command:
```xml
  # createrepo .
```
5.Create a repo file on each host with a descriptive filename in the
/etc/yum.repos.d/ directory of each host (for example, CentOS-6.1.repo)
with the following contents:

```xml
[CentOS-6.1]
name=CentOS 6.1 local repo for OS RPMS
baseurl=http://172.254.51.221/centos/$releasever/os/
$basearch/
enabled=1
gpgcheck=1
gpgkey=http://172.254.51.221/centos/$releasever/os/$basearch
/RPM-GPG-KEY-CentOS-6

```
6.Validate that you can access the local yum repos by running the following
command:

```xml
Yum list

```

