---
title: Creating a YUM EPEL Repository 
---

Creating a YUM EPEL Repository
------------------------------

Pivotal Command Center and Pivotal HD Enterprise expect some prerequisite
packages to be pre-installed on each host, depending on the software that gets
deployed on a particular host. In order to have a smoother installation it is
recommended that each host would have yum access to an EPEL yum repository. If
you have access to the Internet, then you can configure your hosts to have access to
the external EPEL repositories. However, if your hosts do not have Internet access (or
you are deploying onto a large cluster), then having a local yum EPEL repo would be
highly recommended. This will also give you some control on the package versions
you want deployed on your cluster.

Following are the steps to create a local yum repo:

* Mount the RHEL/CentOS DVD on a machine that will act as the local yum repo

* Install a webserver on that machine (e.g. httpd), making sure that HTTP traffic can
  reach this machine

*  Install the following packages on the machine:

```xml
    yum-utils
    createrep
```
*  Go to the directory where the DVD is mounted and run the following command:

```xml
   # createrepo .
```

* Create a repo file on each host with a descriptive filename in the
  /etc/yum.repos.d/ directory of each host (for example, CentOS-6.1.repo)
  with the following contents:

```xml

  [CentOS-6.1]
  name=CentOS 6.1 local repo for OS RPMS
  baseurl=http://172.254.51.221/centos/$releasever/os/
  $basearch/
  enabled=1
  gpgcheck=1
  gpgkey=http://172.254.51.221/centos/$releasever/os/$basearch
  /RPM-GPG-KEY-CentOS-6

```
* Validate that you can access the local yum repos by running the following
      command:

```xml

   Yum list
   Creating a YUM EPEL Repository

```
