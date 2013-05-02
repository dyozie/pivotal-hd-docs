---
title: Preparing Pivotal HD Cluster Environment
---

The following steps explain the workflow to set up all necessary prerequisites on the
Pivotal HD cluster nodes using GPHD Manager.
**TIP:** It is handy to have a hostfile with newline separated hostnames ready. This will
be used as input in many GPHD Manager commands. For a large number of hosts, a
simple script like the one shown below can be used:
```xml
for i in `seq \-w 0100 0800`; do sudo sh \-c "echo \"node$i\" >>
HostFile.txt"; done
```


Step 1: Create User gpadmin
---------------------------
Pivotal Command Center requires a user called "gpadmin" on the GPHD Manager
Admin Node. To create user "gpadmin" with sudo privileges on all cluster nodes,
Pivotal Command Center provides a convenient utility called add-user-gpadmin. This
utility needs to be run as "root" and all cluster nodes are assumed to have the same
"root" password. When the command prompts the user to enter a new password for
user "gpadmin", please enter a non-empty password.
**Important:** Do not include the Admin node in the hostfile.
```xml
[root]# icm_client ad-user-gpadmin --help
Usage: icm_client [options]
Options:
-h, --help
show this help message and exit
-f HOSTFILE, --hostfile=HOSTFILE
file containing a list of all cluster hosts (newline
separated) where the user gpadmin needs to be created

###Example:

[root]# icm_client add-user-gpadmin -f ./HostFile.txt
```

Step 2: Prepare Cluster Nodes with Pivotal HD Prerequisites
-----------------------------------------------------------
The preparehosts option of the icm_client command provides the user convenient
options to ensure all prerequisites are satisfied on cluster nodes. The prerequisites for
cluster nodes are:
1. Password-less SSH access from Admin node (as user 'gpadmin').
2. Oracle Java JDK Version 1.6 or above (You must download the binary from the
  Oracle Java website. )
3. SELinux Disabled.
4. System clocks synchronized.
5. Puppet version 2.7.20 installed. Puppet is supplied with the Pivotal HD tarball.
6. Sshpass installed.
The preparehosts command will ensure that all the above prerequisites are satisfied.
**Important:** Do not include the Admin node in the hostfile.
```xml
[gpadmin]# icm_client preparehosts --help
Usage: icm_client [options]
Options:
show this help message and exit
-h, --help
-f HOSTFILE, --hostfile=HOSTFILE
file containing a list of all cluster
hosts (newline
separated)
-s, --ssh
master using
setup passphrase-less access from
$HOME/.ssh/id_dsa.pub
-j JAVA, --java=JAVA
binary (Ex:
location of Sun Java JDK RPM installer
jdk-6u41-linux-x64-rpm.bin)
-t, --ntp
(requires external
synchronize system clocks using NTP
network access)
-d, --selinuxoff
disable SELinux
Example:
[gpadmin]# icm_client -preparehosts --hostfile=./HostFile.txt
--ssh --java=./jdk-6u43-linux-x64-rpm.bin
```

Step 3: Upgrade Ruby and Facter version to match Admin node packages
--------------------------------------------------------------------
Run the following command on the Pivotal HD Admin Node as user "gpadmin".

Note: massh is an open source parallel SSH utility that is shipped along with the PHD
tarball. More details about massh can be found at:
http://m.a.tt/er/massh/
```xml
[gpadmin]# massh ./HostFile.txt verbose "sudo yum install ruby
facter -y --disablerepo=* --enablerepo=gphd-admin-localrepo"
```

Step 4: Prepare Cluster Nodes with HAWQ Prerequisites
-----------------------------------------------------
Note: Prepare the cluster nodes with HAWQ if HAWQ is available.
prepare-hawq-hosts option of icm_clients sets some kernel parameters which enable
HAWQ to perform optimally. In particular, this utility modifies /etc/sysctl.conf and
/etc/security/limits.conf. The recommended configurations are available at
/usr/lib/gphd/gphdmgr/hawq_sys_config/ on the Admin node.
Important: The hostfile only needs to contain all the HAWQ nodes (HAWQ master,
standby master and segment nodes).
Important: This command edits limits.conf and sysctl.conf. We recommend you
review these configurations before you run the command.
```xml
[gpadmin]# icm_client prepare-hawq-hosts
-h
Usage: icm_client [options]
Options:
show this help message and exit
-h, --help
-f HOSTFILE, --hostfile=HOSTFILE
file containing a list of all cluster
hosts where HAWQ
will be installed (newline separated)
-g GPCC, --gpcc=GPCC
files
directory location of the custom conf
(sysctl.conf and limits.conf) which
will be appended
to /etc/sysctl.conf and
/etc/limits.conf on slave
nodes
Example:
[gpadmin]# icm_client prepare-hawq-hosts -f ./HAWQ_Hosts.txt -g
/usr/lib/gphd/gphdmgr/hawq_sys_config/
```

Step 5: Verify Cluster Nodes' Prerequisites
-------------------------------------------
scanhosts verifies if all cluster nodes' prerequisites have been met. This is a good
indicator if cluster deployments will go through smoothly on the nodes. As its output,
it provides a detailed report of missing prerequisites.
```xml
[gpadmin]# icm_client scanhosts --help
Usage: /usr/bin/icm_client scanhosts [options]
Options:
show this help message and exit
-h, --help
-v, --verbose
increase output verbosity
-f HOSTFILE, --hostfile=HOSTFILE
file containing new-line separated list of
hosts to be
scanned
Example:
[gpadmin]# icm_client scanhosts -f ./HostFile.txt
```
The following log files can be inspected for troubleshooting:
```xml
On Admin
/var/log/gphd/gphdmgr/ScanCluster.log
On Cluster Nodes
/tmp/ScanHost.XXX.log
```

Manual Verification of Cluster Node Prerequisites
-------------------------------------------------
Note: Optional but recommended.

Table 1.6
| Validation | Description |
| gpadmin user check | Every cluster node must have the user 'gpadmin' |
| sudo privilege for gpadmin check | Check if gpadmin has sudo access on all the cluster nodes |
| No requirettty check for admin | Check if gpadmin can run scripts without requiring terminal |
 
Table 1.6
| Validation | Description |
| Puppet, Ruby and Facter version check | Check for the right versions of Puppet, Ruby and Facter rpms|
| Admin node reachability | Check if admin node puppet master and rpm repo are reachable from
                       all cluster nodes |


