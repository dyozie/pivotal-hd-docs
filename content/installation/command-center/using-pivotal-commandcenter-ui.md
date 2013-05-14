---
title: Using Pivotal Command Center UI
---

  This section provides an overview of the Pivotal Command Center 2.0 user interface.

##Overview


  Pivotal Command Center UI is a browser-based application for viewing the status and
performance of Pivotal HD clusters. At a high level, the screens consist of:
This chapter includes the following sections:

*	**Dashboard—**Provides an overview of your Pivotal HD cluster. This screen shows
	at one glance the most important states and metrics that an administrator needs to
	know about the Pivotal HD cluster.
*	**Cluster Analysis—**Provides detailed information about various metrics of your
	Pivotal HD cluster. This provides cluster-wide metrics all the way down to
	host-level metrics. This has hadoop-specific metrics such as MapReduce slot
	utilization and NameNode performance, as well as system metrics such as CPU,
  	memory, disk and network statistics.
* 	**MapReduce Job Monitor—**Provides details about all, or a filtered set of
     	MapReduce jobs.
* 	**YARN App Monitor—**Provides details about all, or a filtered set of YARN
     	applications.
* 	**HAWQ Query Monitor—**When HAWQ (a revolutionary MPP database on
     	Hadoop solution) is deployed on the cluster, Command C

##Status indicators

Note that throughout the user interface the following indicators are used to indicate the
status of nodes:

*	 Green: Succeeded

* 	Blue: Running

* 	Grey: Stopped/Pending

* 	Red: Killed/failed

##Logging In

The URL to access Pivotal Command Center UI from a browser is

```bash
http://CommandCenterHost:5000/login
```
To change the default port (5000), update the port settings in the following file:

```bash
/usr/local/greenplum-cc/config/app.yml
```

##Browser Support

The following browsers are supported by Pivotal Command Center 2.0:

*	Firefox 16, 19
* 	IE 8, IE 9, both with Google Chrome Frame
* 	Chrome 25.0.1364.172

##Login Screen


The first time you launch the Command Center UI, a login screen appears showing the
hostname of the host for the Command Center.

![login ](/images/cc/login.png)

##Selecting a Cluster

Once you have launched Command Center, you may be presented with a list of
clusters to monitor.

*	Click the cluster name in the table to select a cluster.

* 	From any point within Command Center UI, you can always select a different
   	cluster by using the Select Cluster drop-down menu in the upper right corner of
  	the screen.

*	Click the gear icon in the upper right corner of the screen at any time to display
   	the Settings menu. From this menu you can Logout or go back to the list of all
  	clusters by selecting Cluster Status.

	![cluster ](/images/cc/cc.png)

##Dashboard

  The dashboard gives you a high level view of a cluster at a glance. You are able to
view the status of the most important cluster services, such as HDFS and YARN. It
also shows you how the most important cluster metrics are trending in a visual way.
The graphs provide a unified view of the state of your system. They are also useful in
detecting outliers and pinpointing specific problems that may be present in your
system.

![dashboard ](/images/cc/dashboard.png)


The right side of the Dashboard displays the state of both HDFS and YARN services.
It answers the following questions:

*	Is HDFS up?

*	When did the last NameNode checkpoint occur?

* 	What percentage of cluster storage is used by HDFS and how much is free?

*	How many DataNodes are up?

*	Is YARN up?

*	How many NodeManagers are up?

	The Dashboard provides metrics about:

*	Namenode RPC Times

*	Hadoop Datanodes Average CPU

*	Hadoop Datanodes Average Bandwidth

*	Namenode Operations Per Second

*	Hadoop Datanodes Average Disk Bandwidth

*	Hadoop Datanodes Average Memory

*	Mapreduce Jobs By Status

##Cluster Analysis


The Cluster Analysis screen provides detailed metrics on your Pivotal HD cluster.
It provides cluster-wide metrics all the way down to host-level metrics. It provides
Hadoop-specific metrics, as well as system metrics that you can drill down to if
needed.
The Cluster Analysis screen displays the same data that is shown in the dashboard but
in greater detail.


![cluster analysis ](/images/cc/cluster-analysis.png)

The Navigation area of the Cluster Analysis screen provides you three ways in which
to navigate:

1.	**By Service**

	Metrics can be aggregated by Services such as HDFS, YARN, or HAWQ. Under
	each service you can also aggregate metrics by category such as:

   * 	namenode

   * 	secondarynamenode

   * 	datanode

   * 	yarn-resourcemanager

   * 	yarn-nodemanager

   * 	mapreduce-historyserver

   * 	hawq-master

   * 	hawq-segment


**2.**	  **By Category**

**3.** 	  **Alphabetically**

   *	Each of these categories provide detailed graphs that display data related to:

   * 	Mapreduce Slot Utilization

   * 	Namenode RPC Times

   * 	Avg Namenode File Operations Per Second

   * 	Mapreduce Jobs by Status

   * 	Segment CPU

   * 	Disk Bandwidth

   * 	Network Bandwidth

   * 	Segment Memory

   * 	Load

   * 	Swap Usage

   * 	Swap I/O

   * 	Network Operations

   * 	Disk Operations

You can view either the Trending Metrics/Performance Metrics, which show the
cluster/node utilization over-time or the Real-time Metrics which shows the current
metrics in real-time.

If you select Cluster Analysis for All Nodes (the default), the Trending Metrics graph
for the cluster is displayed:

![All Nodes ](/images/cc/cluster-analysis2.png)

If you select Cluster Analysis for a specific node, then a Performance Metrics graph
for that node is displayed:

![specific node ](/images/cc/cluster-analysis3.png)

##MapReduce Job Monitor

The Job Monitor screen tracks the MapReduce jobs that are executed in the Pivotal
HD cluster when the YARN MapReduce service is running. It provides details about
all, or a filtered set of MapReduce jobs.

![set of MapReduce jobs ](/images/cc/mapreduce1.png)

The MapReduce jobs displayed can be filtered by state and/or time range:

* By state:

 * currently pending jobs

 * currently running jobs

 * succeeded jobs

 * failed jobs

 * all jobs (set by default)

 * killed jobs

 * By time range:

   By selecting a preset time range in hours, weeks, months, or by specifying acustom time range.

 The MapReduce jobs can also be filtered by the following fields by entering it in the
search bar in the following format: searchKey=searchValue:

* jobID

* name

* user

* queue

These are substring searches. For example: jobID=1363920466130 will locate a job
with jobID=job_1363920466130_0002

Hovering your mouse over various locations displays even greater detail about the
jobs.

##Job Details

When you click on any of the jobs in the Job Monitor more details of the job are
shown.

![Job Details ](/images/cc/mapreduce1.png)

This screen displays all the tasks that are have been allocated for the selected job and
their progress. You can see the mapper and the reducer tasks separately. In the above
screen capture, the bars in the JOB SUMMARY section represent the two Mapper
tasks that have run, one took 19 seconds, the other, 20 seconds.

Clicking on each task ID will show even more details about that particular task. You
can also filter on a particular task ID in the search bar.

 ![particular task ID ](/images/cc/task.png)

To see job related counters click on **View more job details** next to the job ID:

 ![View more job details  ](/images/cc/jobdetails.png)


##YARN App Monitor


The YARN App Monitor screen tracks YARN applications that are executed in the
Pivotal HD Cluster.

 ![YARN App Monitor screen  ](/images/cc/yarn-app-monitor.png)

The YARN applications displayed can be filtered by category and/or time range:


* **By Category:**
  * currently pending apps
  * currently running apps
  * succeeded apps
  * failed apps
  * all apps (set by default)
  * killed apps

* **By Time Range:**

  By selecting a preset time range in hours, weeks, months, or by specifying a
  custom time range.

The YARN applications can also be filtered by the following fields by entering it in
the search bar in the following format: searchKey=searchValue:

* appID
* name
* user

These are substring searches. For example: **appID=1363920466130** will locate the 
application with **appID=application_1363920466130_0002**

##HAWQ Query Monitor

The HAWQ Query monitor is only displayed when HAWQ is installed on the cluster.
This screen displays all **active** queries running on the HAWQ cluster:

![HAWQ cluster  ](/images/cc/hawq1.png)

In this release, this screen only displays **active** queries as can be seen when you run:

```bash
SELECT * FROM pg_stat_activity;

```
on the HAWQ cluster.
Click on a Query ID to get the syntax of that query:

![syntax of that query  ](/images/cc/hawq2.png)


# cd /root/phd
# tar --no-same-owner -zxvf
GPCC-2.0.0.version.build.os.x86_64.tar.gz
```
3.Still as root user, run the installation script. This installs the required packages and
configures both Pivotal Command Center and Pivotal HD Manager, and starts services.

**Important:**
You must run the installation script from the directory where it is
installed, for example: GPCC-2.0.0.version
For example:
```bash
# ls
GPCC-2.0.0.version
GPCC-2.0.0.version.build.os.x86_64.tar.gz
# cd GPCC-version
# ./install
```
You will see installation progress information on the screen. Once the installation
successfully completes, you will see the following:

You have successfully installed GPCC 2.0.
You now need to install a GPHD cluster to monitor or sync
GPCC to monitor an existing GPHD cluster. You can view your
cluster statuses here:
http://node0781.ic.analyticsworkbench.com:5000/status

##Starting, Stopping, and Restarting Command Center Services


 To stop or restart the Command Center services, run the following commands on the
Pivotal Command Center admin host:

```bash
$ service commander stop
$ service commander start
$ service commander restart
```

##Launching Command Center


Launch a browser and navigate to the host on which you installed Command Center.
For example:

```bash
http://CommandCenterHost:5000

```

The Command Center login page is launched in your browser. The default
username/password is gpadmin/gpadmin.

##Next Steps

   See the Pivotal HD 1.0 Installation and Configuration Guide for instructions for 
using the command-line interface of 
[Pivotal Command Center to deploy and configure a HD cluster.](../pivotal-hd/configure-deploy-cluster.html)



