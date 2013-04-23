---
title: YARN
---

Overview
-------
Apache Hadoop has two main components:

* Distributed Storage and
* Distributed computatation

The distributed storage is provided by the HDFS and distributed computation is provided by the MapReduce. Apache MapReduce is the most popular open-source implementation of the MapReduce model.

Apache Hadoop 1.x aka MRv1 is composed of JobTracker, which is the master and per node slave called the Task Tracker. The JobTracker is responsible for the Job scheduling, Job distribution and resource management. The Task tracker is responsible for monitoring and executing the tasks and reporting the status back to JobTracker.

##About YARN
YARN(Yet-Another-Resource-Negotiator) is the next-generation Hadoop data-processing framework. YARN provides generic framework for writing distributed processing frameworks and applications. It is a sub-project of Apache Hadoop in the ASF. 

YARN ((Yet-Another-Resource-Negotiator)provides the following key changes compared to 1.x:

* Tasks are no longer managed as Map and Reduce slots. This will help in Cluster utilization
* The scheduling responsibility is managed by the ResourceManager and the task management is moved to the Application Master
* Application master negotiates the resources with ResourceManager and works with NodeManagers to execute the tasks. Moving this function to the Application Master allows Hadoop 2.x support multiple frameworks such as MapReduce, MPI and Graph processing.

YARN allows applications to launch any process and, unlike existing Hadoop MapReduce in hadoop-1.x, it isn’t limited to Java applications alone. Yarn has the following main services.

A brief overview of yarn archtecture is show below:

![yarn](/images/introduction/yarn.png)

**FIG. 2  YARN Architecture**

A detailed view of YARN architecture is available at apache : [YARN](http://hadoop.apache.org/docs/r2.0.3-alpha/hadoop-yarn/hadoop-yarn-site/YARN.html)_

YARN has a central master service called ResourceManager, which manages all the resources in the cluster. It is purely a scheduler, managing the resurces among competing applications.

YARN has per node NodeManager, takes the directions from ResourceManager and is responsible for managing resources in a single node.

There is no JobTracker in YARN, instead has a per job master called, Application master. Application master controls the execution flow, such as working with Resource Manager in negotiating for resources, task management, handling speculative execution and failures. This is more scalable than MR1, where a single tracker does the resource management, scheduling and task monitoring.


###Resource manager
The ResourceManager and per-node slave, the NodeManager, form the data-computation framework. The ResourceManager is the ultimate authority that arbitrates resources among all the applications in the system.
The ResourceManager has two main components: Scheduler and ApplicationsManager.
The Scheduler is responsible for allocating resources to the various running applications subject to familiar constraints of 
capacities, queues etc. 
The Scheduler is pure scheduler in the sense that it performs no monitoring or tracking of status for the application. 
Also, it offers no guarantees about restarting failed tasks either due to application failure or hardware failures.

The Scheduler performs its scheduling function based the resource requirements of the applications; it does so based on the abstract notion of a resource Container which incorporates generic resource model with elements such as memory, cpu, disk, network etc. In the first version, only memory is supported.

###Node Manager
The NodeManager is the per-machine framework agent responsible for containers, monitoring their resource usage (cpu, memory, disk, network) and reporting the same to the ResourceManager/Scheduler.

###Application master
ApplicationMaster is framework specific library and is tasked with negotiating resources from the Resource Manager and working with the NodeManager(s) to execute and monitor the tasks. Application master is bundled along with the Node Manager. The per-application ApplicationMaster has the responsibility of negotiating appropriate resource containers from the Scheduler, tracking their status and monitoring for progress. Applcation master provides the fault tolerance.

###Container
The basic unit of allocation is now container, instead of a Map or a Reduce task in Hadoop 1.0. The container for example could be defined as one with attributes like memory, cpu, disk etc.
This granualirty in define resources and allocating them allows the resource management to be efficient and helps meet multiple processing requirements.

###History Server
History server maintains the history of all the jobs. After a job is complere, application master will not longer be available for any queries. The designers chose to have an independent history server for managing the history of the jobs.

##MapReduce with YARN 

A brief overview of how YARN works is shown in Fig. 2

![yarn-walkthro](/images/introduction/rmdetails.png)

Fig. 2  A detailed walk-thro of component interactions in Yarn

The following are the steps to run an Application on YARN cluster.

* [1] Client communicates with the Resource Manager (The Applications Manager part of the Resource Manager) with a new Application Request
* [2] Resource Manger responds with Application Id
* [3] Client constructs the Application Submission request with details on what kind of resources it is required, priority, user information etc. The Application Sumit request may have the context for the Job like the application's jar files, resource requirements (memoery etc)
* [4] Applications Manager, upon receiving the request from client, requests the Node Manager to create a per Job Application Master
* [5] Node Manager creates the Application Master
* [6] Application Master up creation, creates request for allocation of resources to the Resource Manager. Application Master is responsible for the Job execution till it completes.
* [7] The Resource Manager returns a list of containers.
* [8] Application Master requests the Node Manager to launch the containers for that particular job
* [9] Node Manager creates the container. Container executes the client specific code on the cotainer  
* [10] Application master manages the job execution till the job is complete 
* [11] Client asks for Application status report

###Migrating older MapReduce applications to run on YARN (Hadoop 2.0):

The MapReduce API and interfaces are sames as Hadoop 1.x and hence no code changes are required to to move MapReduce applications from Hadoop 1.x to 2.x.
