---
title: HAWQ - Count Businesses in a City
---


In this tutorial you will learn how to use HAWQ and its related tools and services to load and query data.

##Use Case##
The sample dataset has information about the Businesses. Each business is located in a city. This use case is a simple example of how to get count how many businesses are there in a city.

##Sample Data ##

For our tutorial we will use the sample data from the following format 

```java
{
 "business_id": "rncjoVoEFUJGCUoC1JgnUA",
 "full_address": "8466 W Peoria Ave\nSte 6\nPeoria, AZ 85345",
 "open": true,
 "categories": ["Accountants", "Professional Services", "Tax Services", "Financial Services"],
 "city": "Peoria",
 "review_count": 3,
 "name": "Peoria Income Tax Service",
 "neighborhoods": [],
 "longitude": -112.241596,
 "state": "AZ",
 "stars": 5.0,
 "latitude": 33.581867000000003,
 "type": "business"
}
```

We have transformed the original `json` data into the format so that it can be loaded into a `external table` or we can use `COPY` command to load the data into Internal Table. The data for businesses reviewed can be found in the directory [pivotal-samples/sample-data/hawq/business.txt](https://github.com/rajdeepd/pivotal-samples/blob/master/sample-data//hawq/business.txt)


##Start the HAWQ Service ##
Execute the following command to start the HAWQ service

```bash
/etc/init.d/hawq start
```


First Option is to insert data into HDFS from HAWQ command line by creating a table and inserting the values.

**Connect to HAWQ Service**

*	Start a `psql` on the name node and connect the server

```bash
$psql -p 8432
```

**Create Database**

*	create a database `test` by executing the following command on psql shell

```bash
gpadmin=# create database test
```

Execute the  command `\l` to make sure the database got created

```bash
gpadmin=# \l
                  List of databases
   Name    |  Owner  | Encoding |  Access privileges  
-----------+---------+----------+---------------------
 gpadmin   | gpadmin | UTF8     | 
 postgres  | gpadmin | UTF8     | 
 template0 | gpadmin | UTF8     | 
 template1 | gpadmin | UTF8     | 
 test      | gpadmin | UTF8     | 
 test3     | gpadmin | UTF8     | =Tc/gpadmin
                                : gpadmin=CTc/gpadmin
(6 rows)
```

**Create table**

*	Create a table  `business`  in database `test`by executing the following command on `psql` command prompt

```bash
gpadmin=# create table business(business_id text,
	full_address text,
	open boolean,
	categories text,
	city text,
	review_count integer,
	name text,
	neighborhoods text,
	longitude decimal,
	state char(2),
	stars decimal,
	latitude decimal,
	type text
);
```

##Use Internal Tables##


In this section you will learn how to insert and query internal tables.

*	Execute command `\d` to make sure `business` table has bee created

```bash
gpadmin=# \d
          List of relations
 Schema |   Name   | Type  |  Owner  
--------+----------+-------+---------
 public | business | table | gpadmin
(1 row)
```

**Insert Values**

* 	Insert values into the table `business` by executing the `COPY` command

```bash
gpadmin=#COPY business FROM '/home/gpadmin/pivotal-samples/sample-data/business.txt' DELIMITERS '|';
```

If the command is successful, the output will be

```bash
COPY 15
```

**Querying the Data**

Execute the following query on two rows to count the number of businesses in each city. We will use the `group by` sq artifact to group the rows by `city` before we run count on the data set.

```bash
gpadmin=# select city, count(*) from business GROUP BY city;
```

Output of the command executed above will be :

```bash
   city         | count 
----------------+-------
 Glendale       |     1
 Tempe          |     1
 Glendale Az    |     1
 Phoenix        |     7
 Gilbert        |     1
 Fountain Hills |     1
 Scottsdale     |     2
 Peoria         |     1
(8 rows)
```


##Use External Tables ##

In this section you will learn how to :

*	Create external table
*	Load data in to external table using `gpfdist` 
*	Query the external table using SELECT 

**Start gpfdist**

*	Create a folder `e_tables` under `/home/gpadmin/`
*	Start `gpfdist` utility using the following command. This is located in the directory `/usr/lib/gphd/hawq/bin` on the namenode of the PivotalHD Cluster

```bash
$./gpfdist -d /home/gpadmin/e_tables -p 8080
```

Output of the command will be 

```bash
Serving HTTP on port 8080, directory /home/gpadmin/e_tables
```
__Note__ : Please make sure command `export LD_LIBRARY_PATH=/usr/local/hawq-1.0.0.0/lib:$LD_LIBRARY_PATH` is excited to have the right openssl library `libssl.so.0.9.8` is in the path for native libraries to be loaded by dynamic loader.

**Copy external file**

Make sure follow file is available as `business.txt` in `/home/gpadmin/e_tables` folder. This file is available under `pivotal-samples/sample-data/hawq`.

**Create External Table**

Create the external table `business_ext` using the query below on `psql` shell

```bash
CREATE EXTERNAL TABLE ext_business(LIKE business) LOCATION ('gpfdist://localhost:8080/business.txt') FORMAT 'TEXT' (DELIMITER AS '|' NULL AS 'null');
```

If the command executes you will see the following output on the shell

```bash
CREATE EXTERNAL TABLE
```

You can check that the external table has been created successfully by running the command `\d` on the psql shell

```bash
gpadmin=# \d
            List of relations
 Schema |     Name     | Type  |  Owner  
--------+--------------+-------+---------
 public | business     | table | gpadmin
 public | ext_business | table | gpadmin
(2 rows)
```

**Check Schema of the External Table**

You can use `\d <external_table_name>` to check the schema created

```bash
gpadmin=# \d ext_business
       Table "public.ext_business"
    Column     |     Type     | Modifiers 
---------------+--------------+-----------
 business_id   | text         | 
 full_address  | text         | 
 open          | boolean      | 
 categories    | text         | 
 city          | text         | 
 review_count  | integer      | 
 name          | text         | 
 neighborhoods | text         | 
 longitude     | numeric      | 
 state         | character(2) | 
 stars         | numeric      | 
 latitude      | numeric      | 
 type          | text         | 
```

**Query the External Table**

Execute the following `SELECT` query on `ext_business` to find the number of businesses in each city for the dataset loaded

```bash
gpadmin=# select city, count(*) from ext_business GROUP BY city;   
```

Output of the select query executed can be seen below

```bash
   city         | count 
----------------+-------
 Glendale       |     1
 Tempe          |     1
 Glendale Az    |     1
 Phoenix        |     7
 Gilbert        |     1
 Fountain Hills |     1
 Scottsdale     |     2
 Peoria         |     1
```

###Summary ###

In this tutorial we learnt how to use HAWQ to insert and query data in internal and external tables.
