---
title: Apache Stack Installation
---

This chapter describes the Apache stack tools and data.

Installation Instructions
-------------------------
The following sections include installation instructions for individual components.

<span style="color: blue">

Hive

Spring Data

HVE

Kerberos

Vaidya

USS

Data Loader

USS

Flume

Sqoop

</span>

Hive
----
You need to set up a MySQL DB and other directory permissions, before using the
command line to install it.

**Components:** hive-server, hive-metastore, hive-dbserver, hive-client
**Prerequisite:** Hdfs, MapReduce
Check that you have installed MySQL.
Pivotal HD mandates using Hive Metastore backed by a DB Server.

**Parameters overridden by GPHD**
```xml
hive.metastore.warehouse.dir = /hive/gphd/warehouse
```
hive.metastore.local = false
The following table describes the configuration parameters that you can modify for
Hive.

**Table 1**  Hive Parameters

|Parameter |  Config file | |Comment |
|Hive Server | NA | Single hostname |
| Hive Metastore Server|  NA | Single hostname |
| Database Host| NA | Hive Database Server which has a MySQL database
                      preinstalled|
| Hive database name | NA | Default: gphdhive |
| Hive database | NA | Default: hive |
  username 
|Hive database | NA | Default: hive |
 password 
|Hive Clients | NA | Comma separated hostnames |
|MySQL connection jar | NA |Full path to the local filesystem location of MySQL
                            Connection jar (with read permission enabled) |
Installing Hive
---------------

To set up the HIVE_METASTORE

1. Choose one of the cluster nodes as HIVE_METASTORE.

2. Login to the host as root.

```xml
$> yum install mysql
```
3.Download the mysql connector, untar, and copy the mysql-connector-java-*
directory to the desired location.
The path of the mysql-connector-java*.jar file is required during Hive installation.
```xml
$> curl -L
'http://dev.mysql.com/get/Downloads/Connector-J/mysql-connect
or-java-5.1.22.tar.gz/from/http://cdn.mysql.com' | tar zx
```
To set up MySQL Server
----------------------

1. Choose the mysql server node for the Hive metadata database.

2. Login as root to the node to install mysql DBMS.

```xml
$> yum install mysql
$> yum install mysql-server

```
3. Go to the mysql command prompt.

4. Press **Enter** after the following command if you do not want to set a password.

```xml
$> mysql -p

```
In the mysql prompt, run the following commands.
Run the hostname command on the host to find the fully
qualified hostname (FQDN) for the host.

```xml
MySql> CREATE USER 'hive'@'<Enter current hostname here>'
IDENTIFIED BY 'hive';
MySql> GRANT ALL PRIVILEGES ON *.* TO 'hive'@'%' IDENTIFIED BY
'hive';
MySql> GRANT ALL PRIVILEGES ON *.* TO 'hive'@'<Enter Hive
Metastore hostname here>' IDENTIFIED BY 'hive';

```
To complete Hive post-installation

1. Login to one of the cluster nodes as root.

2. Create hive.warehouse.dir
```xml
$> sudo -u hdfs hadoop fs -mkdir /hive/gphd/warehouse
```
3.Set permissions for hive.warehouse.dir.
```xml
$> sudo -u hdfs hadoop fs -chmod 775 /hive/gphd/warehouse

```
4.Set the ownership for hive.warehouse.dir

```xml
$> sudo -u hdfs hadoop fs -chown hadoop:hadoop
/hive/gphd/warehouse

```

Configuring a Secure Hive Cluster
---------------------------------
Follow the instructions below to configure Hive for a security-enabled HD cluster.

If you are running Hive in a standalone mode using a local or embedded MetaStore
you do not need to make any modifications.

The Hive MetaStore supports Kerberos authentication for Thrift clients. You can
configure a standalone Hive MetaStoreServer instance to force clients to authenticate
with Kerberos by setting the property hive.metastore.sasl.enabled property in the
hive-default.xml configuration file to true, as shown in the example below.
Add the Kerberos principals and their locations to the hive-default.xml or
hive-site.xml (if you are user). For example:
```xml
<property>
<name>hive.metastore.sasl.enabled</name>
<value>true</value>
<description>If true, the metastore thrift interface will be
secured with SASL. Clients must authenticate with
Kerberos. </description>
</property>
<property>
<name>hive.metastore.kerberos.keytab.file</name>
<value>/etc/*****/hive.keytab</value>
<description>The path to the Kerberos Keytab file containing
the metastore thrift server's service
principal. </description>
</property>
<property>
<name>hive.metastore.kerberos.principal</name>
<value>hive-metastore/_HOST@EXAMPLE.COM</value>
<description>The service principal for the metastore thrift
server. The special string _HOST will be replaced
automatically with the correct host name.</description>
</property>
```

Spring Data
-----------
Spring for Apache Hadoop provides support for writing Apache Hadoop applications
that benefit from the features of Spring, Spring Batch, and Spring Integration. For
more information, please refer to the Spring Data official page:

[http://www.springsource.org/spring-data/hadoop] (http://www.springsource.org/spring-data/hadoop)

Installing Spring Data Hadoop
-----------------------------
Download and copy GPHD Tools Tarball to /home/gpadmin/. Make sure the tarball
has read permission for user 'gpadmin'. To extract the GPHDTools tarball:
```xml

[root@hdp2-w17 gpadmin]# chown gpadmin:gpadmin
GPHDTools-1.0.0-31.tar.gz
[root@hdp2-w17 gpadmin]# ls -lrt GPHDTools-1.0.0-31.tar.gz
-rw-r--r-- 1 gpadmin gpadmin 499930679 Mar 20 20:12
GPHDTools-1.0.0-31.tar.gz
[root@hdp2-w17 gpadmin]# sudo su - gpadmin
[gpadmin@hdp2-w17 ~]$ tar xzvf GPHDTools-1.0.0-31.tar.gz
[gpadmin@hdp2-w17 ~]$ ls -lrt GPHD*
drwxrwxr-x 5 gpadmin gpadmin
GPHDTools-1.0.0-31
4096 Mar 20 00:35
-rw-r--r-- 1 gpadmin gpadmin 499930679 Mar 20 20:12
GPHDTools-1.0.0-31.tar.gz
[gpadmin@hdp2-w17 ~]$ cd
GPHDTools-1.0.0-31/spring-data-hadoop/rpm/
[gpadmin@hdp2-w17 rpm]$ ls -lrt
total 1580
-rw-rw-r-- 1 gpadmin gpadmin 1610604 Mar 20 00:04
spring-data-hadoop-1.0.1.RC1-3.noarch.rpm
-rw-rw-r-- 1 gpadmin gpadmin
76 Mar 20 00:44
spring-data-hadoop-1.0.1.RC1-3.noarch.rpm.md5
```
Installing Spring Data Hadoop through RPM
------------------------------------------

To install Spring Data Hadoop through RPM:

```xml
[gpadmin@hdp2-w17 rpm]$ pwd
/home/gpadmin/GPHDTools-1.0.0-31/spring-data-hadoop/rpm
[gpadmin@hdp2-w17 rpm]$ sudo rpm -ivh
spring-data-hadoop-1.0.1.RC1-3.noarch.rpm
Preparing...
########################################### [100%]
1:spring-data-hadoop
########################################### [100%]
[gpadmin@hdp2-w17 rpm]$ sudo rpm -qa |grep spring
spring-data-hadoop-1.0.1.RC1-3.noarch
Using Spring Data Hadoop
By default, Spring Data Hadoop is installed to /usr/local/gphd/ directory.
[gpadmin@hdp2-w17 ~]$ cd
/usr/local/gphd/spring-data-hadoop-1.0.1.RC1
[gpadmin@hdp2-w17 spring-data-hadoop-1.0.1.RC1]$ ls -lrt
total 36
-rw-r--r-- 1 root root
861 Oct 11 01:32 readme.txt
-rw-r--r-- 1 root root 11357 Oct 11 01:32 license.txt
-rw-r--r-- 1 root root 1151 Mar
4 06:19 notice.txt
drwxr-xr-x 2 root root 4096 Mar 20 20:49 dist
drwxr-xr-x 4 root root 4096 Mar 20 20:49 docs
drwxr-xr-x 3 root root 4096 Mar 20 20:49 schema
drwxr-xr-x 2 root root 4096 Mar 20 20:49 samples
Note: Please refer to readme.txt and files within docs/ directory, to start using Spring Data
Hadoop.

```xml

HVE
---
###Hadoop Virtualization Extensions

Hadoop Virtualization Extensions (HVE) allows Hadoop clusters implemented on
virtualized infrastructure full awareness of the topology on which they are running,
thus enhancing the reliability and performance of these clusters.

HIVE should be enabled in the following situations:

* When there is more than one Hadoop VM per physical host in virtualized
   environments
* When DataNodes and TaskTrackers exist in separate virtual machines in
   virtualized environments, so as to achieve graceful scaling of the compute
  component of the Hadoop cluster.
* When there is a topology layer between host and rack (e.g. chassis), which can
   affect the failure/locality group between hosts, in non-virtualized environments.

Kerberos
--------

Kerberos is a network authentication protocol that provides strong authentication for
client/server applications using secret-key cryptography.

You must install and configure Kerberos to enable security in Pivotal HD 1.0.

The Hive MetaStore supports Kerberos authentication for Thrift clients. You can
configure a standalone Hive MetaStoreServer instance to force clients to authenticate
with Kerberos by setting the property hive.metastore.sasl.enabled property in the
hive-default.xml configuration file to true, as shown in the example below.

Add the Kerberos principals and their locations to the hive-default.xml or
hive-site.xml (if you are user). For example:

```xml
<property>
<name>hive.metastore.sasl.enabled</name>
<value>true</value>
<description>If true, the metastore thrift interface will be
secured with SASL. Clients must authenticate with
Kerberos. </description>
</property>
<property>
<name>hive.metastore.kerberos.keytab.file</name>
<value>/etc/*****/hive.keytab</value>
<description>The path to the Kerberos Keytab file containing
the metastore thrift server's service
principal. </description>
</property>
<property>
<name>hive.metastore.kerberos.principal</name>
<value>hive-metastore/_HOST@EXAMPLE.COM</value>
<description>The service principal for the metastore thrift
server. The special string _HOST will be replaced
automatically with the correct host name.</description>
</property>

```xml

Installing the Kerberos Key Distribution Center Master
------------------------------------------------------

Follow the steps below to install the Kerberos KDC Master:

1. Use NTP to synchronize the time across all nodes.
It is important to synchronize the time of the Kerberos server across all clients. If the
time difference between the Kerberos server and a client is big enough (configurable,
5 minutes is the default), authentication fails.
2. Download the krb5-libs, krb5-server, and krb5-workstation packages from
  Kerberos.
3. Install the packages on the Kerberos Master server in CentOS/RHEL
  environments.
4. Run the following command:

```xml
yum install <package>

```

5. Edit the */etc/krb5.conf* and */var/kerberos/krb5kdc/kdc.conf*
configuration files to reflect the realm name and domain-to-realm mappings.

Sample /etc/krb5.conf
---------------------

```xml
[logging]
default = FILE:/var/log/krb5libs.log
kdc = FILE:/var/log/krb5kdc.log
admin_server = FILE:/var/log/kadmind.log
[libdefaults]
default_realm = HD.GREENPLUM.COM
dns_lookup_realm = false
dns_lookup_kdc = false
ticket_lifetime = 24h
forwardable = yes
udp_preference_limit = 1
default_tgs_enctypes = des3-hmac-sha1
default_tkt_enctypes = des3-hmac-sha1
permitted_enctypes = des3-hmac-sha1
[realms]
HD.GREENPLUM.COM = {
kdc = myhost.mydomain:88
admin_server = myhost.mydomain:749
default_domain = mydomain }
[domain_realm]
.mydomain = HD.MYCOMPANY.COM
mydomain = HD.MYCOMPANY.COM
[appdefaults]
pam = {
debug = false
ticket_lifetime = 36000
renew_lifetime = 36000
forwardable = true
krb4_convert = false
}

```
Sample /var/kerberos/krb5kdc/kdc.conf
-------------------------------------
```xml
[kdcdefaults]
v4_mode = nopreauth
kdc_tcp_ports = 88
[realms]
HD.GREENPLUM.COM = {
master_key_type = des3-hmac-sha1
acl_file = /var/kerberos/krb5kdc/kadm5.acl
dict_file = /usr/share/dict/words
admin_keytab = /var/kerberos/krb5kdc/kadm5.keytab
supported_enctypes =
aes256-cts:normal aes128cts:normal
des3-hmac-sha1:normal arcfour-hmac:normal
des-hmac-sha1:normal des-cbc-md5:normal
des-cbc-crc:normal des-cbc-crc:v4
des-cbc-crc:afs3 }
```
6. Use the command line kdb5 utility to create the KDC database, as follows:
```xml
/user/kerberos/sbin/kdb5_util create \-s
```

The create command creates the database to store keys for the Kerberos realm that is
managed by this KDC server. The s option creates a stash file. Without the stash file,
every time the KDC server starts it asks for a password.

7. Edit the /var/kerberos/krb5kdc/kadm5.acl file as kadmin uses this file to
control which Kerberos principals have administrative access to Kerberos
database.

###For example:

```xml
kdcadmin/admin@HD.MYCOMPANY.COM
```

**Note:**Most users do not need administrative access to the KDC server. They can use
kadmin to manage their own principals (for example, to change their own password).

**Note:**kadmin itself uses Kerberos to authenticate to the server, so before using
kadmin, you need to add the administrative user to KDC database by running
kadmin.local. kadmin.local is local to the server and does not use Kerberos
authentication. To add the administrative user to the KDC database, run the following
command.

```xml
/usr/kerberos/sbin/kadmin.local \-q "addprinc
adminusername/admin"


```
8. Start the Kerberos daemons using following commands:

```xml
/sbin/service krb5kdc start
/sbin/service kadmin start
/sbin/service krb524 start
If you want to start Kerberos automatically upon restart, run the following commands:
/sbin/chkconfig krb5kdc on
/sbin/chkconfig kadmin on
/sbin/chkconfig krb524 on

```
9. Verify that your Kerberos installation is running correctly:

**a.**  Run the kinit command to obtain a ticket and store it in the cache:

```xml
[hadoop@myhost ~]$ kinit
Password for hadoop@HD.MYCOMPANY.COM

```
**b.**Run the klist command to check the token issued:
```xml
[hadoop@myhost ~]$ klist
Ticket cache: FILE:/tmp/krb5cc_500
Default principal: hadoop@HD.MYCOMPANY.COM
Valid starting
Expires
Service principal
10/16/11 22:43:34 10/17/11 22:43:34
krbtgt/HD.MYCOMPANY.COM@HD.MYCOMPANY.COM
Kerberos 4 ticket cache: /tmp/tkt500
klist: You have no tickets cached

```
Vaidya
------

Vaidya is a diagnostic tool for Map/Reduce jobs. After a job is executed successfully,
it uses job history log and job configuration information to identify any
performance/scalability problems with the job. Upon execution, it provides a job
analysis report indicating specific problems with the job along with the remedy to
rectify them.

###Note: The Vaidya tool does not analyze failed jobs either for performance/scalability
###        problems nor for the reasons of failure.

At present Vaidya tool consumes "job-history log" and "job configuration"
information for the analysis, though in future more information sources can be
included such as job scheduling information, and system metrics such as CPU, RAM,
Disk/Network IO-bandwidth, etc.

Vaidya tool includes diagnostic rules (also referred to as "tests") where each rule
analyzes a specific problem with the M/R job. Diagnostic rule is written as a Java
class and captures the logic of how to detect a specific problem condition with the
M/R job. Each diagnostic rule takes job history log and job configuration information
provided to it using a standard structured interface. The standard interface allows
admin/developers to independently add more diagnostic rules in the Vaidya tool.

Typically, a Hadoop application user (M/R user submitting jobs on the cluster) will
not be writing the new diagnostic rules but rather running the tool with an embedded
set of rules for analyzing their job performance, while cluster service providers and
administrators will add new diagnostic rules to Vaidya tool developed and provided
by Hadoop experts. 

It has a command line interface to take the "Job History Log" file, "Job Configuration"
file and a "Rules Configuration" file as input and returns the job analysis report as an
output XML document. After M/R job execution, job configuration and job history
log files are typically stored for each job under the job history log directory on HDFS.
You need to copy them locally on the client node before providing them as input to
Vaidya tool.

The Vaidya rules configuration file (in xml format), lists all the diagnostic rules to be
executed by Vaidya tool. The java classes for these diagnostic rules can either be part
of Vaidya tool's jar file (i.e. rules that are embedded with Vaidya tool itself) or they
should be in the class path that Vaidya tool can find during the execution. The Rules
configuration file has a separate XML element for each diagnostic rule, providing the
"rule description", "rule java class name", "rule importance", "rule success threshold"
and "rule remedy" section. Vaidya tool refers to rules configuration file to execute the
corresponding Java classes. Each diagnostic rule java class, when executed, returns an
"impact" value between 0.0 and 1.0, indicating how severe the diagnostic condition is
tested by the rule for a given job, where closer to 1.0 means more severe. Vaidya tool
uses the "rule success threshold" to binarize the impact into either passed/failed status.
The "rule importance" indicates relative importance of the rule, specified as "High",
"Medium" & "low" i.e. failure of high importance rule is more severe than failure of
"low" importance rule. Typically remedy for the diagnostic rule is documented in the
corresponding java class itself, but you can override it by specifying it in the rules
description.

Diagnostic Rule Test
```xml

<DiagnosticTest>
<Title>Balanaced Reduce Partitioning</Title>
<ClassName>
org.apache.hadoop.vaidya.postexdiagnosis.tests.Balanc
edReducePartitioning
</ClassName>
<Description>
This rule tests as to how well the input to reduce
tasks is balanced
</Description>
<Importance>High</Importance>
<SuccessThreshold>0.40</SuccessThreshold>
<Prescription>advice</Prescription>
<InputElement>
<PercentReduceRecords>0.85</PercentReduceRecords>
</InputElement>
</DiagnosticTest>
</ReferenceDetails>
<TestPrescription>

```xml
* Use the appropriate partitioning function

* For streaming job consider following partitioner and
hadoop config parameters

* org.apache.hadoop.mapred.lib.KeyFieldBasedPartitioner

* -jobconf stream.map.output.field.separator,

-jobconf stream.num.map.output.key.fields
</TestPrescription>
</TestReportElement>

```

Vaidya tool returns a diagnostic report as an XML document with one report element
for each rule executed. The report element includes, "rule title", "rule description",
"rule importance", "rule severity", "reference details" & "remedy/prescription" to
rectify the problem. The "rule severity", is a product of rule impact and the rule
importance.

Test Report Element in the diagnostic report
---------------------------------------------

```xml
<TestReportElement>
<TestTitle>Balanaced Reduce Partitioning</TestTitle>
<TestDescription>
This rule tests as to how well the input to reduce tasks
is balanced
</TestDescription>
<TestImportance>HIGH</TestImportance>
<TestResult>POSITIVE(FAILED)</TestResult>
<TestSeverity>0.69</TestSeverity>
<ReferenceDetails>
* TotalReduceTasks: 4096
* BusyReduceTasks processing 0.85% of total records:
3373
* Impact: 0.70
```
USS
----
USS is available as an alpha release in the GPHDTools tarball in Pivotal HD 1.0.
Documentation for USS can be found in the README file that is shipped with
Pivotal HD 1.0.

Data Loader
-----------
See the Data Loader Installation and User Guide for detailed information.

Flume
-----

Flume is a distributed, reliable, and available service for efficiently collecting,
aggregating, and moving large amounts of log data. It has a simple and flexible
architecture based on streaming data flows. It is robust and fault tolerant with tunable
reliability mechanisms and many failover and recovery mechanisms. It uses a simple
extensible data model that allows for online analytic application. For more info, please
refer to the Apache Flume page: [http://flume.apache.org/] (http://flume.apache.org/)
The base version of Flume is Apache Flume 1.3.1.

Sqoop
-----
Sqoop is a tool designed for efficiently transferring bulk data between Apache Hadoop
and structured datastores such as relational databases. For more details, please refer to
Apache Sqoop page: [http://sqoop.apache.org/] (http://sqoop.apache.org/)
The base version of Squoop is Apache Squoop 1.4.2.


