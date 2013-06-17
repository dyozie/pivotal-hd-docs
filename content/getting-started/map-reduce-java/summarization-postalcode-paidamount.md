---
title: Top Ten Postal Codes by Revenue
---

The given dataset has information about the Orders. Each Order has postal code of the customer. This use case is a simple example on how to get top ten postal codes by revenue .

* Approximate time: 45 mins
* Level: Basic

Use case
--------
The goal of the exercise is to get top ten postal codes by revenue .

Pre-requisites
-------------
* Pivotal Command Center 2.0 deployed
* Pivotal HD deployed
* [Development Environment setup](../setting-development.html)

Approach
--------
*  Understand the Data formats
*  Decide on the Input and output formats
*  Design the Mapper
*  Design the Reducer

##Working with the Tutorial

###Step 1: Clone the source from the git repository

```bash
git clone https://github.com/rajdeepd/pivotal-samples.git
```
This will create pivotal-samples directory.

###Step 2: Importing the project to Eclipse IDE

Import the sample `taxpaid_by_postalcode` project into eclipse using the instructions given in the [Setting Development Environment](../setting-development.html). 

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
We are interested in postal code and that tax amounts in every row. 
In the Mapper code. we will extract `billing_address_postal_code` as key and  `total_tax_amount` and `total_paid_amount` as value. Since we are selecting two fields as values, we will separate the fileds by `,` as the separator.

#### Mapper code:

```java

 @Override
    protected void map(LongWritable offset, Text text, Context context)
        throws IOException, InterruptedException {
    String[] tokens = text.toString().split("\t");
    String total_tax_amount = tokens[8];
    String total_paid_amount = tokens[9];
    String billing_address_postal_code = tokens[24];
    key.set(Integer.parseInt(billing_address_postal_code));
    val.set(total_tax_amount + "," + total_paid_amount);
    context.write(key, val);
	}
```

###Step 6: Designing the Reducer  
The Reducer is also a simple one similar to the classic wordcount example. In this case, we are finding the sum of all tax amounts for each postal code, which is passed as a key.
Since we are interested in finding the top ten postal codes by revenue, we will initialize the a TreeMap, which automatically sorts our data. The tree map is initialized in the setup time and the output is written during the cleanup time. We could use the combiner to reduce the data further. That will be another exercise.

```java
    @Override
    protected void reduce(IntWritable key, Iterable<Text> counts,
        Context context) throws IOException, InterruptedException {
    StringBuffer temp;
    double total_tax_amount = 0;
    double total_paid_amount = 0;
    Text result = new Text();
    for (Text val : counts) {
        String[] rawTokens = val.toString().split(",");
        StringBuffer tax_amount = new StringBuffer(rawTokens[0]);
        StringBuffer paid_amount = new StringBuffer(rawTokens[1]);
        total_paid_amount = total_paid_amount
                + Double.parseDouble(paid_amount.toString());
        total_tax_amount = total_tax_amount
                + Double.parseDouble(tax_amount.toString());
        }

        temp = new StringBuffer(key.toString());
        temp.append("\t");
        temp.append(new StringBuffer(String.valueOf(total_paid_amount)));
        temp.append("\t");
        temp.append(new StringBuffer(String.valueOf(total_tax_amount)));

        result.set(temp.toString());

        recordRepo.put(total_paid_amount, result);
        if (recordRepo.size() > 10) {
            recordRepo.remove(recordRepo.firstKey());
        }
    }

    @Override
    protected void cleanup(org.apache.hadoop.mapreduce.Reducer.Context context)
        throws IOException, InterruptedException {
        for (Text t : recordRepo.descendingMap().values()) {
            context.write(NullWritable.get(), t);
        }
        super.cleanup(context);
    }

```

###Step 7: Writing the MapReduce Driver Code

```java
    Job job = new Job(getConf());
    job.setJarByClass(PostalCodesPaidAmountTaxDriver.class);

    FileInputFormat.setInputPaths(job, new Path(args[0]));
    Path outputPath = new Path(args[1]);
    outputPath.getFileSystem(job.getConfiguration()).delete(outputPath,
                true);

    job.setMapperClass(PostalCodesMapper.class);
    job.setReducerClass(PostalCodesReducer.class);

    FileOutputFormat.setOutputPath(job, new Path(args[1]));

    job.setMapOutputKeyClass(IntWritable.class);
    job.setMapOutputValueClass(Text.class);

    job.setOutputKeyClass(NullWritable.class);
    job.setOutputValueClass(Text.class);
    job.setNumReduceTasks(1);
    job.waitForCompletion(true);
      
```

We are setting the number of reducers to one, so that, we can calculate the top ten postal codes by revenue. This could reduce the performance if the data is huge. This can be solved by using combiners and chaining the tasks.

###Step 7: Running the tutorial in Pivotal Hd Virtual Machine
The following instructions can be used to run the sample on the Pivotal Hd Virtual Machine.

####Building the project 

Go to the project directory

```bash
cd  pivotal-samples
ls
cd taxpaid_by_postalcode
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
hadoop jar target/taxpaid_by_postalcode-1.0.jar com.pivotal.hadoop.PostalCodesPaidAmountTaxDriver /retail_demo/orders/orders.tsv.gz /output-mr1
```

####Check the output

Verify the job in the hadoop cluster.

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000

48001    111868.31999999998    6712.0992
15329    107958.24    6477.4944
42714    103244.58    6194.6748
41030    101365.50000000003    6081.93
50223    100511.64000000001    6030.698400000001
3106    83566.41    0.0
57104    77383.62999999996    3095.3451999999997
23002    73673.65999999999    3683.682999999999
25703    68282.12    4096.9272
26178    66836.4    4010.1839999999997

```

###Step 8: Running the tutorial on Pivotal HD Cluster

####Transfer the code to a node to the cluster. Let us assume it is one of the datanode.
Execute the following commands on the development machine.

```bash
tar -zcvf sample1.tar.gz target/* /pivotal-samples/sample-data/orders.tsv.gz
scp sample1.tar.gz gpadmin@DATA_NODE:/home/gpadmin/sample1.tar.gz 
```
Note: Replace the DATA_NODE with the hostname where one of the datanode is running.

####Extract the Archive
Login to datanode and extract the `sample1.tar.gz` to a directory. This will create a target folder.

```bash
cd /home/gpadmin
mkdir taxpaid_by_postalcode
cd taxpaid_by_postalcode
tar -zxvf ../sample1.tar.gz 
```
####Upload the datasets to HDFS

```bash
hadoop fs -mkdir -p /user/gpadmin/sample1/input
hadoop fs -put /pivotal-samples/sample-data/orders.tsv.gz /user/gpadmin/sample1/input
```

####Submit the Job

```bash
hadoop jar target/taxpaid_by_postalcode-1.0.jar com.pivotal.hadoop.PostalCodesPaidAmountTaxDriver /user/gpadmin/sample1/input /user/gpadmin/sample1/output
```

####Check the output

Verify the job in the hadoop cluster as shown below:

![Job Command Center](/images/gs/mapreduce/sample1.png)

Click View more job details to see the job details as shown below:

![Job Details](/images/gs/mapreduce/sample1-details.png)

Check the output directory in hadoop file system. The output directory should contain the part-r-0000-file.

See the output using

```bash
hadoop fs -cat /user/gpadmin/sample1/output/part-r-00000

48001    111868.31999999998    6712.0992
15329    107958.24    6477.4944
42714    103244.58    6194.6748
41030    101365.50000000003    6081.93
50223    100511.64000000001    6030.698400000001
3106    83566.41    0.0
57104    77383.62999999996    3095.3451999999997
23002    73673.65999999999    3683.682999999999
25703    68282.12    4096.9272
26178    66836.4    4010.1839999999997

```

You have successfully run the sample on Pivotal HD Cluster!.

