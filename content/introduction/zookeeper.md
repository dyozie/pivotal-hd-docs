---
title: ZooKeeper
---

Overview
--------

About ZooKeeper
----------

ZooKeeper maintains common objects needed in large clusters environments.  Some of the examples of objects are
configuration information, hierarchical naming space, and so on.

An application can create a state in what is called as znode within Zookeeper. The znode can be updated by
any node in the cluster and any node in the cluster can register to be informed of changes to that znode.
Using this znode infrastructure applications can synchronize their tasks across the distributed cluster
by updating their status in a ZooKeeper znode, which would then
inform the rest of the cluster of a specific node’s status change. This cluster-wide status centralization
service is essential for management and serialization tasks across a large distributed set of servers.
Applications can leverage these services to coordinate distributed processing across large clusters.
