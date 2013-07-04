---
title: Recent and oldest order date/Orderid for every customer
---

Overview 
--------
The use case demonstrates using Pig to retrieve the firs and last orders customer has ordered along with the order id's.
The given dataset has information about the Orders. Each Order has customerid, ordered date, orderid and other attributes.

##Prerequisites ##

*  Pivotal HD is installed 
*  Single/Multi Node cluster has been started
*  pivotal-samples have been downloaded from github.

##Installation ##
Pig is shipped along with Pivotal HD distribution. You will use the this service to upload and query the data.

##Using Pig##

* Start the `Pig` interactive shell `grunt` by issuing `pig` 

   <pre class="terminal">
   $ pig
   grunt> 
   </pre>


* verify `orders.tsv.gz` available in Hdfs 

   <pre class="terminal">
   grunt> fs -ls /retail_demo/orders
   Found 1 items
   -rw-r--r--   3 gpadmin hadoop   72797064 2013-06-25 10:13 /retail_demo/orders/orders.tsv.gz
   </pre>

* Create relation `orders` from orders.tsv.tz 

   <pre class="terminal">
   grunt>orders = LOAD 'order_data/orders.tsv.gz'
     USING PigStorage('\t') AS (
     order_id : long,
     customer_id : int,
     store_id : int,
     order_datetime : chararray,
     ship_completion_datetime : chararray,
     return_datetime : chararray,
     refund_datetime : chararray,
     payment_method_code : chararray,
     total_tax_amount :double,
     total_paid_amount : double,
     total_item_quantity : int,
     total_discount_amount : int,
     coupon_code : chararray,
     coupon_amount : int,
     order_canceled_flag : chararray,
     has_returned_items_flag : chararray,
     has_refunded_items_flag : chararray,
     fraud_code : chararray,
     fraud_resolution_code : chararray, 
     billing_address_line1 : chararray,
     billing_address_line2 : chararray,
     billing_address_line3 : chararray,
     billing_address_city : chararray,
     billing_address_state : chararray,
     billing_address_postal_code : int,
     billing_address_country : chararray,
     billing_phone_number : chararray,
     customer_name : chararray,
     customer_email_address :chararray,
     ordering_session_id : int,
     website_url : chararray
   );
   </pre>
Note that Pig processes the compressed file.

* Group records by `customer_id`

   <pre class="terminal">
   records_group =GROUP orders BY customer_id;
   </pre>

   The `group` statement groups the records by `customer_id`

###Finding the recent order date for the customer

* Get the recent order using `max` function

   <pre class="terminal">
   recent_order_date = FOREACH records_group GENERATE 
                       flatten(orders.customer_id) AS customer_id,
                       flatten(orders.order_id) as order_id,
                       MAX(orders.order_datetime) AS order_datetime;
   </pre>

   We use `flatten` to remove the level of nesting.

* Collect `distinct` records from `recent_order_date`

   <pre class="terminal">
   distinct_order_date = distinct recent_order_date;
   </pre>

* Join `orders` and `distinct_order_date` by `customer_id`,`order_id`,`order_datetime` .

   <pre class="terminal">
   rowOrder = join orders by (customer_id,order_id,order_datetime),
	      distinct_order_date by (customer_id,order_id,order_datetime);
   </pre>

* Filter records in `rowOrder`

   <pre class="terminal">
   joined_recent_order_date = filter rowOrder by 
                            orders::customer_id == distinct_order_date::customer_id and 
                            orders::order_id == distinct_order_date::order_id and 
                            orders::order_datetime == distinct_order_date::order_datetime;
   </pre>

* Project the required fields from `joined_recent_order_date`

   <pre class="terminal">
   resMx = FOREACH joined_recent_order_date GENERATE 
	   orders::customer_id,
	   orders::order_id ,
	   orders::order_datetime;
   </pre>

###Find the oldest oldest orderdate for each customer

* Get the oldest orderdate using `min` function

   <pre class="terminal">
   old_order_date = FOREACH records_group GENERATE 
	            flatten(orders.customer_id) AS customer_id,
                    flatten(orders.order_id) as order_id,
                    MIN(orders.order_datetime) AS order_datetime;
   </pre>


* Collect `distinct` records of `old_order_date`

   <pre class="terminal">
   dist_old_order_date = distinct old_order_date;
   </pre>

* Join `orders` and `dist_old_order_date` by `customer_id`,`order_id`,`order_datetime` .

   <pre class="terminal">
   rowOrdermn = join orders by (customer_id,order_id,order_datetime),
	        dist_old_order_date by (customer_id,order_id,order_datetime);
   </pre> 

* Filter records in `rowOrdermn`

   <pre class="terminal">
   joined_old_order_date = filter rowOrdermn by 
                         orders::customer_id == dist_old_order_date::customer_id and 
                         orders::order_id == dist_old_order_date::order_id and   
                         orders::order_datetime == dist_old_order_date::order_datetime;
   </pre> 
* project the required fields from `joined_old_order_date`

   <pre class="terminal">
   resMn = FOREACH joined_old_order_date GENERATE 
           orders::customer_id,
           orders::order_id ,
           orders::order_datetime;
   </pre>

#   Join Old Date and Latest Date adOrderId of every Customer #
* Join `resMn` and `resMn`.

   <pre class="terminal">
   result = join resMn by customer_id,
	    resMx by customer_id; 
   </pre>

*  Get the first ten records  

   <pre class="terminal">
   grunt>firstten = limit result 10;
   </pre>
   The `limit` will return at most 10 records of `result`

* We can use `dump` to see the output of script  
	
   <pre class="terminal">
   dump firstten;
   137    8228753927    2010-10-02 09:26:40    137    6952760836    2010-10-10 23:46:16
   274    8228753207    2010-10-02 06:49:05    274    8038062167    2010-10-14 09:17:33
   411    8228659208    2010-10-02 02:45:08    411    6326675610    2010-10-11 11:32:28
   548    6734479225    2010-10-01 08:31:08    548    6953064348    2010-10-10 19:20:25
   1096    6734568190    2010-10-01 21:15:03    1096    8181753531    2010-10-07 04:04:26
   1370    6734388086    2010-10-01 02:08:12    1370    7412417661    2010-10-12 23:46:44
   1507    8456649021    2010-10-03 04:47:50    1507    7412451029    2010-10-12 07:37:18
   1644    7136614975    2010-10-04 09:03:40    1644    8038062935    2010-10-14 17:27:29
   2055    7570913900    2010-10-08 23:29:35    2055    4877101631    2010-10-13 21:12:05
   2192    7136693581    2010-10-04 19:48:16    2192    8037933831    2010-10-14 12:35:21
   </pre>

* Save the output to a file using `store` 

   <pre class="terminal">
   grunt> store firstten into '/user/gpadmin/output2/' ;
   grunt> fs -cat /user/gpadmin/output2/part*
   
   dump firstten;
   137    8228753927    2010-10-02 09:26:40    137    6952760836    2010-10-10 23:46:16
   274    8228753207    2010-10-02 06:49:05    274    8038062167    2010-10-14 09:17:33
   411    8228659208    2010-10-02 02:45:08    411    6326675610    2010-10-11 11:32:28
   548    6734479225    2010-10-01 08:31:08    548    6953064348    2010-10-10 19:20:25
   1096    6734568190    2010-10-01 21:15:03    1096    8181753531    2010-10-07 04:04:26
   1370    6734388086    2010-10-01 02:08:12    1370    7412417661    2010-10-12 23:46:44
   1507    8456649021    2010-10-03 04:47:50    1507    7412451029    2010-10-12 07:37:18
   1644    7136614975    2010-10-04 09:03:40    1644    8038062935    2010-10-14 17:27:29
   2055    7570913900    2010-10-08 23:29:35    2055    4877101631    2010-10-13 21:12:05
   2192    7136693581    2010-10-04 19:48:16    2192    8037933831    2010-10-14 12:35:21
 
   </pre>

