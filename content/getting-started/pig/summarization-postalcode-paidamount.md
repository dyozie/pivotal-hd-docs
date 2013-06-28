---
title: Top Ten Postal Codes by Revenue
---

Overview 
--------
The given dataset has information about the Orders. Each Order has postal code of the customer. This use case is a simple example on how to get top ten postal codes by revenue .

##Prerequisites ##

*  Pivotal HD is installed 
*  Single/Multi Node cluster has been started
*  pivotal-samples have been downloaded from github.

##Introduction ##
Pig is shipped along with Pivotal HD distribution. You will use the this service to upload and query the data.

1. Start the `Pig` interactive shell -`grunt` by issuing `pig`. 
	
 <pre class="terminal">
 $ Pig
 grunt> 
 </pre>

2. verify `orders.tsv.gz` available in Hdfs

<pre class="terminal">
grunt> fs -ls /retail_demo/orders
Found 1 items
-rw-r--r--   3 gpadmin hadoop   72797064 2013-06-25 10:13 /retail_demo/orders/orders.tsv.gz
</pre>

3. Create relation `orders` from orders.tsv

<pre class="terminal">
grunt>orders = LOAD 'order_data/orders.tsv'
USING PigStorage('\t') AS ( order_id : int,customer_id : int,store_id : int,order_datetime : chararray,ship_completion_datetime : 	  chararray,   return_datetime : chararray,refund_datetime : chararray,
payment_method_code : chararray,total_tax_amount :double,total_paid_amount : double,
total_item_quantity : int,total_discount_amount : int,coupon_code : chararray,coupon_amount : int,
order_canceled_flag : chararray, has_returned_items_flag : chararray,has_refunded_items_flag : chararray,fraud_code : chararray,
fraud_resolution_code : chararray, billing_address_line1 : chararray,billing_address_line2 : chararray,billing_address_line3 : 		chararray,billing_address_city : chararray,billing_address_state : chararray,billing_address_postal_code : int,
billing_address_country : chararray,billing_phone_number : chararray,
customer_name : chararray,customer_email_address :chararray,
ordering_session_id : int,website_url : chararray);
</pre>


4. Group the records by `billing_address_postal_code` 

<pre class="terminal">
grunt>pcode = GROUP orders BY billing_address_postal_code;
</pre>
The `group` statement collects together records with the `billing_address_postal_code` as key

5. Calculate sums of `total_paid_amount` and `total_tax_amount` on each `pcode` record.  

<pre class="terminal">
grunt>revenue_counts = FOREACH pcode GENERATE group as zip,
			SUM(orders.total_paid_amount) as total,SUM(orders.total_tax_amount); 
</pre>
`foreach` takes `sum` method and applies them to every record in the `pcode`

6. Order `revenue_counts` records in descending order.

<pre class="terminal">
grunt>order_revenue = order revenue_counts by total DESC;
</pre>
The `order` statement sorts `revenue_counts` data in descending order using `DESC` 

7. Get the top ten records

<pre class="terminal">
grunt>firstten = limit order_revenue 10;
</pre>
The `limit` will return at most 10 records of `order_revenue`

8. We can use `dump` to see the output of script
	
<pre class="terminal">
dump firstten;
(48001,111868.31999999999,6712.0992)
(15329,107958.24,6477.4944)
(42714,103244.58,6194.6748)
(41030,101365.50000000001,6081.930000000001)
(50223,100511.64,6030.698400000001)
(3106,83566.41000000002,0.0)
(57104,77383.62999999999,3095.3452)
(23002,73673.66000000002,3683.6829999999995)
(25703,68282.12,4096.9272)
(26178,66836.4,4010.1839999999997)
</pre>

9. To write the results of processing into a directory we use `save`

<pre class="terminal">
grunt> store firstten into '/user/gpadmin/output/' ;
grunt> fs -cat /user/gpadmin/output/part*
48001    111868.31999999999    6712.0992
15329    107958.24    6477.4944
42714    103244.58    6194.6748
41030    101365.50000000001    6081.930000000001
50223    100511.64    6030.698400000001
3106    83566.41000000002    0.0
57104    77383.62999999999    3095.3452
23002    73673.66000000002    3683.6829999999995
25703    68282.12    4096.9272
26178    66836.4    4010.1839999999997
</pre>


