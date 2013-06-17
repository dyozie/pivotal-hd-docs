---
title: Pivotal HD VM
---


##Minimum requirements for running this VM: ##

* 8 GB RAM since the VM itself consumes 4 GB
* At least 30 GB free disk space
* At least a dual-core CPU
* NAT networking configured in the VM

##Installing the VM ##

*	Download the VM (compressed) from: _LOCATION_
* 	Uncompress using 7z: `7za x ~/VMWare/PIVHDSNE_102_VM.7z`
    *	7z can be obtained here: `http://www.7-zip.org/`
*	Start the VM by double-clicking the .vmx file within the newly-created `PIVHDSNE_102_VM` directory
*	Once the VM is booted, log in to the "gpadmin" user account using the password "password" (note: this is also the root password)
*	Once logged in, you can start up the Firefox web browser to see the Command Center UI at `http://localhost:5000/` since Command Center is started automatically at boot time.
*	Start Pivotal HD and HAWQ using the `~/Desktop/start_piv_hd.sh script`
*	Stop Pivotal HD and HAWQ using the `~/Desktop/stop_piv_hd.sh script`

__Notes__:
* 	`sudo` is configured, so the `gpadmin` (default user for this VM) account can run commands via sudo without providing a password, and this can be used to access any of the other system accounts
  (mapred, hdfs, hadoop, etc.)