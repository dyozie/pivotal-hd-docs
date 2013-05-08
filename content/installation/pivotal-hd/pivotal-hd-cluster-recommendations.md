---
title: Pivotal HD Cluster Recommendations
---

##Pivotal HD Cluster Recommendations

This section describes the following:

  **Hardware Recommendations**
  **Hadoop services Topology**

Effective deployment of Hadoop cluster has three important considerations to make.

* Selecting appropriate hardware configuration for cluster & management nodes,

* Mapping Hadoop services roles to cluster nodes and

* Configuring them to effectively leverage underlying hardware platform.

##Hardware Recommendations

Typically hardware configuration of cluster nodes depend on the analytics workload
run on the Hadoop cluster, which can be broadly classified as I/O bound, Memory
bound, CPU bound or Network bound. Typically, it is hard to anticipate the kind of
workload that will run on the cluster and so designing it for a specific type of
workload may lead to under utilization of certain hardware resources. So it is
recommended to select the hardware for a balanced workload across different types of
resources while having the ability to provision more specific resources e.g. CPU, I/O
bandwidth and Memory, etc. as the workload evolves and demands occur.
Typical Hardware configurations are provided below,

**Note:**This is not a minimum requirement but just a guidelines to consider while designing a production cluster. Contact your GPHD customer  representative to seek more specific advice for your requirements.

**Cluster Slaves** (Nodes that run Hadoop service slaves like Datanode, NodeManager,
RegionServer & SegmentServer),

* 2 quad core CPUs - You can also have a single CPU with more (6 to 8) cores and
  the ability to add additional CPU, if needed in future. Typically total map+reduce
  tasks per node are ~= 1.5 times number of cores per node.

* 12 to 24GB RAM per node — Typically 1 GB for each Hadoop daemon
  (DataNode, NodeManager, Zookeeper etc.) and 1.5GB/2GB for each map/reduce
  task respectively. Again memory per map/reduce tasks on slave nodes depends on
  the application requirement.

* 4 to 10, 2TB, 7.2K RPM, SATA drives (JBOD) -- More disks per node provides
  more I/O bandwidth. Although more disk capacity per node may put more
  memory requirement on HDFS Namenode, as total HDFS storage capacity grows
  with more cluster nodes while the average HDFS file size stays small.

* 2 x 2TB disks, RAID 1 configured for System OS. It can also store Hadoop
  daemon logs.

* 1GbE network connectivity within RACK
  Cluster Masters (nodes that run Hadoop service masters e.g. NameNode,
  ResourceManager, HAWQ Master)

* Typically cluster nodes running Hadoop masters should have more reliable
  hardware.

* Compared to cluster slave nodes Memory (RAM) requirement would be higher
  depending on the size of the cluster, number of HDFS storage/files etc.

* Local disk storage requirement would not be as high has cluster slave nodes, 1 to
  2TB, SAS disks, with RAID5/6
  GPHD Manager Admin node

* Typically should be separate from cluster nodes especially if cluster size is ~ >=
  15/20 nodes. No special resource requirements for Admin node but typically,

* 1 Quad code CPU

* 4 to 8GB RAM

* 2x2TB SATA disks

**Important:** 1GbE network connectivity

**Important:** Overall, it is important to provide better and more reliable hardware
for master nodes for high cluster availability while also choosing the hardware for
cluster nodes to lower the overall power consumption.

##Hadoop services Topology

Typically for experimentation purposes all the Hadoop services roles, e.g. HDFS
Namenode/Datanode, YARN ResourceManager/NodeManager, HAWQ
Master/SegmentServer etc. can be deployed on a single node. Although for a
production cluster with more than 3 to 5 nodes, there are some guidelines for better
performance, availability and utilization of cluster hardware.

* Typically Hadoop services Master roles (e.g HDFS NameNode, YARN
  ResourceManager, HBase Master, HAWQ Master) should reside on separate
  nodes. They typically have more dedicated resource requirements and are
  responsible for direct communication to Hadoop client applications. Hadoop
  slaves running application tasks (map/reduce tasks) on the same node can
  potentially interfere with master resource requirements.
* Typically all the slave roles (e.g. HDFS DataNode, YARN NodeManager, HBase
  RegionServer, HAWQ SegmentServer) should be collocated on the cluster slave
  nodes. This helps provide optimal data locality for improved data access as well as
  better hardware utilization of cluster slave nodes.

* HBase requires Zookeeper. Typically the Zookeeper ensemble should have an odd
  number of Zookeeper servers. They don't need a dedicated node and can be
  co-located with master servers with ~ 1GB RAM and dedicated disk with ~ TB of
  space.
* Hadoop Clients (Hive, Pig etc.) explicitly required by Hadoop applications should
  typically be installed on the separate gateway node(s) depending on multi-user
  application requirements.

