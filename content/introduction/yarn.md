---
title: YARN
---

Overview
-------
Apache Hadoop has two main components:

* Distributed Storage
* Distributed computation

The distributed storage is provided by the HDFS, and the MapReduce provides the distributed computation.

##About YARN

YARN (Yet-Another-Resource-Negotiator) is the next-generation Hadoop data-processing framework. YARN provides a generic framework for writing distributed processing frameworks and applications. It is a sub-project of Apache Hadoop in the ASF.

YARN provides the following key changes compared to 1.x:

* Hadoop 2.x does not distinguish resources as Map and Reduce slots. 
* The scheduling and task management are separated. ResourceManager and the task management are moved to the Application Master
* Application master negotiates the resources with ResourceManager on behalf of the Job. It manages the lifecycle of the job till the job is complete.
Hadoop 2.x may support multiple frameworks such as MPI and Graph processing along with MapReduce.

A brief overview of yarn architecture is shown below:

![yarn](/images/introduction/yarn.png)

**Fig. 1  YARN Architecture**

A detailed view of YARN architecture is available at apache : [YARN](http://hadoop.apache.org/docs/r2.0.3-alpha/hadoop-yarn/hadoop-yarn-site/YARN.html)

###Resource manager
ResourceManager provides an end point to clients for submitting Applications requests. ResourceManager has in-built ApplicationsManager that manages the Jobs across the cluster.

ResouceManager is the central authority for managing cluster wide resources. Its primary function to schedule resources among competing applications for the resources. ResourceManager provides the built-in schedulers and a pluggable scheduler framework. The resources can be negotiated with attributes like Cpu's, disk, Memory etc.

###Node Manager
The NodeManager is per slave node. NodeManager is primarily responsible for monitoring and managing  resources in the slave node. It takes the directions from ResourceManger and creates containers based on the Job requirements.

###Application master
Application master is bundled along with the NodeManager. It is created per Job and manages the monitoring and execution of the tasks using the container. It negotiates the resource requirements for the Job with the ResourceManager and owns up the responsibility for completing the tasks. ApplicationMaster provides the fault-tolerance at the task level.

###Container
The basic unit of allocation is the container instead of a Map or a Reduce slot in Hadoop 1.x. The container is defined with attributes like memory, Cpu, disk etc.i These attributes helps in supporting  multiple Applications like Graph processing and MPI.

###History Server
History server maintains the history of all the jobs. 

##MapReduce with YARN 

A brief overview of how YARN works is shown in Fig. 2

![yarn-walkthro](/images/introduction/rmdetails.png)

**Fig. 2  A detailed walk-through of component interactions in Yarn**

Clients submit the application requests to the ResourceManager, triggering a series of steps across the cluster. The following steps illustrate running applications on the YARN cluster.

* [1] Client communicates with the Resource Manager (The Applications Manager part of the Resource Manager) with a new Application Request 
* [2] Resource Manger responds with Application Id
* [3] Client constructs the Application Submission request with details requirements like memory, cpu's, priority etc. The Application Request may have the context for the Job like the application's jar files and resource requirements.
* [4] Applications Manager, upon receiving the request from client, requests the Node Manager to create a per Job Application Master 
* [5] Node Manager creates the Application Master
* [6] ApplicationMaster  creates the request for allocation of resources to the Resource Manager. Application Master is responsible for the Job execution till it completes. 
* [7] The ResourceManager returns a list of containers.
* [8] Application Master requests the Node Manager to launch the containers for that particular job 
* [9] Node Manager creates the container. Container executes the client specific code on the container 
* [10] Application master manages the job execution till the job is complete
* [11] Client asks for Application status report

###Migrating Applications from Hadoop 1.x

The MapReduce API and interfaces are same as Hadoop 1.x. A recompilation is required to move MapReduce applications from Hadoop 1.x to 2.x.

