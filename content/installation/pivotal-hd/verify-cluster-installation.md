---
title: Verifying Clsuter Installation
---

Service Status Verification
--------------------------

You can use the service status command to check the running status of a particular
service role from its appropriate host(s).
Please refer to the Role/Host Level Operation that shows the service commands for
each Pivotal HD service role.
To check the service status for all the services at once, from the admin node, run the
following command to show an aggregate status view of all service roles from all the
cluster nodes:
# Create a newline separated file named 'hostfile' containing all the
cluster hosts (do not include admin host here, hbase is optional) \\
```xml
[gpadmin]\# massh hostfile verbose 'sudo service --status-all |
egrep "hadoop | zookeeper | hbase"'
```
Below is an example to check the status of all datanodes in the cluster.
# Create a newline separated file named 'hostfile' containing
all the datanode belonging to the service role \\
```xml
[gpadmin]\# massh hostfile verbose 'sudo service
hadoop-hdfs-datanode status'
```
Running Sample Programs
-----------------------

Make sure you are logged in as user 'gpadmin' on the appropriate host before testing
the service.

Hadoop Test
-----------
**Important:** Hadoop commands can be executed from any configured hadoop
nodes.
**Important:** Map reduce jobs can be run from any of the datanodes/resource
manager/historyserver. Once logged in to one of the above.
```xml
#clear input directory, if any |
hadoop fs -rmr /tmp/test_input
#create input directory
hadoop fs -mkdir /tmp/test_input
#ensure output directory does not exist
hadoop fs -rmr /tmp/test_output
#copy some file having text data to run word count on
hadoop fs -copyFromLocal /usr/lib/gphd/hadoop/CHANGES.txt
/tmp/test_input
#run word count
hadoop jar
usr/lib/gphd/hadoop/hadoop-examples-1.0.3-gphd-1.2.0.0.jar
wordcount /tmp/test_input /tmp/test_output
#dump output on console
hadoop fs -cat /tmp/test_output/part*
```

**Important:** When you run a map reduce job as any custom user outside of the
following list of users (gpadmin, hdfs, mapred, hbase), note the following.
* Make sure the appropriate user staging directory exists
* Set permissions on yarn.nodemanager.remote-app-log-dir to 1777.
   For example if it is set to the default value /yarn/apps, do the following
```xml
 sudo -u hdfs hadoop fs -chmod 777 /yarn/apps
```
* Ignore the Exception trace that comes up, as this is just a warning. This is a known
apache hadoop issue.

HBase Test
----------

**Important:** Use the HBase Master node to run HBase tests.
```xml
[gpadmin]\# ./bin/hbase shell
hbase(main):003:0> create 'test', 'cf'
0 row(s) in 1.2200 seconds
hbase(main):003:0> list 'test'
..
1 row(s) in 0.0550 seconds
hbase(main):004:0> put 'test', 'row1', 'cf:a', 'value1'
0 row(s) in 0.0560 seconds
hbase(main):005:0> put 'test', 'row2', 'cf:b', 'value2'
0 row(s) in 0.0370 seconds
hbase(main):006:0> put 'test', 'row3', 'cf:c', 'value3'
0 row(s) in 0.0450 seconds
hbase(main):007:0> scan 'test'
ROW COLUMN+CELL
row1 column=cf:a, timestamp=1288380727188, value=value1
row2 column=cf:b, timestamp=1288380738440, value=value2
row3 column=cf:c, timestamp=1288380747365, value=value3
3 row(s) in 0.0590 seconds
hbase(main):012:0> disable 'test'
0 row(s) in 1.0930 seconds
hbase(main):013:0> drop 'test'
0 row(s) in 0.0770 seconds
```
HAWQ Test
---------

**Important:** Use the HAWQ Master node to run HAWQ tests.
```xml
[gpadmin]\# source /usr/local/hawq/greenplum_path.sh
[gpadmin]\# psql \-p 8432
psql (8.2.15)
Type "help" for help.
gpadmin=# \d
No relations found.
gpadmin=# \l
List of databases
Name
\|
Owner
\| Encoding \| Access privileges
\--\--\--{}-\--\-\--\--+-\--\-----------\-
gpadmin \| gpadmin \| UTF8 \|
postgres \| gpadmin \| UTF8 \|
template0 \| gpadmin \| UTF8 \|
template1 \| gpadmin \| UTF8 \|
(4 rows)
gpadmin=# \c gpadmin
You are now connected to database "gpadmin" as user "gpadmin".
gpadmin=# create table test (a int, b text);
NOTICE: Table doesn't have 'DISTRIBUTED BY' clause -- Using
column named 'a' as the Greenplum Database data distribution
key for this table.
HINT: The 'DISTRIBUTED BY' clause determines the distribution
of data. Make sure column(s) chosen are the optimal data
distribution key to minimize skew.
CREATE TABLE
gpadmin=# insert into test values (1, '435252345');
INSERT 0 1
gpadmin=# select * from test;
a \|
b
\--+-\--------\-
1 \| 435252345
(1 row)
gpadmin=#
```

