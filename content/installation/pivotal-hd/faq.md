---
title: FAQ
---

Can we deploy multiple clusters from the same admin?

Can I modify the topology of the cluster?

Certain services like hadoop-hdfs-namenode or hadoop-hdfs-datanode do not come
up when I a start cluster.

What group and users are created by GPHD 2.x ?

What is the allowable time difference amongst the cluster nodes as compared to the
admin node?

Does Pivotal Command Center support simultaneous deployment of multiple
clusters?

Does Pivotal Command Center support hostnames both in IP address and FQDN
format?

Can a node be shared between different clusters?

I installed puppet-2.7.20 from the puppetlabs repo but Pivotal HD Mananger doesnt
seem to work?

How do I clean up the nodes if a cluster deployment failed?

How to convert maven hadoop mapreduce version 1.x project to version 2.x? 

## Can we deploy multiple clusters from the same admin?

Certainly. You can deploy any number of HD clusters from the same admin but
deploy them one after the other.

**Important:** Do not start two concurrent deployments from two different terminals.
Can I modify the topology of the cluster?

Unfortunately the current version doesn't support changing the topology. This feature
will be available in one of the future releases.

##Certain services like hadoop-hdfs-namenode or

##hadoop-hdfs-datanode do not come up when I a start cluster.


Refer to the section on debugging errors in the “Troubleshooting” section. It might
also happen that the ports being used by the specific service are already in use. Please
verify if the port is already being used using -netstat -na. And kill the existing process
if necessary.

##What group and users are created by GPHD 2.x ?

Please refer to the section for details about the users and directories created by GPHD.

## What is the allowable time difference amongst the cluster nodes as

## compared to the admin node?

The tolerable time difference on the cluster nodes as compared to the admin node
where the GPHD Manager is installed is +/-60 secs of admin node time. If the time
difference is more than this the SSL authentication might fail leading to cluster
deployment failures.

## Does Pivotal Command Center support simultaneous deployment of  multiple clusters?

No. Concurrent deploys are not allowed. Please wait until the first deploy is complete
before starting another.

## Does Pivotal Command Center support hostnames both in IP address and FQDN format?

Yes, both formats are supported.

## Can a node be shared between different clusters?

No, nodes cannot be shared between clusters.

## I installed puppet-2.7.20 from the puppetlabs repo but Pivotal HD

## Mananger doesnt seem to work?

Pivotal HD Manager requires the version of puppet shipped with the product and not
the one on the puppetlabs repo. Please uninstall puppet and install the one shipped
with the product using the icm_client preparehosts command.

## How do I clean up the nodes if a cluster deployment failed?

Uninstall the cluster using the icm_client command then try deploying the cluster
again.

## How do I clean up the nodes if a cluster deployment failed?

Uninstall the cluster using the icm_client command then try deploying the cluster
again.

## How to convert maven hadoop mapreduce version 1.x project to version 2.x? 

 To convert maven hadoop mapreduce version 1.x project to version 2.x then add the following dependencies to your pom.xml and 
remove all the 1.x dependencies .

```xml
<dependency>
       <groupId>org.apache.hadoop</groupId>
       <artifactId>hadoop-client</artifactId>
       <version>2.0.4-alpha</version>
</dependency>

<dependency>
       <groupId>org.apache.mrunit</groupId>
       <artifactId>mrunit</artifactId>
       <classifier>hadoop2</classifier>
       <version>0.9.0-incubating</version>
</dependency>
```


