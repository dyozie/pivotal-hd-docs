---
title: YARN
---

Overview
-------

A brief overview of yarn archtecture is show below:

![yarn](/images/yarn-architecture.png)

**FIG. 2  YARN Architecture**

YARN allows applications to launch any process and, unlike existing Hadoop MapReduce in hadoop-1.x (aka MR1), it isn’t limited to Java applications alone. Yarn has the following main services.

###Resource manager
The ResourceManager and per-node slave, the NodeManager, form the data-computation framework. The ResourceManager is the ultimate authority that arbitrates resources among all the applications in the system.
The ResourceManager has two main components: Scheduler and ApplicationsManager.
The Scheduler is responsible for allocating resources to the various running applications subject to familiar constraints of 
capacities, queues etc. 
The Scheduler is pure scheduler in the sense that it performs no monitoring or tracking of status for the application. 
Also, it offers no guarantees about restarting failed tasks either due to application failure or hardware failures.
The Scheduler performs its scheduling function based the resource requirements of the applications; it does so based on the abstract notion of a resource Container which incorporates elements such as memory, cpu, disk, network etc. In the first version, only memory is supported.

###Node Manager
The NodeManager is the per-machine framework agent responsible for containers, monitoring their resource usage (cpu, memory, disk, network) and reporting the same to the ResourceManager/Scheduler.

###Application master
ApplicationMaster is framework specific library and is tasked with negotiating resources from the Resource Manager and working with the NodeManager(s) to execute and monitor the tasks. Application master is bundled along with the Node Manager. The per-application ApplicationMaster has the responsibility of negotiating appropriate resource containers from the Scheduler, tracking their status and monitoring for progress. Applcation master provides the fault tolerance.

###Container
The basic unit of allocation is now container, instead of a Map or a Reduce task in Hadoop 1.0. The container for example could be defined as one with attributes like memory, cpu, disk etc.
This granualirty in define resources and allocating them allows the resource management to be efficient and helps meet multiple processing requirements.

###History Server
History server maintains the history of all the jobs. After a job is complere, application master will not longer be available for any queries. The designers chose to have an independent history server for managing the history of the jobs.