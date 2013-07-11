---
title: Every customer with their first order ID/date and last order ID/date
---

The given dataset has information about the Orders. Each Order has cutomer id of the customer. This use case is a simple example on how to get every customer with their first order ID/date and last order ID/date .

* Approximate time: 45 mins
* Level: Basic

Use case
--------
The goal of the exercise is to get every customer with their first order ID/date and last order ID/date .

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
*  Understand the data formats
*  Decide on the input and output formats
*  Design the Mapper
*  Design the Reducer

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/PivotalHD/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `customer_first_and_last_order_dates` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

###Step 3: Understand the Data formats
Data Header is shown below:

```java
order_id  | customer_id | store_id  |   order_datetime       |ship_completion_datetime | 
return_datetime   |   refund_datetime   | payment_method_code |total_tax_amount | 
total_paid_amount | total_item_quantity | total_discount_amount |coupon_code    | 
coupon_amount | order_canceled_flag | has_returned_items_flag |has_refunded_items_flag | 
fraud_code | fraud_resolution_code | billing_address_line1 |billing_address_line2 |
billing_address_line3 | billing_address_city | billing_address_state |billing_address_postal_code | 
billing_address_country | billing_phone_number | customer_name   |
customer_email_address  | ordering_session_id  | website_url
```
 

Data separated by `\t`  is shown below:

```java
8180565407	49711957	69	2010-10-07 08:48:35	2010-10-10 03:01:47
FreeReplacement	0.41300	5.90000	1	0.05000	None	0.00000	N	N	N
7385 CLINTON	Apt 24		INDIANAPOLIS	IN	46201
USA	(105)037-5575	Casey Mahon	Casey.Mahon@sitebilgi.net
OS22196-563554-06-11957	http://myretailsite.emc.com/product_detail
```



###Step 4:  Decide on the Input and output formats
The data is in text format, has the fields separated by `\t`. It is well structured for processing. We will use TextInputFormat which is subclass of FileInputFormat as the InputFormat. By defualt, map function gets one line at a time for processing.

###Step 5: Designing the Mapper
We are interested in customer_id ,order_id and order_datetime in every row. 
In the Mapper code. we will extract `customer_id` as key and  `order_id` and `order_datetime` as value. Since we are selecting two fields as values, we will separate the fileds by `,` as the separator.

#### Mapper code:

```java
    @Override
    protected void map(LongWritable offset, Text text, Context context)
    throws IOException, InterruptedException {
        String[] tokens = text.toString().split("\t");
        String order_id = tokens[0];
        String customer_id = tokens[1];
        String order_datetime = tokens[3];
        key.set(Integer.parseInt(customer_id));
        val.set(order_id + "," + order_datetime);
        context.write(key, val);
    }
```

###Step 6: Designing the Reducer  
The Reducer is also a simple one similar to the classic wordcount example. In this case, we are finding the first and last date of orders for each customer, which is passed as a key.


```java
    @Override
    public void reduce(IntWritable key, Iterable<Text> counts, Context context)
    throws IOException, InterruptedException {
    StringBuffer temp;
    Text result = new Text();
    StringBuffer lastOrderDate = null;
    StringBuffer firstOrderDate = null;
        try {
            firstlastOrderDate = new StringBuffer(lastOrderDate(key, counts));
	} catch (ParseException e) {
            e.printStackTrace();
	}
	temp = new StringBuffer(key.toString());
	temp.append("\t");
	temp.append(firstlastOrderDate);
	result.set(temp.toString());
	context.write(NullWritable.get(), result);
	}

    public static String lastOrderDate(IntWritable key, Iterable<Text> counts) throws ParseException {
        ........
	........
        return valDate;
	}

```

###Step 7: Writing the MapReduce Driver Code

```java
    Job job = new Job(getConf());
    job.setJarByClass(CustomerFirstLastOrderDateDriver.class);

    FileInputFormat.setInputPaths(job, new Path(args[0]));
    Path outputPath = new Path(args[1]);
    outputPath.getFileSystem(job.getConfiguration()).delete(outputPath,
				true);

    job.setMapperClass(CustomerFirstLastOrderDateMapper.class);
    job.setReducerClass(CustomerFirstLastOrderDateReducer.class);

    FileOutputFormat.setOutputPath(job, new Path(args[1]));

    job.setMapOutputKeyClass(IntWritable.class);
    job.setMapOutputValueClass(Text.class);

    job.setOutputKeyClass(NullWritable.class);
    job.setOutputValueClass(Text.class);
    job.waitForCompletion(true);;
      
```


###Step 8: Running the tutorial in Pivotal Hd Virtual Machine
The following instructions can be used to run the sample on the Pivotal Hd Virtual Machine.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd customer_first_and_last_order_dates
```
Build the project

```bash 
mvn clean compile
mvn -DskipTests package
```
####Upload the input
Please refer [here](../dataset.html) for loading data to hdfs. 


####Submit the job

```bash
hadoop jar target/customer_first_and_last_order_dates-1.0.jar com.pivotal.hadoop.CustomerFirstLastOrderDateDriver /retail_demo/orders/orders.tsv.gz /output-mr2
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /output-mr2/part-r-00000

137    8228753927    2010-10-02 09:26:40    6952760836    2010-10-10 23:46:16
274    6952804085    2010-10-10 14:16:48    8038062167    2010-10-14 09:17:33
411    5987514832    2010-10-05 23:49:40    6326675610    2010-10-11 11:32:28
548    6734479225    2010-10-01 08:31:08    6953064348    2010-10-10 19:20:25
1096    8181753531    2010-10-07 04:04:26    8181753531    2010-10-07 04:04:26
1370    6326626699    2010-10-11 06:33:05    7412417661    2010-10-12 23:46:44
1507    8238655247    2010-10-06 11:01:33    7412451029    2010-10-12 07:37:18
1644    4876892978    2010-10-13 11:21:59    8038062935    2010-10-14 17:27:29
2055    7570913900    2010-10-08 23:29:35    4877101631    2010-10-13 21:12:05
2192    7136693581    2010-10-04 19:48:16    8037933831    2010-10-14 12:35:21
2603    8502193355    2010-10-09 13:41:22    7412316965    2010-10-12 21:31:32
2877    8456624891    2010-10-03 01:19:32    6952627429    2010-10-10 12:09:08
3151    6326825025    2010-10-11 02:11:35    6326825025    2010-10-11 02:11:35


```

###Step 9: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanode.
Execute the following commands on the development machine.

```bash
tar -zcvf sample2.tar.gz target/* /pivotal-samples/sample-data/orders.tsv.gz
scp sample2.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample2.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanode is running.

####Extract the Archive
Login to datanode and extract the `sample2.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir customer_first_and_last_order_dates
cd customer_first_and_last_order_dates
tar -zxvf ../sample2.tar.gz 
```

####Upload the datasets to HDFS
Please refer [here](../dataset.html) for loading data to hdfs. 

####Submit the Job

```bash
hadoop jar target/customer_first_and_last_order_dates-1.0.jar com.pivotal.hadoop.CustomerFirstLastOrderDateDriver /retail_demo/orders/orders.tsv.gz /output-mr2
```

####Check the output

Verify the job in the hadoop cluster as shown below:

![Job Command Center](/images/gs/mapreduce/sample2.png)

Click View more job details to see the job details as shown below:

![Job Details](/images/gs/mapreduce/sample2-details.png)

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample2/output/part-r-00000

137    8228753927    2010-10-02 09:26:40    6952760836    2010-10-10 23:46:16
274    6952804085    2010-10-10 14:16:48    8038062167    2010-10-14 09:17:33
411    5987514832    2010-10-05 23:49:40    6326675610    2010-10-11 11:32:28
548    6734479225    2010-10-01 08:31:08    6953064348    2010-10-10 19:20:25
1096    8181753531    2010-10-07 04:04:26    8181753531    2010-10-07 04:04:26
1370    6326626699    2010-10-11 06:33:05    7412417661    2010-10-12 23:46:44
1507    8238655247    2010-10-06 11:01:33    7412451029    2010-10-12 07:37:18
1644    4876892978    2010-10-13 11:21:59    8038062935    2010-10-14 17:27:29
2055    7570913900    2010-10-08 23:29:35    4877101631    2010-10-13 21:12:05
2192    7136693581    2010-10-04 19:48:16    8037933831    2010-10-14 12:35:21
2603    8502193355    2010-10-09 13:41:22    7412316965    2010-10-12 21:31:32
2877    8456624891    2010-10-03 01:19:32    6952627429    2010-10-10 12:09:08
3151    6326825025    2010-10-11 02:11:35    6326825025    2010-10-11 02:11:35


```

You have successfully run the sample on Pivotal HD Cluster!.

