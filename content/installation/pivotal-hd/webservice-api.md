---
title: Webservice API
---

The following are the topics covered in the WebService API:

* **Scanhost**

* **Listing all stacks**

* **Listing all clusters**

* **Listing a particular cluster**

* **Fetching a template**

* **Deploying a cluster**

* **Starting a cluster**

* **Stopping a Cluster**

* **Uninstalling a cluster**

* **Getting the install status**

##Scanhost


**Resource:** POST /scanhosts

**Description:** API to scan the hosts for prerequisites. This step is usually done before
deploying a cluster to check the prerequisite status of each node.

**HTTP Request Header:** Content-type: application/json
Sample URL: curl -X POST -d @inputfile

```bash
http://localhost:8080/gphdmgr/v1/scanhosts --header "Content-Type:application/json"
Input (sample inputfile):
{
"hostList": [
"node0742",
"node0743",
"node0744"
],
"auth": {
"username": "root",
"publicKey": "",
"password": "",
"privateKey": "",
"passphrase": ""
}
}

Success:
200 OK

{
"failedHostList": {},
"okHostList": {
"node0742": [
"[OK] SELinux is disabled.",
"[OK] Clocks are synchronized.",
"[OK] Time difference between clocks within
acceptable threshold.",
"[OK] Sun Java(TM) SE Runtime Environment Version
1.6 or above found.",
"[OK] Puppet-2.7.20 installed.",
"[OK] sshpass installed"
],
"node0743": [
"[OK] SELinux is disabled.",
"[OK] Clocks are synchronized.",
"[OK] Time difference between clocks within
acceptable threshold.",
"[OK] Sun Java(TM) SE Runtime Environment Version
1.6 or above found.",
"[OK] Puppet-2.7.20 installed.",
"[OK] sshpass installed"
],
"node0744": [
"[OK] SELinux is disabled.",
"[OK] Clocks are synchronized.",
"[OK] Time difference between clocks within
acceptable threshold.",
"[OK] Sun Java(TM) SE Runtime Environment Version 1.6 or above
found.",
"[OK] Puppet-2.7.20 installed.",
"[OK] sshpass installed"
]
}
}
```
No results:
200 OK {}
Unknown errors:
500 Internal Server Error

##Listing all stacks

**Resource:** GET /stacks

**Description:** API to get the stacks that have been imported into Pivotal Command
Center. 

**For example:** HD 1.2, HD 2.0 PADS HTTP Request Header: Content-type:
application/json

**Sample URL:**

```bash
 curl -X GET "http://localhost:8080/gphdmgr/v1/stacks"
Input:
Success:
200OK
```

```bash
\[
{
"name": "gphd",
"services": \[
{
"dependsOn": \[\],
"description": "Apache Hadoop Distributed File System",
"name": "hdfs",
"roles": \[
{
"category": "master",
"dependsOn": [],
"description": "Master server that
manages the file system namespace and regulates access to files
by clients",
"name": "namenode"
},
{
"category": "master",
"dependsOn": [
"namenode"
],
"description": "Helper to the primary
NameNode that is responsible for supporting periodic
checkpoints of the hdfs metadata",
"name": "secondarynamenode"
},{
"category": "slave",
"dependsOn": [
"namenode"
],
"description": "The slave for hdfs",
"name": "datanode"
}
\]
},
{
"dependsOn": \[
"hdfs"
\],
"description": "Apache Hadoop Distributed Processing Framework
- Hadoop NextGen MapReduce",
"name": "yarn",
"roles": \[
{
"category": "master",
"dependsOn": [
"yarn-resourcemanager",
"yarn-nodemanager"
],
"description": "",
"name": "mapreduce-historyserver"
},
{
"category": "master",
"dependsOn": [],
"description": "",
"name": "yarn-resourcemanager"
},{
"category": "slave",
"dependsOn": [
"yarn-resourcemanager"
],
"description": "",
"name": "yarn-nodemanager"
}
\]
}
"status": "ACTIVE",
"
version": "2.0"
}
\]
No results:
200 OK[]
Bad request: E.g.: Wrong version number
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid input format"
}
Unknown errors:
No results:
200 OK[]
Bad request: E.g.: Wrong version number
400 Bad Request
{
"error":"Invalid input"
"description": "Invalid input format"
}

Unknown errors:
500 Internal Server Error

```

##Listing all clusters


**Resource:** GET /clusters

**Description:** API to get all the installed clusters

**HTTP Request Header:** Content-type: application/json

**Sample URL:**

```bash
curl -X GET "http://localhost:8080/gphdmgr/v1/clusters
Success:
200 OK
```
```bash
[
{
"cfgVersion": 1,
"gphdVersion": "2.0",
"id": 1,
"name": "test",
"services": [
{
"name": "hbase",
"roles": [
{
"hostNames": [
"node0744",
"node0743",
"node0742"
],
"name": "hbase-regionserver"
},
{
"hostNames": [
"node0744"
],
"name": "hbase-master"
}
]
}, ...
]
"status": "installed"
}
]

No results:
200 OK[]
Bad request: E.g.: Wrong version number
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid input format"
}

Unknown errors:
500 Internal Server Error
```

## Listing a particular cluster


**Resource:** POST /clusters/{clusterId}

**Description:** API to get the details of a particular cluster

**HTTP Request Header:** Content-type: application/json

**Sample URL:**

```bash
 curl -X GET "http://localhost:8080/gphdmgr/v1/clusters/1
Success:
200 OK
```

```bash
[
{
"cfgVersion": 1,
"gphdVersion": "2.0",
"id": 1,
"name": "test",
"services": [
{
"name": "hdfs",
"roles": [
{
"hostNames": [
"node0742"
],
"name": "namenode"
},
{
"hostNames": [
"node0742",
"node0744",
"node0743"
],
"name": "datanode"
},
{
"hostNames": [
"node0743"
],
"name": "secondarynamenode"
}
]
},
{
"name": "yarn",
"roles": [
{
"hostNames": [
"node0742"
],
"name": "yarn-resourcemanager"
},
{
"hostNames": [
"node0744",
"node0743",
"node0742"
],
"name": "yarn-nodemanager"
},
{
"hostNames": [
"node0743"
],
"name": "mapreduce-historyserver"
}
]
}, ...
],
"status": "installed"
}
]

No results:
200 OK[]
Bad request: E.g.: Wrong cluster id
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid cluster"
}

Unknown errors:
500 Internal Server Error
```

##Fetching a template

**Resource:** GET /configurations/default/{stackVersion}

**Description:** API to get the default template. This template will be updated and used for deploying the cluster using the deploy API.

**HTTP Request Header:** Content-type: application/json

**Sample URL:**

```bash
 curl -X GET
"http://localhost:8080/gphdmgr/v1/configurations/default/2.0" Input:
Success:
200 OK
```
```bash
{
"clusterConfigFiles": [
{
"content": "<?xml version=\"1.0\" ...,
"name": "clusterConfig.xml",
"type": "text"
}
],
"services": [
{
"configFiles": [
{
"content": "# FILE NAME: ...,
"name": "gpinitsystem_config",
"type": "text"
}
],
"name": "hawq"
},
{
"configFiles": [
{
"content": "# See
http://wiki.apache.org/hadoop/GangliaMetrics ...,
"name": "hadoop-metrics.properties",
"type": "text"
},
{
"content": "<?xml version=\"1.0\"?>...,
"name": "hbase-site.xml",
"type": "text"
}
],
"name": "hbase"
}, ...
]
}

No results:
200 OK {}
Bad request: E.g.: Wrong version number
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid input format"
}
Unknown errors:
500 Internal Server Error
```

##Deploying a cluster


@Path("/clusters")

**Resource:** POST /clusters

**Description:** API to deploy the cluster. The updated template (obtained from the template API) is sent as a POST input for this API.

**HTTP Request Header:** Content-type: application/json

**Sample URL:** 

```bash
curl -X POST -d
@inputfile http://localhost:8080/gphdmgr/v1/clusters&nbsp;--header
```
```bash
 "Content-Type:application/json"Input (Sample inputfile) :

{
"services": [
{
"configFiles": [
{
"content": "# FILE NAME:
gpinitsystem_config ...,
"type": "text",
"name": "gpinitsystem_config"
}
],
"name": "hawq"
},
{
"configFiles": [
{
"content": "# See
http://wiki.apache.org/hadoop/GangliaMetrics... ,
"type": "text",
"name": "hadoop-metrics.properties"
},
{
"content": "<?xml
version=\"1.0\"?>\n<?xml-stylesheet ...,
"type": "text",
"name": "hbase-site.xml"
}, ...
]
}

Success:
200 OK
No results:
200 OK[]
Bad request:E.g.: Wrong version number
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid input format"
}

Unknown errors:
500 Internal Server Error
```

##Starting a cluster


**Resource:**Resource POST /cluster/{clusterName}/start

**Resource Description:**Resource API to start the cluster HTTP Request Header: Content-type:
application/json

**Sample URL:**
```bash
 curl -X GET
"http://localhost:8080/gphdmgr/v1/cluster/test/start?force=1"
Success:
200 OK
```
```bash
Cluster Start Complete

No results:
200 OK[]
Bad request: E.g.: Wrong cluster name
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid cluster"
}

Unknown errors:
500 Internal Server Error
```

##Stopping a cluster


**Resource:** POST /cluster/{clusterName}/stop
**Description:** API to stop the cluster
**HTTP Request Header:** Content-type: application/json

**Sample URL:**

```bash
 curl -X GET
"http://localhost:8080/gphdmgr/v1/cluster/test/start?force=1"

Success:
200 OK
```
```bash
Cluster Start Complete

No results:
200 OK[]
Bad request:E.g.: Wrong cluster name
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid cluster"
}

Unknown errors:
500 Internal Server Error
```
##Uninstalling a cluster


@Path("/cluster/{clusterName}")

**Resource:** DELETE /cluster/{clusterName}

**Description:** API to delete a cluster HTTP Request

**Header:** Content-type: application/json

**Sample URL:** 

```bash
curl -X DELETE "http://localhost:8080/gphdmgr/v1/clusters/1" Input:
Success:
200 OK
```
```bash
Uninstall complete

No results:
200 OK[]
Bad request:
E.g.: Wrong cluster name
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid cluster"
}

Unknown errors:
500 Internal Server Error
```

##Getting the install status


**Resource:** POST /clusters/{clusterId}/status

**Description:** API to get the install status of a cluster

**HTTP Request Header:** Content-type: application/json

**Sample URL:**

```bash
 curl -X GET
"http://localhost:8080/gphdmgr/v1/clusters/2/status" Input:
Success:
200 OK
```
```bash
[
{
"clusterId": 2,
"hostname": "node0744",
"installPercentage": 100,
"messages": "[INFO] Puppet Sync Finished",
"status": "INSTALLED"
},
{
"clusterId": 2,
"hostname": "node0743",
"installPercentage": 100,
"messages": "[INFO] Puppet Sync Finished",
"status": "INSTALLED"
},
{
"clusterId": 2,
"hostname": "node0742",
"installPercentage": 100,
"messages": "[INFO] Puppet Sync Finished",
"status": "INSTALLED"
},
]

No results:
200 OK[]
Bad request:E.g.: Wrong cluster id
400 Bad Request

{
"error":"Invalid input"
"description": "Invalid cluster"
}

Unknown errors:
500 Internal Server Error
```

