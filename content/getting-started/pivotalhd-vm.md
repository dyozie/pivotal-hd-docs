---
title: Pivotal HD VM
---


##Minimum requirements for running this VM: ##

* 8 GB RAM since the VM itself consumes 4 GB
* At least 30 GB free disk space
* At least a dual-core CPU
* NAT networking configured in the VM

##Pivotal HD VM contents
Pivotal HD VM is shipped with the following contents:

1. Pivotal HD - Hadoop 2.x, Zookeeper, HBase, Hive, Pig, Mahout
2. Pivotal HAWQ
3. Pivotal Extension Framework (PXF)
4. Pivotal DataLoader
5. Product usage documentation

Other installed packages:

1. JDK 7
2. Maven
3. Spring Tool Suite (STS)

__Notes__:
* 	`sudo` is configured so that the `gpadmin` (default user for this VM) account can run commands via sudo without providing a password, and this can be used to access any of the other system accounts
  (mapred, hdfs, hadoop, etc.)

##Installing the VM ##

*	Download the VM (compressed) from [this page](http://www.gopivotal.com/pivotal-products/data/pivotal-hd)
* Uncompress using 7z: `7za x ~/Downloads/PIVHDSNE_VM.7z`
*	7z can be obtained here: `http://www.7-zip.org/`
*	Start the VM by double-clicking the .vmx file within the newly-created `PIVHDSNE_VM` directory
*	Once the VM is booted, you should be automatically logged in as user "gpadmin"
* The password for both the "root" and "gpadmin" accounts is "password"
*	Once logged in, you can start up the Firefox web browser to see the Command Center UI at `http://localhost:5000/` since 
        Command Center is started automatically at boot time.
*       Login to the Command Center using "gpadmin" as user and "gpadmin" as password
*	Start Pivotal HD and HAWQ using the `~/Desktop/start_all.sh` script
*	Stop Pivotal HD and HAWQ using the `~/Desktop/stop_all.sh` script


##How to use this VM: ##

1. Start the Hadoop services using `start_all.sh` on the desktop
2. Follow the tutorials in the [getting started](/getting-started-overview.html) section of this site
