---
title: HAWQ - List of Five star reviewers (users) for a Business
---


In this tutorial you will learn how to use HAWQ to join tables and query data.

##Use Case##

The sample datasets have information about the Businesses and Reviews from users. Each business is located in a city. Users has posted
reviews about the business. The goal of the tutorial is to find out list of all users who has rated a business as five star.

##Sample Data ##

For our tutorial we will use the sample data from the following format .

`business`

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
We have transformed the original `json` data into the format given below .

```java
rncjoVoEFUJGCUoC1JgnUA|8466 W Peoria Ave\nSte 6\nPeoria, AZ 85345|true|["Accountants","Professional Services","Tax Services","Financial Services"]|Peoria|3|Peoria Income Tax Service|[]|-112.241596|AZ|5.0|33.581867|business
```

`review data set`

```java
{
"votes": {"funny": 0, "useful": 1, "cool": 0}, 
"user_id": "HK35ai8frY75iMYBVdD_Pg",
"review_id": "EnAdKZ_u_wj9ifTRwkfVwg",
"stars": 5,
"date": "2012-02-12", 
"text": "I highly reccomend this place. They helped my girlfriend and I figure out our taxes and deductions so that we could get the max refund. We both had been doing our taxes online and missing out on hundreds in deductions. Ill never use another online service to do my taxes again as long as these guys are here.", 
"type": "review", 
"business_id": "rncjoVoEFUJGCUoC1JgnUA"
}
```
We have transformed the original `json` data into the format given below .

```java
{"cool":0,"funny":0,"useful":1}|HK35ai8frY75iMYBVdD_Pg|EnAdKZ_u_wj9ifTRwkfVwg|5|2012-02-12|rncjoVoEFUJGCUoC1JgnUA|I highly reccomend this place. They helped my girlfriend and I figure out our taxes and deductions so that we could get the max refund. We both had been doing our taxes online and missing out on hundreds in deductions. Ill never use another online service to do my taxes again as long as these guys are here.|review|rncjoVoEFUJGCUoC1JgnUA

```


The data for businesses reviewed can be found in the directory [pivotal-samples/sample-data/hawq/business.txt](https://github.com/rajdeepd/pivotal-samples/blob/master/sample-data/hawq/business.txt) and [pivotal-samples/sample-data/hawq/reviews.txt](https://github.com/rajdeepd/pivotal-samples/blob/master/sample-data/hawq/reviews.txt).



##Start the HAWQ Service ##
Execute the following command to start the HAWQ service

```bash
/etc/init.d/hawq start
```

**Connect to HAWQ Service**

*	Start a `psql` on the name node and connect the server

```bash
$psql -p 8432
```

**Use Database**

*	create a database `test` by executing the following command on psql shell

```bash
gpadmin=# \c test;
```


**Create table**

*	Create tables  `business` and `review` in database `test` by executing the following commands on `psql` command prompt

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
	type text);
```

```bash
gpadmin=#create table review
 	( votes text, 
	user_id text, 
	review_id text,
	 stars integer,
 	date timestamp,
 	text text,
 	type text, 
	business_id text);
```
##Use Internal Tables##
In this section you will load and query internal tables.

*	Execute command `\d` to make sure `business` an `review` tables have been created

```bash
gpadmin=# \d
          List of relations
 Schema |   Name   | Type  |  Owner  
--------+----------+-------+---------
 public | business | table | gpadmin
 public | review   | table | gpadmin
(1 row)
```

**Load Data**

* 	Load data into the table `business` by executing the `COPY` command

```bash
gpadmin=#COPY business FROM '/home/gpadmin/pivotal-samples/sample-data/hawq/business.txt' DELIMITERS '|';
```

If the command is successful, the output will be

```bash
COPY 15
```

* 	Load data into the table `review` by executing the `copy` command

```bash
gpadmin=#COPY review FROM '/home/gpadmin/pivotal-samples/sample-data/hawq/reviews.txt' DELIMITERS '|';
```

If the command is successful, the output will be

```bash
COPY 10
```

**Querying the Data**

Execute the following query on two tables to find list of Five star reviewers(users) for a Business. 
We will use the `Join` to join tables by `business_id` .

```bash
gpadmin=# select name,user_id FROM business JOIN review  ON (business.business_id=review.business_id AND review.stars=5.0) ;
```

Output of the command executed above will be :

```bash
             name             |        user_id        
------------------------------+------------------------
 Valley Permaculture Alliance | w6DgbWFq671y50A_QsILwQ
 Bike Doctor                  | yEQacRqY2MJRHTkrUJYLOw
 Bike Doctor                  | muIhE1HQZscwe06ISMu81A
 Bike Doctor                  | WkEu8km8U-6X-mm5OdkHjw
 Peoria Income Tax Service    | EnAdKZ_u_wj9ifTRwkfVwg
(5 rows)

```

##Use External Tables ##

In this section you will learn how to :

*	Create external table
*	Load data in to external table using `gpfdist` 
*	Query the external table using JOIN

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
__Note__ : Please make sure command `export LD_LIBRARY_PATH=/usr/local/hawq-1.0.0.0/lib:$LD_LIBRARY_PATH` is executed to have the right openssl library `libssl.so.0.9.8` is in the path for native libraries to be loaded by dynamic loader.

**Copy external file**
Make sure follow files are available as `business.txt` and `reviews.txt` in `/home/gpadmin/e_tables` folder. 

**Create External Table**

Create the external tables `business_ext` and `reviews.txt` using the query below on `psql` shell

```bash
CREATE EXTERNAL TABLE ext_business(LIKE review) LOCATION ('gpfdist://localhost:8080/business.txt') FORMAT 'TEXT' (DELIMITER AS '|' NULL AS 'null');
```

```bash
CREATE EXTERNAL TABLE ext_review(LIKE review) LOCATION ('gpfdist://localhost:8080/reviews.txt') FORMAT 'TEXT' (DELIMITER AS '|' NULL AS 'null');
```
You can check that the external table has been created successfully by running the command `\d` on the psql shell

```bash
gpadmin=# \d
            List of relations
 Schema |     Name     | Type  |  Owner  
--------+--------------+-------+---------
 public | business     | table | gpadmin
 public | ext_business | table | gpadmin
 public | review       | table | gpadmin
 public | ext_review   | table | gpadmin
(4 rows)
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

```bash
gpadmin=# \d ext_review
       Table "public.ext_review"
    Column     |     Type     | Modifiers 
---------------+--------------+-----------
 votes	       | text	      |
 review_id     | text         |
 user_id       | text         |
 stars         | integer      |
 date          | timestamp    |
 text          | text         |
 type          | text         |
 business_id   | text         |
```

**Query the External Table**

Execute the following `SELECT` query on `ext_business` and `ext_review` to find the list of Five star reviewers(users) for a Business for the dataset loaded

```bash
gpadmin=# select name,user_id FROM ext_business JOIN ext_review  ON (ext_business.business_id=ext_review.business_id AND ext_review.stars=5.0) ;
```

Output of the command executed above will be :

```bash
             name             |        user_id        
------------------------------+------------------------
 Valley Permaculture Alliance | w6DgbWFq671y50A_QsILwQ
 Bike Doctor                  | yEQacRqY2MJRHTkrUJYLOw
 Bike Doctor                  | muIhE1HQZscwe06ISMu81A
 Bike Doctor                  | WkEu8km8U-6X-mm5OdkHjw
 Peoria Income Tax Service    | EnAdKZ_u_wj9ifTRwkfVwg
(5 rows)

```

###Summary ###
In this tutorial we learnt how to get the list of users who has given five star rating to the business. 
We have used `join` on `business` and `review` tables to get the result. 
The tutorial demonstrates HAWQ using internal and external tables.
