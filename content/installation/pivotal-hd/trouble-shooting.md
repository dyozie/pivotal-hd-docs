---
title: Trouble Shooting
---

Debugging Errors
----------------

Pivotal Command Center has several logs. Finding the exact log can be challenging at
the beginning. Here is a quick guide on how to identify the issues.
Installation of GPHD Manager Errors

All installation errors will be logged under: /var/log/gphd/gphdmgr/installer.log
Cluster Deployment Errors

If you see a 500 Internal Server Error, check the following logs for details:

```xml
/usr/lib/gphd/gphdmgr/apache-tomcat/logs/catalina.out/var/log/gphd/gphdmgr/gphd
mgr-webservices.log

```
If you see Puppet cert generation error, check

```xml
/var/log/gphd/gphdmgr/gphdmgr-webservices.log
```
If config properties are not making into the cluster nodes, check

```xml
/var/log/gphd/gphdmgr/gphdmgr-webservices.log
```
If you see GPHDClusterInstaller.py script execution error, check

```xml
/var/log/gphd/gphdmgr/GPHDClusterInstaller_XXX.log

```
Sometimes /var/log/messages can also have good information especially if the
deployment fails during the puppet deploy stage.

In general if something fails on the server side, look at the logs in this order:

```xml

/usr/lib/gphd/gphdmgr/apache-tomcat/logs/catalina.out
/var/log/gphd/gphdmgr/gphdmgr-webservices.log
/var/log/gphd/gphdmgr/GPHDClusterInstaller_XXX.log
/var/log/messages
```

Cluster Nodes Installation Errors
---------------------------------

If there are no errors on the admin side, but the installation failed on the cluster nodes,
check the latest log file: /tmp/GPHDNodeInstaller_XXX.log
Search for the first occurrence of the word "merr" that will point to the most probable
issue.

Services Start Errors
----------------------

Check for the corresponding log file under /var/log/gphd/ directory.
For example, if the namenode does not start, look at the
/var/log/gphd/hadoop/hadoop-hdfs-namenode-hostname.log file for details.
Pivotal Command Centr requires the tomcat that is shipped with it.
Handling Puppet SSL errors

If there are errors like "Unable to generate certificates" or "SSLv3 authentication issues on the client"

Run the following commands.:

```xml
# service commander stop
# rm -rf /var/lib/puppet/ssl-icm/*
# service puppetmaster start
# service puppetmaster stop
# service commander start

```
And retry your deployment.

Installation failed during tomcat initialization
-------------------------------------------------

Ensure that there are no prior tomcat installations during the Pivotal Command Center
installation. Cluster deployment fails due to rpm dependencies

Ensure that the base OS repo is available. You might have to mount the CD that comes
with the OS installation or point yum at the right location like a NFS mount point on
all the cluster nodes.

The installation seems to fail with directory permission issues
---------------------------------------------------------------
Please check if the umask is set to 0022. If not please set the umask in the .bashrc as
"umask 0022" and retry the Pivotal Command Center installation.

The cluster deployment fails with messages like “Unable to contact
the yum repo” on the admin server
-------------------------------------------------------------------

Please verify that the admin node is reachable from the agent node.If you have
configured proxy servers, please refer to the section Working with Proxy servers in
the troubleshooting section on the work arounds.

Unable to access the namenode status webpage
--------------------------------------------

If the host returns a short hostname instead of FQDN for hostname(), it is possible that
the namenode status link cannot be accessed from external networks.

The solution is to either ensure that the hostname() returns FQDN on the namenode
host or change the "dfs.http.address" value to 0.0.0.0 in the hdfs-site.xml and restart
namenode.

```xml
<property>
<name>dfs.http.address</name>
<value>0.0.0.0:50070</value>
</property>

```
The installation fails with messages like “SSL certificate not found”
-----------------------------------------------------------------------
Check if "dnsdomainname" returns an empty value. If yes, you need to ensure that the
dnsdomainname returns the correct domain.

The cluster nodes are not getting installed and I don’t see the log
file under /tmp
--------------------------------------------------------------------
Ensure that passwordless ssh is setup between the admin node and the cluster nodes.

Ensure that the Puppet, Facter and Ruby rpms are the same as that on the admin node.

Ensure that the user "gpadmin" has sudo and no requiretty access on the cluster node
by checking for the existence of file: /etc/sudoers.d/gpadmin).

Then, retry the deployment.

Puppet certificate failure
--------------------------
Follow the instructions in the following section, Handling Puppet SSL errors.

Errors like package bundle not found
------------------------------------

If you sudo in to the system as root, please ensure that you sudo with the environment.
i.e, "sudo su -" Do not forget the hyphen at the end.

If you directly login as root with password and if you still see the above issue, add
`/usr/local/bin` to the PATH variable.

Cluster deployment fails due to missing nc or postgres-devel
------------------------------------------------------------

The above error can be identified by following the instructions in the Cluster Nodes
Installation Errors section above.

Install nc and postgres-devel packages on all the cluster nodes or point them to a repo
that contains the rpms.


Working with Proxy servers
----------------------------
It might sometimes be required for all outgoing http traffic to use a HTTP proxy. The
Pivotal Command Center installer might sometimes pull rpms from external repos like
epel6 repo if the external repos are configured and if any packages are missing on the
host. If you configure the proxy settings in /etc/yum.conf the cluster node, cluster
deployments might fail because yum will send all gphd.repo requests to the proxy
which in turn will fail to connect to the admin node local repo.


Here are a few workarounds:

Workaround 1
------------

* Remove the proxy settings from yum.conf and
* Make sure following params are set in ~root/.bashrc

For example:

```xml
export http_proxy=http://proxy:3333
export no_proxy=local.domain ## this is the local domain for hadoop cluster
```
*  Modify these files so gphd.repo gets pushed out with fqdn name instead of shortname: /etc/puppet/modules/yumrepo/templates/yumrepo.erb

```xml
Change from:

baseurl=http://< %= scope.lookupvar("params::config::admin_host") %>/<%=
scope.lookupvar("params::config::repopath") %>
Change to:

< replace node.full.domain.com > with the FQDN of the admin
node baseurl=http://node.full.domain.com/<%=
scope.lookupvar("params::config::repopath") %>
```

Workaround 2
------------

* Enable NFS and export /usr/lib/gphd/rpms to all cluster nodes
* Mount the nfs repo on all cluster nodes.

```xml
mount gpcc:/usr/lib/gphd/rpms /local_repo
```

* Modify these files: /etc/puppet/modules/yumrepo/templates/yumrepo.erb

```xml
Change from:
baseurl=http://<%= scope.lookupvar("params::config::admin_host") %>/< %=
scope.lookupvar("params::config::repopath") %>

Change to:


baseurl=file:///local_repo/

```

Capital letters in hostname
---------------------------

Pivotal Command Center might fail to deploy if the hostnames have capital letters in
them. For example: "Node0781.domain.com". You will have to rename the hostname
in lowercase before proceeding with the deployment.

Resolving postgres port conflict issue
--------------------------------------

If you happen to face a postgres port conflict do the following:
[root]# service commander stop

Add the new port localhost:5435 in the gphdmgr properties file

```xml

vim /etc/gphd/gphdmgr/conf/gphdmgr.properties
"icm_db_url = jdbc:postgresql://localhost:5435/gphdmgr"
Change the port number in postgresql.conf
vim /var/lib/pgsql/data/postgresql.conf
"port = 5435"
Also edit the init.d/postgresql file
vim /etc/init.d/postgresql
#Change the PGPORT to 5435
"PGPORT=5435"
[root]# service commander start

```
Resolving HTTP port conflict
-----------------------------

If an HTTP port conflict occurs do the following:

```xml

[root]# service commander stop
# Change the port in the tomcat server.xml file
vim /usr/lib/gphd/gphdmgr/apache-tomcat/conf/server.xml

#Change the 8080 in the follwoing line to your desired port:
<Connector port="8080" protocol="HTTP/1.1"
connectionTimeout="20000"
redirectPort="8443" />
#E.g:
<Connector port="8085" protocol="HTTP/1.1"
connectionTimeout="20000"
redirectPort="8443" />
#Replace 8080 with 8085 in the following file
sed -i 's/8080/8085/g&nbsp;
/usr/lib/gphd/gphdmgr/lib/client/InputReaders.py
[root]# service commander start
Seeing Errors like Ambit : Push Failed
If you see errors like the following:
[root]# icm_client add-user-gpadmin -f hosts
Ambit : Push Failed
Had : Push Failed
Issues : Push Failed
Generating : Push Failed
A : Push Failed
List : Push Failed

```
This is an ambit bug. If there are hostnames (only the name part, not the domain)
which are substrings of other hostnames then this issue seems to occur.

For example: host1.emc.com, host11.emc.com
This error can be ignored for now as the actual deployment still goes through.

HAWQ Performance Patch
----------------------
HAWQ requires the following patches currently to deploy on a large cluster.

GPHD Manager HAWQ Patch
------------------------

HAWQ requires updating two non standard properties. In order to use them in GPHD,
Manager you will need to add those properties to the GPHD Manager's property data
store as shown below.

```xml

# On the Admin Node
[gpadmin]# psql gphdmgr postgres
# Insert two new properties
gphdmgr=# insert into defaultconfigproperty(property_name,
property_value, cfg_file, service, gphd_version) values
('ipc.server.handler.queue.size', '3300', 'hdfs-site.xml',
'hdfs', '2.x');
gphdmgr=# insert into defaultconfigproperty(property_name,
property_value, cfg_file, service, gphd_version) values
('dfs.client.socket-timeout', '0', 'hdfs-site.xml', 'hdfs',
'2.x');
# Exit postgres
gphdmgr=# \q

```

Cluster Configuration HAWQ Patch
---------------------------------

Add the following properties to your cluster configuration prior to deploying the
cluster.

```xml
# Add to hdfs/core-site.xml <property>
<name>ipc.client.connection.maxidletime</name>
<value>3600000</value> </property>
# Add to hdfs/hdfs-site.xml : <property>
<name>dfs.datanode.max.transfer.threads</name>
<value>40960</value> </property> <property>
<name>dfs.client.socket-timeout</name>
<value>0</value> </property> <property>
<name>ipc.server.handler.queue.size</name>
<value>3300</value> </property> <property>
<name>dfs.datanode.handler.count</name>
<value>60</value> </property> <property>
<name>dfs.namenode.accesstime.precision</name>
<value>-1</value> </property>
```

Java HeapSpace Issues
---------------------
This may happen if mapreduce is not configured properly.

Change the following property in `/etc/gphd/hadoop/conf/mapred-site.xml` in the resourcemanager node.

from 
```xml
<property>
      <name>
             mapreduce.task.io.sort.mb
      </name>
      <value>
             512
      </value>
</property>
```
to
```xml
<property>
      <name>
             mapreduce.task.io.sort.mb
      </name>
      <value>
             256
      </value>
</property>
```

If you really need 512 MB for the buffer, you must increase the heap size for Map and Reduce tasks. Change the heapsize to 2048m for map and reduce tasks in `/etc/gphd/hadoop/conf/mapred-site.xml` 
```xml
<property>
      <name>
             mapreduce.map.java.opts
      </name>
      <value>
             -Xmx2048m
      </value>
</property>


<property>
      <name>
             mapreduce.reduce.java.opts
      </name>
      <value>
             -Xmx2048m
      </value>
</property>

```
Ideally it is better to change at the command center ClusterConfig directory and 
issue the following command from the command center.
```xml
gpadmin#icm_client reconfigure -l test -c ClusterconfigDir
```

Hbase Master not starting
--------------------------
Hbase Master starts and then exits with an error message saying Invalid permissions for reading the block.

Change the following property in hbase-site.xml

```xml

```

