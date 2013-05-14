---
title: Installation Instructions
---

  Once you have met the prerequisites, you are ready to begin the installation. Perform
the following installation steps as a root user.

This chapter includes the following sections:

**1.**	Copy the Command Center tar file to your host. For example:

```bash
# scp ./GPCC-2.0.0.version.build.os.x86_64.tar.gz
host:/root/phd/
```

**2.**	Log into the Command Center admin host as root user. cd to the directory where
	the Command Center tar files are located and untar. For example

```bash
# cd /root/phd
# tar --no-same-owner -zxvf
GPCC-2.0.0.version.build.os.x86_64.tar.gz
```
**3.**	Still as root user, run the installation script. This installs the required packages and
	configures both Pivotal Command Center and Pivotal HD Manager, and starts services.

##Important: 

You must run the installation script from the directory where it is
installed, for example: GPCC-2.0.0.version
For example:

```bash
# ls
GPCC-2.0.0.version
GPCC-2.0.0.version.build.os.x86_64.tar.gz
# cd GPCC-version
# ./install
```
You will see installation progress information on the screen. Once the installation
successfully completes, you will see the following:

You have successfully installed GPCC 2.0.
You now need to install a GPHD cluster to monitor or sync
GPCC to monitor an existing GPHD cluster. You can view your
cluster statuses here:

```bash

http://node0781.ic.analyticsworkbench.com:5000/status
```

##Starting, Stopping, and Restarting Command Center Services


 To stop or restart the Command Center services, run the following commands on the
Pivotal Command Center admin host:

```bash
$ service commander stop
$ service commander start
$ service commander restart
```

##Launching Command Center


Launch a browser and navigate to the host on which you installed Command Center.
For example:

```bash
http://CommandCenterHost:5000

```

The Command Center login page is launched in your browser. The default
username/password is gpadmin/gpadmin.

##Next Steps

See the [Pivotal HD 1.0 Installation and Configuration Guide](../pivotal-hd.html) for instructions for using
the command-line interface of Pivotal Command Center to deploy and configure a HD
cluster.


