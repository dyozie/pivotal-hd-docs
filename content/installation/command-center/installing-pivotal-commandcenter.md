---
title: Pivotal Command Center 2.0 Installation and User Guide
---

  This section describes how to install and configure Pivotal HD 2.0 using the Pivotal
Command Center Unified Installer.
This chapter includes the following sections:

   *  Supported Platforms  

   *  Product Downloads

   *  Prerequisites

   *  Installation Instructions

   *  Uninstalling Pivotal Command Center


Supported Platforms
--------------------

   *  RHEL 6.1, 6.2 

   *  CentOS 6.1, 6.2


                   
Product Downloads
-----------------

   *  GPCC-2.0.0.*.version_build_OS.x86_64.tar.gz

Prerequisites
-------------

   *  Oracle JDK 6 or higher installed on the Admin host.
  
   *  See Package Accessibility, below, for prerequisite packages.

   Installation of Pivotal HD Manager assumes the user has a working knowledge of the
   following:

   *  Yum. Yum enables you to install or update software from the command line. See
      http://yum.baseurl.org/

   *  RPM (Redhat Package Manager).

   *  SSH (Secure Shell protocol).
	

Package Accessibility
---------------------

Pivotal Command Center and Pivotal HD Enterprise expect some prerequisite
packages to be pre-installed on each host, depending on the software that gets
deployed on a particular host. In order to have a smoother installation it is
recommended that each host would have yum access to an EPEL yum repository. If
you have access to the Internet, then you can configure your hosts to have access to
the external EPEL repositories. However, if your hosts do not have Internet access (or
you are deploying onto a large cluster), then having a local yum EPEL repo is highly
recommended. This will also give you some control on the package versions you want
deployed on your cluster. See Appendix A, “Creating a YUM EPEL Repository” for
instructions on how to setup a local yum repository or point your hosts to an EPEL
repository.
For Pivotal Command Center 2.0, here is a list of pre-requisites that need to either
already be installed on the Command Center admin host or on an accessible yum
repository:

PostgreSQL Database
-------------------

Pivotal Command Center makes use of a PostgreSQL Database to store the following:

* httpds

* mod_ssl

* postgresql

* postgresql-devel

* postgresql-server

* compat-readline5

* createrepo

* sigar

You can run the following command on the admin node to make sure that you are able
to install the prerequisite packages during installation.

```xml
$ sudo yum list httpd mod_ssl postgresql postgresql-devel
postgresql-server compat-readline5 createrepo sigar

```

If any of them are not available or not already installed, then you may have not added
the repository correctly to your admin host.
For the cluster hosts (where you plan to install the cluster), the prerequisite packages
depend on the software you will eventually install there, but you may want to verify
that the following two packages are installed or accessible by yum on all hosts:

* nc

* postgresql-devel

System Checks
-------------

### Important:

   Avoid using hostnames with capital letters in them because Puppet has an
issue generating certificates for domains with capital letters.

* Ensure that SE Linux is disabled by running the following command:
  
```xml
# sestatus
SELinux status: disabled
  
```

* Every cluster node must be able to perform a forward and reverse DNS look-up
for every other node.

* Verify that iptables is turned off, for example:

```xml

# chkconfig iptables off
# service iptables stop
# service iptables status
iptables: Firewall is not running.

```



  

